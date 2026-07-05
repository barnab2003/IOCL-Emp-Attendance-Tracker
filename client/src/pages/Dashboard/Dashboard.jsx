import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [view, setView] = useState('admin');

  return (
    <div className="dashboard-container">
      <div className="breadcrumb">
        🏠 Home / <strong>Dashboard</strong>
      </div>

      {/* Admin / Employee Toggle */}
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${view === 'admin' ? 'active' : ''}`}
          onClick={() => setView('admin')}
        >
          Admin Dashboard
        </button>
        <button 
          className={`toggle-btn ${view === 'employee' ? 'active' : ''}`}
          onClick={() => setView('employee')}
        >
          Employee Dashboard
        </button>
      </div>

      {/* Multi-colored Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card card-teal">
          <div>
            <h3>Employees</h3>
            <p>700</p>
          </div>
          <div className="card-icon-wrapper">👥</div>
        </div>
        
        <div className="summary-card card-purple">
          <div>
            <h3>Departments</h3>
            <p>20</p>
          </div>
          <div className="card-icon-wrapper">🏢</div>
        </div>

        <div className="summary-card card-orange">
          <div>
            <h3>Leaves</h3>
            <p>9</p>
          </div>
          <div className="card-icon-wrapper">🚪</div>
        </div>

        <div className="summary-card card-green">
          <div>
            <h3>Present Today</h3>
            <p>650</p>
          </div>
          <div className="card-icon-wrapper">✅</div>
        </div>
      </div>

      {/* Chart Containers (To be populated next) */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">Overall Attendance</div>
          {/* Big Pie Chart will go here */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px', color: '#9ca3af' }}>
            Pie Chart Area
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">Department Wise Attendance</div>
          {/* Double Bar Graph will go here */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px', color: '#9ca3af' }}>
            Bar Graph Area
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;