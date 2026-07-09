const Leave = require('../models/Leave');
const sendEmail = require('../utils/sendEmail');

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
// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id/status
// @access  Private (Admin)
const updateLeaveStatus = async (req, res, next) => {
    try {
        // Find the leave and explicitly populate the employee details so we have their email
        const leave = await Leave.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).populate('employeeId', 'name email');

        // Construct a clean HTML email message
        const emailMessage = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #00215F;">Leave Request Update</h2>
                <p>Hello <strong>${leave.employeeId.name}</strong>,</p>
                <p>Your recent leave request for <strong>${leave.type}</strong> has been marked as: 
                   <span style="color: ${req.body.status === 'Approved' ? '#10b981' : '#ef4444'}; font-weight: bold;">
                     ${req.body.status}
                   </span>
                </p>
                <p><strong>Dates:</strong> ${new Date(leave.startDate).toLocaleDateString()} to ${new Date(leave.endDate).toLocaleDateString()}</p>
                <br/>
                <p>Regards,<br/>HR Department</p>
            </div>
        `;

        // Trigger the email utility
        try {
            await sendEmail({
                email: leave.employeeId.email,
                subject: `Leave Request ${req.body.status} - IOCL HR`,
                message: emailMessage
            });
        } catch (emailError) {
            console.error("Email could not be sent:", emailError);
            // We don't want to crash the app if the email fails, just log it.
        }

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