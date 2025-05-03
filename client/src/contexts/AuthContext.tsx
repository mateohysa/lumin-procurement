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
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL - Make sure this points to your backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Real login function that calls the backend API
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiClient.post('/login', { email, password });
      const data = response.data;
      
      if (data.success) {
        // Map the server response to our User interface
        const userData: User = {
          id: data.user.id,
          name: data.user.name || data.user.username || '',
          email: data.user.email,
          role: mapServerRoleToClientRole(data.user.role),
          avatar: data.user.avatar
        };
        
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
  
  // Helper function to map server roles to client roles
  const mapServerRoleToClientRole = (serverRole: string): UserRole => {
    switch (serverRole) {
      case 'ProcurementManager':
        return 'admin';
      case 'Vendor':
        return 'vendor';
      case 'Evaluator':
        return 'evaluator';
      default:
        return 'vendor'; // Default fallback
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
        isLoading
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
