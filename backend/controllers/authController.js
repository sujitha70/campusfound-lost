const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, registrationNumber, password } = req.body;

    if (!name || !email || !registrationNumber || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists with email or registration number
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { registrationNumber: registrationNumber.toUpperCase().trim() },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'A student with this email or registration number is already registered',
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      registrationNumber: registrationNumber.toUpperCase().trim(),
      password,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({ message: 'Server error during registration: ' + error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Find user by lowercase email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ message: 'Server error during login: ' + error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('GetMe Error:', error.message);
    return res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

