
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Calendar, Clock, Edit3, Trash2, Eye, Plus, Save, X } from 'lucide-react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';

const initialHorarios = [
  { id: 1, horario: '08:00 - 10:00', aula: '101', grupo: 'A', materia: 'Matemáticas', docente: 'María González' },
  { id: 2, horario: '10:00 - 12:00', aula: '203', grupo: 'B', materia: 'Historia', docente: 'Juan Pérez' },
  { id: 3, horario: '14:00 - 16:00', aula: '105', grupo: 'C', materia: 'Física', docente: 'Ana Torres' },
];

// Simulación de datos de la BD
const horariosBD = ['08:00 - 10:00', '10:00 - 12:00', '14:00 - 16:00', '16:00 - 18:00'];
const aulasBD = ['101', '203', '105', '301'];
const gruposBD = ['A', 'B', 'C', 'D'];
const materiasBD = ['Matemáticas', 'Historia', 'Física', 'Química'];
const docentesBD = ['María González', 'Juan Pérez', 'Ana Torres', 'Carlos Ruiz'];

export const Schedule = ({ user, setUser }) => {
  const [horarios, setHorarios] = useState(initialHorarios);
  const [modal, setModal] = useState({ open: false, mode: '', horario: null });
  const [form, setForm] = useState({ horario: '', aula: '', grupo: '', materia: '', docente: '' });
  const [errors, setErrors] = useState({});

  // Exportar a PDF
  const handleReportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text('Reporte de Horarios', 14, 16);
      autoTable(doc, {
        startY: 22,
        head: [['Horario', 'Aula', 'Grupo', 'Materia', 'Docente']],
        body: horarios.map(h => [h.horario, h.aula, h.grupo, h.materia, h.docente]),
        theme: 'grid',
        styles: { halign: 'center' },
        headStyles: { fillColor: [37, 99, 235] },
      });
      doc.save('horarios.pdf');
    } catch (error) {
      alert('Error al generar PDF: ' + error.message);
    }
  };

  // Exportar a Excel
  const handleReportExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(horarios);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Horarios');
      XLSX.writeFile(wb, 'horarios.xlsx');
    } catch (error) {
      alert('Error al generar Excel: ' + error.message);
    }
  };

  // ...existing code...

  // Abrir modal para crear, editar o ver detalle
  const openModal = (mode, horario = null) => {
    setModal({ open: true, mode, horario });
    setErrors({});
    if (horario) {
      setForm({ ...horario });
    } else {
      setForm({ horario: '', aula: '', grupo: '', materia: '', docente: '' });
    }
  };

  // Cerrar modal
  const closeModal = () => {
    setModal({ open: false, mode: '', horario: null });
    setForm({ horario: '', aula: '', grupo: '', materia: '', docente: '' });
    setErrors({});
  };

  // Validar formulario
  const validate = () => {
    const newErrors = {};
    if (!form.horario) newErrors.horario = 'Horario requerido';
    if (!form.aula) newErrors.aula = 'Aula requerida';
    if (!form.grupo) newErrors.grupo = 'Grupo requerido';
    if (!form.materia) newErrors.materia = 'Materia requerida';
    if (!form.docente) newErrors.docente = 'Docente requerido';
    return newErrors;
  };

  // Crear o editar horario
  const handleSave = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (modal.mode === 'edit') {
      setHorarios(horarios.map(h => h.id === modal.horario.id ? { ...form, id: h.id } : h));
    } else {
      setHorarios([...horarios, { ...form, id: Date.now() }]);
    }
    closeModal();
  };

  // Eliminar horario
  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este horario?')) {
      setHorarios(horarios.filter(h => h.id !== id));
    }
  };

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
                      <th className="px-4 py-3 text-left">Docente</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {horarios.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">No hay horarios registrados.</td>
                      </tr>
                    ) : (
                      horarios.map(h => (
                        <tr key={h.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                          <td className="px-4 py-3">{h.horario}</td>
                          <td className="px-4 py-3">{h.aula}</td>
                          <td className="px-4 py-3">{h.grupo}</td>
                          <td className="px-4 py-3">{h.materia}</td>
                          <td className="px-4 py-3">{h.docente}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => openModal('detail', h)}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 mr-1"
                              title="Ver Detalle"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openModal('edit', h)}
                              className="p-2 rounded-lg text-purple-600 hover:bg-purple-100 mr-1"
                              title="Editar"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(h.id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-100"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal para crear, editar, ver detalle */}
            {modal.open && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
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
                        <div className="py-2 text-gray-900 font-medium">{form.horario}</div>
                      ) : (
                        <select
                          name="horario"
                          value={form.horario}
                          onChange={e => setForm(f => ({ ...f, horario: e.target.value }))}
                          className={`w-full px-3 py-2 border ${errors.horario ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="">Selecciona un horario</option>
                          {horariosBD.map((h, idx) => (
                            <option key={idx} value={h}>{h}</option>
                          ))}
                        </select>
                      )}
                      {errors.horario && <p className="text-xs text-red-600 mt-1">{errors.horario}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Aula</label>
                      {modal.mode === 'detail' ? (
                        <div className="py-2 text-gray-900 font-medium">{form.aula}</div>
                      ) : (
                        <select
                          name="aula"
                          value={form.aula}
                          onChange={e => setForm(f => ({ ...f, aula: e.target.value }))}
                          className={`w-full px-3 py-2 border ${errors.aula ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="">Selecciona un aula</option>
                          {aulasBD.map((a, idx) => (
                            <option key={idx} value={a}>{a}</option>
                          ))}
                        </select>
                      )}
                      {errors.aula && <p className="text-xs text-red-600 mt-1">{errors.aula}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                      {modal.mode === 'detail' ? (
                        <div className="py-2 text-gray-900 font-medium">{form.grupo}</div>
                      ) : (
                        <select
                          name="grupo"
                          value={form.grupo}
                          onChange={e => setForm(f => ({ ...f, grupo: e.target.value }))}
                          className={`w-full px-3 py-2 border ${errors.grupo ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        >
                          <option value="">Selecciona un grupo</option>
                          {gruposBD.map((g, idx) => (
                            <option key={idx} value={g}>{g}</option>
                          ))}
                        </select>
                      )}
                      {errors.grupo && <p className="text-xs text-red-600 mt-1">{errors.grupo}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Materia</label>
                      {modal.mode === 'detail' ? (
                        <div className="py-2 text-gray-900 font-medium">{form.materia}</div>
                      ) : (
                        <select
                          name="materia"
                          value={form.materia}
                          onChange={e => setForm(f => ({ ...f, materia: e.target.value }))}
                          className={`w-full px-3 py-2 border ${errors.materia ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                          <option value="">Selecciona una materia</option>
                          {materiasBD.map((m, idx) => (
                            <option key={idx} value={m}>{m}</option>
                          ))}
                        </select>
                      )}
                      {errors.materia && <p className="text-xs text-red-600 mt-1">{errors.materia}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Docente</label>
                      {modal.mode === 'detail' ? (
                        <div className="py-2 text-gray-900 font-medium">{form.docente}</div>
                      ) : (
                        <select
                          name="docente"
                          value={form.docente}
                          onChange={e => setForm(f => ({ ...f, docente: e.target.value }))}
                          className={`w-full px-3 py-2 border ${errors.docente ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        >
                          <option value="">Selecciona un docente</option>
                          {docentesBD.map((d, idx) => (
                            <option key={idx} value={d}>{d}</option>
                          ))}
                        </select>
                      )}
                      {errors.docente && <p className="text-xs text-red-600 mt-1">{errors.docente}</p>}
                    </div>
                  </form>

                  {/* Botones de acción */}
                  <div className="flex items-center justify-end space-x-3 mt-8">
                    <button
                      onClick={closeModal}
                      className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    {modal.mode !== 'detail' && (
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>Guardar</span>
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



