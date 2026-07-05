const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin only)
const getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: employees.length, data: employees });
    } catch (error) {
        next(error); // Passes the error to your global errorHandler
    }
};

// @desc    Add a new employee
// @route   POST /api/employees
// @access  Private (Admin only)
const addEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        // Handle duplicate unique fields (like email or empId)
        if (error.code === 11000) {
            res.status(400);
            return next(new Error('Duplicate field value entered. Employee ID, Card No, or Email already exists.'));
        }
        next(error);
    }
};

module.exports = { getEmployees, addEmployee };