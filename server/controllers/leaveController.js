const Leave = require('../models/Leave');
const sendEmail = require('../config/mailer');
// @desc    Get all leaves (Optionally filter by status)
// @route   GET /api/leaves
// @access  Private (Admin only)
const getLeaves = async (req, res, next) => {
    try {
        const query = req.query.status ? { status: req.query.status } : {};
        // Populate pulls in the employee's name and department from the Employee collection
        const leaves = await Leave.find(query).populate('employeeId', 'name department empId');
        
        res.status(200).json({ success: true, count: leaves.length, data: leaves });
    } catch (error) {
        next(error);
    }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private (Admin only)
const updateLeaveStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        if (!['Approved', 'Rejected'].includes(status)) {
            res.status(400);
            return next(new Error('Invalid status update.'));
        }

        const leave = await Leave.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true, runValidators: true }
        ).populate('employeeId', 'name email');

        if (!leave) {
            res.status(404);
            return next(new Error('Leave request not found.'));
        }

        // Trigger instantaneous email to employee notifying them of approval/rejection
        const message = `Dear ${leave.employeeId.name},\n\nYour leave request for ${leave.type} from ${new Date(leave.startDate).toDateString()} to ${new Date(leave.endDate).toDateString()} has been ${status}.\n\nRegards,\nIOCL Administration`;
        
        await sendEmail({
            email: leave.employeeId.email,
            subject: `Leave Request ${status}`,
            message: message
        });

        res.status(200).json({ success: true, data: leave });
    } catch (error) {
        next(error);
    }
};

module.exports = { getLeaves, updateLeaveStatus };