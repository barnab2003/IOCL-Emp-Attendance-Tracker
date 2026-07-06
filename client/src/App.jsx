import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Employees from './pages/Employees/Employees';
import Leaves from './pages/Leaves/Leaves';
import './App.css';

// --- Header Component ---
const TopHeader = () => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="top-header">
      <input type="text" className="search-bar" placeholder="Search Keyword..." />
      <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span>👤 {admin?.username || 'Admin'}</span>
        <button 
          onClick={handleLogout} 
          className="btn btn-outline" 
          style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

// --- Sidebar Component ---
const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-logo">IOCL Tracker</div>
    <nav>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
        MAIN MENU
      </div>
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Dashboard
      </NavLink>
      
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '1.5rem 0 0.5rem', paddingLeft: '1rem' }}>
        PEOPLES & TEAMS
      </div>
      <NavLink to="/employees" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Employees
      </NavLink>
      <NavLink to="/leaves" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Leaves
      </NavLink>
    </nav>
  </aside>
);

// --- Layout Wrapper ---
const AuthenticatedLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />
    <main className="main-content">
      <TopHeader />
      <div className="page-content">
        {children}
      </div>
    </main>
  </div>
);

// --- Main App Root ---
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/employees" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Employees />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/leaves" element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <Leaves />
              </AuthenticatedLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;