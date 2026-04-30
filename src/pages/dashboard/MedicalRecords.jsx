import { useState } from 'react';
import { Search, Filter, FlaskConical, Pill, Activity, Download } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { exportMedicalRecordToPdf } from '../../utils/ExportPdf';
import './MedicalRecords.css';

export default function MedicalRecords() {
  const { medicalRecords, patients, openAddRecordModal } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Lab Request');
  const [searchQuery, setSearchQuery] = useState('');

  // Map type names to tab roles
  const tabMap = {
    'labs': 'Lab Result',
    'prescriptions': 'Prescription',
    'diagnostics': 'Diagnosis'
  };

  const currentType = tabMap[activeTab] || activeTab;

  const records = medicalRecords.filter(record => {
    // If we are looking at pending requests, hide those that already have a submitted Lab Result
    if (currentType === 'Lab Request') {
      const hasResult = medicalRecords.some(r => r.type === 'Lab Result' && r.visitId === record.visitId);
      if (hasResult) return false;
    }

    const matchesTab = record.type === currentType;
    const patientName = record.patientName || patients.find(p => p.id === record.patientId)?.name || '';
    const matchesSearch = patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="patients-page slide-in">
      <div className="overview-header">
        <div>
          <h1 className="heading-3">Medical Records</h1>
          <p style={{ color: 'var(--color-gray-500)' }}>Centralized repository for lab results, diagnostics, and prescriptions.</p>
        </div>
        {['Doctor'].includes(user?.role) && (
          <button className="btn btn-primary" onClick={() => openAddRecordModal()}>
            + New Entry
          </button>
        )}
      </div>

      <div className="tabs-container" style={{ gap: '0' }}>
        <div className="mr-tabs-list">
          <button className={`mr-tab-btn ${activeTab === 'Lab Request' ? 'active' : ''}`} style={{ borderColor: activeTab === 'Lab Request' ? 'var(--color-warning)' : '', color: activeTab === 'Lab Request' ? 'var(--color-warning)' : '' }} onClick={() => setActiveTab('Lab Request')}>
            <FlaskConical size={18} /> Pending Lab Requests
          </button>
          <button className={`mr-tab-btn ${activeTab === 'Lab Result' ? 'active' : ''}`} onClick={() => setActiveTab('Lab Result')}>
            <FlaskConical size={18} /> Lab Results
          </button>
          <button className={`mr-tab-btn ${activeTab === 'Prescription' ? 'active' : ''}`} onClick={() => setActiveTab('Prescription')}>
            <Pill size={18} /> Prescriptions
          </button>
          <button className={`mr-tab-btn ${activeTab === 'Diagnosis' ? 'active' : ''}`} onClick={() => setActiveTab('Diagnosis')}>
            <Activity size={18} /> Diagnostics
          </button>
        </div>

        <div className="panel flex-1">
          <div className="panel-header filters-header" style={{ padding: '24px' }}>
            <div className="mr-search-box " >
              <input
                type="text"
                placeholder={`Search by patient, title, or ID...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={20} color="var(--color-gray-400)" />
            </div>
            <button className="btn btn-outline" style={{ background: 'var(--color-highlight)' }}>
              <Filter size={18} /> Filter
            </button>
          </div>

          <div className="table-responsive">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Patient Name</th>
                  <th>{activeTab === 'Lab Request' ? 'Requested Test' : activeTab === 'Lab Result' ? 'Test Type' : activeTab === 'Prescription' ? 'Medication' : 'Diagnosis'}</th>
                  <th>Date</th>
                  <th>Ordering Doctor</th>
                  <th>Summary</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const patient = patients.find(p => p.id === record.patientId);
                  return (
                    <tr key={record.id} className="hover-lift" style={{ transform: 'none', boxShadow: 'none' }}>
                      <td style={{ fontWeight: 600 }}>{record.id}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{patient?.name || 'Unknown Patient'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>{patient?.pid}</div>
                      </td>
                      <td>{record.title}</td>
                      <td>{record.date}</td>
                      <td>{record.doctor}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {record.notes}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {activeTab === 'Lab Request' ? (
                           <button
                             className="btn btn-outline"
                             style={{ padding: '4px 12px', fontSize: '12px', background: 'var(--color-warning-light)', color: 'var(--color-warning-dark)', borderColor: 'var(--color-warning)' }}
                             onClick={() => openAddRecordModal(record.patientId, record.visitId)}
                           >
                             + Enter Result
                           </button>
                        ) : (
                           <button
                             className="btn btn-outline"
                             style={{ padding: '4px 12px', fontSize: '12px', background: 'blue' }}
                             onClick={() => {
                               const p = patients.find(p => String(p.id) === String(record.patientId));
                               if (!p) console.warn('PDF Export: Patient data not found for record', record.id);
                               exportMedicalRecordToPdf(record, p);
                             }}
                           >
                             <Download size={14} style={{ marginRight: '4px' }} /> PDF
                           </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      <p style={{ color: 'var(--color-gray-500)' }}>No {activeTab.toLowerCase()} records found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  );
}
