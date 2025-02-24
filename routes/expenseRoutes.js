const express = require('express');
require('dotenv').config();
const { jwtAuthMiddleware } = require('../util/jwt')
const router = express.Router();

const {getExpenses, addExpense, deleteExpense, updateExpense, searchExpense, leaderboard} = require('../controllers/expenseController');

const isPremiumUser = (req, res, next) => {
    if (req.user && req.user.isPremium) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Premium users only.' });
    }
};

router.get('/' , jwtAuthMiddleware, getExpenses);
router.post('/', jwtAuthMiddleware, addExpense);
router.delete('/:id' , jwtAuthMiddleware, deleteExpense);
router.put('/:id', jwtAuthMiddleware, updateExpense);
router.get('/:date', jwtAuthMiddleware, searchExpense);
router.get('/leaderboard', jwtAuthMiddleware, isPremiumUser, leaderboard);

module.exports = router;