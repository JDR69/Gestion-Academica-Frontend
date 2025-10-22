
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Pages/Login';
import { Register } from './Pages/Register';
import { AdminDashboard } from './Pages/AdminDashboard';
import { TeacherDashboard } from './Pages/TeacherDashboard';
import { Perfil } from './Pages/Perfil';
import { useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  
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
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
