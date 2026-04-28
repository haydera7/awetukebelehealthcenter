import { Users, Activity, FlaskConical, Filter, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Overview.css';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { exportMedicalRecordToPdf } from '../../utils/ExportPdf';

export default function Overview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients, visits, medicalRecords, openAddPatientModal } = useData();
  const role = user?.role || 'Doctor';

  // --- Chart Data Logic ---
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => ({
    name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    visits: visits.filter(v => v.date === date).length,
    records: medicalRecords.filter(r => r.date === date).length
  }));

  const pendingLabs = medicalRecords.filter(r => r.type === 'Lab Result' && r.notes.toLowerCase().includes('pending')).length;

  const stats = [
    { title: 'Total Patients', value: patients.length.toLocaleString(), change: '+2', icon: <Users size={24} />, color: 'primary' },
    { title: 'Total Visits', value: visits.length.toLocaleString(), change: '+5%', icon: <Activity size={24} />, color: 'purple' },
    { title: 'Pending Labs', value: pendingLabs.toLocaleString(), change: '0', icon: <FlaskConical size={24} />, color: 'warning' },
    { title: 'Clinical Records', value: medicalRecords.length.toLocaleString(), change: `+${medicalRecords.length}`, icon: <Filter size={24} />, color: 'success' },
  ];

  const recentPatients = patients.slice(0, 5);
  const canAddPatient = ['Receptionist'].includes(role);

  return (
    <div className="overview-page slide-in">
      <div className="overview-header">
        <div>
          <h1 className="heading-3">Dashboard</h1>
          <p style={{ color: 'var(--color-gray-500)' }}>
            Hospital Overview & Clinical Analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline" style={{ background: 'var(--color-highlight)' }}>Download Statistics</button>
          {canAddPatient && (
            <button className="btn btn-primary" onClick={openAddPatientModal}>+ Register Patient</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {stats.map((stat, i) => (
            <div key={i} className="dashboard-stat-card" style={{ marginBottom: 0 }}>
              <div className={`stat-icon-wrapper ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <span className="stat-title">{stat.title}</span>
                <div className="stat-value-row">
                  <span className="stat-number">{stat.value}</span>
                  <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <h3 className="heading-4" style={{ fontSize: 'var(--font-size-base)' }}>Activity Trends (Last 7 Days)</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-primary)' }}></div> Visits</span>
              <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-purple)' }}></div> Records</span>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: '200px', width: '100%', marginTop: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRecords" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-purple)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--color-purple)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-gray-100)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--color-gray-400)' }}
                />
                <YAxis
                  hide
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--glass-bg)' }}
                  labelStyle={{ fontWeight: 600, color: 'var(--color-white)' }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="var(--color-primary)"
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="records"
                  stroke="var(--color-purple)"
                  fillOpacity={1}
                  fill="url(#colorRecords)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overview-panels">

        {/* Recent Patients */}
        <div className="panel flex-2">
          <div className="panel-header">
            <h3 className="heading-4" style={{ fontSize: 'var(--font-size-lg)' }}>Recent Patients</h3>
            <button
              className="btn btn-link"
              style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: 'var(--font-size-sm)', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => navigate('/dashboard/patients')}
            >
              View All
            </button>
          </div>

          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Primary Condition</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((pt) => (
                  <tr key={pt.id} className="hover-lift" style={{ transform: 'none', boxShadow: 'none' }} onClick={() => navigate(`/dashboard/patient/${pt.id}`)}>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{pt.pid}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="avatar sm">{pt.name.split(' ').map(n => n[0]).join('')}</div>
                        <span style={{ fontWeight: 500 }}>{pt.name}</span>
                      </div>
                    </td>
                    <td>{pt.age} yrs, {pt.gender}</td>
                    <td>
                      <span className="badge badge-primary" style={{ background: 'var(--color-gray-100)', color: 'var(--color-gray-700)' }}>
                        {pt.lastVisit}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${pt.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {pt.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentPatients.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: 'var(--color-gray-500)' }}>
                      No patients registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="panel flex-1">
          <div className="panel-header">
            <h3 className="heading-4" style={{ fontSize: 'var(--font-size-lg)' }}>Recent Activity</h3>
          </div>

          <div className="activity-feed">
            {medicalRecords.slice(0, 4).map((record, i) => {
              const patient = patients.find(p => p.id === record.patientId);
              return (
                <div key={i} className="activity-item" style={{ position: 'relative' }}>
                  <div className="activity-dot"></div>
                  <div className="activity-content">
                    <p className="activity-text">
                      New <strong>{record.type}</strong> recorded for {patient?.name || 'a patient'}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span className="activity-time">{record.date}</span>
                      {['Prescription', 'Lab Result'].includes(record.type) && (
                        <button
                          className="btn btn-link"
                          style={{ padding: 0, fontSize: '10px', color: 'var(--color-primary)', background: 'none' }}
                          onClick={() => exportMedicalRecordToPdf(record, patient)}
                        >
                          Download PDF
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {medicalRecords.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-gray-500)', fontSize: '13px' }}>
                No recent activity to show.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
