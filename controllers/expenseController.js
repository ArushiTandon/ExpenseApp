const Expense = require('../models/expense');
const User = require('../models/User')
const sequelize = require('../util/db');
require('dotenv').config();


exports.getExpenses = async (req, res) => {
    try {
        const rows = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Error fetching expenses' });
    }
};

exports.addExpense = async (req, res) => {
    
    const { amount, description, category, date } = req.body;
    const userId = req.user.id; // Extract user id from token

    console.log("USER ID:", userId);

    const t = await sequelize.transaction();
    
    try {

        const result = await sequelize.transaction(async (t) => {
            const newExpense = await Expense.create(
                { amount, description, category, date, userId },
                { transaction: t }
            );

            const totalExpense = await Expense.sum('amount', { where: { userId }, transaction: t });

            await User.update(
                { totalexpense: totalExpense },
                { where: { id: userId }, transaction: t }
            );

            return newExpense;
        });
        await t.commit();
        res.status(201).json(result);
    } catch (error) {
        await t.rollback();
        console.error('Error adding expense:', error);
        res.status(400).json({ error: 'Error adding expense' });
    }
};


exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();

    const { id } = req.params;
    const userId = req.user.id;
    try {
        const rowsDeleted = await Expense.destroy({ where: { id, userId }, transaction: t });

        if (!rowsDeleted) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        
        const totalExpense = await Expense.sum('amount', { where: { userId }, transaction: t });
        await User.update(
            { totalexpense: totalExpense },
            { where: { id: userId }, transaction: t }
        );
        
        await t.commit();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        await t.rollback();
        console.error('Error deleting expense:', err);
        res.status(500).json({ error: 'Error deleting expense' });
    }
};

exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const { amount, description, category, date } = req.body;
    const userId = req.user.id;

    const t = await sequelize.transaction();
    
    try {
        const existingExpense = await Expense.findOne({ where: { id, userId } , transaction: t });

        if (!existingExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        await existingExpense.update({ amount, description, category, date });
        await t.commit();
        res.status(200).json({ message: 'Expense updated successfully' });
    } catch (err) {
        await t.rollback();
        console.error('Error updating expense:', err);
        res.status(500).json({ error: 'Error updating expense' });
    }
};


exports.leaderboard = async (req, res) => {
    try {
        const leaderboardData = await User.findAll({
            attributes: [
                "username",
                [sequelize.fn("SUM", sequelize.col("expenses.amount")), "totalexpense"],
            ],
            include: [
                {
                    model: Expense,
                    attributes: [],
                },
            ],
            group: ["User.id"],
            order: [[sequelize.literal("totalexpense"), "DESC"]],
        });
        res.status(200).json(leaderboardData);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Error fetching leaderboard" });
    }
};
