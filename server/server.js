const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(mongoSanitize()); // Sanitizes user-supplied data to prevent MongoDB Operator Injection

// Body parser
app.use(express.json());

// CORS Configuration - Restrict to your frontend domain
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true 
}));

// Basic Route for testing
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'IOCL Server is running securely.' });
});
app.use('/api/auth', authRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});