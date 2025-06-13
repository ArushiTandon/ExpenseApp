const Expense = require('../models/expense');
const Order = require('../models/order');
const User = require('../models/User');
const { format, startOfDay, startOfWeek, startOfMonth } = require('date-fns');
const AwsServices = require('../services/AwsService');
const { Cashfree } = require("cashfree-pg");
const { v4: uuidv4 } = require("uuid");
const path = require('path');
require('dotenv').config();



Cashfree.XClientId = process.env.CASHFREE_KEYID;
Cashfree.XClientSecret = process.env.CASHFREE_KEY_SECRET;
Cashfree.XEnvironment = "TEST";


exports.createOrder = async (req, res) => {
  const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // expires in 1 hour
  const orderId = `order_${uuidv4()}`;

  try {
    const request = {
      order_amount: 2500,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: "devstudio_user",
        customer_phone: "8474770589",
      },
      order_meta: {
        return_url: `http://localhost:3000/purchase/orderStatus/${orderId}`,
        payment_methods: "cc,dc,upi",
      },
      order_expiry_time: expiryDate,
    };

    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    const paymentSessionId = response.data.payment_session_id;

    if (!paymentSessionId) {
      console.error("Payment session ID is missing!");
      return res.status(500).json({ error: "Payment session creation failed" });
    }

    await Order.create({
      paymentid: paymentSessionId,
      orderid: orderId,
      status: "PENDING",
      userId: req.user.id,
    });

    return res.status(200).json({ paymentSessionId, orderId });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ error: "Error creating order" });
  }
};


exports.transactionStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user.id;

  try {
    const orderStatus = await exports.getPaymentStatus(orderId);

    if (orderStatus === 'SUCCESS') {
      await User.findByIdAndUpdate(userId, { isPremium: true });
    }

    return res.status(200).json({ orderId, orderStatus });
  } catch (error) {
    console.error("Error fetching transaction status:", error.message);
    res.status(500).json({ error: "Error fetching transaction status" });
  }
};
  
// Get Payment Status Function
exports.getPaymentStatus = async (orderId) => {
  try {
    const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);
    const transactions = response.data;

    let orderStatus = 'FAILURE';
    if (transactions.some(txn => txn.payment_status === "SUCCESS")) {
      orderStatus = "SUCCESS";
    } else if (transactions.some(txn => txn.payment_status === "PENDING")) {
      orderStatus = "PENDING";
    }

    await Order.findOneAndUpdate({ orderid: orderId }, { status: orderStatus });
    return orderStatus;
  } catch (error) {
    console.error("Error fetching order status:", error.message);
    throw error;
  }
};

exports.orderStatus = async (req, res) => {

  res.sendFile(path.join(__dirname, '..', 'Cashfreeservices', 'orderStatus.html'));
};