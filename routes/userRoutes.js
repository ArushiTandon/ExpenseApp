const express = require('express');
const { signUp, login, getUserInfo, getUserFiles } = require('../controllers/userController');
const router = express.Router();
const passport = require('../middlewares/auth');
const { jwtAuthMiddleware } = require('../middlewares/jwt');

const localAuthMid = passport.authenticate('local', {session: false});

// Create a new user
router.post('/signup', signUp);

// Login
router.post('/login', localAuthMid, login);

// UserInfo
router.get('/userinfo', jwtAuthMiddleware, getUserInfo);

// Get user files
router.get('/files' , jwtAuthMiddleware, getUserFiles);

module.exports = router;