const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("📝 Attempting to register:", email); // Debug Log 1

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("⚠️ User already exists in database"); // Debug Log 2
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      console.log("✅ User created successfully!"); // Debug Log 3
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.error("❌ REGISTRATION ERROR:", error); // <--- THIS IS THE IMPORTANT LOG
    res.status(400).json({ message: 'Invalid user data', error: error.message });
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Check password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, 'MY_SECRET_KEY', { expiresIn: '30d' });
};

module.exports = router;