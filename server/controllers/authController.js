const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token payload
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d' // Token expires in 24 hours
    });
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Explicitly select password since we set 'select: false' in the Schema
        const admin = await Admin.findOne({ email }).select('+password');

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                success: true,
                token: generateToken(admin._id),
                admin: {
                    id: admin._id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in admin details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            admin: req.admin
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { loginAdmin, getMe };