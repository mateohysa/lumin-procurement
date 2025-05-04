import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Briefcase, Users, UserCheck, Flag, FileCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';

// Menu items for each role
const MENU_CONFIG: Record<UserRole, Array<{ title: string; icon: React.FC<any>; path: string }>> = {
  admin: [
    { title: 'Dashboard', icon: Home, path: '/' },
    { title: 'Tenders', icon: Briefcase, path: '/tenders' },
    { title: 'Vendors', icon: Users, path: '/vendors' },
    { title: 'Evaluators', icon: UserCheck, path: '/evaluators' },
    { title: 'Disputes', icon: Flag, path: '/disputes' },
    { title: 'Reports', icon: FileCheck, path: '/reports' },
  ],
  vendor: [
    { title: 'Dashboard', icon: Home, path: '/' },
    { title: 'Available', icon: Briefcase, path: '/available-tenders' },
    { title: 'Submissions', icon: Users, path: '/my-submissions' },
    { title: 'Disputes', icon: Flag, path: '/disputes' },
  ],
  evaluator: [
    { title: 'Dashboard', icon: Home, path: '/' },
    { title: 'Evaluations', icon: UserCheck, path: '/my-evaluations' },
    { title: 'Completed', icon: FileCheck, path: '/completed-evaluations' },
  ],
};

export function RoleBasedNavigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const menuItems = MENU_CONFIG[user.role] || [];
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sticky top-0 w-64 h-screen bg-gray-950 text-white flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center h-16 px-6 bg-gray-900">
      <img src="/logo.png" alt="logo" className="w-30 h-20" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 overflow-y-auto">
        <p className="text-xs font-semibold uppercase text-indigo-300 mb-4">Main Menu</p>
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-2 mb-2 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-inner'
                      : 'text-gray-300 hover:bg-indigo-600 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-900">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-4 py-2 rounded-full text-sm font-medium text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
