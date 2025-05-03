
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedSubmissionAccessProps {
  tenderId: string;
}

export const RoleBasedSubmissionAccess: React.FC<RoleBasedSubmissionAccessProps> = ({ tenderId }) => {
  const { user } = useAuth();
  
  // Only show submissions access to admin and evaluator roles
  if (!user || user.role === 'vendor') {
    return null;
  }
  
  return (
    <Button 
      variant="secondary"
      asChild
    >
      <Link to={`/tenders/${tenderId}/submissions`}>
        <ClipboardList className="h-4 w-4 mr-2" />
        View Submissions
      </Link>
    </Button>
  );
};
