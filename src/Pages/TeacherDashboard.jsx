import { useEffect, useState } from 'react';
import { Sidebar } from '../components/sidebar';
import { Navbar } from '../components/navbar';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import { getDocentes, getHorariosByDocente } from '../api/axios';

export const TeacherDashboard = ({ user, setUser }) => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resolveDocenteId = async () => {
    // Preferimos un docenteId explícito si viene del login
    if (user?.docenteId) return user.docenteId;
    // Para tu modelo: cualquier no-admin es docente; buscamos por correo en la tabla Docente
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
        const { data } = await getHorariosByDocente(docenteId);
        if (!active) return;
        setHorarios(data?.horarios || []);
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Error cargando horarios');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.docenteId, user?.email]);

  const myCourses = horarios.map((h, idx) => ({
    id: h.detalle_horario_id ?? idx,
    name: `${h.materia ?? 'Materia'} · ${h.grupo ?? 'Grupo'}`,
    hora: h.hora_inicio && h.hora_fin ? `${h.hora_inicio} - ${h.hora_fin}` : undefined,
    aula: h.aula ? `Facultad ${h.aula.nro_facultad} • Aula ${h.aula.nro_aula}` : undefined,
  }));

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
                <div className="space-y-4">
                  {myCourses.length === 0 && !loading && !error && (
                    <div className="text-sm text-gray-500">No tienes horarios asignados.</div>
                  )}
                  {myCourses.map((course) => (
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
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
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
};
 
