import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '@/lib/api-client';

// Define user roles
export type UserRole = 'admin' | 'vendor' | 'evaluator';

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL - Make sure this points to your backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Function to map server roles to client roles
  const mapServerRoleToClientRole = (serverRole: string): UserRole => {
    // Convert to lowercase for case-insensitive comparison
    const role = serverRole.toLowerCase();
    
    if (role.includes('manager') || role.includes('admin') || role === 'procurementmanager') {
      return 'admin';
    } else if (role.includes('vendor')) {
      return 'vendor';
    } else if (role.includes('evaluator')) {
      return 'evaluator';
    } else {
      console.warn(`Unknown role: ${serverRole}, defaulting to vendor`);
      return 'vendor'; // Default fallback
    }
  };

  // Function to validate token and fetch current user data
  const validateSession = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      // Make a request to validate token and get fresh user data
      const response = await apiClient.get('/profile');
      const data = response.data;

      if (data.success && data.user) {
        const userData: User = {
          id: data.user.id || data.user._id,
          name: data.user.name || data.user.username || '',
          email: data.user.email,
          role: mapServerRoleToClientRole(data.user.role),
          avatar: data.user.avatar
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        // Clean up invalid session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      // Clean up invalid session
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  };

  // Function to refresh user data from the server
  const refreshUserData = async (): Promise<void> => {
    try {
      const success = await validateSession();
      if (!success) {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Check for stored user on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        // First try to validate the token and get fresh user data
        const isValid = await validateSession();
        
        // If validation fails, check if we have stored user data
        if (!isValid) {
          const storedUser = localStorage.getItem('user');
          const token = localStorage.getItem('token');
          
          if (storedUser && token) {
            // We have stored data, but token is invalid
            // Clear everything
            localStorage.removeItem('user');
            localStorage.removeItem('token');
          }
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function that calls the backend API
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiClient.post('/login', { email, password });
      const data = response.data;
      
      if (data.success) {
        console.log('Server response user data:', data.user); // Debug log
        
        // Map the server response to our User interface
        const userData: User = {
          id: data.user.id || data.user._id,
          name: data.user.name || '', // Ensure name is captured from response
          email: data.user.email,
          role: mapServerRoleToClientRole(data.user.role),
          avatar: data.user.avatar // Ensure avatar is captured
        };
        
        console.log('Mapped user data:', userData); // Debug log
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Store token in localStorage (apiClient will use it automatically for future requests)
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        setIsLoading(false);
        return true;
      } else {
        console.error('Login failed:', data.message);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Optional: Call logout endpoint if you have one
      // await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user state and local storage regardless of API call result
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
