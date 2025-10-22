import { useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  Clock, 
  Award,
  TrendingUp,
  MessageSquare,
  Bell,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

export const TeacherDashboard = ({ user, setUser }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const stats = [
    {
      title: 'Mis Cursos',
      value: '6',
      change: '+1',
      changeType: 'positive',
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: 'Estudiantes Totales',
      value: '156',
      change: '+12',
      changeType: 'positive',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Tareas Pendientes',
      value: '8',
      change: '-3',
      changeType: 'negative',
      icon: FileText,
      color: 'orange'
    },
    {
      title: 'Promedio General',
      value: '85%',
      change: '+2%',
      changeType: 'positive',
      icon: Award,
      color: 'purple'
    }
  ];

  const myCourses = [
    {
      id: 1,
      name: 'Matemáticas I',
      students: 28,
      progress: 75,
      nextClass: '2025-10-23 08:00',
      pendingGrades: 3,
      status: 'active'
    },
    {
      id: 2,
      name: 'Álgebra Lineal',
      students: 24,
      progress: 60,
      nextClass: '2025-10-23 10:00',
      pendingGrades: 0,
      status: 'active'
    },
    {
      id: 3,
      name: 'Cálculo I',
      students: 32,
      progress: 45,
      nextClass: '2025-10-24 08:00',
      pendingGrades: 5,
      status: 'active'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'grade',
      message: 'Calificaciones subidas para Matemáticas I - Parcial 2',
      time: '30 minutos atrás',
      icon: Award,
      color: 'green'
    },
    {
      id: 2,
      type: 'message',
      message: 'Nuevo mensaje de María Pérez sobre la tarea',
      time: '1 hora atrás',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      id: 3,
      type: 'reminder',
      message: 'Recordatorio: Clase de Álgebra Lineal mañana',
      time: '2 horas atrás',
      icon: Clock,
      color: 'orange'
    },
    {
      id: 4,
      type: 'assignment',
      message: 'Nueva tarea enviada para Cálculo I',
      time: '3 horas atrás',
      icon: FileText,
      color: 'purple'
    }
  ];

  const upcomingClasses = [
    {
      course: 'Matemáticas I',
      time: '08:00 - 10:00',
      date: 'Mañana',
      room: 'Aula 101',
      students: 28
    },
    {
      course: 'Álgebra Lineal',
      time: '10:00 - 12:00',
      date: 'Mañana',
      room: 'Aula 203',
      students: 24
    },
    {
      course: 'Cálculo I',
      time: '14:00 - 16:00',
      date: 'Jueves',
      room: 'Aula 105',
      students: 32
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
                Dashboard del Profesor
              </h1>
              <p className="text-gray-600 mt-2">
                Bienvenido de vuelta, Profesor {user?.name}. Gestiona tus cursos y estudiantes.
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
                        <span className="text-sm text-gray-500 ml-1">este período</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* My Courses */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-900">Mis Cursos</h2>
                      <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Curso</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {myCourses.map((course) => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{course.name}</h3>
                                <p className="text-sm text-gray-600">{course.students} estudiantes</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {course.pendingGrades > 0 ? (
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                  {course.pendingGrades} pendientes
                                </span>
                              ) : (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progreso del curso</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Próxima clase: {new Date(course.nextClass).toLocaleString('es-ES')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
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
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Classes */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Próximas Clases</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {upcomingClasses.map((classItem, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{classItem.course}</p>
                            <p className="text-xs text-gray-600">{classItem.date} • {classItem.time}</p>
                            <p className="text-xs text-gray-500">{classItem.room} • {classItem.students} estudiantes</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Resumen de Rendimiento</h2>
                    <p className="text-gray-600 mt-1">Estadísticas de tus cursos este semestre</p>
                  </div>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="current">Período Actual</option>
                    <option value="previous">Período Anterior</option>
                    <option value="year">Todo el Año</option>
                  </select>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">87%</div>
                    <div className="text-sm text-gray-600">Promedio de Calificaciones</div>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+3%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">94%</div>
                    <div className="text-sm text-gray-600">Asistencia Promedio</div>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+1%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">156</div>
                    <div className="text-sm text-gray-600">Tareas Calificadas</div>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600">Al día</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <div className="text-sm text-gray-600">Tareas Pendientes</div>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-600">Pendiente</span>
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
