const Employee = require('../models/Employee');
const xlsx = require('xlsx');

// @desc    Upload Employees via Excel
// @route   POST /api/data/upload
// @access  Private (Admin)
const uploadEmployees = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            return next(new Error('Please upload an Excel file.'));
        }

        // Parse the uploaded file from memory
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (rows.length === 0) {
            res.status(400);
            return next(new Error('The uploaded file is empty.'));
        }

        let processedCount = 0;

        // Iterate through rows and upsert (update if exists, insert if new) to prevent duplicate key crashes
        for (const row of rows) {
            if (!row.EmpID || !row.Name || !row.Email || !row.Department || !row.CardNo) continue;

            const employeeData = {
                empId: row.EmpID.toString(),
                name: row.Name,
                email: row.Email,
                department: row.Department,
                punchingCardNo: row.CardNo.toString(),
                employeeType: row.Type || 'Employee',
                trainingEndDate: row.TrainingEndDate ? new Date(row.TrainingEndDate) : null
            };

            await Employee.findOneAndUpdate(
                { empId: employeeData.empId }, 
                employeeData, 
                { upsert: true, new: true, runValidators: true }
            );
            processedCount++;
        }

        res.status(200).json({ 
            success: true, 
            message: `Successfully processed ${processedCount} employee records.` 
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Export Employees to Excel
// @route   GET /api/data/export
// @access  Private (Admin)
const exportEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 }).lean();

        // Format raw database records for the Excel sheet
        const worksheetData = employees.map(emp => ({
            'EmpID': emp.empId,
            'Name': emp.name,
            'Email': emp.email,
            'Department': emp.department,
            'CardNo': emp.punchingCardNo,
            'Type': emp.employeeType,
            'TrainingEndDate': emp.trainingEndDate ? emp.trainingEndDate.toISOString().split('T')[0] : 'N/A',
            'Registered On': emp.createdAt.toISOString().split('T')[0]
        }));

        // Generate workbook
        const worksheet = xlsx.utils.json_to_sheet(worksheetData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Employee_Directory');

        // Create buffer
        const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        // Set headers to prompt a file download in the browser
        res.setHeader('Content-Disposition', 'attachment; filename="IOCL_Employees.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        res.send(excelBuffer);
    } catch (error) {
        next(error);
    }
};

module.exports = { uploadEmployees, exportEmployees };