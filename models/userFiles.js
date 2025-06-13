const mongoose = require('mongoose');

const userFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserFile', userFileSchema);
