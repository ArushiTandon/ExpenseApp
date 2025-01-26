const Razorpay = require('razorpay');
const Order = require('../models/order');

exports.purchasePremium = async (req, res) => {
    try {
        
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        
        const order = await rzp.orders.create({ amount, currency: "INR" });

        
        await req.user.createOrder({ orderid: order.id, status: 'PENDING' });

        return res.status(201).json({ order, key_id: rzp.key_id });
    } catch (error) {
        console.error('Error during purchasePremium:', error);
        return res.status(500).json({ message: 'Failed to initiate purchase. Please try again later.' });
    }
};

exports.purchaseStatus = async (req, res) => {
    const { order_id, status } = req.body; 
    try {
        if (!order_id || !status) {
            return res.status(400).json({ message: "Order ID and status are required." });
        }

        const order = await Order.findOne({ where: { id: order_id } });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Update the status of the order
        order.status = status;
        await order.save();

        return res.status(200).json({
            message: `Order status updated to ${status}.`,
            order,
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            message: "Failed to update order status. Please try again later.",
            error: error.message,
        });
    }
}