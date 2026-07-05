import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists on initial load
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    const token = localStorage.getItem('token');
    
    if (storedAdmin && token) {
      setAdmin(JSON.parse(storedAdmin));
      // Set default axios header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, admin } = response.data;
        
        // Store in local storage
        localStorage.setItem('token', token);
        localStorage.setItem('admin', JSON.stringify(admin));
        
        // Set state and default headers
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

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};