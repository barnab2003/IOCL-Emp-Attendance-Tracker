import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../components/Common/Table.css';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch leaves on component mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/leaves');
      if (res.data.success) {
        setLeaves(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch leave requests.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Approve/Reject Actions
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/leaves/${id}`, { status: newStatus });
      if (res.data.success) {
        // Update the local state to reflect the change immediately
        setLeaves(leaves.map(leave => 
          leave._id === id ? { ...leave, status: newStatus } : leave
        ));
      }
    } catch (err) {
      alert('Failed to update leave status.');
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        🏠 Home / <strong>Leaves Management</strong>
      </div>
      
      <h2 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Leave Requests</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee Info</th>
              <th>Leave Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading leaves...</td></tr>
            ) : leaves.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No leave requests found.</td></tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{leave.employeeId?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {leave.employeeId?.department} | ID: {leave.employeeId?.empId}
                    </div>
                  </td>
                  <td>{leave.type}</td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>
                      {new Date(leave.startDate).toLocaleDateString()} - 
                      {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {leave.reason}
                  </td>
                  <td>
                    <span className={`status-badge status-${leave.status.toLowerCase()}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>
                    {leave.status === 'Pending' ? (
                      <div className="action-buttons">
                        <button 
                          className="btn btn-sm btn-approve"
                          onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-sm btn-reject"
                          onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processed</span>
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