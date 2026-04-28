import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('Doctor');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth delay
    setTimeout(() => {
      login(role);
      setIsLoading(false);
      onClose();
      navigate('/dashboard/overview');
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="heading-4 text-gradient">Welcome back</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleLogin}>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="doctor@hospital.com" 
                required 
                defaultValue="doctor@hospital.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                required 
                defaultValue="password123"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Select Role</label>
              <select className="form-control form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Doctor</option>
                <option>Admin</option>
                <option>Receptionist</option>
                <option>Lab Technician</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
              <a href="#" style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full" 
              disabled={isLoading}
              style={{ height: '48px' }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In to HealthCare Pro'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
