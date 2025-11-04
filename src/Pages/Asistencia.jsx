import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { BookOpen, Clock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { getDocentes, getHorariosByDocente, getDetalleDocentes } from '../api/axios';

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

  useEffect(() => {
    let active = true;
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
        // Filtramos solo los del docente
        const soloMios = (detalleRes?.data || []).filter(dd => dd.ID_Docente === docenteId);
        setDetalleDocentes(soloMios);
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Error cargando asistencia');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.docenteId, user?.email]);

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
              </div>
            </div>

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
