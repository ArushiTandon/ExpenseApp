const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  paymentid: String,
  orderid: String,
  status: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Order', orderSchema);
