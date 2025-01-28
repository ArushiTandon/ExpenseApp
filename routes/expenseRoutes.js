const express = require('express');
require('dotenv').config();
const { jwtAuthMiddleware } = require('../util/jwt')
const router = express.Router();

const {getExpenses, addExpense, deleteExpense, updateExpense, searchExpense, loadExpense} = require('../controllers/expenseController');

router.get('/' , jwtAuthMiddleware, getExpenses);
router.post('/', jwtAuthMiddleware, addExpense);
router.delete('/:id' , jwtAuthMiddleware, deleteExpense);
router.put('/:id', jwtAuthMiddleware, updateExpense);
router.get('/:date', jwtAuthMiddleware, searchExpense)
router.get('/loadexpense', jwtAuthMiddleware, loadExpense)

module.exports = router;