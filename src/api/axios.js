import axios from "axios";

export const api = axios.create({
  baseURL: "https://gestion-academica-backend-dl66.onrender.com/api", // Cambia la URL si tu backend está en otro puerto o dominio
  //baseURL: 'http://localhost:8000/api', // Cambia la URL si tu backend está en otro puerto o dominio
  withCredentials: true,
});

// Materias (backend en singular: materia)
export const getMaterias = () => api.get("/materia");
export const createMateria = (data) => api.post("/materia", data);
export const updateMateria = (id, data) => api.put(`/materia/${id}`, data);
export const deleteMateria = (id) => api.delete(`/materia/${id}`);

// Horarios
export const getHorarios = () => api.get("/horarios");
export const createHorario = (data) => api.post("/horarios", data);
export const updateHorario = (id, data) => api.put(`/horarios/${id}`, data);
export const deleteHorario = (id) => api.delete(`/horarios/${id}`);

// Grupos
export const getGrupos = () => api.get("/grupos");
export const createGrupo = (data) => api.post("/grupos", data);
export const updateGrupo = (id, data) => api.put(`/grupos/${id}`, data);
export const deleteGrupo = (id) => api.delete(`/grupos/${id}`);

// Aulas
export const getAulas = () => api.get("/aula");
export const createAula = (data) => api.post("/aula", data);
export const updateAula = (id, data) => api.put(`/aula/${id}`, data);
export const deleteAula = (id) => api.delete(`/aula/${id}`);
// Aulas disponibles para un horario (query param: horario_id)
export const getAulasDisponibles = (horarioId) =>
  api.get(`/aulas/disponibles?horario_id=${horarioId}`);

// Usuarios (ejemplo para login y registro)
export const login = (data) => api.post("/login", data);
export const register = (data) => api.post("/register", data);
export const getUser = () => api.get("/user");

// Asistencia
export const getAsistencias = () => api.get("/asistencia");
export const createAsistencia = (data) => api.post("/asistencia", data);
export const getAsistenciaById = (id) => api.get(`/asistencia/${id}`);
export const updateAsistencia = (id, data) => api.put(`/asistencia/${id}`, data);
export const deleteAsistencia = (id) => api.delete(`/asistencia/${id}`);

// Docentes
export const getDocentes = () => api.get("/docente");
export const createDocente = (data) => api.post("/docente", data);
export const updateDocente = (id, data) => api.put(`/docente/${id}`, data);
export const deleteDocente = (id) => api.delete(`/docente/${id}`);

// Horarios por Docente
export const getHorariosByDocente = (docenteId) =>
  api.get(`/docente/${docenteId}/horarios`);

// Marcar Asistencia de Docente
// Marcar asistencia: el backend espera las claves exactas
// { ID_Docente, ID_Detalle_Horario, ID_Asistencia }
export const marcarAsistenciaDocente = (
  docenteId,
  detalleHorarioId,
  asistenciaId
) =>
  api.post(`/detalle-horario/marcar-asistencia`, {
    ID_Docente: Number(docenteId),
    ID_Detalle_Horario: Number(detalleHorarioId),
    ID_Asistencia: Number(asistenciaId),
  });

// Detalle Horario (Asignaciones)
export const getDetalleHorarios = () => api.get("/detalle-horario");
export const createDetalleHorario = (data) =>
  api.post("/detalle-horario", data);
export const updateDetalleHorario = (id, data) =>
  api.put(`/detalle-horario/${id}`, data);
export const deleteDetalleHorario = (id) =>
  api.delete(`/detalle-horario/${id}`);

// Detalle Docente (Asignación de docente a horario)
export const getDetalleDocentes = () => api.get("/detalle-docente");
export const createDetalleDocente = (data) =>
  api.post("/detalle-docente", data);
export const updateDetalleDocente = (id, data) =>
  api.put(`/detalle-docente/${id}`, data);
export const deleteDetalleDocente = (id) =>
  api.delete(`/detalle-docente/${id}`);
