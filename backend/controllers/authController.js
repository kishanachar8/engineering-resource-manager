const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      skills,
      seniority,
      maxCapacity,
      department
    } = req.body;

    console.log("📩 Incoming Data:", req.body);

    // Check for required fields
    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({ msg: 'All required fields must be provided' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("🚫 Email already exists");
      return res.status(409).json({ msg: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("🔐 Password hashed");

    // Create user object
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      skills,
      seniority,
      maxCapacity,
      department
    });

    console.log("📦 User to be saved:", newUser);

    // Save user to DB
    await newUser.save();
    console.log("✅ User saved successfully");

    // Generate JWT token
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not defined");
      return res.status(500).json({ msg: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password before sending user data
    const { password: _, ...userWithoutPassword } = newUser._doc;

    res.status(201).json({
      msg: 'User registered successfully',
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


