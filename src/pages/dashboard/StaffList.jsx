import { useState } from 'react';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, Eye, ShieldAlert } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import './StaffList.css';

export default function StaffList() {
  const { staffs, openAddStaffModal, deleteStaff } = useData();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard/overview" replace />;
  }

  const filteredStaffs = staffs.filter(st =>
    st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="staff-page slide-in">
      <div className="overview-header">
        <div>
          <h1 className="heading-3">Staff Directory</h1>
          <p style={{ color: 'var(--color-gray-500)' }}>Manage doctors, technicians, and other staff members.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddStaffModal}>
          <Plus size={18} /> Add New Staff
        </button>
      </div>

      <div className="panel flex-1">
        <div className="panel-header filters-header">
          <div className="search-box">
            <Search size={18} color="var(--color-gray-400)" />
            <input
              type="text"
              placeholder="Search by name, ID or role..."
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
                <th>Employee ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffs.map(st => (
                <tr key={st.id} className="hover-lift" style={{ transform: 'none', boxShadow: 'none' }}>
                  <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{st.empId}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="avatar sm" style={{ background: st.role === 'Admin' ? 'var(--color-primary-dark)' : 'var(--color-primary)' }}>
                        {st.name.split(' ').map((n, i) => i < 2 ? n[0] : '').join('')}
                      </div>
                      <span style={{ fontWeight: 500 }}>{st.name}</span>
                    </div>
                  </td>
                  <td>{st.role}</td>
                  <td>{st.department}</td>
                  <td>
                    <div style={{ fontSize: '13px' }}>{st.phone}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>{st.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${st.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {st.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="action-buttons">
                      <button className="icon-btn" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn delete" title="Delete" onClick={() => {
                        if (window.confirm('Are you sure you want to delete this staff member?')) {
                          deleteStaff(st.id);
                        }
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStaffs.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-gray-500)' }}>
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-footer">
          <span style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
            Showing {filteredStaffs.length} entries
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
