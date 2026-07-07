const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretkey', {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token (Admin or Employee)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Check for Admin Login (Hardcoded for simplicity, or use your Admin DB model)
        if (email === 'admin@iocl.com' && password === 'admin123') {
            return res.status(200).json({
                success: true,
                data: {
                    _id: 'admin_id',
                    name: 'System Admin',
                    email: 'admin@iocl.com',
                    role: 'Admin',
                    token: generateToken('admin_id', 'Admin')
                }
            });
        }

        // 2. Check for Employee Login
        const employee = await Employee.findOne({ email });

        // For production, you should use bcrypt to compare hashed passwords
        if (employee && employee.password === password) {
            return res.status(200).json({
                success: true,
                data: {
                    _id: employee._id,
                    name: employee.name,
                    email: employee.email,
                    role: 'Employee',
                    token: generateToken(employee._id, 'Employee')
                }
            });
        }

        res.status(401);
        return next(new Error('Invalid email or password'));
    } catch (error) {
        next(error);
    }
};

module.exports = { login };