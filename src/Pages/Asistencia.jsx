import { useEffect, useState, useCallback } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { Eye, EyeOff, Edit3, Trash2, X } from 'lucide-react';
import { getDocentes, getDetalleHorarios, getAsistencias, marcarAsistenciaDocente, updateAsistencia, deleteAsistencia } from '../api/axios';

function Asistencia({ user: userProp, setUser: setUserProp }) {
  // Rehidratar usuario si no viene por props
  const [user, setUser] = useState(() => userProp || JSON.parse(localStorage.getItem('authUser') || 'null'));
  useEffect(() => {
    if (userProp) setUser(userProp);
  }, [userProp]);

  const [mostrarAsistencia, setMostrarAsistencia] = useState(true);

  // Para el formulario de marcar asistencia (solo admin)
  const [docentesAll, setDocentesAll] = useState([]);
  const [detalleHorariosAll, setDetalleHorariosAll] = useState([]);
  const [asistenciasAll, setAsistenciasAll] = useState([]);
  const [form, setForm] = useState({ docenteId: '', detalleHorarioId: '', asistenciaId: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Para la tabla de asistencias (solo admin)
  const [asistencias, setAsistencias] = useState([]);
  const [asistenciasLoading, setAsistenciasLoading] = useState(false);
  const [modalAsistencia, setModalAsistencia] = useState({ open: false, mode: '', asistencia: null });
  const [editForm, setEditForm] = useState({ Descripcion: '' });

  // Funciones para gestionar asistencias
  const fetchAsistencias = useCallback(async () => {
    if (user?.role !== 'admin') return;
    setAsistenciasLoading(true);
    try {
      const res = await getAsistencias();
      setAsistencias(res.data || []);
    } catch (err) {
      console.error('Error al cargar asistencias:', err);
    } finally {
      setAsistenciasLoading(false);
    }
  }, [user?.role]);

  const handleDeleteAsistencia = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta asistencia?')) return;
    try {
      await deleteAsistencia(id);
      await fetchAsistencias();
    } catch (err) {
      alert('Error al eliminar asistencia: ' + (err?.response?.data?.message || err.message));
    }
  };

  const openModal = (mode, asistencia = null) => {
    setModalAsistencia({ open: true, mode, asistencia });
    if (asistencia && mode === 'edit') {
      setEditForm({ Descripcion: asistencia.Descripcion });
    } else {
      setEditForm({ Descripcion: '' });
    }
  };

  const closeModal = () => {
    setModalAsistencia({ open: false, mode: '', asistencia: null });
    setEditForm({ Descripcion: '' });
  };

  const handleUpdateAsistencia = async () => {
    try {
      await updateAsistencia(modalAsistencia.asistencia.ID, editForm);
      await fetchAsistencias();
      closeModal();
    } catch (err) {
      alert('Error al actualizar asistencia: ' + (err?.response?.data?.message || err.message));
    }
  };

  // Cargar datos iniciales para admin
  useEffect(() => {
    if (user?.role === 'admin') {
      const loadInitialData = async () => {
        try {
          const [docentesRes, detalleHorariosRes, asistenciasRes] = await Promise.all([
            getDocentes(),
            getDetalleHorarios(),
            getAsistencias(),
          ]);
          setDocentesAll(docentesRes?.data || []);
          setDetalleHorariosAll(detalleHorariosRes?.data || []);
          setAsistenciasAll(asistenciasRes?.data || []);
          await fetchAsistencias();
        } catch (error) {
          console.error('Error cargando datos iniciales:', error);
        }
      };
      loadInitialData();
    }
  }, [user?.role, fetchAsistencias]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} setUser={setUserProp || (()=>{})} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Asistencia</h1>
                  <p className="text-gray-600 mt-2">Consulta tus materias y su estado de asistencia actual.</p>
                </div>
                {user?.role !== 'admin' && (
                  <label className="flex items-center gap-2 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={mostrarAsistencia}
                      onChange={() => setMostrarAsistencia(v => !v)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full relative transition-colors peer-checked:bg-blue-600">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                    </div>
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                      {mostrarAsistencia ? <Eye className="w-4 h-4 text-blue-600"/> : <EyeOff className="w-4 h-4 text-gray-500"/>}
                      Ver asistencia
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Formulario para marcar asistencia (solo admin) */}
            {user?.role === 'admin' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Marcar Asistencia de Docente</h2>
                <form
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setFormLoading(true);
                    setFormError('');
                    setFormSuccess('');
                    try {
                      if (!form.docenteId || !form.detalleHorarioId || !form.asistenciaId) {
                        setFormError('Completa todos los campos');
                        setFormLoading(false);
                        return;
                      }
                      await marcarAsistenciaDocente(
                        form.docenteId,
                        form.detalleHorarioId,
                        form.asistenciaId
                      );
                      setFormSuccess('Asistencia marcada correctamente');
                      setForm({ docenteId: '', detalleHorarioId: '', asistenciaId: '' });
                      // Recargar asistencias después de marcar
                      await fetchAsistencias();
                    } catch (err) {
                      setFormError('Error al marcar asistencia: ' + (err?.response?.data?.message || err.message));
                    } finally {
                      setFormLoading(false);
                    }
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.docenteId}
                      onChange={e => setForm(f => ({ ...f, docenteId: e.target.value }))}
                      required
                    >
                      <option value="">Selecciona un docente</option>
                      {docentesAll.map(d => (
                        <option key={d.ID} value={d.ID}>{d.Nombre} {d.Apellido}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Detalle Horario</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.detalleHorarioId}
                      onChange={e => setForm(f => ({ ...f, detalleHorarioId: e.target.value }))}
                      required
                    >
                      <option value="">Selecciona un detalle horario</option>
                      {detalleHorariosAll.map(dh => (
                        <option key={dh.ID} value={dh.ID}>
                          {dh.materia?.Nombre} - {dh.grupo?.Nombre} ({dh.horario?.Hora_Inicio}-{dh.horario?.Hora_Fin})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Asistencia</label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={form.asistenciaId}
                      onChange={e => setForm(f => ({ ...f, asistenciaId: e.target.value }))}
                      required
                    >
                      <option value="">Selecciona tipo de asistencia</option>
                      {asistenciasAll.map(a => (
                        <option key={a.ID} value={a.ID}>{a.Descripcion}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3 flex items-center gap-4 mt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
                      disabled={formLoading}
                    >
                      {formLoading ? 'Marcando…' : 'Marcar Asistencia'}
                    </button>
                    {formError && <span className="text-red-600 text-sm">{formError}</span>}
                    {formSuccess && <span className="text-green-600 text-sm">{formSuccess}</span>}
                  </div>
                </form>
              </div>
            )}

            {/* Tabla de asistencias (solo admin) */}
            {user?.role === 'admin' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Todas las Asistencias</h2>
                  <button 
                    onClick={fetchAsistencias}
                    className="text-blue-600 hover:text-blue-800"
                    disabled={asistenciasLoading}
                  >
                    {asistenciasLoading ? 'Cargando...' : 'Actualizar'}
                  </button>
                </div>
                
                {asistenciasLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 text-lg">Cargando asistencias...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-linear-to-r from-blue-600 to-blue-700 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold rounded-tl-xl">ID</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Tipo de Asistencia</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Docentes Registrados</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold rounded-tr-xl">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {asistencias.map((a, index) => (
                          <tr key={a.ID} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                #{a.ID}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900">{a.Descripcion}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {a.detalle_docentes && a.detalle_docentes.length > 0 ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  {a.detalle_docentes.length} docente{a.detalle_docentes.length !== 1 ? 's' : ''}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                                  Sin registros
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => openModal('detail', a)}
                                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200"
                                  title="Ver detalle"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => openModal('edit', a)}
                                  className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors duration-200"
                                  title="Editar"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteAsistencia(a.ID)}
                                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Modal para ver/editar asistencia */}
            {modalAsistencia.open && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {modalAsistencia.mode === 'detail' ? 'Detalle de Asistencia' : 'Editar Asistencia'}
                    </h3>
                    <button 
                      onClick={closeModal} 
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="Cerrar"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  {modalAsistencia.mode === 'detail' ? (
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Identificador</label>
                        <div className="text-lg font-medium text-blue-600">#{modalAsistencia.asistencia?.ID}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Tipo de Asistencia</label>
                        <div className="text-lg font-medium text-gray-900">{modalAsistencia.asistencia?.Descripcion}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Docentes Registrados</label>
                        <div className="text-gray-900">
                          {modalAsistencia.asistencia?.detalle_docentes?.length > 0 ? (
                            <div className="space-y-3">
                              {modalAsistencia.asistencia.detalle_docentes.map((dd, index) => (
                                <div key={dd.ID} className="bg-white rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="text-sm font-medium text-gray-500">Registro #{index + 1}</span>
                                      <div className="mt-1">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                                          Docente: {dd.ID_Docente}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                          Horario: {dd.ID_Detalle_Horario}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <div className="text-gray-400 text-sm italic">No hay docentes registrados para esta asistencia</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Tipo de Asistencia</label>
                        <input
                          type="text"
                          value={editForm.Descripcion}
                          onChange={e => setEditForm({ ...editForm, Descripcion: e.target.value })}
                          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-blue-500 focus:outline-none transition-colors"
                          placeholder="Ej: Presente, Ausente, Tardanza..."
                        />
                      </div>
                      <div className="flex gap-3 justify-end pt-4">
                        <button 
                          onClick={closeModal}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={handleUpdateAsistencia}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg"
                        >
                          Guardar Cambios
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Asistencia;
