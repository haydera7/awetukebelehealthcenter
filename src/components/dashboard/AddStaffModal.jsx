import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function AddStaffModal() {
  const { closeAddStaffModal, addStaff } = useData();
  const [formData, setFormData] = useState({
    name: '',
    role: 'Doctor',
    department: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addStaff(formData);
    closeAddStaffModal();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={closeAddStaffModal}>
      <div className="modal-content animate-scale-up" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="heading-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} className="text-primary" />
            Register New Staff
          </h3>
          <button className="modal-close" onClick={closeAddStaffModal}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                placeholder="e.g. Dr. John Smith"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select 
                className="form-control form-select"
                required
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="Doctor">Doctor</option>
                <option value="Receptionist">Receptionist</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Cardiology"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-control" 
                required
                placeholder="+1 234-567-8900"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                required
                placeholder="john.smith@hospital.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--color-gray-200)' }}>
            <button type="button" className="btn btn-outline" onClick={closeAddStaffModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Register Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
