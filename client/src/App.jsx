import { Navigate, NavLink, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Records from './pages/Records';

function Protected() {
  const { user, loading } = useAuth();
  if (loading) return <div className="center">Loading TeleMed…</div>;
  return user ? <Layout /> : <Navigate to="/login" replace />;
}
function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <div className="shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">+</span> TeleMed</div><div className="profile">{user.name} <span className="role">{user.role}</span><button className="link-button" onClick={() => { logout(); navigate('/login'); }}>Sign out</button></div></header>
    <div className="body"><aside><nav><NavLink to="/">Overview</NavLink><NavLink to="/patients">Patients</NavLink><NavLink to="/appointments">Appointments</NavLink><NavLink to="/records">Medical records</NavLink></nav></aside><main><Outlet /></main></div>
  </div>;
}
export default function App() {
  return <Routes><Route path="/login" element={<Login />} /><Route element={<Protected />}><Route path="/" element={<Dashboard />} /><Route path="/patients" element={<Patients />} /><Route path="/appointments" element={<Appointments />} /><Route path="/records" element={<Records />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
