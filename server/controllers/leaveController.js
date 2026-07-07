const Leave = require('../models/Leave');

// @desc    Apply for leave (Employee)
// @route   POST /api/leaves
// @access  Private (Employee)
const applyLeave = async (req, res, next) => {
    try {
        const leave = await Leave.create({
            employeeId: req.user._id,
            ...req.body,
            status: 'Pending'
        });
        res.status(201).json({ success: true, data: leave });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all leave requests (Admin)
// @route   GET /api/leaves
// @access  Private (Admin)
const getAllLeaves = async (req, res, next) => {
    try {
        const leaves = await Leave.find().populate('employeeId', 'name empId department').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        next(error);
    }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin)
const updateLeaveStatus = async (req, res, next) => {
    try {
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.status(200).json({ success: true, data: leave });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged-in employee's leaves
// @route   GET /api/leaves/my-leaves
// @access  Private (Employee)
const getMyLeaves = async (req, res, next) => {
    try {
        const leaves = await Leave.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: leaves });
    } catch (error) {
        next(error);
    }
};

module.exports = { applyLeave, getAllLeaves, updateLeaveStatus, getMyLeaves }; // <-- Update exports