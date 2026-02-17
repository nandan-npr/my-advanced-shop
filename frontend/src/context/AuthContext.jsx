import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login Function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data)); // Save to local storage
      alert("Login Successful!");
      return true;
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  // Register Function
  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      alert("Registration Successful!");
      return true;
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
      return false;
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = "/login"; // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};