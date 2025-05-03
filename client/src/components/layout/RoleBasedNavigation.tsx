
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';
import { 
  Home, 
  FilePlus, 
  Send, 
  Users, 
  Award, 
  FileCheck, 
  LogOut, 
  Briefcase, 
  ClipboardCheck,
  ListOrdered,
  UserCheck,
  Flag
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';

// Menu items by role
const menuItemsByRole: Record<UserRole, Array<{title: string; icon: React.FC<any>; path: string; subItems?: Array<{title: string; path: string}>}>> = {
  admin: [
    { title: 'Dashboard', icon: Home, path: '/' },
    { 
      title: 'Tenders', 
      icon: Briefcase, 
      path: '/tenders',
      subItems: [
        { title: 'All Tenders', path: '/tenders' },
        { title: 'Create Tender', path: '/create-tender' },
      ]
    },
    { title: 'Vendors', icon: Users, path: '/vendors' },
    { title: 'Evaluators', icon: UserCheck, path: '/evaluators' },
    { title: 'Disputes', icon: Flag, path: '/disputes' },
    { title: 'Reports', icon: FileCheck, path: '/reports' },
  ],
  vendor: [
    { title: 'Dashboard', icon: Home, path: '/' },
    { title: 'Available Tenders', icon: Briefcase, path: '/available-tenders' },
    { title: 'My Submissions', icon: Send, path: '/my-submissions' },
    { title: 'My Disputes', icon: Flag, path: '/disputes' },
  ],
  evaluator: [
    { title: 'Dashboard', icon: Home, path: '/' },
    { title: 'My Evaluations', icon: ClipboardCheck, path: '/my-evaluations' },
    { title: 'Completed Evaluations', icon: FileCheck, path: '/completed-evaluations' },
  ]
};

export function RoleBasedNavigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // If no user, don't render navigation
  if (!user) return null;
  
  // Get menu items based on user role
  const mainMenuItems = menuItemsByRole[user.role] || [];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSubPathActive = (path: string, subPath: string) => {
    return location.pathname === subPath;
  };

  const isPathActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            SP
          </div>
          <div className="font-semibold text-sidebar-foreground">Smart Procurement</div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {!item.subItems ? (
                    <SidebarMenuButton
                      asChild
                      isActive={isPathActive(item.path)}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <>
                      <SidebarMenuButton
                        asChild
                        isActive={isPathActive(item.path)}
                      >
                        <Link to={item.path}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      {isPathActive(item.path) && (
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isSubPathActive(item.path, subItem.path)}
                              >
                                <Link to={subItem.path}>
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {user.avatar || user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenuButton onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
