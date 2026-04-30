import { useState } from 'react';
import { Search, Filter, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import './VisitsList.css';

export default function VisitsList() {
  const navigate = useNavigate();
  const { visits, openAddVisitModal } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth()
  const filteredVisits = visits.filter(visit =>
    visit.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    visit.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="patients-page slide-in">
      <div className="overview-header">
        <div>
          <h1 className="heading-3">Visits & Appointments</h1>
          <p style={{ color: 'var(--color-gray-500)' }}>Track ongoing sessions, scheduled visits, and history.</p>
        </div>
        {['Receptionist'].includes(user?.role) && <button className="btn btn-primary" onClick={() => openAddVisitModal()}>
          <Plus size={18} /> Schedule Visit
        </button>}
      </div>

      <div className="panel flex-1">
        <div className="vl-header-filters">
          <div className="vl-search-box ">
            <input
              className="search-input"
              type="text"
              placeholder="Search visits by patient, ID or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} color="var(--color-gray-400)" />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline" style={{ background: 'var(--color-highlight)' }}>
              <CalendarIcon size={18} /> Today
            </button>
            <button className="btn btn-outline" style={{ background: 'var(--color-highlight)' }}>
              <Filter size={18} /> Filter
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Visit ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Visit Type</th>
                <th>Date / Time</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.map((visit) => (
                <tr key={visit.id} className="hover-lift" style={{ transform: 'none', boxShadow: 'none' }}>
                  <td style={{ fontWeight: 600 }}>{visit.id}</td>
                  <td><div style={{ fontWeight: 500 }}>{visit.patientName}</div></td>
                  <td>{visit.doctor}</td>
                  <td>{visit.type}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} color="var(--color-gray-500)" />
                      {visit.date} at {visit.time}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${visit.status === 'Completed' ? 'badge-success' :
                      visit.status === 'Waiting' || visit.status === 'Scheduled' ? 'badge-warning' :
                      visit.status === 'Pharmacy Queue' || visit.status === 'Lab Requested' ? 'badge-danger' : 'badge-primary'
                      }`}>
                      {visit.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-outline"
                      style={{ padding: '4px 12px', fontSize: '12px', background: 'blue' }}
                      onClick={() => navigate(`/dashboard/patient/${visit.patientId}`)}
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {filteredVisits.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)' }}>
                    No visits found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
