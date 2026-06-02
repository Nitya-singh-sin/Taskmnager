const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password min 6 characters' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, message: 'Registered successfully', data: { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    res.json({ success: true, message: 'Login successful', data: { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = (req, res) => res.json({ success: true, data: req.user });

module.exports = { registerUser, loginUser, getMe };
