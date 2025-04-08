import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';
import { useToast } from '@chakra-ui/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Function to fetch and update user profile data
  const refreshUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // No token, no refresh

    try {
      console.log("Refreshing user profile..."); // Added log
      const response = await axios.get(API_ENDPOINTS.auth.getProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUserData = response.data;

      // Update state and localStorage
      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      console.log("User profile refreshed:", updatedUserData); // Added log

    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      // Optional: Show a toast or handle error (e.g., if token expired)
      // If token is invalid, maybe log out?
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
         console.log("Token expired or invalid during refresh, logging out.");
         logout(); // Log out if token is bad
      }
    }
  }, [toast]); // Added toast dependency, logout implicitly included via scope

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.auth.register, {
        name,
        email,
        password
      });

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Refresh profile to get full data right after registration
      await refreshUserProfile();

      toast({
        title: 'Registration successful',
        description: 'Your account has been created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.details || error.response?.data?.error || 'Registration failed';
      toast({
        title: 'Registration failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(API_ENDPOINTS.auth.login, {
        email,
        password
      });

      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      // Refresh profile to get full data right after login
      await refreshUserProfile();

      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.name}!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.details || error.response?.data?.error || 'Login failed';
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, token: localStorage.getItem('token'), register, login, logout, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 