import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Calendar, MapPin, Pill, Activity, Stethoscope, Download, Heart, Thermometer, Weight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { exportMedicalRecordToPdf } from '../../utils/ExportPdf';
import './PatientDetails.css';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patients, visits, medicalRecords, vitals, openAddVisitModal, openAddRecordModal } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('visits');

  const patient = patients.find(p => p.id === id);
  const patientVisits = visits.filter(v => v.patientId === id);
  const patientRecords = medicalRecords.filter(r => r.patientId === id);
  const latestVitals = vitals.filter(v => v.patientId === id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const canAddVisit = ['Receptionist'].includes(user?.role);
  const canAddRecord = ['Lab technician', 'Doctor'].includes(user?.role);

  if (!patient) {
    return (
      <div className="patient-details-page slide-in" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 className="heading-2">Patient Not Found</h2>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: '24px' }}>The patient you are looking for does not exist or has been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard/patients')}>
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="patient-details-page slide-in">
      <div className="overview-header" style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="icon-btn" onClick={() => navigate('/dashboard/patients')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="heading-3">Patient Profile</h1>
            <p style={{ color: 'var(--color-gray-500)' }}>{patient.pid} • {patient.status} Patient</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {canAddRecord && (
            <button className="btn btn-secondary" onClick={() => openAddRecordModal(patient.id)}>
              + Add Record
            </button>
          )}
          {canAddVisit && (
            <button className="btn btn-primary" style={{ boxShadow: 'var(--shadow-glow)' }} onClick={() => openAddVisitModal(patient.id)}>
              + Add Visit
            </button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-large" style={{ color: 'var(--color-avatar)' }} > {patient.name.split(' ').map(n => n[0]).join('')}</div>
        <div className="profile-info">
          <h2 className="heading-2" style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '4px' }}>{patient.name}</h2>
          <div className="profile-tags">
            <span className={`badge ${patient.status === 'Active' ? 'badge-success' : 'badge-danger'}`} style={{ border: 'transparent' }}>{patient.status} Patient</span>
            <span className="badge" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', border: 'transparent' }}>{patient.gender}, {patient.age} yrs</span>
            {patient.allergy && patient.allergy !== 'None' && (
              <span className="badge" style={{ background: '#fef2f2', color: '#ef4444', border: 'transparent' }}>
                Allergy: {patient.allergy}
              </span>
            )}
          </div>

          <div className="profile-contacts">
            <div className="contact-item"><Phone size={14} /> {patient.phone}</div>
            <div className="contact-item"><Mail size={14} /> {patient.email}</div>
            <div className="contact-item"><Calendar size={14} /> DOB: {patient.dob}</div>
            <div className="contact-item"><MapPin size={14} /> {patient.address}</div>
          </div>

          {latestVitals && (
            <div className="vitals-header-strip">
              <div className="vital-mini-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 600, fontSize: '13px' }}>
                  <div className="vital-icon-wrap" style={{ background: '#fef2f2' }}><Heart size={16} /></div>
                  Blood Pressure
                </div>
                <div><span className="vital-val">{latestVitals.bp}</span> <span className="vital-unit">mmHg</span></div>
              </div>

              <div className="vital-mini-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', fontWeight: 600, fontSize: '13px' }}>
                  <div className="vital-icon-wrap" style={{ background: '#f5f3ff' }}><Activity size={16} /></div>
                  Heart Rate
                </div>
                <div><span className="vital-val">{latestVitals.heartRate}</span> <span className="vital-unit">bpm</span></div>
              </div>

              <div className="vital-mini-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 600, fontSize: '13px' }}>
                  <div className="vital-icon-wrap" style={{ background: '#fffbeb' }}><Thermometer size={16} /></div>
                  Temperature
                </div>
                <div><span className="vital-val">{latestVitals.temp}</span> <span className="vital-unit">°C</span></div>
              </div>

              <div className="vital-mini-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600, fontSize: '13px' }}>
                  <div className="vital-icon-wrap" style={{ background: '#ecfdf5' }}><Weight size={16} /></div>
                  Weight
                </div>
                <div><span className="vital-val">{latestVitals.weight}</span> <span className="vital-unit">kg</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs System */}
      <div className="tabs-container">
        <div className="tabs-list">
          <button className={`tab-btn ${activeTab === 'visits' ? 'active' : ''}`} onClick={() => setActiveTab('visits')}>
            Visits
          </button>
          <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            Medical History
          </button>
          <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            Reports & Prescriptions
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'visits' && (
            <div className="visits-tab animate-fade-in">
              <div className="timeline">
                {patientVisits.map((visit, i) => (
                  <div key={visit.id} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-card panel hover-lift" style={{ transform: 'none', boxShadow: 'var(--shadow-sm)', background: 'var(--glass-bg, rgba(255, 255, 255, 0.7))' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div className="timeline-date ">{visit.date}</div>
                          <h4 className="heading-4" style={{ fontSize: 'var(--font-size-base)', marginBottom: '8px', color: 'green' }}>{visit.type}: {visit.reason}</h4>
                        </div>
                        {canAddRecord && (
                          <button className="btn btn-outline" style={{ fontSize: '18px', padding: '4px 8px', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark' }} onClick={() => openAddRecordModal(patient.id, visit.id)}>
                            + Add Finding
                          </button>
                        )}
                      </div>

                      <div className="timeline-footer" style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)' }}>
                          <Stethoscope size={16} /> Attending: {visit.doctor}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {patientVisits.length === 0 && (
                  <p style={{ color: 'var(--color-gray-500)', textAlign: 'center', padding: '40px' }}>No visit record found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-tab animate-fade-in" style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>

              <div className="panel">
                <div className="panel-header" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', padding: '12px 20px' }}>
                  <h3 className="heading-4" style={{ fontSize: 'var(--font-size-base)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pill size={18} /> Active Prescriptions
                  </h3>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {patientRecords.filter(r => r.type === 'Prescription').map(presc => (
                    <div key={presc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--color-highlight)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <div>
                        <h4 style={{ fontWeight: 600, color: 'var(--text-color)' }}>{presc.title}</h4>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{presc.notes}</p>
                        <p style={{ fontSize: '11px', color: 'var(--color-gray-400)', marginTop: '4px' }}>Prescribed by {presc.doctor} on {presc.date}</p>
                      </div>
                      <button className="btn btn-outline" style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => exportMedicalRecordToPdf(presc, patient)}>
                        <Download size={14} /> PDF
                      </button>
                    </div>
                  ))}
                  {patientRecords.filter(r => r.type === 'Prescription').length === 0 && (
                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>No active prescriptions.</p>
                  )}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header" style={{ background: '#fef3c7', color: '#b45309', padding: '12px 20px' }}>
                  <h3 className="heading-4" style={{ fontSize: 'var(--font-size-base)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} /> Recent Lab Results
                  </h3>
                </div>
                <div style={{ padding: '20px' }}>
                  {patientRecords.filter(r => r.type === 'Lab Result').map(lab => (
                    <div key={lab.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                      <div>
                        <h4 style={{ fontWeight: 500, color: 'var(--text-color)' }}>{lab.title}</h4>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{lab.date} - Result: {lab.notes}</p>
                      </div>
                      <button className="btn btn-outline" style={{ fontSize: '12px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => exportMedicalRecordToPdf(lab, patient)}>
                        <Download size={14} /> PDF
                      </button>
                    </div>
                  ))}
                  {patientRecords.filter(r => r.type === 'Lab Result').length === 0 && (
                    <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', padding: '10px' }}>No lab results available.</p>
                  )}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-tab animate-fade-in panel" style={{ padding: '24px' }}>
              <h3 className="heading-4" style={{ marginBottom: '16px' }}>Diagnosis History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {patientRecords.filter(r => r.type === 'Diagnosis').map(diag => (
                  <div key={diag.id} style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>{diag.date}</div>
                    <h4 style={{ fontWeight: 600, margin: '4px 0', color: 'var(--text-color)' }}>{diag.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{diag.notes}</p>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-500)', marginTop: '4px' }}>Diagnosed by {diag.doctor}</div>
                  </div>
                ))}
                {patientRecords.filter(r => r.type === 'Diagnosis').length === 0 && (
                  <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>No diagnosis history found.</p>
                )}
              </div>
              <hr style={{ border: 0, borderTop: '1px solid var(--glass-border)', margin: '24px 0' }} />
              <h3 className="heading-4" style={{ marginBottom: '16px' }}>Notes & Allergies</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Known Allergies: <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>{patient.allergy || 'None'}</span>
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginTop: '8px' }}>
                Address: {patient.address}
              </p>
            </div>
          )}

        </div>
      </div>

    </div >
  );
}
