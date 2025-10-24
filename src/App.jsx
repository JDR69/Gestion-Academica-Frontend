
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Pages/Login';
import { Register } from './Pages/Register';
import { AdminDashboard } from './Pages/AdminDashboard';
import { TeacherDashboard } from './Pages/TeacherDashboard';
import { Perfil } from './Pages/Perfil';
import { useEffect, useState } from 'react';
import { Schedule } from './Pages/Schedule';
import { Materia } from './Pages/Materia';
import { Horarios } from './Pages/Horarios';
import { Grupos } from './Pages/Grupos';
import { Aula } from './Pages/Aula';

function App() {
  const [user, setUser] = useState(null);
  
  // Rehidratar sesión desde localStorage al cargar la app
  useEffect(() => {
    try {
      const stored = localStorage.getItem('authUser');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('No se pudo leer authUser de localStorage', e);
    }
  }, []);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              !user 
                ? <Login setUser={setUser} /> 
                : user.role === 'admin' 
                  ? <Navigate to="/admin" /> 
                  : <Navigate to="/teacher" />
            } 
          />
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/teacher" 
            element={user?.role === 'teacher' ? <TeacherDashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/register" 
            element={user?.role === 'admin' ? <Register /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/perfil" 
            element={user ? <Perfil user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/schedule" 
            element={user ? <Schedule /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/materias" 
            element={user?.role === 'admin' ? <Materia user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/horarios" 
            element={user?.role === 'admin' ? <Horarios user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/grupos" 
            element={user?.role === 'admin' ? <Grupos user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/aulas" 
            element={user?.role === 'admin' ? <Aula user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
