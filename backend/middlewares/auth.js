const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // ✅ Import Admin model

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: 'Access Denied: No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY); // { id: ... }

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: 'Admin not found' });

    req.admin = admin; // ✅ Attach full admin object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = verifyToken;
