const express = require('express');
const router = express.Router();
const { applyLeave, getAllLeaves, updateLeaveStatus, getMyLeaves } = require('../controllers/leaveController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET: Employee views their own leaves
router.route('/my-leaves').get(protect, getMyLeaves);

router.route('/')
    .get(protect, adminOnly, getAllLeaves)
    .post(protect, applyLeave);

router.route('/:id/status')
    .put(protect, adminOnly, updateLeaveStatus);

module.exports = router;