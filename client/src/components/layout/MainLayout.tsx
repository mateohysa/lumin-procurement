
import React from 'react';
import { RoleBasedNavigation } from '@/components/layout/RoleBasedNavigation';
import { Header } from '@/components/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <RoleBasedNavigation />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
          <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t">
            Smart Procurement Platform v1.0 &copy; {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
