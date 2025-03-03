const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
const { Op } = require("sequelize");
const { startOfDay, startOfWeek, startOfMonth } = require("date-fns");

exports.viewReport = async (req, res) => {

    try {
        
        const reportType = req.params.reportType;
        const userId = req.user.id;
        let condition = { userId };

        //Date ranges
        const today = startOfDay(new Date());
        const startOfWeekDate = startOfWeek(new Date());
        const startOfMonthDate = startOfMonth(new Date());

        if (reportType === "daily") {
            condition.date = { [Op.gte]: today };
        } else if (reportType === "weekly") {
            condition.date = { [Op.between]: [startOfWeekDate, today] };
        } else if (reportType === "monthly") {
            condition.date = { [Op.between]: [startOfMonthDate, today] };
        } else {
            return res.status(400).json({ error: 'Invalid report type' });
        }

        const expenses = await Expense.findAll({
            where: condition,
            order: [["date", "DESC"]], // Sort by latest expenses
        });

        res.status(200).json(expenses);

    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Server error" });
    }
}