const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin)
const getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: employees });
    } catch (error) {
        next(error);
    }
};

// @desc    Add new employee
// @route   POST /api/employees
// @access  Private (Admin)
const addEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: employee });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single employee profile with history
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeProfile = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id);
        
        if (!employee) {
            res.status(404);
            return next(new Error('Employee not found'));
        }

        // Fetch their recent attendance (last 30 days)
        const attendance = await Attendance.find({ employeeId: req.params.id })
            .sort({ date: -1 })
            .limit(30);

        // Fetch their leave history
        const leaves = await Leave.find({ employeeId: req.params.id })
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            data: { employee, attendance, leaves } 
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update employee details (e.g., training dates, type)
// @route   PUT /api/employees/:id
// @access  Private (Admin)
const updateEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!employee) {
            res.status(404);
            return next(new Error('Employee not found'));
        }

        res.status(200).json({ success: true, data: employee });
    } catch (error) {
        next(error);
    }
};

module.exports = { getEmployees, addEmployee, getEmployeeProfile, updateEmployee };