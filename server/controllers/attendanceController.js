const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');

// @desc    Get dashboard chart statistics
// @route   GET /api/attendance/stats
// @access  Private
const getAttendanceStats = async (req, res, next) => {
    try {
        const { timeframe } = req.query; // 'day', 'month', or 'year'
        
        let startDate = new Date();
        const endDate = new Date();

        // Determine date range based on the filter toggle
        if (timeframe === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (timeframe === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        } else {
            // Default to 'day' (past 24 hours)
            startDate.setHours(0, 0, 0, 0);
        }

        const matchStage = {
            $match: {
                date: { $gte: startDate, $lte: endDate }
            }
        };

        // 1. Pipeline for Overall Attendance (Big Pie Chart)
        const overallStats = await Attendance.aggregate([
            matchStage,
            {
                $group: {
                    _id: '$status', // Present, Absent, Late, On Leave
                    count: { $sum: 1 }
                }
            }
        ]);

        // 2. Pipeline for Department-Wise Data (Double Bar Graph & Smaller Pie Chart)
        const deptStats = await Attendance.aggregate([
            matchStage,
            {
                // Join with Employee collection to get the department
                $lookup: {
                    from: 'employees',
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employeeData'
                }
            },
            { $unwind: '$employeeData' },
            {
                // Group by both Department and Status
                $group: {
                    _id: {
                        department: '$employeeData.department',
                        status: '$status'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                // Restructure for easier frontend parsing
                $group: {
                    _id: '$_id.department',
                    attendanceRecords: {
                        $push: {
                            status: '$_id.status',
                            count: '$count'
                        }
                    },
                    total: { $sum: '$count' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overall: overallStats,
                departmentWise: deptStats
            }
        });
    } catch (error) {
        next(error);
    }
};

// ... existing getAttendanceStats function ...

// @desc    Employee Check-In
// @route   POST /api/attendance/check-in
// @access  Private (Employee or Admin)
const checkIn = async (req, res, next) => {
    try {
        const { employeeId } = req.body;
        
        // Define today's date boundaries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Check if already checked in today
        const existingRecord = await Attendance.findOne({
            employeeId,
            date: { $gte: today, $lte: endOfDay }
        });

        if (existingRecord) {
            res.status(400);
            return next(new Error('Employee has already checked in today.'));
        }

        // Determine if Late (e.g., after 9:30 AM)
        const checkInTime = new Date();
        const cutoffTime = new Date();
        cutoffTime.setHours(9, 30, 0, 0);
        
        const status = checkInTime > cutoffTime ? 'Late' : 'Present';

        const attendance = await Attendance.create({
            employeeId,
            date: new Date(),
            status,
            checkIn: checkInTime
        });

        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        next(error);
    }
};

// @desc    Employee Check-Out
// @route   PUT /api/attendance/check-out/:id
// @access  Private
const checkOut = async (req, res, next) => {
    try {
        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            res.status(404);
            return next(new Error('Attendance record not found.'));
        }

        attendance.checkOut = new Date();
        await attendance.save();

        res.status(200).json({ success: true, data: attendance });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAttendanceStats, checkIn, checkOut };