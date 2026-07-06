import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAdmin = localStorage.getItem('admin');
      const token = localStorage.getItem('token');
      
      // Prevent JSON.parse from crashing if storedAdmin is literally the string "undefined"
      if (storedAdmin && token && storedAdmin !== 'undefined') {
        setAdmin(JSON.parse(storedAdmin));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        // Clear any corrupted data
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error reading auth state:', error);
      localStorage.removeItem('admin');
      localStorage.removeItem('token');
    } finally {
      // This MUST run, otherwise the screen stays blank forever
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, admin } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(admin));
        
        setAdmin(admin);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // If loading is true, it renders nothing (blank screen). We must ensure loading becomes false.
  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};