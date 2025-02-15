const Expense = require('../models/expense');
const User = require('../models/User')
const sequelize = require('../util/db');

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

    console.log("INSIDE ADD EXPENSE");
    
    const { amount, description, category, date } = req.body;
    const userId = req.user.id; // Extracting user id from token

    console.log("USER ID:", userId);

    const t = sequelize.transaction();
    
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

        await t.commit();
        
        const totalExpense = await Expense.sum('amount', { where: { userId }, transaction: t });
        await User.update(
            { totalexpense: totalExpense },
            { where: { id: userId }, transaction: t }
        );
        
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

    console.log("******");
    console.log(id);
    console.log("******");
    
    
    try {
        const existingExpense = await Expense.findOne({ where: { id, userId } });

        if (!existingExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        await existingExpense.update({ amount, description, category, date });

        res.status(200).json({ message: 'Expense updated successfully' });
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).json({ error: 'Error updating expense' });
    }
};

exports.searchExpense = async (req, res) => {
    const { date } = req.params;
    const userId = req.user.id;
    
    try {
        const expense = await Expense.findAll({ where: { date, userId } });
        res.status(200).json(expense);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Error fetching expenses' });
    }
}

// exports.loadExpense = async (req, res) => {
    
//     try {
//         const expense = await Expense.findAll();
//         res.status(200).json(expense);
//     } catch (err) {
//         console.error('Error loading expenses:', err);
//         res.status(500).json({ error: 'Error loading expenses' });
//     }
// }
