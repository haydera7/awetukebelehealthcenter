import { useState } from 'react';
import { X, User, Phone, Mail, Calendar, MapPin, Loader2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function AddPatientModal() {
  const { addPatient, closeAddPatientModal } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodGroup: 'A+'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate database saving delay
    setTimeout(() => {
      addPatient(formData);
      setIsLoading(false);
      closeAddPatientModal();
    }, 800);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={closeAddPatientModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3 className="heading-4 text-gradient">Register New Patient</h3>
          <button className="modal-close" onClick={closeAddPatientModal}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                  <input 
                    name="name"
                    type="text" 
                    className="form-control" 
                    placeholder="John Doe" 
                    style={{ paddingLeft: '40px' }}
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                  <input 
                    name="phone"
                    type="tel" 
                    className="form-control" 
                    placeholder="+1 (555) 000-0000" 
                    style={{ paddingLeft: '40px' }}
                    required 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input 
                  name="age"
                  type="number" 
                  className="form-control" 
                  placeholder="25" 
                  required 
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select 
                  name="gender"
                  className="form-control form-select" 
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select 
                  name="bloodGroup"
                  className="form-control form-select"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                <input 
                  name="email"
                  type="email" 
                  className="form-control" 
                  placeholder="john.doe@example.com" 
                  style={{ paddingLeft: '40px' }}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '16px', color: 'var(--color-gray-400)' }} />
                <textarea 
                  name="address"
                  className="form-control" 
                  placeholder="123 Medical St, Health City" 
                  style={{ paddingLeft: '40px', minHeight: '80px', paddingTop: '12px' }}
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: '24px', marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                className="btn btn-outline flex-1" 
                onClick={closeAddPatientModal}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary flex-1" 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Register Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
