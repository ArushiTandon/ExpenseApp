const express = require('express');
const { signUp, login } = require('../controllers/userController');
const router = express.Router();

// Create a new user
router.post('/signup', signUp);

// Login
router.post('/login', login);


module.exports = router;