const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const {generateToken}=require('../utils/generateToken')
const verifyToken=require('../middlewares/auth')

const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const adminExists = await Admin.findOne({});
    if (adminExists) {
      return res.status(403).json({ message: 'Admin already registered' });
    }

    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(admin);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,          // required for SameSite=None
      sameSite: 'None',      // allow cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ message: 'Login successful' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET PROFILE
router.get('/profile',verifyToken,async (req, res) => {
  const { email } = req.admin;
  res.json({ email });
});

// UPDATE PROFILE
router.put('/profile',verifyToken ,async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: 'Please provide email or password to update' });
  }

  if (email) req.admin.email = email;
  if (password) req.admin.password = await bcrypt.hash(password, 10);

  await req.admin.save();
  res.json({ message: 'Profile updated successfully' });
});



// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,       // match cookie settings used in login
    sameSite: 'None'    // match cookie settings used in login
  });
  return res.status(200).json({ message: 'Logged out successfully' });
});





module.exports = router;