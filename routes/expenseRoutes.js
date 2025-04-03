const express = require('express');
require('dotenv').config();
const { jwtAuthMiddleware } = require('../middlewares/jwt')
const router = express.Router();

const {getExpenses, addExpense, deleteExpense, updateExpense, leaderboard} = require('../controllers/expenseController');

router.get('/' , jwtAuthMiddleware, getExpenses);
router.post('/', jwtAuthMiddleware, addExpense);
router.delete('/:id' , jwtAuthMiddleware, deleteExpense);
router.put('/:id', jwtAuthMiddleware, updateExpense);
router.get('/leaderboard', jwtAuthMiddleware, leaderboard);

module.exports = router;