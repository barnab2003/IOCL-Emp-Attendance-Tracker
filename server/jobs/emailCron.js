const cron = require('node-cron');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const sendEmail = require('../config/mailer');

// Schedule job to run at 18:00 (6 PM) every day
const startAbsenceCheckJob = () => {
    cron.schedule('0 18 * * *', async () => {
        console.log('Running daily absence check cron job...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            // 1. Fetch all active employees
            const employees = await Employee.find({});

            // 2. Fetch today's attendance records
            const todaysAttendance = await Attendance.find({
                date: { $gte: today, $lte: endOfDay }
            });
            const attendedEmployeeIds = todaysAttendance.map(a => a.employeeId.toString());

            // 3. Fetch today's approved leaves
            const todaysLeaves = await Leave.find({
                status: 'Approved',
                startDate: { $lte: endOfDay },
                endDate: { $gte: today }
            });
            const onLeaveEmployeeIds = todaysLeaves.map(l => l.employeeId.toString());

            // 4. Find employees who are neither present nor on leave
            for (const employee of employees) {
                const empIdStr = employee._id.toString();
                
                if (!attendedEmployeeIds.includes(empIdStr) && !onLeaveEmployeeIds.includes(empIdStr)) {
                    // Trigger email alert
                    const message = `Dear ${employee.name},\n\nOur records indicate you were absent today without prior approved leave. Please submit a leave request or contact your department manager immediately.\n\nRegards,\nIOCL Administration`;
                    
                    await sendEmail({
                        email: employee.email,
                        subject: 'Notice: Unapproved Absence Today',
                        message: message
                    });
                }
            }
            console.log('Daily absence check completed successfully.');
        } catch (error) {
            console.error('Error in daily absence check job:', error);
        }
    });
};

module.exports = startAbsenceCheckJob;