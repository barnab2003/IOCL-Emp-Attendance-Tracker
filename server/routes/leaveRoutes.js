const express = require('express');
const router = express.Router();
const { getLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getLeaves);

router.route('/:id')
    .put(protect, updateLeaveStatus);

module.exports = router;