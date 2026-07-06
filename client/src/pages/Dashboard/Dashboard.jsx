import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';

// Colors for the Pie Chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    totalTrainees: 0,
    onLeaveToday: 0,
    deptDistribution: [],
    attendanceTrend: []
  });
  const [loading, setLoading] = useState(true);
  // 1. Add a state for the time range
  const [timeRange, setTimeRange] = useState('7days');
  useEffect(() => {
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/dashboard/stats?range=${timeRange}`);
      if (res.data.success) setStats(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchStats();
}, [timeRange]);
  return (
    <div>
      <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        🏠 Home / <strong>Dashboard</strong>
      </div>
      <h2>System Overview</h2>

      {loading ? (
        <p>Loading statistics and charts...</p>
      ) : (
        <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>Analytics Overview</h3>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="today">Today</option>
            <option value="7days">Past 7 Days</option>
            <option value="30days">Past 30 Days</option>
            <option value="year">Past Year</option>
          </select>
        </div>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontWeight: '500' }}>Total Personnel</h4>
              <h2 style={{ margin: 0, fontSize: '2.5rem', color: '#1e293b' }}>{stats.totalEmployees}</h2>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
              <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontWeight: '500' }}>Present Today</h4>
              <h2 style={{ margin: 0, fontSize: '2.5rem', color: '#1e293b' }}>{stats.presentToday}</h2>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
              <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontWeight: '500' }}>Active Trainees</h4>
              <h2 style={{ margin: 0, fontSize: '2.5rem', color: '#1e293b' }}>{stats.totalTrainees}</h2>
            </div>
            <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #ef4444' }}>
              <h4 style={{ color: 'var(--text-muted)', margin: '0 0 0.5rem 0', fontWeight: '500' }}>On Leave Today</h4>
              <h2 style={{ margin: 0, fontSize: '2.5rem', color: '#1e293b' }}>{stats.onLeaveToday}</h2>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
            
            {/* 7-Day Attendance Trend Bar Chart */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Attendance Trend (Last 7 Days)</h3>
              <div style={{ width: '100%', height: 300 }}>
                {stats.attendanceTrend.length > 0 ? (
                  <ResponsiveContainer>
                    <BarChart data={stats.attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      
                      {/* The Two Bars */}
                      <Bar dataKey="present" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Present" />
                      <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent / On Leave" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    No attendance data for the past 7 days.
                  </div>
                )}
              </div>
            </div>

            {/* Department Distribution Pie Chart */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>Workforce by Department</h3>
              <div style={{ width: '100%', height: 300 }}>
                {stats.deptDistribution.length > 0 ? (
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={stats.deptDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.deptDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    No department data available.
                  </div>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;