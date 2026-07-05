const express = require('express');
const router = express.Router();
const { getEmployees, addEmployee } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getEmployees)
    .post(protect, addEmployee);

module.exports = router;