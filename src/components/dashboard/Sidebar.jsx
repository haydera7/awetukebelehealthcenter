import { NavLink } from 'react-router-dom';
import {
  HeartPulse,
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Settings,
  LogOut,
  Zap,
  Pill,
  BarChart
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

export default function Sidebar({ isOpen }) {
  const { user, logout } = useAuth();
  const { openAddPatientModal } = useData();
  const role = user?.role || 'Doctor';

  const allNavItems = [
    { name: 'Overview', path: '/dashboard/overview', icon: <LayoutDashboard size={20} />, roles: ['Admin', 'Doctor', 'Receptionist', 'Lab Technician', 'Pharmacist'] },
    { name: 'Patients', path: '/dashboard/patients', icon: <Users size={20} />, roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist'] },
    { name: 'Staff', path: '/dashboard/staff', icon: <Users size={20} />, roles: ['Admin'] },
    { name: 'Visits', path: '/dashboard/visits', icon: <CalendarDays size={20} />, roles: ['Admin', 'Doctor', 'Receptionist'] },
    { name: 'Medical Records', path: '/dashboard/records', icon: <FileText size={20} />, roles: ['Admin', 'Doctor', 'Lab Technician', 'Pharmacist'] },
    { name: 'Pharmacy & Billing', path: '/dashboard/pharmacy', icon: <Pill size={20} />, roles: ['Admin', 'Receptionist', 'Pharmacist'] },
    { name: 'Analytics', path: '/dashboard/analytics', icon: <BarChart size={20} />, roles: ['Admin', 'Doctor'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  const canAddPatient = ['Receptionist'].includes(role);

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <HeartPulse size={28} className="logo-icon" />
        <span className="sidebar-logo-text">HealthCare Pro</span>
      </div>

      {canAddPatient && (
        <div className="sidebar-action-box">
          <button
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center' }}
            onClick={openAddPatientModal}
          >
            <Zap size={16} /> <span style={{ marginLeft: '4px' }}>Add Patient</span>
          </button>
        </div>
      )}

      <div className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span className="sidebar-item-text">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavLink to="/dashboard/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span className="sidebar-item-text">Settings</span>
          </NavLink>
          <button onClick={logout} className="sidebar-item" style={{ color: 'var(--color-danger)', border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span className="sidebar-item-text">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
