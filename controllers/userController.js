const bcrypt = require('bcrypt');
const User = require('../models/User');
const UserFile = require('../models/userFiles');
const { generateToken } = require('../middlewares/jwt');

exports.signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(200).json({ message: 'Username already exists' });
    }

    // Create new user; password hash handled by Mongoose pre-save hook
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ userId: newUser._id, message: 'ACCOUNT CREATED!' });
  } catch (error) {
    console.error('ERROR:', error);
    res.status(400).json({ error: 'Error creating user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const payload = {
      id: user._id,
      username: user.username,
    };
    const token = generateToken(payload);

    res.status(200).json({
      message: 'Login successful!',
      token,
      redirectUrl: '/addExpense',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Error logging in' });
  }
};

exports.getUserInfo = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('id username email isPremium');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
};

  
 exports.getUserFiles = async (req, res) => {
  const userId = req.user.id;

  try {
    const files = await UserFile.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, files });
  } catch (error) {
    console.error('Error fetching user files:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch' });
  }
};
