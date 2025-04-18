import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ token, ...decoded });
      } catch (error) {
        console.error('Invalid token');
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/users/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser({ token, ...decoded });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };