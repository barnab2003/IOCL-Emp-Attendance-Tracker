const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadEmployees, exportEmployees } = require('../controllers/dataController');
const { protect } = require('../middleware/authMiddleware');

// Configure Multer for in-memory processing
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', protect, upload.single('file'), uploadEmployees);
router.get('/export', protect, exportEmployees);

module.exports = router;