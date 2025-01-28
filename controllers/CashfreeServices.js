const Cashfree = require('cashfree-pg'); 
const Order = require("../models/order");

Cashfree.XClientId = "CASHFREE_KEYID";
Cashfree.XClientSecret = "CASHFREE_KEY_SECRET";
Cashfree.XEnvironment = "TEST";

 exports.createOrder = async (req, res) => {
    try {
        const order_amount = req.body.order_amount; // order_amount is sent in the request

        const request = {
            order_amount: order_amount,
            order_currency: "INR",
            order_id: "devstudio_83855830",
            customer_details: {
                customer_id: "devstudio_user",
                customer_phone: "8474090589",
            },
            order_meta: {
                return_url: "http://localhost:3000/expense/transactionstatus?order_id={order_id}",
                notify_url: "", // Optional

                payment_methods: "cc,dc,upi",
            },
            order_expiry_time: "2025-01-28T11:40:07.869Z",
        };

        const response = await Order.PGCreateOrder("2023-08-01", request);
        const paymentSessionId = response.data.payment_session_id;

        res.status(200).json({ paymentSessionId });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ error: "Error creating order" });
    }
};

// Get Payment Status Function
exports.getPaymentStatus = async (orderId) => {
    try {
        const response = await Order.PGOrderFetchPayments("2025-08-01", orderId);
        const getOrderResponse = response.data;

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

        return orderStatus;
    } catch (error) {
        console.error("Error fetching order status:", error.message);
        throw error; 
    }
};
