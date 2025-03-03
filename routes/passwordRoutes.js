const express = require('express');
require('dotenv').config();
const router = express.Router();
const { forgotpassword , updatepassword } = require('../controllers/passwordController');

router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword/:id', updatepassword);


module.exports = router;