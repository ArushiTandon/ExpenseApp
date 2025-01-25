const express = require('express');
require('dotenv').config();
const { jwtAuthMiddleware } = require('../util/jwt')


const {getExpenses, addExpense, deleteExpense, updateExpense, searchExpense} = require('../controllers/expenseController');
const router = express.Router();

router.get('/' , jwtAuthMiddleware, getExpenses);
router.post('/', jwtAuthMiddleware, addExpense);
router.delete('/:id' , jwtAuthMiddleware, deleteExpense);
router.put('/:id', jwtAuthMiddleware, updateExpense);
router.get('/:date', jwtAuthMiddleware, searchExpense)

module.exports = router;