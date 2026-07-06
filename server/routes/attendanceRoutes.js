const express = require('express');
const router = express.Router();

// Make sure all three are inside these brackets
const { protect } = require('../middleware/authMiddleware');
const { getAttendanceStats, checkIn, checkOut, getAllAttendanceLogs } = require('../controllers/attendanceController');

router.route('/').get(protect, getAllAttendanceLogs); // ADD THIS LINE
router.route('/stats').get(protect, getAttendanceStats);
router.route('/check-in').post(protect, checkIn);
router.route('/check-out/:id').put(protect, checkOut);

module.exports = router;