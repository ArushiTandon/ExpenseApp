const express = require('express');
// const purchaseController = require('../controllers/purchaseController');
const CashfreeServices = require('../controllers/CashfreeServices')
const { jwtAuthMiddleware } = require("../util/jwt");


const router = express.Router();

router.get('/premiummembership', jwtAuthMiddleware, CashfreeServices.createOrder);
router.post('/transactionstatus', jwtAuthMiddleware, CashfreeServices.getPaymentStatus);

module.exports = router;