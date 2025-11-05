import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { BookOpen, Clock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { getDocentes, getHorariosByDocente, getDetalleDocentes, getAsistencias, getDetalleHorarios, marcarAsistenciaDocente } from '../api/axios';

function Asistencia({ user: userProp, setUser: setUserProp }) {
  // Rehidratar usuario si no viene por props
  const [user, setUser] = useState(() => userProp || JSON.parse(localStorage.getItem('authUser') || 'null'));
  useEffect(() => {
    if (userProp) setUser(userProp);
  }, [userProp]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [detalleDocentes, setDetalleDocentes] = useState([]);
  const [mostrarAsistencia, setMostrarAsistencia] = useState(true);

  // Para el formulario de marcar asistencia (solo admin)
  const [docentesAll, setDocentesAll] = useState([]);
  const [detalleHorariosAll, setDetalleHorariosAll] = useState([]);
  const [asistenciasAll, setAsistenciasAll] = useState([]);
  const [form, setForm] = useState({ docenteId: '', detalleHorarioId: '', asistenciaId: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const resolveDocenteId = async () => {
    if (user?.docenteId) return user.docenteId;
    if (user?.email) {
      try {
        const { data } = await getDocentes();
        const match = (data || []).find(d => d.Correo === user.email);
        if (match?.ID) return match.ID;
      } catch(e) {
        console.error('Error buscando docente por email:', e);
      }
    }
    return null;
  };

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (user?.role === 'admin') {
          // Admin: cargar todos los docentes, detalle horarios y asistencias
          const [docentesRes, detalleHorariosRes, asistenciasRes] = await Promise.all([
            getDocentes(),
            getDetalleHorarios(),
            getAsistencias(),
          ]);
          if (!active) return;
          setDocentesAll(docentesRes?.data || []);
          setDetalleHorariosAll(detalleHorariosRes?.data || []);
          setAsistenciasAll(asistenciasRes?.data || []);
        } else {
          // Docente: solo sus datos
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
        }
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Error cargando asistencia');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.docenteId, user?.email, user?.role]);

  const cards = useMemo(() => {
    return (horarios || []).map((h, idx) => {
      // Buscar estado de asistencia para el detalle_horario actual
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
  }, [horarios, detalleDocentes]);

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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Mis Materias</h2>
                  <div className="text-sm text-gray-500">
                    {loading ? 'Cargando…' : error ? (
                      <span className="text-red-600">{error}</span>
                    ) : (
                      <span>{cards.length} asignaciones</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {cards.length === 0 && !loading && !error && (
                    <div className="text-sm text-gray-500">No tienes materias asignadas.</div>
                  )}
                  {cards.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{course.name}</h3>
                            {course.aula && (
                              <p className="text-sm text-gray-600">{course.aula}</p>
                            )}
                          </div>
                        </div>

                        {mostrarAsistencia && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                course.estado === 'Presente' ? 'bg-green-100 text-green-700' :
                                course.estado === 'Ausente' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {course.estado}
                            </span>
                          </div>
                        )}
                      </div>

                      {course.hora && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{course.hora}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Asistencia;
