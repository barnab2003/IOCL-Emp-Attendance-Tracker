import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../components/Common/Table.css';

const AttendanceLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/attendance');
        if (res.data.success) {
          setLogs(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <strong>Attendance Logs</strong>
      </div>
      <h2 style={{ marginBottom: '1rem' }}>Daily Attendance Log</h2>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="6">Loading logs...</td></tr> : 
              logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.date).toLocaleDateString()}</td>
                <td>
                  {log.employeeId ? (
                    <Link to={`/profile/${log.employeeId._id}`} style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>
                      {log.employeeId.name} ({log.employeeId.empId})
                    </Link>
                  ) : 'Unknown'}
                </td>
                <td>{log.employeeId?.department}</td>
                <td>
                  <span className={`status-badge status-${log.status.toLowerCase().replace(' ', '')}`}>
                    {log.status}
                  </span>
                </td>
                {/* Updated Columns for new schema */}
                <td>{log.sessions?.length || 0} Punches</td>
                <td>
                  <span style={{ fontWeight: '500' }}>
                    {Math.floor((log.totalMinutes || 0) / 60)}h {(log.totalMinutes || 0) % 60}m
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceLogs;