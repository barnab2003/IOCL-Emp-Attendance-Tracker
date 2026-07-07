import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/employees/${id}`);
        if (res.data.success) {
          setProfileData(res.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div>Loading profile...</div>;
  if (!profileData) return <div>Profile not found.</div>;

  const { employee, attendance, leaves } = profileData;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <Link to="/employees" style={{ color: 'inherit', textDecoration: 'none' }}>Directory</Link> / <strong>Profile</strong>
      </div>

      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{employee.name}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <p><strong>Employee ID:</strong> {employee.empId}</p>
          <p><strong>Type:</strong> <span className="status-badge status-approved">{employee.employeeType}</span></p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Card No:</strong> {employee.punchingCardNo}</p>
          {employee.employeeType !== 'Employee' && (
            <p><strong>Training Ends:</strong> {employee.trainingEndDate ? new Date(employee.trainingEndDate).toLocaleDateString() : 'N/A'}</p>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Recent Attendance */}
        <div className="table-container" style={{ marginTop: 0 }}>
          <h3 style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Recent Attendance (30 Days)</h3>
          <table className="data-table">
            <tbody>
              {attendance.map(record => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td><span className={`status-badge status-${record.status.toLowerCase().replace(' ', '')}`}>{record.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leave History */}
        <div className="table-container" style={{ marginTop: 0 }}>
          <h3 style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>Leave History</h3>
          <table className="data-table">
            <tbody>
              {leaves.length === 0 ? <tr><td style={{ padding: '1rem' }}>No leaves requested.</td></tr> : leaves.map(leave => (
                <tr key={leave._id}>
                  <td>{leave.type}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td><span className={`status-badge status-${leave.status.toLowerCase()}`}>{leave.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;