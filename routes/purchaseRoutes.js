const express = require('express');
const CashfreeServices = require('../controllers/CashfreeServices')
const { jwtAuthMiddleware } = require("../util/jwt");


const router = express.Router();

router.post('/premiummembership', jwtAuthMiddleware, CashfreeServices.createOrder);
router.get('/transactionstatus', jwtAuthMiddleware, CashfreeServices.getPaymentStatus);

module.exports = router;