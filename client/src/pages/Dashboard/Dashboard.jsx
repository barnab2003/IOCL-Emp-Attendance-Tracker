import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import BigPieChart from '../../components/Charts/BigPieChart';
import DoubleBarGraph from '../../components/Charts/DoubleBarGraph';

const Dashboard = () => {
  const [view, setView] = useState('admin');
  const [timeframe, setTimeframe] = useState('day');
  const [stats, setStats] = useState({ overall: [], departmentWise: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/attendance/stats?timeframe=${timeframe}`);
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching stats", error);
      }
      setLoading(false);
    };

    fetchStats();
  }, [timeframe]);

  return (
    <div className="dashboard-container">
      <div className="breadcrumb" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>🏠 Home / <strong>Dashboard</strong></div>
        
        {/* Timeframe Filter */}
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
          style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
        >
          <option value="day">Past Day</option>
          <option value="month">Past Month</option>
          <option value="year">Past Year</option>
        </select>
      </div>

      <div className="view-toggle">
        <button className={`toggle-btn ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>Admin Dashboard</button>
        <button className={`toggle-btn ${view === 'employee' ? 'active' : ''}`} onClick={() => setView('employee')}>Employee Dashboard</button>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card card-teal">
          <div><h3>Total Employees</h3><p>700</p></div>
          <div className="card-icon-wrapper">👥</div>
        </div>
        <div className="summary-card card-purple">
          <div><h3>Departments</h3><p>20</p></div>
          <div className="card-icon-wrapper">🏢</div>
        </div>
        <div className="summary-card card-orange">
          <div><h3>On Leave</h3><p>{stats.overall.find(s => s._id === 'On Leave')?.count || 0}</p></div>
          <div className="card-icon-wrapper">🚪</div>
        </div>
        <div className="summary-card card-green">
          <div><h3>Present</h3><p>{stats.overall.find(s => s._id === 'Present')?.count || 0}</p></div>
          <div className="card-icon-wrapper">✅</div>
        </div>
      </div>

      {/* Analytical Charts */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>Loading visualizations...</div>
      ) : (
        <div className="charts-grid">
          <div className="chart-container">
            <div className="chart-header">Overall Attendance ({timeframe})</div>
            <div style={{ height: '300px', width: '100%' }}>
              <BigPieChart data={stats.overall} />
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">Department Wise Summary ({timeframe})</div>
            <div style={{ height: '300px', width: '100%' }}>
              <DoubleBarGraph data={stats.departmentWise} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;