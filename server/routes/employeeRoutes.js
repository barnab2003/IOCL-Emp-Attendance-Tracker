const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getEmployees, addEmployee, getEmployeeProfile, updateEmployee } = require('../controllers/employeeController');
router.route('/')
    .get(protect, getEmployees)
    .post(protect, addEmployee);
router.route('/:id')
    .get(protect, getEmployeeProfile)
    .put(protect, updateEmployee); 
module.exports = router;