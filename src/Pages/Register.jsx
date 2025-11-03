
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  IdCard, 
  Save, 
  ArrowLeft,
  Building,
  Gem
} from 'lucide-react';
import { createDocente } from '../api/axios';

export const Register = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Registro: '',
    Contrasena: '',
    Correo: '',
    Fecha_Nacimiento: '',
    Genero: '',
    Estado: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado civil
  // Estado civil: false = Soltero, true = Casado
  const estados = [
    { label: 'Soltero', value: false },
    { label: 'Casado', value: true }
  ];
  const generos = ['Masculino', 'Femenino', 'Otro'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Estado debe ser booleano
    if (name === 'Estado') {
      setFormData(prev => ({
        ...prev,
        Estado: value === 'true' ? true : false
      }));
      if (errors.Estado) {
        setErrors(prev => ({ ...prev, Estado: '' }));
      }
      return;
    }
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
    if (!formData.Nombre.trim()) newErrors.Nombre = 'El nombre es requerido';
    if (!formData.Apellido.trim()) newErrors.Apellido = 'El apellido es requerido';
    if (!formData.Registro.trim()) newErrors.Registro = 'El registro es requerido';
    if (!formData.Correo.trim()) {
      newErrors.Correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.Correo)) {
      newErrors.Correo = 'El correo no es válido';
    }
    if (!formData.Fecha_Nacimiento) newErrors.Fecha_Nacimiento = 'La fecha de nacimiento es requerida';
    if (!formData.Genero) newErrors.Genero = 'El género es requerido';
    if (!formData.Estado) newErrors.Estado = 'El estado es requerido';
    if (!formData.Contrasena) {
      newErrors.Contrasena = 'La contraseña es requerida';
    } else if (formData.Contrasena.length < 6) {
      newErrors.Contrasena = 'La contraseña debe tener al menos 6 caracteres';
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
      // Prepara el payload compatible con backend
      const payload = {
        ...formData,
        Registro: parseInt(formData.Registro, 10),
        Estado: Boolean(formData.Estado),
        Fecha_Nacimiento: formData.Fecha_Nacimiento // asume formato yyyy-mm-dd
      };
      console.log('Registrando docente:', payload);
      await createDocente(payload);
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                      <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.Nombre ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ingrese el nombre"
                      />
                      {errors.Nombre && <p className="mt-1 text-sm text-red-600">{errors.Nombre}</p>}
                    </div>
                    {/* Apellido */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                      <input
                        type="text"
                        name="Apellido"
                        value={formData.Apellido}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.Apellido ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ingrese el apellido"
                      />
                      {errors.Apellido && <p className="mt-1 text-sm text-red-600">{errors.Apellido}</p>}
                    </div>
                    {/* Registro */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Registro *</label>
                      <input
                        type="text"
                        name="Registro"
                        value={formData.Registro}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.Registro ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ingrese el número de registro"
                      />
                      {errors.Registro && <p className="mt-1 text-sm text-red-600">{errors.Registro}</p>}
                    </div>
                    {/* Fecha de Nacimiento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="Fecha_Nacimiento"
                          value={formData.Fecha_Nacimiento}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border ${errors.Fecha_Nacimiento ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.Fecha_Nacimiento && <p className="mt-1 text-sm text-red-600">{errors.Fecha_Nacimiento}</p>}
                    </div>
                  </div>
                </div>

                {/* Contacto y otros datos */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Información de Contacto y Otros</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Correo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="Correo"
                          value={formData.Correo}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border ${errors.Correo ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="ejemplo@correo.com"
                        />
                      </div>
                      {errors.Correo && <p className="mt-1 text-sm text-red-600">{errors.Correo}</p>}
                    </div>
                    {/* Género */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Género *</label>
                      <select
                        name="Genero"
                        value={formData.Genero}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.Genero ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      >
                        <option value="">Seleccione un género</option>
                        {generos.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                      {errors.Genero && <p className="mt-1 text-sm text-red-600">{errors.Genero}</p>}
                    </div>
                    {/* Estado civil */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estado Civil *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Gem className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          name="Estado"
                          value={formData.Estado}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border ${errors.Estado ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                          <option value="">Seleccione estado civil</option>
                          {estados.map((estado) => (
                            <option key={estado.label} value={estado.value}>{estado.label}</option>
                          ))}
                        </select>
                      </div>
                      {errors.Estado && <p className="mt-1 text-sm text-red-600">{errors.Estado}</p>}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                      <input
                        type="password"
                        name="Contrasena"
                        value={formData.Contrasena}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.Contrasena ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="••••••••"
                      />
                      {errors.Contrasena && <p className="mt-1 text-sm text-red-600">{errors.Contrasena}</p>}
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
