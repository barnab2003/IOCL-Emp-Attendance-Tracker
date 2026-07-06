import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Employees from './pages/Employees/Employees';
import EmployeeProfile from './pages/Employees/EmployeeProfile';
import Leaves from './pages/Leaves/Leaves';
// New Components (We will build these next)
import DataUpload from './pages/DataUpload/DataUpload';
import AttendanceLogs from './pages/AttendanceLogs/AttendanceLogs';
import Trainees from './pages/Trainees/Trainees';
import './App.css';

// --- Header Component with Export Feature ---
const TopHeader = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/data/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'IOCL_Employees.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("Failed to export data.");
    }
  };

  return (
    <header className="top-header">
      <input type="text" className="search-bar" placeholder="Search Keyword..." />
      <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={handleExport} className="btn btn-primary" style={{ backgroundColor: '#10b981', color: 'white' }}>
          ⬇️ Export to Excel
        </button>
        <span>👤 {admin?.username || 'Admin'}</span>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
          Logout
        </button>
      </div>
    </header>
  );
};

// --- Updated Sidebar Component ---
const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-logo">IOCL Tracker</div>
    <nav>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '1rem' }}>MAIN MENU</div>
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
      <NavLink to="/attendance" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Attendance Logs</NavLink>
      <NavLink to="/upload" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Data Upload</NavLink>
      
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '1.5rem 0 0.5rem', paddingLeft: '1rem' }}>PEOPLES & TEAMS</div>
      <NavLink to="/leaves" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Leave Manager</NavLink>
      <NavLink to="/trainees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Trainee Manager</NavLink>
      <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Register Employee</NavLink>
    </nav>
  </aside>
);

// --- Layout Wrapper ---
const AuthenticatedLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <main className="main-content">
      <TopHeader />
      <div className="page-content">{children}</div>
    </main>
  </div>
);

// --- Main App Root ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><AuthenticatedLayout><Dashboard /></AuthenticatedLayout></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><AuthenticatedLayout><Employees /></AuthenticatedLayout></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><AuthenticatedLayout><EmployeeProfile /></AuthenticatedLayout></ProtectedRoute>} />
          <Route path="/leaves" element={<ProtectedRoute><AuthenticatedLayout><Leaves /></AuthenticatedLayout></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><AuthenticatedLayout><DataUpload /></AuthenticatedLayout></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><AuthenticatedLayout><AttendanceLogs /></AuthenticatedLayout></ProtectedRoute>} />
          <Route path="/trainees" element={<ProtectedRoute><AuthenticatedLayout><Trainees /></AuthenticatedLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;