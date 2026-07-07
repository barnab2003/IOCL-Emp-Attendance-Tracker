import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (res.data.success) {
        login(res.data.data); // Save the user data and token
        navigate('/'); // Redirect to dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
      
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', overflow: 'hidden' }}>
        
        {/* Brand Header Section */}
        <div style={{ backgroundColor: '#00215F', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '5px solid #f97316' }}>
          <img 
            src="/indian-oil-corporation-business-petroleum-logo-national-oil-company-business-e69926a18c24eb29c2a0cd05ed3934e9.png" 
            alt="IOCL Logo" 
            style={{ width: '70px', height: '70px', objectFit: 'contain', marginBottom: '1rem' }} 
          />
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: '600', textAlign: 'center', lineHeight: '1.3', letterSpacing: '0.5px' }}>
            Human Resource<br/>Management System
          </h2>
        </div>

        {/* Form Section */}
        <div style={{ padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#475569', fontSize: '0.95rem' }}>
            Please sign in to your account
          </div>

          {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '500' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e293b', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#00215F'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e293b', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#00215F'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading} 
              style={{ 
                width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: '600', 
                backgroundColor: '#00215F', color: 'white', border: 'none', borderRadius: '6px', 
                cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' 
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#001a4d'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#00215F'}
            >
              {isLoading ? 'Authenticating...' : 'Login'}
            </button>
          </form>

          {/* Helper Section for Testing */}
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#64748b', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.5rem' }}>System Access</strong>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>Admin:</span>
              <span style={{ color: '#00215F', fontWeight: '500' }}>----@iocl.com</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Employee:</span>
              <span style={{ color: '#00215F', fontWeight: '500' }}>[employee]@iocl.com</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;