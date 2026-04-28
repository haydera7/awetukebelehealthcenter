import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import AddPatientModal from '../components/dashboard/AddPatientModal';
import AddVisitModal from '../components/dashboard/AddVisitModal';
import AddRecordModal from '../components/dashboard/AddRecordModal';
import AddStaffModal from '../components/dashboard/AddStaffModal';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isAddPatientModalOpen, isAddVisitModalOpen, isAddRecordModalOpen, isAddStaffModalOpen } = useData();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className={`dashboard-main ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <DashboardNavbar onMenuToggle={toggleSidebar} />
        
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>

      {isAddPatientModalOpen && <AddPatientModal />}
      {isAddVisitModalOpen && <AddVisitModal />}
      {isAddRecordModalOpen && <AddRecordModal />}
      {isAddStaffModalOpen && <AddStaffModal />}
    </div>
  );
}
