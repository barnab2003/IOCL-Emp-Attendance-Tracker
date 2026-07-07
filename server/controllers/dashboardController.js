const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

// @desc    Get dashboard summary statistics & chart data
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const totalTrainees = await Employee.countDocuments({ employeeType: { $in: ['Apprentice', 'Intern'] } });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const presentToday = await Attendance.countDocuments({ 
            date: { $gte: today, $lt: tomorrow },
            status: 'Present' // <-- Explicitly filter for Present staff
        });
        const onLeaveToday = await Leave.countDocuments({
            status: 'Approved',
            startDate: { $lte: today },
            endDate: { $gte: today }
        });

        // --- NEW: CHART DATA AGGREGATION ---

        // 1. Department Distribution (Pie Chart)
        const deptDistribution = await Employee.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 } } },
            { $project: { name: '$_id', value: '$count', _id: 0 } }
        ]);

        // 2. Attendance Trend - Last 7 Days (Bar Chart)
        // 2. Attendance Trend - Last 7 Days (Double Bar Chart)
        // Dynamic Range Calculation
        const range = req.query.range || '7days';
        const startDate = new Date();
        startDate.setHours(0,0,0,0);
        
        if (range === 'today') startDate.setDate(startDate.getDate());
        else if (range === '7days') startDate.setDate(startDate.getDate() - 7);
        else if (range === '30days') startDate.setDate(startDate.getDate() - 30);
        else if (range === 'year') startDate.setDate(startDate.getDate() - 365);

        const rawAttendanceTrend = await Attendance.aggregate([
            { $match: { date: { $gte: startDate } } },
            { $group: { 
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
                present: { $sum: 1 } 
            }},
            { $sort: { _id: 1 } }
        ]);

        // Map through the raw data to calculate the absent count dynamically
        const attendanceTrend = rawAttendanceTrend.map(day => ({
            date: day._id,
            present: day.present,
            absent: totalEmployees - day.present // Total workforce minus those present
        }));

        res.status(200).json({
            success: true,
            data: { 
                totalEmployees, totalTrainees, presentToday, onLeaveToday, 
                deptDistribution, attendanceTrend 
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboardStats };