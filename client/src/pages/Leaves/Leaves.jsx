import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import '../../components/Common/Table.css';

const Leaves = () => {
  const { user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // State for Employee Leave Form
  const [formData, setFormData] = useState({
    type: 'Sick',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      // Determine endpoint based on role
      const endpoint = user.role === 'Admin' 
        ? 'http://localhost:5000/api/leaves' 
        : 'http://localhost:5000/api/leaves/my-leaves';
      
      const res = await axios.get(endpoint);
      if (res.data.success) setLeaves(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  // Handle Admin Approvals
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/${id}/status`, { status: newStatus });
      fetchLeaves();
    } catch (error) {
      alert('Failed to update leave status');
    }
  };

  // Handle Employee Leave Submission
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/leaves', formData);
      setMessage('Leave request submitted successfully!');
      setFormData({ type: 'Sick', startDate: '', endDate: '', reason: '' });
      fetchLeaves(); // Refresh their history
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to submit leave request.');
    }
  };

  // -------------------------------------------------------------
  // RENDER EMPLOYEE VIEW
  // -------------------------------------------------------------
  if (user?.role === 'Employee') {
    return (
      <div>
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>🏠 Home / <strong>My Leaves</strong></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Leave Application Form */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3>Apply for Leave</h3>
            {message && <div style={{ padding: '0.75rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '6px', marginBottom: '1rem' }}>{message}</div>}
            
            <form onSubmit={handleSubmitLeave}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Leave Type</label>
                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} required>
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Earned">Earned Leave</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Start Date</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>End Date</label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} style={{ width: '100%', padding: '0.5rem' }} required />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Reason</label>
                <textarea value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Request</button>
            </form>
          </div>

          {/* Employee's Leave History */}
          <div className="table-container" style={{ margin: 0 }}>
            <h3>My Leave History</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <tr><td colSpan="4">Loading...</td></tr> : leaves.length === 0 ? <tr><td colSpan="4">No leave history.</td></tr> : leaves.map(leave => (
                  <tr key={leave._id}>
                    <td>{leave.type}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span style={{ 
                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                        backgroundColor: leave.status === 'Approved' ? '#d1fae5' : leave.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                        color: leave.status === 'Approved' ? '#065f46' : leave.status === 'Rejected' ? '#991b1b' : '#92400e'
                      }}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER ADMIN VIEW
  // -------------------------------------------------------------
  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}><strong>Leave Manager</strong></div>
      <div className="table-container">
        <h3>Pending & Approved Leaves</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>Loading...</td></tr>
            ) : leaves.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No leave requests found.</td></tr>
            ) : (
              leaves.map(leave => (
                <tr key={leave._id}>
                  <td>{leave.employeeId?.name || 'Unknown'} <br/><span style={{ fontSize: '0.8rem', color: '#64748b' }}>{leave.employeeId?.department}</span></td>
                  <td>{leave.type}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td><strong>{leave.status}</strong></td>
                  <td>
                    {leave.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-primary" onClick={() => handleStatusUpdate(leave._id, 'Approved')} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#10b981' }}>Approve</button>
                        <button className="btn btn-primary" onClick={() => handleStatusUpdate(leave._id, 'Rejected')} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', backgroundColor: '#ef4444' }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaves;