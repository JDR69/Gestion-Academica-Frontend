import { useEffect, useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import { getDocentes, getHorariosByDocente, getDetalleDocentes } from '../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
// asdf
// --- Export helpers ---
function exportToPDF(courses) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  // Titulo
  doc.setFontSize(14);
  doc.text('Reporte de Asistencia - Docente', 30, 30);
  // Tabla
  try {
    autoTable(doc, {
      startY: 60,
      head: [['Materia', 'Horario', 'Aula', 'Estado']],
      body: courses.map(c => [c.name, c.hora || '', c.aula || '', c.estado]),
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [37, 99, 235] },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      columnStyles: { 0: { cellWidth: 260 }, 1: { cellWidth: 120 }, 2: { cellWidth: 140 }, 3: { cellWidth: 80 } },
    });
  } catch (e) {
    console.error('Error generando PDF:', e);
  }
  doc.save('asistencia_docente.pdf');
}

function exportToXLSX(courses) {
  const header = ['Materia', 'Horario', 'Aula', 'Estado'];
  const rows = courses.map(c => [c.name, c.hora || '', c.aula || '', c.estado]);
  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  ws['!cols'] = [
    { wch: 40 },
    { wch: 20 },
    { wch: 30 },
    { wch: 14 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');
  XLSX.writeFile(wb, 'asistencia_docente.xlsx');
}

function exportToHTML(courses) {
  const header = ['Materia', 'Horario', 'Aula', 'Estado'];
  const rows = courses.map(c => [c.name, c.hora || '', c.aula || '', c.estado]);
  let html = '<table border="1" style="border-collapse:collapse;width:100%"><thead><tr>';
  html += header.map(h => `<th>${h}</th>`).join('');
  html += '</tr></thead><tbody>';
  html += rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('');
  html += '</tbody></table>';
  const win = window.open('', '_blank');
  win.document.write(`<html><head><title>Reporte Asistencia</title></head><body>${html}</body></html>`);
  win.document.close();
}

export const TeacherDashboard = ({ user, setUser }) => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detalleDocentes, setDetalleDocentes] = useState([]);
  const isAdmin = user?.role === 'admin' || user?.isAdmin;

  useEffect(() => {
    if (isAdmin) {
      window.location.replace('/');
      return;
    }
    let active = true;
    const resolveDocenteId = async () => {
      if (user?.docenteId) return user.docenteId;
      if (user?.email) {
        try {
          const { data } = await getDocentes();
          const match = (data || []).find(d => d.Correo === user.email);
          if (match?.ID) return match.ID;
        } catch {}
      }
      return null;
    };
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const docenteId = await resolveDocenteId();
        if (!docenteId) throw new Error('No se pudo determinar el docente logueado.');
        const [horariosRes, detalleRes] = await Promise.all([
          getHorariosByDocente(docenteId),
          getDetalleDocentes(),
        ]);
        if (!active) return;
        setHorarios(horariosRes?.data?.horarios || []);
        const soloMios = (detalleRes?.data || []).filter(dd => dd.ID_Docente === docenteId);
        setDetalleDocentes(soloMios);
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Error cargando horarios');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.docenteId, user?.email, isAdmin]);

  // Eliminado: declaración duplicada de myCourses

  if (isAdmin) return null;
  const myCourses = horarios.map((h, idx) => {
    const dd = detalleDocentes.find(x => x.ID_Detalle_Horario === h.detalle_horario_id);
    const estado = dd?.asistencia?.Descripcion || 'Asignado';
    return {
      id: h.detalle_horario_id ?? idx,
      name: `${h.materia ?? 'Materia'} · ${h.grupo ?? 'Grupo'}`,
      hora: h.hora_inicio && h.hora_fin ? `${h.hora_inicio} - ${h.hora_fin}` : undefined,
      aula: h.aula ? `Facultad ${h.aula.nro_facultad} • Aula ${h.aula.nro_aula}` : undefined,
      estado,
    };
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Mis Horarios</h1>
              <p className="text-gray-600 mt-2">Bienvenido, {user?.name}. Aquí verás únicamente tus horarios asignados.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Botones de exportación */}
              <div className="flex gap-3 p-6 border-b border-gray-200">
                <button
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-blue-700"
                  onClick={() => exportToPDF(myCourses)}
                >
                  Exportar PDF
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-green-700"
                  onClick={() => exportToXLSX(myCourses)}
                >
                  Exportar Excel
                </button>
                <button
                  className="bg-gray-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-gray-700"
                  onClick={() => exportToHTML(myCourses)}
                >
                  Exportar HTML
                </button>
              </div>
              
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Mis Horarios</h2>
                  <div className="text-sm text-gray-500">
                    {loading ? 'Cargando…' : error ? (
                      <span className="text-red-600">{error}</span>
                    ) : (
                      <span>{myCourses.length} asignaciones</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                {myCourses.length === 0 && !loading && !error && (
                  <div className="text-sm text-gray-500">No tienes horarios asignados.</div>
                )}
                {myCourses.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-700">
                          <th className="px-3 py-2">Materia · Grupo</th>
                          <th className="px-3 py-2">Horario</th>
                          <th className="px-3 py-2">Aula</th>
                          <th className="px-3 py-2">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {myCourses.map(course => (
                          <tr key={course.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="font-medium text-gray-900">{course.name}</div>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-gray-700">
                              {course.hora ? (
                                <span className="inline-flex items-center">
                                  <Clock className="w-4 h-4 mr-1 text-gray-500" />
                                  {course.hora}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="px-3 py-2 text-gray-700">{course.aula || '-'}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  course.estado === 'Presente' ? 'bg-green-100 text-green-700' :
                                  course.estado === 'Ausente' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {course.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
 
