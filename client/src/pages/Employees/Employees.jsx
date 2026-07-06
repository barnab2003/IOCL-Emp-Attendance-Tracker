import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../components/Common/Table.css';
import '../../components/UI/Modal.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    empId: '',
    name: '',
    email: '',
    punchingCardNo: '',
    department: 'MECH'
  });

  const departments = ['MECH', 'CIVIL', 'QC', 'TS', 'INSP', 'MSC', 'ES', 'F&S', 'HSC', 'PSM', 'FIN', 'MEO', 'HR', 'IS', 'VIG', 'MKT', 'PROD', 'PSU', 'EM', 'INST'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/employees');
      if (res.data.success) {
        setEmployees(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch employees.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/employees', formData);
      if (res.data.success) {
        setEmployees([res.data.data, ...employees]); // Add new employee to the top of the list
        setIsModalOpen(false); // Close modal
        setFormData({ empId: '', name: '', email: '', punchingCardNo: '', department: 'MECH' }); // Reset form
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add employee. Check for duplicate IDs or Emails.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          🏠 Home / <strong>Employee Directory</strong>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Add New Employee
        </button>
      </div>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Punching Card No.</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>Loading employees...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No employees found.</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td style={{ fontWeight: '600' }}>{emp.empId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>
                    <span style={{ backgroundColor: 'var(--bg-light)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '500' }}>
                      {emp.department}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{emp.punchingCardNo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button className="btn-close" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" required />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Employee ID</label>
                  <input type="text" name="empId" value={formData.empId} onChange={handleInputChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Department</label>
                  <select name="department" value={formData.department} onChange={handleInputChange} className="form-input" required>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Card Number</label>
                  <input type="text" name="punchingCardNo" value={formData.punchingCardNo} onChange={handleInputChange} className="form-input" required />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Employee</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;