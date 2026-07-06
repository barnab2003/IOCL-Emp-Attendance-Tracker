const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    sessions: [{
        checkIn: { type: Date, required: true },
        checkOut: { type: Date }
    }],
    totalMinutes: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half-Day'],
        default: 'Absent'
    }
}, { timestamps: true });

// Ensure we only have one attendance document per employee per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);