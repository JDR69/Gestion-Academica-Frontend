
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  IdCard, 
  Save, 
  ArrowLeft,
  Building
} from 'lucide-react';

export const Register = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Datos personales
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    // Dirección
    estado: '',
    // Datos académicos
    contrasena: '',
    confirmarContrasena: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estados = [
    'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
    'Carabobo', 'Cojedes', 'Delta Amacuro', 'Distrito Capital', 'Falcón',
    'Guárico', 'Lara', 'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta',
    'Portuguesa', 'Sucre', 'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.cedula.trim()) newErrors.cedula = 'La cédula es requerida';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.estado) newErrors.estado = 'El estado es requerido';
    if (!formData.contrasena) {
      newErrors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena.length < 6) {
      newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Aquí iría la llamada a la API
      console.log('Registrando docente:', formData);
      
      // Simulación de delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Docente registrado exitosamente');
      navigate('/admin');
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Error al registrar el docente');
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Registrar Docente</h1>
                  <p className="text-gray-600 mt-1">Complete la información del nuevo docente</p>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <form onSubmit={handleSubmit} className="p-6">
                {/* Datos Personales */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Datos Personales</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.nombre ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ingrese el nombre"
                      />
                      {errors.nombre && (
                        <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                      )}
                    </div>

                    {/* Apellido */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.apellido ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ingrese el apellido"
                      />
                      {errors.apellido && (
                        <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
                      )}
                    </div>

                    {/* Cédula */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cédula *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="cedula"
                          value={formData.cedula}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border ${
                            errors.cedula ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="12.345.678"
                        />
                      </div>
                      {errors.cedula && (
                        <p className="mt-1 text-sm text-red-600">{errors.cedula}</p>
                      )}
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="fechaNacimiento"
                          value={formData.fechaNacimiento}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border ${
                            errors.fechaNacimiento ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.fechaNacimiento && (
                        <p className="mt-1 text-sm text-red-600">{errors.fechaNacimiento}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contacto */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Información de Contacto</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="ejemplo@correo.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border ${
                            errors.telefono ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="0412-1234567"
                        />
                      </div>
                      {errors.telefono && (
                        <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                      )}
                    </div>

                    {/* Estado */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          name="estado"
                          value={formData.estado}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border ${
                            errors.estado ? 'border-red-300' : 'border-gray-300'
                          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                          <option value="">Seleccione un estado</option>
                          {estados.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.estado && (
                        <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Credenciales */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Credenciales de Acceso</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contraseña */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.contrasena ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="••••••••"
                      />
                      {errors.contrasena && (
                        <p className="mt-1 text-sm text-red-600">{errors.contrasena}</p>
                      )}
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Contraseña *
                      </label>
                      <input
                        type="password"
                        name="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${
                          errors.confirmarContrasena ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="••••••••"
                      />
                      {errors.confirmarContrasena && (
                        <p className="mt-1 text-sm text-red-600">{errors.confirmarContrasena}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{isSubmitting ? 'Registrando...' : 'Registrar Docente'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
