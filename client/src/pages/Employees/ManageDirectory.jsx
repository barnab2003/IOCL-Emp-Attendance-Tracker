import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../components/Common/Table.css';

const ManageDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (query = '') => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/employees?search=${query}`);
      if (res.data.success) setEmployees(res.data.data);
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search to avoid spamming the API on every keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees(searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${name}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(employees.filter(emp => emp._id !== id));
    } catch (error) {
      alert("Failed to delete employee.");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        🏠 Home / <strong>Manage Directory</strong>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Manage Personnel</h2>
        <input 
          type="text" 
          placeholder="Search by Name, ID, or Dept..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.5rem 1rem', width: '300px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{textAlign:'center'}}>Loading...</td></tr> : 
             employees.length === 0 ? <tr><td colSpan="5" style={{textAlign:'center'}}>No personnel found.</td></tr> :
             employees.map(emp => (
              <tr key={emp._id}>
                <td style={{ fontWeight: '500' }}>{emp.empId}</td>
                <td><Link to={`/profile/${emp._id}`} style={{ color: '#1e293b', textDecoration: 'none' }}>{emp.name}</Link></td>
                <td>{emp.department}</td>
                <td>{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* Reusing the profile route for viewing/editing details */}
                    <Link to={`/profile/${emp._id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(emp._id, emp.name)} 
                      className="btn" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#ef4444', color: 'white' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDirectory;