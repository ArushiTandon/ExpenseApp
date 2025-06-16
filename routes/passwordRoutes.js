const express = require('express');
const router = express.Router();
const { forgotpassword , updatepassword } = require('../controllers/passwordController');

router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword/:id', updatepassword);


module.exports = router;