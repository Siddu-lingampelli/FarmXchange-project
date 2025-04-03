const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authorization token found' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Add user info to request
    req.user = {
      _id: user._id, // This is the MongoDB ObjectId
      userId: user._id, // Add this for compatibility
      email: user.email,
      userType: user.userType,
      fullName: user.fullName
    };
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Please authenticate' 
    });
  }
};
