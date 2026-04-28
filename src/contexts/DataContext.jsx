import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const INITIAL_PATIENTS = [
  { id: '1', pid: 'PT-8942', name: 'Chala Bula', age: 45, gender: 'Male', phone: '+251 934-567-8900', email: 'chala.fox@example.com', lastVisit: '2026-04-01', status: 'Active', dob: '1980-05-14', address: '4140 Parker Rd. Allentown', allergy: 'Penicillin' },
  { id: '2', pid: 'PT-8943', name: 'Tammirat Oli', age: 32, gender: 'Female', phone: '+251 934-567-8901', email: 'jane.c@example.com', lastVisit: '2026-03-28', status: 'Active', dob: '1992-08-22', address: '2972 Westheimer Rd. Santa Ana', allergy: 'None' },
];

const INITIAL_VISITS = [
  { id: 'VS-1042', patientId: '1', patientName: 'Chala Bula', doctor: 'Dr. Sarah Jenkins', type: 'Checkup', date: '2026-04-24', time: '10:00 AM', status: 'Completed', reason: 'Routine annual checkup' },
  { id: 'VS-1043', patientId: '2', patientName: 'Tammirat Oli', doctor: 'Dr. Mark Lee', type: 'Follow-up', date: '2026-04-24', time: '11:15 AM', status: 'In Session', reason: 'Diabetes management review' },
];

const INITIAL_RECORDS = [
  { id: 'REC-1', patientId: '1', visitId: 'VS-1042', type: 'Diagnosis', title: 'Essential Hypertension', date: '2026-04-24', notes: 'Blood pressure slightly elevated. Patient encouraged to reduce salt intake.', doctor: 'Dr. Sarah Jenkins' },
  { id: 'REC-2', patientId: '1', visitId: 'VS-1042', type: 'Prescription', title: 'Lisinopril 10mg', date: '2026-04-24', notes: 'Take 1 tablet daily. Refills: 2.', doctor: 'Dr. Sarah Jenkins' },
];

const INITIAL_STAFF = [
  { id: '1', empId: 'EMP-101', name: 'Dr. Bula Boru', role: 'Doctor', department: 'Cardiology', phone: '+251 9234-567-1111', email: 's.jenkins@hospital.com', status: 'Active' },
  { id: '2', empId: 'EMP-102', name: 'Dr. Abebe Alemu', role: 'Doctor', department: 'Endocrinology', phone: '+251 9234-567-2222', email: 'a.abebe@hospital.com', status: 'Active' },
  { id: '3', empId: 'EMP-103', name: 'Guta Bekele', role: 'Lab Technician', department: 'Pathology', phone: '+251 934-567-3333', email: 'b.bekle@hospital.com', status: 'Active' },
  { id: '4', empId: 'EMP-104', name: 'Abdi Dereje', role: 'Receptionist', department: 'Front Desk', phone: '+251 934-567-4444', email: 'd.dabdi@hospital.com', status: 'Active' },
];

const INITIAL_VITALS = [
  { id: 'VIT-1', patientId: '1', visitId: 'VS-1042', bp: '138/88', heartRate: '75', temp: '36.6', weight: '78', date: '2026-04-24' },
];

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('healthcare-patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [visits, setVisits] = useState(() => {
    const saved = localStorage.getItem('healthcare-visits');
    return saved ? JSON.parse(saved) : INITIAL_VISITS;
  });

  const [medicalRecords, setMedicalRecords] = useState(() => {
    const saved = localStorage.getItem('healthcare-records');
    return saved ? JSON.parse(saved) : INITIAL_RECORDS;
  });

  const [vitals, setVitals] = useState(() => {
    const saved = localStorage.getItem('healthcare-vitals');
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  });

  const [staffs, setStaffs] = useState(() => {
    const saved = localStorage.getItem('healthcare-staffs');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isAddVisitModalOpen, setIsAddVisitModalOpen] = useState(false);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedVisitId, setSelectedVisitId] = useState(null);

  useEffect(() => {
    localStorage.setItem('healthcare-patients', JSON.stringify(patients));
    localStorage.setItem('healthcare-visits', JSON.stringify(visits));
    localStorage.setItem('healthcare-records', JSON.stringify(medicalRecords));
    localStorage.setItem('healthcare-vitals', JSON.stringify(vitals));
    localStorage.setItem('healthcare-staffs', JSON.stringify(staffs));
  }, [patients, visits, medicalRecords, vitals, staffs]);

  const addPatient = (newPatient) => {
    const patientWithId = {
      ...newPatient,
      id: Math.random().toString(36).substr(2, 9),
      pid: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      lastVisit: 'New Patient',
      status: 'Active'
    };
    setPatients(prev => [patientWithId, ...prev]);
  };

  const addVisit = (visitData, vitalsData = null) => {
    const visitId = `VS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVisit = {
      ...visitData,
      id: visitId,
      status: 'Scheduled'
    };
    setVisits(prev => [newVisit, ...prev]);

    // Create vitals if provided
    if (vitalsData) {
      addVitals({
        ...vitalsData,
        visitId: visitId,
        patientId: visitData.patientId
      });
    }

    // Update patient's last visit date
    if (visitData.patientId) {
      updatePatient(visitData.patientId, { lastVisit: visitData.date });
    }
  };

  const addMedicalRecord = (recordData) => {
    const newRecord = {
      ...recordData,
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setMedicalRecords(prev => [newRecord, ...prev]);
  };

  const addVitals = (vitalsData) => {
    const newVitals = {
      ...vitalsData,
      id: `VIT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setVitals(prev => [newVitals, ...prev]);
  };

  const addStaff = (newStaff) => {
    const staffWithId = {
      ...newStaff,
      id: Math.random().toString(36).substr(2, 9),
      empId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Active'
    };
    setStaffs(prev => [staffWithId, ...prev]);
  };

  const updatePatient = (id, updatedData) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const deleteStaff = (id) => {
    setStaffs(prev => prev.filter(s => s.id !== id));
  };

  const openAddPatientModal = () => setIsAddPatientModalOpen(true);
  const closeAddPatientModal = () => setIsAddPatientModalOpen(false);

  const openAddVisitModal = (patientId = null) => {
    setSelectedPatientId(patientId);
    setIsAddVisitModalOpen(true);
  };
  const closeAddVisitModal = () => {
    setIsAddVisitModalOpen(false);
    setSelectedPatientId(null);
  };

  const openAddRecordModal = (patientId = null, visitId = null) => {
    setSelectedPatientId(patientId);
    setSelectedVisitId(visitId);
    setIsAddRecordModalOpen(true);
  };
  const closeAddRecordModal = () => {
    setIsAddRecordModalOpen(false);
    setSelectedPatientId(null);
    setSelectedVisitId(null);
  };

  const openAddStaffModal = () => setIsAddStaffModalOpen(true);
  const closeAddStaffModal = () => setIsAddStaffModalOpen(false);

  return (
    <DataContext.Provider value={{
      patients,
      visits,
      medicalRecords,
      vitals,
      staffs,
      addPatient,
      addVisit,
      addMedicalRecord,
      addVitals,
      addStaff,
      updatePatient,
      deletePatient,
      deleteStaff,
      isAddPatientModalOpen,
      openAddPatientModal,
      closeAddPatientModal,
      isAddVisitModalOpen,
      openAddVisitModal,
      closeAddVisitModal,
      isAddRecordModalOpen,
      openAddRecordModal,
      closeAddRecordModal,
      isAddStaffModalOpen,
      openAddStaffModal,
      closeAddStaffModal,
      selectedPatientId,
      selectedVisitId
    }}>
      {children}
    </DataContext.Provider>
  );
};
