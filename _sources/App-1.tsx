import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import StudentStudio from './routes/StudentStudio';
import TeacherCockpit from './routes/TeacherCockpit';
import AdminPanel from './routes/AdminPanel';

const TopNav: React.FC = () => {
  const location = useLocation();
  const isStudent = location.pathname.startsWith('/student');

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${isStudent ? 'opacity-0 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs uppercase tracking-widest text-slate-300">
        <span className="font-semibold">EAI Studio 10.0</span>
        <div className="flex gap-4">
          <Link to="/student" className="hover:text-white">Student</Link>
          <Link to="/teacher" className="hover:text-white">Docent</Link>
          <Link to="/admin" className="hover:text-white">Admin</Link>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="/student" element={<StudentStudio />} />
        <Route path="/teacher" element={<TeacherCockpit />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
