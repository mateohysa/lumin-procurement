
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "evaluator" | "vendor" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "AADF Admin",
    email: "admin@aadf.org",
    role: "admin",
    organization: "Albanian-American Development Foundation"
  },
  {
    id: "2",
    name: "Procurement Evaluator",
    email: "evaluator@aadf.org",
    role: "evaluator",
    organization: "Albanian-American Development Foundation"
  },
  {
    id: "3",
    name: "Vendor Company",
    email: "vendor@example.com",
    role: "vendor",
    organization: "Example Vendor LLC"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for logged in user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulating API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (!foundUser) {
      setLoading(false);
      throw new Error("Invalid credentials");
    }
    
    // In a real app, we would verify password here
    
    // Save to state and localStorage
    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
