import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import './App.css';

const Employees = () => <div><h1>Employees</h1></div>;
const Leaves = () => <div><h1>Leaves</h1></div>;

// Update TopHeader to include Logout
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
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>Logout</button>
      </div>
    </header>
  );
};

// ... Sidebar component remains exactly the same as before ...
const Sidebar = () => (
    <aside className="sidebar">
      {/* ... previous Sidebar code ... */}
    </aside>
);

// App Layout for Authenticated users
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes wrapped in Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <AuthenticatedLayout><Dashboard /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/employees" element={
            <ProtectedRoute>
              <AuthenticatedLayout><Employees /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          <Route path="/leaves" element={
            <ProtectedRoute>
              <AuthenticatedLayout><Leaves /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;