const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserFile = require('../models/userFiles');
const { generateToken } = require('../middlewares/jwt');
const ForgotPassword = require('../models/password');
const Brevo = require('sib-api-v3-sdk');
const uuid = require('uuid');
require('dotenv').config();

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.FORGOT_PASSWORD;

console.log('API Key:', process.env.FORGOT_PASSWORD ? 'Exists' : 'Missing');

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const id = uuid.v4();
    await ForgotPassword.create({ id, userId: user._id, active: true });

    const resetLink = `http://localhost:3000/resetpassword.html?id=${id}`;
    const emailData = {
      sender: { email: 'arushitandon4@gmail.com', name: 'Expense Tracker' },
      to: [{ email }],
      subject: 'Password Reset Request',
      htmlContent: `<p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`
    };

    const apiInstance = new Brevo.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail(emailData);

    res.status(200).json({ message: 'A reset link has been sent.', resetId: id });
  } catch (error) {
    console.error('Error sending reset email:', error);
    res.status(500).json({ error: 'Failed to process request. Please try again.' });
  }
};

exports.updatepassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const resetRequest = await ForgotPassword.findOne({ id, active: true });
    if (!resetRequest) return res.status(404).json({ error: 'Invalid or expired reset link.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(resetRequest.userId, { password: hashedPassword });
    await ForgotPassword.findOneAndUpdate({ id }, { active: false });

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
};