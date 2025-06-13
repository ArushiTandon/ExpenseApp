const Expense = require('../models/expense');
const { format, startOfDay, startOfWeek, startOfMonth } = require('date-fns');
const AwsServices = require('../services/AwsService');


exports.viewReport = async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  try {
    const { reportType } = req.params;
    const userId = req.user.id;
    const condition = { userId };

    const today = startOfDay(new Date());
    const startOfWeekDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const startOfMonthDate = startOfMonth(new Date());

    if (reportType === 'daily') {
      condition.date = { $gte: today };
    } else if (reportType === 'weekly') {
      condition.date = { $gte: startOfWeekDate };
    } else if (reportType === 'monthly') {
      condition.date = { $gte: startOfMonthDate };
    } else {
      return res.status(400).json({ error: 'Invalid report type' });
    }

    const totalExpenses = await Expense.countDocuments(condition);

    const expenses = await Expense.find(condition)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      expenses,
      totalExpenses,
      totalPages: Math.ceil(totalExpenses / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const formattedDate = format(new Date(), 'dd-MM-yyyy');
    const userId = req.user.id;

    const expenses = await Expense.find({ userId });
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `reports/Expenses_${userId}_${formattedDate}.txt`;

    const fileUrl = await AwsServices.uploadToS3(userId, filename, stringifiedExpenses);

    res.status(200).json({ fileUrl, success: true });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false });
  }
};


