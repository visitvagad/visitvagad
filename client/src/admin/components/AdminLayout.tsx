import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Hotel, 
  Calendar, 
  Utensils, 
  Route, 
  Image as ImageIcon, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Users as UsersIcon,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAppAuth } from '../../context/AuthContext';
import { PERMISSIONS } from '../utils/permissions';
import type { Role } from '../utils/permissions';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', permission: null },
  { name: 'Destinations', icon: MapPin, path: '/admin/destinations', permission: 'CAN_CREATE' },
  { name: 'Hotels', icon: Hotel, path: '/admin/hotels', permission: 'CAN_CREATE' },
  { name: 'Events', icon: Calendar, path: '/admin/events', permission: 'CAN_CREATE' },
  { name: 'Food', icon: Utensils, path: '/admin/food', permission: 'CAN_CREATE' },
  { name: 'Itineraries', icon: Route, path: '/admin/itineraries', permission: 'CAN_CREATE' },
  { name: 'Media Library', icon: ImageIcon, path: '/admin/media', permission: 'CAN_UPLOAD' },
  { name: 'Users', icon: UsersIcon, path: '/admin/users', permission: 'CAN_MANAGE_USERS' },
  { name: 'Settings', icon: SettingsIcon, path: '/admin/settings', permission: 'CAN_EDIT_SETTINGS' },
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout, role } = useAppAuth();
  const navigate = useNavigate();

  const filteredItems = sidebarItems.filter(item => {
    if (!item.permission) return true;
    return (PERMISSIONS as any)[item.permission](role as Role);
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">Visit Vagad Admin</h1>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {filteredItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.name}</span>
                {/* Active Indicator */}
                <div className="ml-auto opacity-0 group-[.active]:opacity-100">
                  <ChevronRight size={16} />
                </div>
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Admin Control Panel</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Administrator</p>
              <p className="text-xs text-gray-500 italic">Vagad Tourism Authority</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
