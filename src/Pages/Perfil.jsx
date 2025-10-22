
import { useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  IdCard, 
  Edit3, 
  Save, 
  X,
  Shield,
  Camera
} from 'lucide-react';

export const Perfil = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    telefono: '0412-1234567',
    cedula: '12.345.678',
    fechaNacimiento: '1985-06-15',
    estado: 'Miranda',
    direccion: 'Av. Principal, Los Teques'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Aquí iría la llamada a la API para actualizar los datos
    setUser(prev => ({
      ...prev,
      name: formData.name,
      email: formData.email
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      telefono: '0412-1234567',
      cedula: '12.345.678',
      fechaNacimiento: '1985-06-15',
      estado: 'Miranda',
      direccion: 'Av. Principal, Los Teques'
    });
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} setUser={setUser} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-gray-600 mt-1">Gestiona tu información personal</p>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Editar Perfil</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna izquierda - Foto y datos básicos */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  {/* Foto de perfil */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-4xl font-bold">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-600 font-medium capitalize">{user?.role}</span>
                    </div>
                  </div>

                  {/* Estado del perfil */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Estado del perfil</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Activo
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">85% completado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna derecha - Información detallada */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  {/* Datos Personales */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Datos Personales</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nombre */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre Completo
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{formData.name}</p>
                        )}
                      </div>

                      {/* Cédula */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cédula de Identidad
                        </label>
                        <div className="flex items-center space-x-2 py-2">
                          <IdCard className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{formData.cedula}</span>
                        </div>
                      </div>

                      {/* Fecha de Nacimiento */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Nacimiento
                        </label>
                        {isEditing ? (
                          <input
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 py-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">
                              {new Date(formData.fechaNacimiento).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Estado */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        {isEditing ? (
                          <select
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Miranda">Miranda</option>
                            <option value="Caracas">Caracas</option>
                            <option value="Carabobo">Carabobo</option>
                            <option value="Aragua">Aragua</option>
                          </select>
                        ) : (
                          <div className="flex items-center space-x-2 py-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{formData.estado}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Correo Electrónico
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 py-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{formData.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 py-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{formData.telefono}</span>
                          </div>
                        )}
                      </div>

                      {/* Dirección */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección
                        </label>
                        {isEditing ? (
                          <textarea
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-start space-x-2 py-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-900">{formData.direccion}</span>
                          </div>
                        )}
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

