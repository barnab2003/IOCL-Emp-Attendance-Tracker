const express = require('express');
const router = express.Router();

// Make sure all three are inside these brackets
const { getAttendanceStats, checkIn, checkOut } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, getAttendanceStats);
router.route('/check-in').post(protect, checkIn);
router.route('/check-out/:id').put(protect, checkOut);

module.exports = router;