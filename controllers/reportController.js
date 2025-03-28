const Expense = require('../models/expense');
const { Op } = require("sequelize");
const { startOfDay, startOfWeek, startOfMonth } = require("date-fns");
const AwsServices = require('../services/AwsService');
const { format } = require('date-fns');
require('dotenv').config();


exports.viewReport = async (req, res) => {

    // console.log("CALLING VIEW REPORT");
    
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    try {
        
        const reportType = req.params.reportType;
        const userId = req.user.id;
        let condition = { userId };

        //Date ranges
        const today = startOfDay(new Date());
        const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        const startOfMonthDate = startOfMonth(new Date());

        if (reportType === "daily") {
            condition.date = { [Op.gte]: today };
        } else if (reportType === "weekly") {
            condition.date = { [Op.gte]: startOfWeekDate };
        } else if (reportType === "monthly") {
            condition.date = { [Op.gte]: startOfMonthDate };
        } else {
            return res.status(400).json({ error: 'Invalid report type' });
        }

        const totalExpenses = await Expense.count({ where: condition });

        const expenses = await Expense.findAll({
            where: condition,
            order: [["date", "DESC"]],
            limit: limit, // Limit per page
            offset: (page - 1) * limit,
        });

        res.status(200).json({
            expenses,
            totalExpenses,
            totalPages: Math.ceil(totalExpenses / limit),
            currentPage: page,
        });

    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Server error" });
    }
}

exports.downloadReport = async (req, res) => {

    try {

        const formattedDate = format(new Date(), 'dd-MM-yyyy');

        // console.log("calling downloadExpense");

        // console.log("USER ID:", req.user);
        
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;

        const filename = `reports/Expenses_${userId}_${formattedDate}.txt`;

        const fileUrl = await AwsServices.uploadToS3(userId, filename, stringifiedExpenses);
        // console.log("Report successfully uploaded:", fileUrl);

        res.status(200).json({ fileUrl, success: true });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


