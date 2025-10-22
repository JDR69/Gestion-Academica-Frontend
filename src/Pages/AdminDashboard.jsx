
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { 
  Users, 
  UserPlus, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Clock,
  GraduationCap,
  FileText,
  Bell
} from 'lucide-react';

export const AdminDashboard = ({ user, setUser }) => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Docentes',
      value: '24',
      change: '+2',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Estudiantes Activos',
      value: '1,284',
      change: '+48',
      changeType: 'positive',
      icon: GraduationCap,
      color: 'green'
    },
    {
      title: 'Cursos Activos',
      value: '18',
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
      color: 'purple'
    },
    {
      title: 'Calificaciones Pendientes',
      value: '156',
      change: '-12',
      changeType: 'negative',
      icon: FileText,
      color: 'orange'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'registro',
      message: 'Nuevo docente registrado: María González',
      time: '2 minutos atrás',
      icon: UserPlus,
      color: 'green'
    },
    {
      id: 2,
      type: 'curso',
      message: 'Curso de Matemáticas Avanzadas actualizado',
      time: '15 minutos atrás',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 3,
      type: 'calificacion',
      message: 'Calificaciones subidas para el curso de Historia',
      time: '1 hora atrás',
      icon: FileText,
      color: 'purple'
    },
    {
      id: 4,
      type: 'sistema',
      message: 'Sistema actualizado a la versión 2.1',
      time: '2 horas atrás',
      icon: Bell,
      color: 'gray'
    }
  ];

  const quickActions = [
    {
      title: 'Registrar Docente',
      description: 'Agregar un nuevo docente al sistema',
      icon: UserPlus,
      color: 'blue',
      action: () => navigate('/register')
    },
    {
      title: 'Ver Reportes',
      description: 'Generar reportes académicos',
      icon: BarChart3,
      color: 'green',
      action: () => console.log('Ver reportes')
    },
    {
      title: 'Gestionar Cursos',
      description: 'Administrar cursos y materias',
      icon: BookOpen,
      color: 'purple',
      action: () => console.log('Gestionar cursos')
    },
    {
      title: 'Calendario Académico',
      description: 'Ver y editar el calendario',
      icon: Calendar,
      color: 'orange',
      action: () => console.log('Calendario')
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} setUser={setUser} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido de vuelta, {user?.name}. Aquí tienes un resumen de la actividad.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">este mes</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
                    <p className="text-gray-600 mt-1">Realiza las tareas más comunes</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={action.action}
                          className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center group-hover:bg-${action.color}-200 transition-colors`}>
                              <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{action.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center shrink-0`}>
                            <activity.icon className={`w-4 h-4 text-${activity.color}-600`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart Section */}
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Rendimiento del Sistema</h2>
                      <p className="text-gray-600 mt-1">Estadísticas de uso y rendimiento</p>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-sm font-medium">+12.5% este mes</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">95%</div>
                      <div className="text-sm text-gray-600">Tiempo de actividad</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">1.2s</div>
                      <div className="text-sm text-gray-600">Tiempo de respuesta</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">99.1%</div>
                      <div className="text-sm text-gray-600">Satisfacción de usuarios</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '99%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
