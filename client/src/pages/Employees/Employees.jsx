import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../components/Common/Table.css';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    email: '',
    department: 'MECH',
    punchingCardNo: '',
    employeeType: 'Employee',
    trainingEndDate: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Validation: Require date for trainees
    if (formData.employeeType !== 'Employee' && !formData.trainingEndDate) {
      setMessage({ text: 'Training End Date is required for Apprentices and Interns.', type: 'error' });
      return;
    }

    try {
      const payload = { ...formData };
      // Clear date if they are a standard employee
      if (payload.employeeType === 'Employee') {
        payload.trainingEndDate = null;
      }

      const res = await axios.post('http://localhost:5000/api/employees', payload);
      
      if (res.data.success) {
        setMessage({ text: 'Employee registered successfully!', type: 'success' });
        setEmployees([res.data.data, ...employees]);
        setFormData({
          name: '', empId: '', email: '', department: 'MECH', punchingCardNo: '', employeeType: 'Employee', trainingEndDate: ''
        });
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.message || 'Failed to register employee.', 
        type: 'error' 
      });
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        🏠 Home / <strong>Register Employee</strong>
      </div>
      
      <div className="employee-layout">
        {/* Registration Form */}
        <div className="form-container">
          <h3>Add New Personnel</h3>
          
          {message.text && (
            <div className={`message-banner ${message.type === 'success' ? 'msg-success' : 'msg-error'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Employee ID</label>
              <input type="text" name="empId" value={formData.empId} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Card Number</label>
              <input type="text" name="punchingCardNo" value={formData.punchingCardNo} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleChange}>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="QC">QC</option>
                <option value="HR">HR</option>
                <option value="PROD">PROD</option>
                <option value="FIN">FIN</option>
                <option value="IS">IS</option>
              </select>
            </div>

            <div className="form-group">
              <label>Personnel Type</label>
              <select name="employeeType" value={formData.employeeType} onChange={handleChange}>
                <option value="Employee">Standard Employee</option>
                <option value="Apprentice">Apprentice</option>
                <option value="Intern">Intern</option>
              </select>
            </div>

            {/* Conditionally render the Training End Date field */}
            {formData.employeeType !== 'Employee' && (
              <div className="form-group fade-in">
                <label>Training End Date</label>
                <input 
                  type="date" 
                  name="trainingEndDate" 
                  value={formData.trainingEndDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Register
            </button>
          </form>
        </div>

        {/* Directory Table */}
        <div className="table-container" style={{ margin: 0 }}>
          <h3>Recent Registrations</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4">Loading data...</td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td style={{ fontWeight: '500' }}>{emp.empId}</td>
                    <td>{emp.name}</td>
                    <td>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '4px',
                        backgroundColor: emp.employeeType === 'Employee' ? '#d1fae5' : emp.employeeType === 'Intern' ? '#e0e7ff' : '#fce7f3',
                        color: emp.employeeType === 'Employee' ? '#065f46' : emp.employeeType === 'Intern' ? '#3730a3' : '#9d174d'
                      }}>
                        {emp.employeeType}
                      </span>
                    </td>
                    <td>{emp.department}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;