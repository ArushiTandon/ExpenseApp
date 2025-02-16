const express = require('express');
require('dotenv').config();
// const { jwtAuthMiddleware } = require('../util/jwt')
const router = express.Router();
const { forgotPassword } = require('../controllers/passwordController');


router.post('/forgotpassword', forgotPassword);