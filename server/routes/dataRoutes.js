const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadEmployees, exportEmployees, uploadAttendance } = require('../controllers/dataController');
const { protect } = require('../middleware/authMiddleware');

// Configure Multer for in-memory processing
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', protect, upload.single('file'), uploadEmployees);
router.post('/upload-attendance', protect, upload.single('file'), uploadAttendance); // ADD THIS
router.get('/export', protect, exportEmployees);

module.exports = router;