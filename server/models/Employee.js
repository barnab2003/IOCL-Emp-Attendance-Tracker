const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    punchingCardNo: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
    },
    department: {
        type: String,
        required: true,
        enum: ['MECH', 'CIVIL', 'QC', 'TS', 'INSP', 'MSC', 'ES', 'F&S', 'HSC', 'PSM', 'FIN', 'MEO', 'HR', 'IS', 'VIG', 'MKT', 'PROD', 'PSU', 'EM', 'INST']
    },
    employeeType: {
        type: String,
        required: true,
        enum: ['Employee', 'Apprentice', 'Intern'],
        default: 'Employee'
    },
    joiningDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    trainingEndDate: {
        type: Date,
        required: function() {
            // Training end date is required only if the user is an Apprentice or Intern
            return this.employeeType === 'Apprentice' || this.employeeType === 'Intern';
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);