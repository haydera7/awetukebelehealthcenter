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

const INITIAL_INVENTORY = [
  { id: 'MED-1', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 450, unitPrice: 15, status: 'In Stock' },
  { id: 'MED-2', name: 'Paracetamol 500mg', category: 'Painkiller', stock: 1200, unitPrice: 5, status: 'In Stock' },
  { id: 'MED-3', name: 'Ibuprofen 400mg', category: 'Anti-inflammatory', stock: 80, unitPrice: 10, status: 'Low Stock' },
];

const INITIAL_BILLS = [
  { id: 'INV-1001', patientId: '1', patientName: 'Chala Bula', date: '2026-04-24', items: [{ desc: 'Consultation', qty: 1, cost: 200 }, { desc: 'Lisinopril 10mg', qty: 1, cost: 150 }], total: 350, status: 'Paid' },
  { id: 'INV-1002', patientId: '2', patientName: 'Tammirat Oli', date: '2026-04-24', items: [{ desc: 'Consultation', qty: 1, cost: 200 }, { desc: 'Blood Sugar Test', qty: 1, cost: 100 }], total: 300, status: 'Unpaid' }
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

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('healthcare-inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('healthcare-bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
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
    localStorage.setItem('healthcare-inventory', JSON.stringify(inventory));
    localStorage.setItem('healthcare-bills', JSON.stringify(bills));
  }, [patients, visits, medicalRecords, vitals, staffs, inventory, bills]);

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
      status: 'Waiting'
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

    // Update Visit States logically based on Doctor actions
    if (recordData.visitId) {
       if (recordData.type === 'Prescription') {
         updateVisitStatus(recordData.visitId, 'Pharmacy Queue');
       } else if (recordData.type === 'Lab Request') {
         updateVisitStatus(recordData.visitId, 'Lab Requested');
       } else if (recordData.type === 'Lab Result') {
         updateVisitStatus(recordData.visitId, 'Results Ready');
       }
    }

    // Auto-generate a Pharmacy order/bill if the doctor issues a Prescription
    if (recordData.type === 'Prescription') {
      const patient = patients.find(p => p.id === recordData.patientId);
      const newBill = {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: recordData.patientId,
        visitId: recordData.visitId,
        patientName: patient ? patient.name : 'Unknown Patient',
        date: new Date().toISOString().split('T')[0],
        items: [{ desc: recordData.title || 'Pharmacy Prescription', qty: 1, cost: 150 }],
        total: 150,
        status: 'Unpaid'
      };
      setBills(prev => [newBill, ...prev]);
    }
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

  const updateVisitStatus = (id, newStatus) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const deleteStaff = (id) => {
    setStaffs(prev => prev.filter(s => s.id !== id));
  };

  const updateInventoryStock = (id, amount) => {
    setInventory(prev => prev.map(med => {
      if(med.id === id) {
        const newStock = med.stock + amount;
        return { ...med, stock: newStock, status: newStock <= 100 ? 'Low Stock' : 'In Stock' };
      }
      return med;
    }));
  };

  const markBillPaid = (id) => {
    setBills(prev => prev.map(bill => {
      if (bill.id === id) {
        if (bill.visitId) {
          updateVisitStatus(bill.visitId, 'Completed');
        }
        return { ...bill, status: 'Paid' }
      }
      return bill;
    }));
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
      inventory,
      bills,
      addPatient,
      addVisit,
      addMedicalRecord,
      addVitals,
      addStaff,
      updatePatient,
      updateVisitStatus,
      deletePatient,
      deleteStaff,
      updateInventoryStock,
      markBillPaid,
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
