import { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import './PatientsList.css';

export default function PatientsList() {
  const navigate = useNavigate();
  const { patients, openAddPatientModal, deletePatient } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const filteredPatients = patients.filter(pt =>
    pt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pt.pid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pt.phone.includes(searchQuery)
  );

  return (
    <div className="patients-page slide-in">
      <div className="overview-header">
        <div>
          <h1 className="heading-3">Patients Directory</h1>
          <p style={{ color: 'var(--color-gray-500)' }}>Manage and view all registered patients.</p>
        </div>
        {['Receptionist'].includes(user?.role) && <button className="btn btn-primary" onClick={openAddPatientModal}>
          <Plus size={18} /> Add New Patient
        </button>}
      </div>

      <div className="panel flex-1">
        <div className="panel-header filters-header">
          <div className="search-box">
            <Search size={18} color="var(--color-gray-400)" />
            <input className='search-input'
              type="text"
              placeholder="Search by name, ID or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-outline" style={{ background: 'var(--color-highlight)' }}>
            <Filter size={18} /> Filter
          </button>
        </div>

        <div className="table-responsive">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Contact Number</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(pt => (
                <tr key={pt.id} className="hover-lift" style={{ transform: 'none', boxShadow: 'none' }}>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{pt.pid}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar sm">{pt.name.split(' ').map(n => n[0]).join('')}</div>
                      <span style={{ fontWeight: 500 }}>{pt.name}</span>
                    </div>
                  </td>
                  <td>{pt.age} yrs, {pt.gender}</td>
                  <td>{pt.phone}</td>
                  <td>{pt.lastVisit}</td>
                  <td>
                    <span className={`badge ${pt.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {pt.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="action-buttons">
                      <button className="icon-btn" title="View Details" onClick={() => navigate(`/dashboard/patient/${pt.id}`)}>
                        <Eye size={16} />
                      </button>
                      {['Receptionist', 'Admin'].includes(user?.role) && <button className="icon-btn" title="Edit">
                        <Edit2 size={16} />
                      </button>}
                      {['Receptionist', 'Admin'].includes(user?.role) && <button className="icon-btn delete" title="Delete" onClick={() => {
                        if (window.confirm('Are you sure you want to delete this patient?')) {
                          deletePatient(pt.id);
                        }
                      }}>
                        <Trash2 size={16} />
                      </button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)' }}>
                    No patients found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-footer">
          <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
            Showing {filteredPatients.length} entries
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary" style={{ padding: '4px 12px' }} disabled>Previous</button>
            <button className="btn btn-secondary" style={{ padding: '4px 12px' }} disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
