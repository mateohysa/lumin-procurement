
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, FilePlus, Send, Users, Award, FileCheck, Settings, HelpCircle, LogOut } from 'lucide-react';

export function AppSidebar() {
  const location = useLocation();

  const mainMenuItems = [
    { title: 'Dashboard', icon: Home, path: '/' },
    { title: 'Create Tender', icon: FilePlus, path: '/create-tender' },
    { title: 'Submissions', icon: Send, path: '/submissions' },
    { title: 'Vendors', icon: Users, path: '/vendors' },
    { title: 'Evaluations', icon: Award, path: '/evaluations' },
    { title: 'Reports', icon: FileCheck, path: '/reports' },
  ];

  const utilityMenuItems = [
    { title: 'Settings', icon: Settings, path: '/settings' },
    { title: 'Help', icon: HelpCircle, path: '/help' },
  ];

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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel>Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenuButton asChild>
          <button className="w-full flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-accent-foreground">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
