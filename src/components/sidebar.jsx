import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  ShoppingCart, 
  Calendar, 
  User, 
  ClipboardList, 
  FileText, 
  Table, 
  FileIcon, 
  MessageCircle, 
  Headphones, 
  Mail,
  Clock,
  Package
} from 'lucide-react';

export const Sidebar = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: user?.role === 'admin' ? '/admin' : '/teacher'
    },
    {
      id: 'profile',
      label: 'User Profile',
      icon: User,
      path: '/perfil'
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: Calendar,
      path: '/schedule',
      hasSubmenu: true
    },
  ];

  const supportItems = [
  ];

  const bottomItems = [
  ];

  const MenuItem = ({ item, isActive }) => (
    <div
      onClick={() => navigate(item.path)}
      className={`
        flex items-center justify-between px-3 py-3 mx-3 my-1 rounded-lg cursor-pointer transition-all duration-200
        ${isActive 
          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      <div className="flex items-center">
        <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
        {!isCollapsed && (
          <span className="font-medium text-sm">{item.label}</span>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="flex items-center space-x-2">
          {item.badge && (
            <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">
              {item.badge}
            </span>
          )}
          {item.hasSubmenu && (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={`
      h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">TailAdmin</span>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Menu Content */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Main Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>

        {/* Support Section */}
        {!isCollapsed && (
          <div className="mt-8">
            <div className="px-6 py-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                SUPPORT
              </span>
            </div>
            <div className="space-y-1">
              {supportItems.map((item) => (
                <MenuItem
                  key={item.id}
                  item={item}
                  isActive={location.pathname === item.path}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Items */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
