
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Calendar, Clock, Edit3, Trash2, Eye, Plus, Save, X } from 'lucide-react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { 
  getDetalleHorarios, 
  createDetalleHorario, 
  updateDetalleHorario, 
  deleteDetalleHorario,
  getHorarios,
  getAulas,
  getAulasDisponibles,
  getGrupos,
  getMaterias,
  getDocentes,
  getDetalleDocentes,
  createDetalleDocente,
  deleteDetalleDocente
} from '../api/axios';

export const Schedule = ({ user, setUser }) => {
  const [horarios, setHorarios] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: '', horario: null });
  const [form, setForm] = useState({ Horario_ID: '', Aula_ID: '', Grupo_ID: '', Materia_ID: '', docente_ids: [] });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Datos de catálogos
  const [horariosBD, setHorariosBD] = useState([]);
  const [aulasBD, setAulasBD] = useState([]);
  const [aulasDisponibles, setAulasDisponibles] = useState([]);
  const [gruposBD, setGruposBD] = useState([]);
  const [materiasBD, setMateriasBD] = useState([]);
  const [docentesBD, setDocentesBD] = useState([]);
  const [detalleDocentes, setDetalleDocentes] = useState([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [horariosRes, aulasRes, gruposRes, materiasRes, docentesRes, detalleHorariosRes, detalleDocentesRes] = await Promise.all([
        getHorarios(),
        getAulas(),
        getGrupos(),
        getMaterias(),
        getDocentes(),
        getDetalleHorarios(),
        getDetalleDocentes()
      ]);
      
      setHorariosBD(horariosRes.data);
      setAulasBD(aulasRes.data);
  // inicialmente mostrar todas las aulas como disponibles
  setAulasDisponibles(aulasRes.data);
      setGruposBD(gruposRes.data);
      setMateriasBD(materiasRes.data);
      setDocentesBD(docentesRes.data);
      setHorarios(detalleHorariosRes.data);
      setDetalleDocentes(detalleDocentesRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  // Cuando se selecciona un horario en el formulario, pedir aulas disponibles
  const handleHorarioChange = async (horarioId) => {
    setForm(f => ({ ...f, Horario_ID: horarioId }));
    if (!horarioId) {
      setAulasDisponibles(aulasBD);
      return;
    }

    try {
      setLoading(true);
      const res = await getAulasDisponibles(Number(horarioId));
      // Si la API devuelve un array, usarlo; si falla, fallback a todas
      if (Array.isArray(res.data)) {
        setAulasDisponibles(res.data);
      } else {
        setAulasDisponibles(aulasBD);
      }
    } catch (err) {
      console.error('No se pudo obtener aulas disponibles, fallback a todas:', err);
      setAulasDisponibles(aulasBD);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener los docentes asignados a un detalle de horario
  const getDocentesForHorario = (detalleHorarioId) => {
    return detalleDocentes
      .filter(dd => dd.ID_Detalle_Horario === detalleHorarioId)
      .map(dd => dd.docente?.Nombre || 'N/A')
      .join(', ') || 'Sin asignar';
  };

  // Función para formatear los datos para mostrar en la tabla
  const formatHorarioDisplay = (h) => {
    const horario = horariosBD.find(hr => hr.ID === h.Horario_ID);
    const aula = aulasBD.find(a => a.ID === h.Aula_ID);
    const grupo = gruposBD.find(g => g.ID === h.Grupo_ID);
    const materia = materiasBD.find(m => m.ID === h.Materia_ID);

    // Mostrar número de aula y facultad si existen, si no, mostrar Nombre, si no, N/A
    let aulaDisplay = 'N/A';
    if (aula) {
      if (aula.Nro_Facultad && aula.Nro_Aula) {
        aulaDisplay = `Facultad ${aula.Nro_Facultad} - Aula ${aula.Nro_Aula}`;
      } else if (aula.Nro_Aula) {
        aulaDisplay = `Aula ${aula.Nro_Aula}`;
      } else if (aula.Nombre) {
        aulaDisplay = aula.Nombre;
      } else {
        aulaDisplay = aula.ID;
      }
    }

    return {
      id: h.ID,
      horario: horario ? `${horario.Hora_Inicio} - ${horario.Hora_Fin}` : 'N/A',
      aula: aulaDisplay,
      grupo: grupo?.Nombre || 'N/A',
      materia: materia?.Nombre || 'N/A',
      docente: getDocentesForHorario(h.ID),
      original: h
    };
  };

  // Exportar a PDF
  const handleReportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text('Reporte de Horarios Asignados', 14, 16);
      const data = horarios.map(h => {
        const formatted = formatHorarioDisplay(h);
        return [formatted.horario, formatted.aula, formatted.grupo, formatted.materia, formatted.docente];
      });
      autoTable(doc, {
        startY: 22,
        head: [['Horario', 'Aula', 'Grupo', 'Materia', 'Docente(s)']],
        body: data,
        theme: 'grid',
        styles: { halign: 'center', fontSize: 9 },
        headStyles: { fillColor: [37, 99, 235] },
      });
      doc.save('horarios_asignados.pdf');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar PDF: ' + error.message);
    }
  };

  // Exportar a Excel
  const handleReportExcel = () => {
    try {
      const data = horarios.map(h => {
        const formatted = formatHorarioDisplay(h);
        return {
          Horario: formatted.horario,
          Aula: formatted.aula,
          Grupo: formatted.grupo,
          Materia: formatted.materia,
          'Docente(s)': formatted.docente
        };
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Horarios');
      XLSX.writeFile(wb, 'horarios_asignados.xlsx');
    } catch (error) {
      console.error('Error al generar Excel:', error);
      alert('Error al generar Excel: ' + error.message);
    }
  };

  // Abrir modal para crear, editar o ver detalle
  const openModal = (mode, horario = null) => {
    setModal({ open: true, mode, horario });
    setErrors({});
    if (horario) {
      // Obtener los IDs de docentes asignados
      const docentesAsignados = detalleDocentes
        .filter(dd => dd.ID_Detalle_Horario === horario.ID)
        .map(dd => dd.ID_Docente);
      
      setForm({ 
        Horario_ID: horario.Horario_ID,
        Aula_ID: horario.Aula_ID,
        Grupo_ID: horario.Grupo_ID,
        Materia_ID: horario.Materia_ID,
        docente_ids: docentesAsignados
      });

      // Cargar aulas disponibles para ese horario y asegurarse de incluir el aula actual
      (async () => {
        try {
          setLoading(true);
          const res = await getAulasDisponibles(Number(horario.Horario_ID));
          let list = Array.isArray(res.data) ? res.data : aulasBD.slice();
          // Si el aula actual no está en la lista (porque está marcada como ocupada), agregarla para que se pueda ver/seleccionar
          if (!list.find(a => a.ID === horario.Aula_ID)) {
            const current = aulasBD.find(a => a.ID === horario.Aula_ID);
            if (current) list = [current, ...list];
          }
          setAulasDisponibles(list);
        } catch (err) {
          console.error('Error cargando aulas disponibles al abrir modal:', err);
          setAulasDisponibles(aulasBD);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setForm({ Horario_ID: '', Aula_ID: '', Grupo_ID: '', Materia_ID: '', docente_ids: [] });
      // nuevo: usar todas las aulas inicialmente
      setAulasDisponibles(aulasBD);
    }
  };

  // Cerrar modal
  const closeModal = () => {
    setModal({ open: false, mode: '', horario: null });
    setForm({ Horario_ID: '', Aula_ID: '', Grupo_ID: '', Materia_ID: '', docente_ids: [] });
    setErrors({});
  };

  // Validar formulario
  const validate = () => {
    const newErrors = {};
    if (!form.Horario_ID) newErrors.Horario_ID = 'Horario requerido';
    if (!form.Aula_ID) newErrors.Aula_ID = 'Aula requerida';
    if (!form.Grupo_ID) newErrors.Grupo_ID = 'Grupo requerido';
    if (!form.Materia_ID) newErrors.Materia_ID = 'Materia requerida';
    if (!form.docente_ids || form.docente_ids.length === 0) newErrors.docente_ids = 'Debe seleccionar al menos un docente';
    return newErrors;
  };

  // Crear o editar horario
  const handleSave = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const detalleHorarioData = {
        Materia_ID: parseInt(form.Materia_ID),
        Grupo_ID: parseInt(form.Grupo_ID),
        Aula_ID: parseInt(form.Aula_ID),
        Horario_ID: parseInt(form.Horario_ID)
      };

      if (modal.mode === 'edit') {
        // Actualizar detalle horario
        await updateDetalleHorario(modal.horario.ID, detalleHorarioData);
        
        // Eliminar asignaciones anteriores de docentes
        const docentesAnteriores = detalleDocentes.filter(dd => dd.ID_Detalle_Horario === modal.horario.ID);
        for (const dd of docentesAnteriores) {
          await deleteDetalleDocente(dd.ID);
        }
        
        // Crear nuevas asignaciones de docentes
        for (const docenteId of form.docente_ids) {
          await createDetalleDocente({
            ID_Docente: parseInt(docenteId),
            ID_Detalle_Horario: modal.horario.ID
          });
        }
      } else {
        // Crear nuevo detalle horario
        const response = await createDetalleHorario(detalleHorarioData);
        const nuevoDetalleHorarioId = response.data.ID;
        
        // Asignar docentes al nuevo detalle horario
        for (const docenteId of form.docente_ids) {
          await createDetalleDocente({
            ID_Docente: parseInt(docenteId),
            ID_Detalle_Horario: nuevoDetalleHorarioId
          });
        }
      }
      
      // Recargar datos
      await fetchAllData();
      closeModal();
    } catch (error) {
      console.error('Error al guardar horario:', error);
      alert('Error al guardar el horario: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Eliminar horario
  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este horario y sus asignaciones de docentes?')) {
      try {
        setLoading(true);
        
        // Eliminar primero las asignaciones de docentes
        const docentesAsignados = detalleDocentes.filter(dd => dd.ID_Detalle_Horario === id);
        for (const dd of docentesAsignados) {
          await deleteDetalleDocente(dd.ID);
        }
        
        // Luego eliminar el detalle horario
        await deleteDetalleHorario(id);
        
        // Recargar datos
        await fetchAllData();
      } catch (error) {
        console.error('Error al eliminar horario:', error);
        alert('Error al eliminar el horario: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Selección múltiple de docentes se maneja directamente en el onChange del <select multiple>

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <h1 className="text-3xl font-bold text-gray-900">Gestión de Horarios</h1>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReportPDF}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    PDF
                  </button>
                  <button
                    onClick={handleReportExcel}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => openModal('create')}
                    className="flex items-center space-x-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Horario</span>
                  </button>
                </div>
              </div>

              {/* Tabla de horarios */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl border border-gray-200">
                  <thead className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Horario</th>
                      <th className="px-4 py-3 text-left">Aula</th>
                      <th className="px-4 py-3 text-left">Grupo</th>
                      <th className="px-4 py-3 text-left">Materia</th>
                      <th className="px-4 py-3 text-left">Docente(s)</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">Cargando...</td>
                      </tr>
                    ) : horarios.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">No hay horarios asignados.</td>
                      </tr>
                    ) : (
                      horarios.map(h => {
                        const formatted = formatHorarioDisplay(h);
                        return (
                          <tr key={h.ID} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                            <td className="px-4 py-3">{formatted.horario}</td>
                            <td className="px-4 py-3">{formatted.aula}</td>
                            <td className="px-4 py-3">{formatted.grupo}</td>
                            <td className="px-4 py-3">{formatted.materia}</td>
                            <td className="px-4 py-3">{formatted.docente}</td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => openModal('detail', h)}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 mr-1"
                                title="Ver Detalle"
                                disabled={loading}
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => openModal('edit', h)}
                                className="p-2 rounded-lg text-purple-600 hover:bg-purple-100 mr-1"
                                title="Editar"
                                disabled={loading}
                              >
                                <Edit3 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(h.ID)}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-100"
                                title="Eliminar"
                                disabled={loading}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal para crear, editar, ver detalle */}
            {modal.open && (
              <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)' }}>
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border border-blue-100">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    title="Cerrar"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>

                  <div className="flex items-center space-x-3 mb-6">
                    <Calendar className="w-7 h-7 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {modal.mode === 'create' && 'Nuevo Horario'}
                      {modal.mode === 'edit' && 'Editar Horario'}
                      {modal.mode === 'detail' && 'Detalle de Horario'}
                    </h2>
                  </div>

                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Horario</label>
                      {modal.mode === 'detail' ? (
                        <div className="py-2 text-gray-900 font-medium">
                          {horariosBD.find(h => h.ID === parseInt(form.Horario_ID))?.Hora_Inicio} - {horariosBD.find(h => h.ID === parseInt(form.Horario_ID))?.Hora_Fin}
                        </div>
                      ) : (
                        <select
                          name="Horario_ID"
                          value={form.Horario_ID}
                          onChange={e => handleHorarioChange(e.target.value)}
                          className={`w-full px-3 py-2 border ${errors.Horario_ID ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          disabled={loading}
                        >
                          <option value="">Selecciona un horario</option>
                          {horariosBD.map((h) => (
                            <option key={h.ID} value={h.ID}>{h.Hora_Inicio} - {h.Hora_Fin}</option>
                          ))}
                        </select>
                      )}
                      {errors.Horario_ID && <p className="text-xs text-red-600 mt-1">{errors.Horario_ID}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Aula</label>
                      {modal.mode === 'detail' ? (
                        <div className="py-2 text-gray-900 font-medium">
                          {(() => {
                            const aula = aulasBD.find(a => a.ID === parseInt(form.Aula_ID));
                            if (!aula) return 'N/A';
                            if (aula.Nro_Facultad && aula.Nro_Aula) {
                              return `Facultad ${aula.Nro_Facultad} - Aula ${aula.Nro_Aula}`;
                            } else if (aula.Nro_Aula) {
                              return `Aula ${aula.Nro_Aula}`;
                            } else if (aula.Nombre) {
                              return aula.Nombre;
                            } else {
                              return aula.ID;
                            }
                          })()}
                        </div>
                      ) : (
                        <select
                          name="Aula_ID"
                          value={form.Aula_ID}
                          onChange={e => setForm(f => ({ ...f, Aula_ID: e.target.value }))}
                          className={`w-full px-3 py-2 border ${errors.Aula_ID ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          disabled={loading}
                        >
                          <option value="">Selecciona un aula</option>
                          {(aulasDisponibles && aulasDisponibles.length > 0 ? aulasDisponibles : aulasBD).map((a) => (
                            <option key={a.ID} value={a.ID}>
                              {a.Nombre || a.Nro_Aula || a.nroAula || a.ID}
                            </option>
                          ))}
                        </select>
                      )}
                      {errors.Aula_ID && <p className="text-xs text-red-600 mt-1">{errors.Aula_ID}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                      {modal.mode === 'detail' ? (
                        <div className="py-2 text-gray-900 font-medium">
                          {gruposBD.find(g => g.ID === form.Grupo_ID)?.Nombre}
                        </div>
                      ) : (
                        <select
                          name="Grupo_ID"
                          value={form.Grupo_ID}
                          onChange={e => setForm(f => ({ ...f, Grupo_ID: e.target.value }))}
                          className={`w-full px-3 py-2 border ${errors.Grupo_ID ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          disabled={loading}
                        >
                          <option value="">Selecciona un grupo</option>
                          {gruposBD.map((g) => (
                            <option key={g.ID} value={g.ID}>{g.Nombre}</option>
                          ))}
                        </select>
                      )}
                      {errors.Grupo_ID && <p className="text-xs text-red-600 mt-1">{errors.Grupo_ID}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                      {modal.mode === 'detail' ? (
                        <div className="py-2 text-gray-900 font-medium">
                          {materiasBD.find(m => m.ID === form.Materia_ID)?.Nombre}
                        </div>
                      ) : (
                        <select
                          name="Materia_ID"
                          value={form.Materia_ID}
                          onChange={e => setForm(f => ({ ...f, Materia_ID: e.target.value }))}
                          className={`w-full px-3 py-2 border ${errors.Materia_ID ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          disabled={loading}
                        >
                          <option value="">Selecciona una materia</option>
                          {materiasBD.map((m) => (
                            <option key={m.ID} value={m.ID}>{m.Nombre}</option>
                          ))}
                        </select>
                      )}
                      {errors.Materia_ID && <p className="text-xs text-red-600 mt-1">{errors.Materia_ID}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Docente(s)</label>
                      {modal.mode === 'detail' ? (
                        <div className="py-2 text-gray-900 font-medium">
                          {form.docente_ids.map(id => docentesBD.find(d => d.ID === id)?.Nombre).join(', ')}
                        </div>
                      ) : (
                        <select
                          multiple
                          name="docente_ids"
                          value={form.docente_ids.map(String)}
                          onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions).map(o => parseInt(o.value));
                            setForm({ ...form, docente_ids: selected });
                          }}
                          className={`w-full px-3 py-2 border ${errors.docente_ids ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          disabled={loading}
                          size={6}
                        >
                          {docentesBD.map((d) => (
                            <option key={d.ID} value={d.ID}>{d.Nombre}</option>
                          ))}
                        </select>
                      )}
                      {errors.docente_ids && <p className="text-xs text-red-600 mt-1">{errors.docente_ids}</p>}
                    </div>
                  </form>

                  {/* Botones de acción */}
                  <div className="flex items-center justify-end space-x-3 mt-8">
                    <button
                      onClick={closeModal}
                      className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    {modal.mode !== 'detail' && (
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        disabled={loading}
                      >
                        <Save className="h-4 w-4" />
                        <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}



