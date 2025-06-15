const Expense = require('../models/expense');
const User = require('../models/User')



exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ error: 'Error fetching expenses' });
  }
};

exports.addExpense = async (req, res) => {
  const { amount, description, category, date } = req.body;
  const userId = req.user.id;

  try {
    const newExpense = await Expense.create({ amount, description, category, date, userId });
    const totalExpense = await Expense.aggregate([
      { $match: { userId: newExpense.userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const newTotal = totalExpense[0]?.total || 0;
    await User.findByIdAndUpdate(userId, { totalexpense: newTotal });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(400).json({ error: 'Error adding expense' });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  console.log('req.params:', req.params);
console.log('req.body:', req.body);
console.log('req.query:', req.query);
  try {
    const deleted = await Expense.findOneAndDelete({ _id: id, userId });

    if (!deleted) return res.status(404).json({ error: 'Expense not found' });

    const totalExpense = await Expense.aggregate([
      { $match: { userId: deleted.userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const newTotal = totalExpense[0]?.total || 0;
    await User.findByIdAndUpdate(userId, { totalexpense: newTotal });

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err);
    res.status(500).json({ error: 'Error deleting expense' });
  }
};

exports.updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, date } = req.body;
  const userId = req.user.id;

  try {
    const updateFields = { amount, description, category };
    if (date) updateFields.date = date;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      updateFields,
      { new: true }
    );

    if (!updatedExpense) return res.status(404).json({ error: 'Expense not found' });
    res.status(200).json({ message: 'Expense updated successfully', data: updatedExpense });
  } catch (err) {
    console.error('Error updating expense:', err);
    res.status(500).json({ error: 'Error updating expense' });
  }
};


exports.leaderboard = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'expenses',
          localField: '_id',
          foreignField: 'userId',
          as: 'expenses',
        },
      },
      {
        $project: {
          username: 1,
          totalexpense: { $sum: '$expenses.amount' },
        },
      },
      { $sort: { totalexpense: -1 } },
    ]);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
};exports.leaderboard = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'expenses',
          localField: '_id',
          foreignField: 'userId',
          as: 'expenses',
        },
      },
      {
        $project: {
          username: 1,
          totalexpense: { $sum: '$expenses.amount' },
        },
      },
      { $sort: { totalexpense: -1 } },
    ]);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Error fetching leaderboard' });
  }
};