const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;

    // Read token from Authorization header (Format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the admin payload from the database and append it to the request object
            req.admin = await Admin.findById(decoded.id);
            
            if (!req.admin) {
                return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };