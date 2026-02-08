import React from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import StudentStudio from './routes/StudentStudio';
import TeacherCockpit from './routes/TeacherCockpit';
import AdminPanel from './routes/AdminPanel';
import LandingPage from './routes/LandingPage';

const TopNav: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  // Hide generic nav on landing page to keep it clean
  if (isLanding) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs uppercase tracking-widest text-slate-300 backdrop-blur-sm">
        <Link to="/" className="font-semibold hover:text-white transition-colors">EAI Studio 10.0</Link>
        <div className="flex gap-4">
          <Link to="/student" className={`hover:text-white transition-colors ${location.pathname.startsWith('/student') ? 'text-teal-400' : ''}`}>Student</Link>
          <Link to="/teacher" className={`hover:text-white transition-colors ${location.pathname.startsWith('/teacher') ? 'text-teal-400' : ''}`}>Docent</Link>
          <Link to="/admin" className={`hover:text-white transition-colors ${location.pathname.startsWith('/admin') ? 'text-teal-400' : ''}`}>Admin</Link>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student" element={<StudentStudio />} />
        <Route path="/teacher" element={<TeacherCockpit />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </HashRouter>
  );
};

export default App;