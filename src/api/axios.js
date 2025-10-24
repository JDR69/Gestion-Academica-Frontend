import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Cambia la URL si tu backend está en otro puerto o dominio
  withCredentials: true,
});

// Materias (backend en singular: materia)
export const getMaterias = () => api.get('/materia');
export const createMateria = (data) => api.post('/materia', data);
export const updateMateria = (id, data) => api.put(`/materia/${id}`, data);
export const deleteMateria = (id) => api.delete(`/materia/${id}`);

// Horarios
export const getHorarios = () => api.get('/horarios');
export const createHorario = (data) => api.post('/horarios', data);
export const updateHorario = (id, data) => api.put(`/horarios/${id}`, data);
export const deleteHorario = (id) => api.delete(`/horarios/${id}`);

// Grupos
export const getGrupos = () => api.get('/grupos');
export const createGrupo = (data) => api.post('/grupos', data);
export const updateGrupo = (id, data) => api.put(`/grupos/${id}`, data);
export const deleteGrupo = (id) => api.delete(`/grupos/${id}`);

// Aulas
export const getAulas = () => api.get('/aula');
export const createAula = (data) => api.post('/aula', data);
export const updateAula = (id, data) => api.put(`/aula/${id}`, data);
export const deleteAula = (id) => api.delete(`/aula/${id}`);

// Usuarios (ejemplo para login y registro)
export const login = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);
export const getUser = () => api.get('/user');

// Asistencia
export const getAsistencias = () => api.get('/asistencias');
export const createAsistencia = (data) => api.post('/asistencias', data);
export const updateAsistencia = (id, data) => api.put(`/asistencias/${id}`, data);
export const deleteAsistencia = (id) => api.delete(`/asistencias/${id}`);
