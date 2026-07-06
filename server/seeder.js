const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await Admin.deleteMany();
        await Employee.deleteMany();
        await Attendance.deleteMany();

        // 1. Create Default Admin
        const adminUser = await Admin.create({
            username: 'SuperAdmin',
            email: 'admin@iocl.com',
            password: 'password123', // Will be hashed by the pre-save hook
            role: 'admin'
        });

        // 2. Create Dummy Employees across different departments
        const departments = ['MECH', 'CIVIL', 'QC', 'PROD', 'HR'];
        const employees = [];
        
        for (let i = 1; i <= 20; i++) {
            employees.push({
                empId: `IOCL100${i}`,
                name: `Employee ${i}`,
                punchingCardNo: `CARD-${1000 + i}`,
                email: `emp${i}@iocl.com`,
                department: departments[i % departments.length]
            });
        }
        
        const createdEmployees = await Employee.insertMany(employees);

        // 3. Generate Random Attendance for Today
        const attendanceRecords = [];
        const statuses = ['Present', 'Present', 'Present', 'Late', 'Absent', 'On Leave']; // Weighted for mostly present

        for (const emp of createdEmployees) {
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            attendanceRecords.push({
                employeeId: emp._id,
                date: new Date(),
                status: randomStatus,
                checkIn: randomStatus === 'Present' || randomStatus === 'Late' ? new Date(new Date().setHours(8, Math.floor(Math.random() * 60), 0)) : null
            });
        }

        await Attendance.insertMany(attendanceRecords);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();