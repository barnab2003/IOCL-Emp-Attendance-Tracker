import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Employees from './pages/Employees/Employees';
import EmployeeProfile from './pages/Employees/EmployeeProfile';
import ManageDirectory from './pages/Employees/ManageDirectory';
import Leaves from './pages/Leaves/Leaves';
// New Components (We will build these next)
import DataUpload from './pages/DataUpload/DataUpload';
import AttendanceLogs from './pages/AttendanceLogs/AttendanceLogs';
import Trainees from './pages/Trainees/Trainees';
import './App.css';

// --- Header Component with Export Feature ---
const TopHeader = () => {
  const { user, logout } = useContext(AuthContext);
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
      {/* Spacer to push actions to the right since search is removed */}
      <div style={{ flex: 1 }}></div> 
      
      <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={handleExport} className="btn btn-primary" style={{ backgroundColor: '#10b981', color: 'white', border: 'none' }}>
          Export to Excel
        </button>
        <span style={{ color: 'white', fontWeight: '500' }}>👤 {user?.name || 'User'}</span>
        <button onClick={handleLogout} className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', backgroundColor: 'transparent', color: 'white', border: '1px solid white' }}>
          Logout
        </button>
      </div>
    </header>
  );
};
// --- Updated Sidebar Component ---
// --- Updated Sidebar Component ---
const Sidebar = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <aside className="sidebar">
      {/* Updated Brand Area with Logo */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        height: '70px', /* Forces exact alignment with the Top Header */
        padding: '0 1rem', 
        borderBottom: '1px solid rgba(255,255,255,0.1)', 
        boxSizing: 'border-box'
      }}>
        <img 
          src="/indian-oil-corporation-business-petroleum-logo-national-oil-company-business-e69926a18c24eb29c2a0cd05ed3934e9.png" 
          alt="IOCL Logo" 
          style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
        />
        <div style={{ 
          color: 'white', 
          fontSize: '0.85rem', /* Reduced size to accommodate long text */
          fontWeight: '700', 
          lineHeight: '1.2', /* Tighter spacing between wrapped lines */
          letterSpacing: '0.5px' 
        }}>
          Human Resource<br/>Management System
        </div>
      </div>

      <nav>
        <div className="sidebar-heading"></div>
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
        
        <NavLink to="/leaves" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          {user?.role === 'Admin' ? 'Leave Manager' : 'My Leaves'}
        </NavLink>

        {user?.role === 'Admin' && (
          <>
            <NavLink to="/attendance" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Attendance Logs</NavLink>
            <NavLink to="/upload" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Data Upload</NavLink>
            
            <div className="sidebar-heading" style={{ marginTop: '1.5rem' }}>PEOPLES & TEAMS</div>
            <NavLink to="/manage-directory" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Manage Directory</NavLink>
            <NavLink to="/trainees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Trainee Manager</NavLink>
            <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Register Employee</NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};
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
          <Route path="/manage-directory" element={<ProtectedRoute><AuthenticatedLayout><ManageDirectory /></AuthenticatedLayout></ProtectedRoute>} />
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