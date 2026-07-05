const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

// Import your routes and middleware
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const startAbsenceCheckJob = require('./jobs/emailCron');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet()); 
app.use(mongoSanitize()); 

// Body parser
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true 
}));

// Mount routes
app.use('/api/auth', authRoutes);

// Basic Route for testing
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'IOCL Server is running securely.' });
});


app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);

startAbsenceCheckJob();
// ERROR HANDLER MUST BE LAST
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});