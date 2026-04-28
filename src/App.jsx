import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/dashboard/Overview';
import PatientsList from './pages/dashboard/PatientsList';
import PatientDetails from './pages/dashboard/PatientDetails';
import VisitsList from './pages/dashboard/VisitsList';
import MedicalRecords from './pages/dashboard/MedicalRecords';
import StaffList from './pages/dashboard/StaffList';
import Settings from './pages/dashboard/Settings';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/overview" replace />} />
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="patients" element={<PatientsList />} />
              <Route path="patient/:id" element={<PatientDetails />} />
              <Route path="visits" element={<VisitsList />} />
              <Route path="records" element={<MedicalRecords />} />
              <Route path="staff" element={<StaffList />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
