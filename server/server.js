const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

// 1. Import All Routes
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// 2. Import Middleware & Jobs
const errorHandler = require('./middleware/errorMiddleware');
const startAbsenceCheckJob = require('./jobs/emailCron');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// 1. CORS MUST BE FIRST
app.use(cors({
    origin: true, // Setting to true dynamically reflects the requesting origin (perfect for local dev)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Adjust Helmet to allow cross-origin API requests
app.use(helmet({
    crossOriginResourcePolicy: false,
})); 

// 3. Then parse the body and sanitize
// 3. Then parse the body and sanitize
// 3. Parse the body FIRST
app.use(express.json());

// 4. Express 5 Compatibility Workaround
app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        value: req.query,
        writable: true,
        configurable: true,
        enumerable: true,
    });
    next();
});

// 5. Clean the data SECOND
app.use(mongoSanitize());

// --- Mount Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'IOCL Server is running securely.' });
});

// --- Initialize Automated Tasks ---
startAbsenceCheckJob();

// --- Error Handling (Must be last) ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});