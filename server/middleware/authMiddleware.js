const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');

            // Attach user data based on role
            if (decoded.role === 'Admin') {
                req.user = { id: 'admin_id', role: 'Admin' };
            } else {
                req.user = await Employee.findById(decoded.id).select('-password');
                req.user.role = 'Employee';
            }
            next();
        } catch (error) {
            res.status(401);
            return next(new Error('Not authorized, token failed'));
        }
    } else {
        res.status(401);
        return next(new Error('Not authorized, no token'));
    }
};

// Middleware to block non-admins
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403);
        return next(new Error('Access denied. Admins only.'));
    }
};

module.exports = { protect, adminOnly };