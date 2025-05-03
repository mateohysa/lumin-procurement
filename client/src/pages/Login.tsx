
import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { isAuthenticated, user } = useAuth();
  
  // If already logged in, redirect to appropriate page
  if (isAuthenticated && user) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Smart Procurement</h1>
          <p className="text-slate-500 mt-2">Login to manage procurement activities</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
