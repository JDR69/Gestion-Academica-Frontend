import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  Calendar, 
  User, 
  ClipboardList,  
  Table, 
  Clock,
  Package,
  CheckCircle
} from 'lucide-react';

export const Sidebar = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dashboardItem = {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    path: user?.role === 'admin' ? '/admin' : '/teacherDashboard'
  };

  const adminMenu = [
    dashboardItem,
    { id: 'profile', label: 'User Profile', icon: User, path: '/perfil' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, path: '/schedule', hasSubmenu: true },
    { id: 'docentes', label: 'Docentes', icon: User, path: '/docentes' },
    { id: 'materias', label: 'Materias', icon: ClipboardList, path: '/materias' },
    { id: 'horarios', label: 'Horarios', icon: Clock, path: '/horarios' },
    { id: 'grupos', label: 'Grupos', icon: Table, path: '/grupos' },
    { id: 'aulas', label: 'Aulas', icon: Package, path: '/aulas' },
    // También disponibles para admin
  // Solo mostrar TeacherDashboard si no es admin
  ...((!user?.role || user?.role !== 'admin') ? [{ id: 'teacherDashboard', label: 'Teacher Dashboard', icon: BarChart3, path: '/teacherDashboard' }] : []),
    { id: 'asistencia', label: 'Asistencia', icon: CheckCircle, path: '/asistencia' },
  ];

  // Para docentes/usuarios normales (no admin), solo Teacher Dashboard y Asistencia
  const teacherMenu = [
  // Solo mostrar Dashboard si no es admin
  ...((!user?.role || user?.role !== 'admin') ? [{ id: 'teacherDashboard', label: 'Dashboard', icon: BarChart3, path: '/teacherDashboard' }] : []),
    // { id: 'asistencia', label: 'Asistencia', icon: CheckCircle, path: '/asistencia' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenu : teacherMenu;
  // Para docentes, quitamos la ruta de Asistencia
  const menuItemsFiltered = user?.role === 'admin'
    ? adminMenu
    : teacherMenu.filter(item => item.id !== 'asistencia');

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
            <span className="font-bold text-lg text-gray-900">FICCT</span>
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
          {menuItemsFiltered.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
      </div>

      {/* User Info */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed && user && (
          <div className="flex flex-col items-center text-center">
            <span className="font-semibold text-sm text-gray-800">{user.name}</span>
            <span className="text-xs text-gray-500">{user.role}</span>
          </div>
        )}
      </div>
    </div>
  );
};
