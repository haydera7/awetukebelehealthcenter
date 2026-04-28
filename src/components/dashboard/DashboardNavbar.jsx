import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

export default function DashboardNavbar({ onMenuToggle }) {
  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <div className="search-bar" style={{ display: 'none' }}>
           {/* Can show conditionally on desktop */}
        </div>
        <div className="search-bar" style={{ display: 'flex' }}>
          <Search size={18} color="var(--color-gray-500)" />
          <input type="text" className="search-input" placeholder="Search patients, doctors, or records..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="header-icon-btn">
          <Bell size={18} />
          <span className="notification-badge"></span>
        </button>

        <div className="user-profile">
          <div className="avatar">DR</div>
          <div className="user-info">
            <span className="user-name">Dr. Sarah Jenkins</span>
            <span className="user-role">Cardiologist</span>
          </div>
          <ChevronDown size={16} color="var(--color-gray-500)" />
        </div>
      </div>
    </header>
  );
}
