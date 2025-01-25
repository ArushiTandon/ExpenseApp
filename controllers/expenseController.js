const Expense = require('../models/expense');

exports.getExpenses = async (req, res) => {
    try {
        const rows = await Expense.findAll();
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Error fetching expenses' });
    }
};

exports.addExpense = async (req, res) => {
    const { amount, description, category, date } = req.body;
    try {
        const newExpense = await Expense.create({ amount, description, category, date });
        res.status(201).json(newExpense);
    } catch (err) {
        console.error('Error adding expense:', err);
        res.status(400).json({ error: 'Error adding expense' });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const rowsDeleted = await Expense.destroy({ where: { id } });

        if (!rowsDeleted) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).json({ error: 'Error deleting expense' });
    }
};

exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const { amount, description, category, date } = req.body;

    try {
        const existingExpense = await Expense.findByPk(id);

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
    
    try {
        const expense = await Expense.findAll({ where: { date } });
        res.status(200).json(expense);
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).json({ error: 'Error fetching expenses' });
    }
}
