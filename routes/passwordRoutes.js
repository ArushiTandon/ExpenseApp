const express = require('express');
require('dotenv').config();
// const { jwtAuthMiddleware } = require('../util/jwt')
const router = express.Router();
const { forgotpassword , updatepassword } = require('../controllers/passwordController');

router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword/:id', updatepassword);


module.exports = router;