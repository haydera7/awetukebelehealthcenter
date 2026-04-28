import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Bell, Shield, Moon, Monitor, Sun, Loader } from 'lucide-react';
import './Settings.css';

export default function Settings() {
  const { user } = useAuth();
  const { theme, changeTheme } = useTheme();

  return (
    <div className="dashboard-page animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1 className="text-gradient heading-2">Platform Settings</h1>
          <p style={{ color: 'var(--color-gray-400)', marginTop: 'var(--spacing-2)' }}>Manage your workspace and profile preferences</p>
        </div>
      </header>

      <div className="settings-container">
        {/* Sidebar Navigation */}
        <div className="glass-panel settings-sidebar">
          <button className="settings-tab active">
            <User size={18} />
            <span>Profile Identity</span>
          </button>
          <button className="settings-tab">
            <Bell size={18} />
            <span>Notifications</span>
          </button>
          <button className="settings-tab">
            <Shield size={18} />
            <span>Security Limits</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="settings-content">
          <div className="glass-panel settings-section">
            <div className="section-title">
              <h3 className="text-gradient">Profile Information</h3>
              <p>Update your account's profile information and email address.</p>
            </div>
            
            <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" className="form-control" defaultValue={user?.name || ''} />
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-control" defaultValue={user?.email || 'doctor@healthcare.pro'} />
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Role</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <input type="text" className="form-control" defaultValue={user?.role || 'Doctor'} disabled style={{ flex: 1 }} />
                  <span className="badge badge-success">Verified</span>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save Config</button>
                <button type="button" className="btn btn-secondary">Discard Changes</button>
              </div>
            </form>
          </div>

          <div className="glass-panel settings-section glow-on-hover">
            <div className="section-title">
              <h3 className="text-gradient">Interface Appearance</h3>
              <p>Customize the look and feel of your medical workspace.</p>
            </div>
            
            <div className="theme-options">
              <button 
                className={`theme-card ${theme === 'light' ? 'active-theme' : ''}`}
                onClick={() => changeTheme('light')}
              >
                <div className="theme-icon-wrapper ui-light"><Sun size={24} /></div>
                <span>Light</span>
              </button>
              <button 
                className={`theme-card ${theme === 'dark' ? 'active-theme' : ''}`}
                onClick={() => changeTheme('dark')}
              >
                <div className="theme-icon-wrapper ui-dark"><Moon size={24} /></div>
                <span>Dark & Neon</span>
              </button>
              <button 
                className={`theme-card ${theme === 'system' ? 'active-theme' : ''}`}
                onClick={() => changeTheme('system')}
              >
                <div className="theme-icon-wrapper ui-system"><Monitor size={24} /></div>
                <span>System Sync</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
