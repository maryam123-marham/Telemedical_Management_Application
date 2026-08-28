import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import PageHeader from '../components/PageHeader';
export default function Dashboard() {
  const [patients, setPatients] = useState([]); const [appointments, setAppointments] = useState([]); const [error, setError] = useState('');
  useEffect(() => { Promise.all([api('/patients'), api('/appointments')]).then(([p, a]) => { setPatients(p); setAppointments(a); }).catch(e => setError(e.message)); }, []);
  return <><PageHeader title="Overview" description="Your care workspace at a glance." action={<Link className="primary" to="/appointments">Schedule visit</Link>} />{error && <div className="error">{error}</div>}<div className="stats"><div className="stat"><span>Active patients</span><strong>{patients.length}</strong><small>Manage your patient panel</small></div><div className="stat"><span>Upcoming appointments</span><strong>{appointments.filter(a => a.status === 'scheduled').length}</strong><small>Across all clinicians</small></div><div className="stat"><span>Completed visits</span><strong>{appointments.filter(a => a.status === 'completed').length}</strong><small>Keep records up to date</small></div></div><div className="card"><div className="card-title"><h2>Next appointments</h2><Link to="/appointments">View all</Link></div>{appointments.slice(0, 5).map(a => <div className="list-row" key={a._id}><div className="avatar">{(a.patient?.name || '?')[0]}</div><div><b>{a.patient?.name || 'Unknown patient'}</b><span>{a.clinician} · {a.type}</span></div><time>{new Date(a.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time></div>)}{!appointments.length && <p className="empty">No appointments yet.</p>}</div></>;
}
