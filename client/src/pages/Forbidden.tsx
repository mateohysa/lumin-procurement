
import React from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Forbidden = () => {
  const { user } = useAuth();
  
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="rounded-full bg-red-100 p-6 mb-6">
          <ShieldAlert className="h-16 w-16 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          You don't have permission to access this page.
        </p>
        
        {user && (
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <p className="font-medium">You're logged in as: {user.name}</p>
            <p className="text-muted-foreground">Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
          </div>
        )}
        
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/">Go to Dashboard</Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/login">Switch Account</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Forbidden;
