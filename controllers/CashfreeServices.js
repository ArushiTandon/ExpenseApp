require('dotenv').config();
const { Cashfree } = require("cashfree-pg");
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/order");
const User = require('../models/User');
// const axios = require('axios');
// const jwt = require('jsonwebtoken');
const path = require('path');



Cashfree.XClientId = process.env.CASHFREE_KEYID;
Cashfree.XClientSecret = process.env.CASHFREE_KEY_SECRET;
Cashfree.XEnvironment = "TEST";


exports.createOrder = async (req, res) => {
    
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString(); //1 hour expiry time
    
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

        // console.log(Cashfree.XClientId, Cashfree.XClientSecret);

        // console.log("Request being sent to Cashfree:", request);

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        

        const paymentSessionId = response.data.payment_session_id;

        if (!paymentSessionId) {
            console.error("Payment session ID is missing!");
            return;
        }
        
        console.log("Order Created successfully:", response.data);

        await Order.create({
            paymentid: paymentSessionId,
            orderid: orderId,
            status: "PENDING",
        });

       return res.status(200).json({ paymentSessionId , orderId });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ error: "Error creating order" });
    }
};

exports.transactionStatus = async (req, res) => {
    const orderId = req.params.orderId;
    // const token = req.query.token;
    // const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const userId = req.user.id; 
    // const { order_amount } = req.body;

    // console.log("INSIDE TRANSACTION STATUS API:", orderId);  
    

    try {
      const orderStatus = await exports.getPaymentStatus(orderId);

      if (orderStatus === 'SUCCESS') {

       await User.update(
          { isPremium: true },
          { where: { id: userId } }
        );

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
        const getOrderResponse = response.data;

        // console.log(getOrderResponse.length);
        
        let orderStatus;

        if (
            getOrderResponse.filter(
                (transaction) => transaction.payment_status === "SUCCESS"
            ).length > 0
        ) {
            orderStatus = "SUCCESS";
        } else if (
            getOrderResponse.filter(
                (transaction) => transaction.payment_status === "PENDING"
            ).length > 0
        ) {
            orderStatus = "PENDING";
        } else {
            orderStatus = "FAILURE";
        }

        await Order.update(
            { status: orderStatus },
            { where: { orderid: orderId } }
        );

        return orderStatus;
    } catch (error) {
        console.error("Error fetching order status:", error.message);
        throw error; 
    }
};

exports.orderStatus = async (req, res) => {
    // const orderId = req.params.orderId;

    // console.log('Serving orderStatus page for Order ID:', orderId);

    res.sendFile(path.join(__dirname, '..', 'Cashfreeservices', 'orderStatus.html'));
};
