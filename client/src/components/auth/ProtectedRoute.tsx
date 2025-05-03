import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // If auth is still loading, show nothing (or a loading spinner)
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If roles are specified and user doesn't have required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect vendor/admin/evaluator to their dashboard or list page
    const fallbackPath = user.role === 'vendor'
      ? '/available-tenders'
      : user.role === 'admin'
      ? '/tenders'
      : user.role === 'evaluator'
      ? '/my-evaluations'
      : '/';
    return <Navigate to={fallbackPath} replace />;
  }
  
  // Otherwise render children
  return <>{children}</>;
};
