
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

export function UserAvatar() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Determine background color based on user role
  const getAvatarClass = () => {
    switch (user.role) {
      case 'admin':
        return 'bg-primary text-primary-foreground';
      case 'vendor':
        return 'bg-green-100 text-green-700';
      case 'evaluator':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  return (
    <Avatar className="h-8 w-8">
      {user.avatar && <AvatarFallback className={getAvatarClass()}>{user.avatar}</AvatarFallback>}
    </Avatar>
  );
}
