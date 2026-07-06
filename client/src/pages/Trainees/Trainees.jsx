import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../components/Common/Table.css';

const Trainees = () => {
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch and filter employees
  const fetchTrainees = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/employees');
      if (res.data.success) {
        // Filter out standard employees
        const filtered = res.data.data.filter(emp => emp.employeeType !== 'Employee');
        setTrainees(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch trainees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainees();
  }, []);

  // Utility to calculate remaining days
  const getDaysRemaining = (endDate) => {
    if (!endDate) return 'N/A';
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Convert Trainee to Full Employee
  const handleFinalize = async (id, name) => {
    if (!window.confirm(`Are you sure you want to finalize training for ${name} and convert them to a standard Employee?`)) return;
    
    try {
      await axios.put(`http://localhost:5000/api/employees/${id}`, {
        employeeType: 'Employee',
        trainingEndDate: null // Clear the date
      });
      // Remove them from this dashboard view
      setTrainees(trainees.filter(t => t._id !== id));
    } catch (error) {
      alert('Failed to finalize training.');
    }
  };

  // Extend Training by 30 Days
  const handleExtend = async (id, currentEndDate) => {
    const newDate = new Date(currentEndDate || new Date());
    newDate.setDate(newDate.getDate() + 30); // Add 30 days

    try {
      const res = await axios.put(`http://localhost:5000/api/employees/${id}`, {
        trainingEndDate: newDate
      });
      // Update the specific row in the table
      setTrainees(trainees.map(t => t._id === id ? res.data.data : t));
    } catch (error) {
      alert('Failed to extend training.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        🏠 Home / <strong>Trainee Manager</strong>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Active Apprentices & Interns</h2>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Department</th>
              <th>End Date</th>
              <th>Days Left</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Loading trainees...</td></tr>
            ) : trainees.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>No active trainees found.</td></tr>
            ) : (
              trainees.map((trainee) => {
                const daysLeft = getDaysRemaining(trainee.trainingEndDate);
                const isUrgent = daysLeft !== 'N/A' && daysLeft <= 15 && daysLeft >= 0;
                const isOverdue = daysLeft !== 'N/A' && daysLeft < 0;

                return (
                  <tr key={trainee._id}>
                    <td style={{ fontWeight: '600' }}>{trainee.empId}</td>
                    <td>
                      <Link to={`/profile/${trainee._id}`} style={{ color: 'var(--text-dark)', textDecoration: 'none', fontWeight: '500' }}>
                        {trainee.name}
                      </Link>
                    </td>
                    <td>
                      <span style={{ backgroundColor: trainee.employeeType === 'Intern' ? '#e0e7ff' : '#fce7f3', color: trainee.employeeType === 'Intern' ? '#3730a3' : '#9d174d', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: '500' }}>
                        {trainee.employeeType}
                      </span>
                    </td>
                    <td>{trainee.department}</td>
                    <td>{trainee.trainingEndDate ? new Date(trainee.trainingEndDate).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: isOverdue ? '#dc2626' : isUrgent ? '#d97706' : '#059669' 
                      }}>
                        {isOverdue ? 'Overdue' : `${daysLeft} days`}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleExtend(trainee._id, trainee.trainingEndDate)}
                          className="btn btn-outline" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          +30 Days
                        </button>
                        <button 
                          onClick={() => handleFinalize(trainee._id, trainee.name)}
                          className="btn btn-primary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#10b981' }}
                        >
                          Finalize
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Trainees;