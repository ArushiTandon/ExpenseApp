require('dotenv').config();
const express = require('express');
const router = express.Router();
const Brevo = require('sib-api-v3-sdk');
const uuid = require('uuid');

console.log(Brevo.ApiClient);

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.FORGOT_PASSWORD;


const User = require('../models/User');
const Password = require('../models/password');

exports.forgotpassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (user) {
            const id = uuid.v4();
            await Password.create({ id, active: true, userId: user.id });

            const resetLink = `http://localhost:3000/resetpassword.html?id=${id}`;
            const apiInstance = new Brevo.TransactionalEmailsApi();

            const sendSmtpEmail = new Brevo.SendSmtpEmail({
                to: [{ email }],
                sender: { email: process.env.SENDER_EMAIL, name: 'Expense Tracker' },
                subject: 'Password Reset Request',
                htmlContent: `<p>Click the link below to reset your password:</p>
                              <a href="${resetLink}">Reset Password</a>`,
            });

            await apiInstance.sendTransacEmail(sendSmtpEmail);
        }

        res.status(200).json({ message: 'If the email is valid, a reset link has been sent.' });
    } catch (error) {
        console.error('Error sending reset email:', error);
        res.status(500).json({ error: 'Failed to process request. Please try again.' });
    }
};


exports.updatepassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const resetRequest = await Password.findOne({ where: { id, active: true } });

        if (!resetRequest) {
            return res.status(404).json({ error: 'Invalid or expired reset link.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.update({ password: hashedPassword }, { where: { id: resetRequest.userId } });
        await Password.update({ active: false }, { where: { id } });

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password. Please try again.' });
    }
};

  
