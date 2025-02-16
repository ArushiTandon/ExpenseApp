require('dotenv').config();
const express = require('express');
const router = express.Router();
const Brevo = require('@getbrevo/brevo');

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.FORGOT_PASSWORD;

exports.forgotpassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const apiInstance = new Brevo.TransactionalEmailsApi();

        const sendSmtpEmail = new Brevo.SendSmtpEmail({
            to: [{ email }],
            sender: { email: process.env.SENDER_EMAIL, name: 'Expense-Tracker' },
            subject: 'Password Reset Request',
            htmlContent: '<p>This is a dummy email for password reset.</p>',
        });

        await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};

module.exports = router;
  
