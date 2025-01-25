const express = require('express');
const { signUp, login } = require('../controllers/userController');
const router = express.Router();
const passport = require('../auth');
require('dotenv').config();



const localAuthMid = passport.authenticate('local', {session: false});


// Create a new user
router.post('/signup', signUp);

// Login
router.post('/login', localAuthMid, login);


module.exports = router;