import { useState, useRef } from 'react';
import { X, FileText, Pill, Activity, Loader2, Info, UploadCloud, Plus, Trash2, HeartPulse } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export default function AddRecordModal() {
  const { addMedicalRecord, addPrescription, addVitals, inventory, closeAddRecordModal, selectedPatientId, selectedVisitId, visits, patients } = useData();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const visit = visits.find(v => v.id === selectedVisitId);

  const availableTypes = (() => {
    if (user?.role === 'Lab Technician') return ['Lab Result'];
    if (user?.role === 'Doctor') return ['Vitals', 'Diagnosis', 'Prescription', 'Lab Request'];
    return ['Vitals', 'Diagnosis', 'Prescription', 'Lab Request', 'Lab Result'];
  })();

  const defaultType = availableTypes.includes('Diagnosis') ? 'Diagnosis' : availableTypes[0];

  const [formData, setFormData] = useState({
    patientId: selectedPatientId || '',
    visitId: selectedVisitId || '',
    type: defaultType,
    title: '',
    notes: '',
    fileName: '',
    doctor: user?.role === 'Doctor' ? 'Dr. Sarah Jenkins' : user?.name || 'Dr. Admin'
  });

  const [vitalsData, setVitalsData] = useState({
    bp: '',
    heartRate: '',
    temp: '',
    weight: ''
  });

  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setVitalsData(prev => ({ ...prev, [name]: value }));
  };

  const [prescriptionItems, setPrescriptionItems] = useState([
    { medicineId: '', requestedQty: 10, dosage: '' }
  ]);

  const handleAddPrescriptionItem = () => {
    setPrescriptionItems(prev => [...prev, { medicineId: '', requestedQty: 10, dosage: '' }]);
  };

  const handleUpdatePrescriptionItem = (index, field, value) => {
    const newItems = [...prescriptionItems];
    newItems[index][field] = value;
    setPrescriptionItems(newItems);
  };

  const handleRemovePrescriptionItem = (index) => {
    if (prescriptionItems.length > 1) {
      setPrescriptionItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate database saving delay
    setTimeout(() => {
      if (formData.type === 'Prescription') {
        const validItems = prescriptionItems.filter(item => item.medicineId);

        if (validItems.length > 0) {
          const formattedItems = validItems.map(item => {
            const med = inventory.find(m => m.id === item.medicineId) || inventory[0];
            return {
              itemId: `item_${Math.random().toString(36).substr(2, 6)}`,
              medicineId: med ? med.id : 'MED-1',
              name: med ? med.name : 'Unknown Medicine',
              dosage: item.dosage,
              requestedQty: Number(item.requestedQty) || 10,
              dispensedQty: 0,
              status: 'PENDING'
            };
          });

          addPrescription({
            visitId: formData.visitId,
            patientId: formData.patientId,
            doctorId: user?.empId || 'EMP-101',
            items: formattedItems
          });

          // Save a medical record log
          const titles = formattedItems.map(i => i.name).join(', ');
          addMedicalRecord({
            ...formData,
            title: `Prescription: ${titles}`,
            notes: `Prescribed ${formattedItems.length} medication(s).`
          });
        }
      } else if (formData.type === 'Vitals') {
        addVitals({
          patientId: formData.patientId,
          visitId: formData.visitId,
          bp: vitalsData.bp,
          heartRate: vitalsData.heartRate,
          temp: vitalsData.temp,
          weight: vitalsData.weight,
          recordedBy: user?.name || 'Dr. Admin'
        });
      } else {
        addMedicalRecord(formData);
      }
      setIsLoading(false);
      closeAddRecordModal();
    }, 800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAddRecordModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h3 className="heading-4 text-gradient">Add Medical Finding</h3>
          <button className="modal-close" onClick={closeAddRecordModal}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {visit && (
            <div style={{ background: 'var(--color-primary-light)', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Info size={18} color="var(--color-primary)" />
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-dark)' }}>
                Linking to visit <strong>#{visit.id}</strong> ({visit.date})
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {!selectedPatientId && (
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ marginBottom: '12px' }}>Select Target Patient</label>
                <select
                  name="patientId"
                  className="form-control"
                  required
                  value={formData.patientId}
                  onChange={handleChange}
                  style={{
                    appearance: 'auto',
                    cursor: 'pointer'
                  }}
                >
                  <option value="" disabled>-- Choose a Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.pid})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ marginBottom: '12px' }}>Record Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${availableTypes.length}, 1fr)`, gap: '12px' }}>
                {availableTypes.map(type => {
                  const isSelected = formData.type === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type, fileName: '' }))}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '16px 8px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid var(--color-primary)' : '2px solid var(--glass-border)',
                        backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'var(--color-highlight)', // theme adapted
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-gray-400)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontWeight: isSelected ? '600' : '500',
                        fontSize: '13px',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--color-gray-500)';
                          e.currentTarget.style.backgroundColor = 'var(--color-highlight-hover)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--glass-border)';
                          e.currentTarget.style.backgroundColor = 'var(--color-highlight)';
                        }
                      }}
                    >
                      {type === 'Diagnosis' && <Activity size={24} color={isSelected ? 'var(--color-primary)' : 'var(--color-gray-400)'} />}
                      {type === 'Prescription' && <Pill size={24} color={isSelected ? 'var(--color-primary)' : 'var(--color-gray-400)'} />}
                      {type === 'Lab Request' && <FileText size={24} color={isSelected ? 'var(--color-warning)' : 'var(--color-gray-400)'} />}
                      {type === 'Lab Result' && <FileText size={24} color={isSelected ? 'var(--color-primary)' : 'var(--color-gray-400)'} />}
                      {type === 'Vitals' && <HeartPulse size={24} color={isSelected ? 'var(--color-danger)' : 'var(--color-gray-400)'} />}
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {formData.type === 'Prescription' ? (
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label className="form-label" style={{ marginBottom: '0' }}>Medications</label>

                {prescriptionItems.map((item, index) => (
                  <div key={index} style={{ background: 'var(--color-highlight)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
                    {prescriptionItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePrescriptionItem(index)}
                        style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="form-label" style={{ fontSize: '12px' }}>Select Medication</label>
                        <select
                          className="form-control"
                          required
                          value={item.medicineId}
                          onChange={(e) => handleUpdatePrescriptionItem(index, 'medicineId', e.target.value)}
                          style={{ appearance: 'auto', cursor: 'pointer' }}
                        >
                          <option value="" disabled>-- Choose Medicine --</option>
                          {inventory.map(med => (
                            <option key={med.id} value={med.id}>{med.name} ({med.stock} in stock)</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: '12px' }}>Quantity</label>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          required
                          value={item.requestedQty}
                          onChange={(e) => handleUpdatePrescriptionItem(index, 'requestedQty', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '12px' }}>Dosage Instructions</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g., 1 tablet 3x daily"
                        value={item.dosage}
                        onChange={(e) => handleUpdatePrescriptionItem(index, 'dosage', e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddPrescriptionItem}
                  className="btn btn-outline"
                  style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                >
                  <Plus size={16} /> Add Another Medicine
                </button>
              </div>
            ) : formData.type !== 'Vitals' ? (
              <>
                <div className="form-group">
                  <label className="form-label">
                    {formData.type === 'Diagnosis' ? 'Diagnosis Title' : 'Test Name'}
                  </label>
                  <input
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder={formData.type === 'Diagnosis' ? 'e.g., Hypertension' : 'e.g., CBC Results Found'}
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    {formData.type === 'Diagnosis' ? 'Clinical Notes' : 'Result Summary'}
                  </label>
                  <textarea
                    name="notes"
                    className="form-control"
                    placeholder="Enter detailed information here..."
                    style={{ minHeight: '100px', paddingTop: '12px' }}
                    required
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : null}

            {formData.type === 'Vitals' && (
              <div style={{ margin: '8px 0 24px', padding: '20px', background: 'var(--color-highlight)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--color-gray-400)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>Clinical Measurements</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Blood Pressure (mmHg)</label>
                    <input name="bp" placeholder="e.g., 120/80" className="form-control" style={{ fontSize: '13px' }} value={vitalsData.bp} onChange={handleVitalsChange} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Heart Rate (BPM)</label>
                    <input name="heartRate" type="number" placeholder="e.g., 72" className="form-control" style={{ fontSize: '13px' }} value={vitalsData.heartRate} onChange={handleVitalsChange} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Temperature (°C)</label>
                    <input name="temp" type="number" step="0.1" placeholder="e.g., 36.5" className="form-control" style={{ fontSize: '13px' }} value={vitalsData.temp} onChange={handleVitalsChange} required />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Weight (kg)</label>
                    <input name="weight" type="number" step="0.1" placeholder="e.g., 70.5" className="form-control" style={{ fontSize: '13px' }} value={vitalsData.weight} onChange={handleVitalsChange} required />
                  </div>
                </div>
              </div>
            )}

            {formData.type === 'Lab Result' && (
              <div className="form-group">
                <label className="form-label">Upload Detailed Results (Optional)</label>
                <div
                  style={{
                    border: '2px dashed var(--glass-border)',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--color-highlight)',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="hover-lift"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                  <UploadCloud size={32} color="var(--color-primary)" style={{ margin: '0 auto 12px' }} />
                  {formData.fileName ? (
                    <p style={{ fontWeight: 500, color: 'var(--color-primary-dark)' }}>{formData.fileName}</p>
                  ) : (
                    <>
                      <p style={{ fontWeight: 500, color: 'var(--color-gray-700)', marginBottom: '4px' }}>Click to upload research file</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>Supports PDF, JPG, PNG, DOC (Max 10MB)</p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="modal-footer" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-outline flex-1"
                onClick={closeAddRecordModal}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
