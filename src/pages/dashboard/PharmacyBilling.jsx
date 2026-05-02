import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Pill, CreditCard, AlertTriangle, CheckCircle2, Search, Plus, Package, Receipt, DollarSign, FileText, X } from 'lucide-react';
import './PatientsList.css'; // Re-use list styles

export default function PharmacyBilling() {
  const { inventory, bills, prescriptions, updateInventoryStock, addInventoryItem, addPaymentToBill, createManualInvoice, dispensePrescription, patients } = useData();
  const [activeTab, setActiveTab] = useState('prescriptions'); // 'prescriptions', 'inventory', 'billing'
  const [searchRx, setSearchRx] = useState('');
  
  // Dispense Modal State
  const [selectedRx, setSelectedRx] = useState(null);
  const [dispenseForm, setDispenseForm] = useState([]);

  // Inventory Modal States
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [newMedForm, setNewMedForm] = useState({ name: '', category: 'General', stock: 0, unitPrice: 0 });
  const [adjustStockMed, setAdjustStockMed] = useState(null);
  const [adjustStockAmount, setAdjustStockAmount] = useState('');

  // Manual Invoice State
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [manualInvoiceForm, setManualInvoiceForm] = useState({
    patientName: '',
    items: [{ medicineId: '', qty: 1 }]
  });

  // Payment Modal State
  const [selectedBillForPayment, setSelectedBillForPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({ amount: '', method: 'Cash' });

  const lowStockCount = useMemo(() => inventory.filter(m => m.stock <= 100).length, [inventory]);
  const unpaidTotal = useMemo(() => bills.filter(b => b.status !== 'Paid').reduce((acc, b) => acc + (b.total - (b.paidAmount || 0)), 0), [bills]);
  const pendingRxCount = useMemo(() => prescriptions.filter(rx => rx.status === 'PRESCRIBED').length, [prescriptions]);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(rx => {
      const patient = patients.find(p => p.id === rx.patientId);
      const patientName = patient ? patient.name.toLowerCase() : '';
      return patientName.includes(searchRx.toLowerCase()) || rx.id.toLowerCase().includes(searchRx.toLowerCase());
    });
  }, [prescriptions, searchRx, patients]);

  const handleOpenDispenseModal = (rx) => {
    setSelectedRx(rx);
    // Initialize dispense form
    const initialForm = rx.items.map(item => {
      const med = inventory.find(m => m.id === item.medicineId);
      const availableStock = med ? med.stock : 0;
      // Default to requested qty if stock is available, else max available
      const defaultQty = Math.min(item.requestedQty - item.dispensedQty, availableStock);
      
      return {
        itemId: item.itemId,
        medicineId: item.medicineId,
        requestedQty: item.requestedQty,
        previouslyDispensed: item.dispensedQty,
        dispensedQty: defaultQty,
        status: defaultQty === 0 && availableStock === 0 ? 'OUT_OF_STOCK' : 'DISPENSED',
        availableStock
      };
    });
    setDispenseForm(initialForm);
  };

  const handleDispenseQtyChange = (itemId, qty) => {
    setDispenseForm(prev => prev.map(item => {
      if (item.itemId === itemId) {
        const newQty = Math.max(0, Math.min(Number(qty) || 0, item.availableStock, item.requestedQty - item.previouslyDispensed));
        return { ...item, dispensedQty: newQty, status: newQty === 0 ? 'OUT_OF_STOCK' : 'DISPENSED' };
      }
      return item;
    }));
  };

  const handleMarkOutOfStock = (itemId) => {
    setDispenseForm(prev => prev.map(item => {
      if (item.itemId === itemId) {
         return { ...item, dispensedQty: 0, status: 'OUT_OF_STOCK' };
      }
      return item;
    }));
  };

  const handleDispenseSubmit = () => {
    if (!selectedRx) return;
    dispensePrescription(selectedRx.id, dispenseForm);
    setSelectedRx(null);
  };

  const handleAddMedicineSubmit = (e) => {
    e.preventDefault();
    addInventoryItem({
      name: newMedForm.name,
      category: newMedForm.category,
      stock: Number(newMedForm.stock),
      unitPrice: Number(newMedForm.unitPrice)
    });
    setIsAddMedOpen(false);
    setNewMedForm({ name: '', category: 'General', stock: 0, unitPrice: 0 });
  };

  const handleAdjustStockSubmit = (e) => {
    e.preventDefault();
    if (!adjustStockMed) return;
    
    // We calculate the difference since updateInventoryStock adds the amount.
    // Wait, let's just make it a relative adjustment (+ or -).
    const amount = Number(adjustStockAmount);
    if (!isNaN(amount)) {
      updateInventoryStock(adjustStockMed.id, amount);
    }
    setAdjustStockMed(null);
    setAdjustStockAmount('');
  };

  const handleCreateManualInvoice = (e) => {
    e.preventDefault();
    const validItems = manualInvoiceForm.items.filter(i => i.medicineId && i.qty > 0);
    if (validItems.length > 0) {
      createManualInvoice({
        patientName: manualInvoiceForm.patientName,
        items: validItems
      });
      setIsCreateInvoiceOpen(false);
      setManualInvoiceForm({ patientName: '', items: [{ medicineId: '', qty: 1 }] });
    }
  };

  return (
    <div className="dashboard-page animate-fade-in" style={{ padding: 'var(--spacing-6)', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* KPI Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
        <div className="glass-panel" style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
           <div style={{ padding: '16px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '16px' }}>
              <FileText size={28} className="text-primary" />
           </div>
           <div>
              <div style={{ fontSize: '14px', color: 'var(--color-gray-400)', fontWeight: '500' }}>Pending Prescriptions</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{pendingRxCount} <span style={{ fontSize: '16px', color: 'var(--color-gray-500)', fontWeight: 'normal' }}>Waiting</span></div>
           </div>
        </div>

        <div className="glass-panel" style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
           <div style={{ padding: '16px', background: 'rgba(248, 113, 113, 0.1)', borderRadius: '16px' }}>
              <AlertTriangle size={28} className="text-danger" />
           </div>
           <div>
              <div style={{ fontSize: '14px', color: 'var(--color-gray-400)', fontWeight: '500' }}>Critical Low Stock</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{lowStockCount} <span style={{ fontSize: '16px', color: 'var(--color-gray-500)', fontWeight: 'normal' }}>Items</span></div>
           </div>
        </div>

        <div className="glass-panel" style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
           <div style={{ padding: '16px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '16px' }}>
              <DollarSign size={28} className="text-warning" />
           </div>
           <div>
              <div style={{ fontSize: '14px', color: 'var(--color-gray-400)', fontWeight: '500' }}>Pending Revenue</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{unpaidTotal} <span style={{ fontSize: '16px', color: 'var(--color-gray-500)', fontWeight: 'normal' }}>ETB</span></div>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', borderBottom: '1px solid var(--glass-border)' }}>
        <button 
          className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('prescriptions')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', color: activeTab === 'prescriptions' ? 'var(--color-primary)' : 'var(--color-gray-400)', borderBottom: activeTab === 'prescriptions' ? '2px solid var(--color-primary)' : '2px solid transparent', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FileText size={18} /> Prescriptions
        </button>
        <button 
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', color: activeTab === 'inventory' ? 'var(--color-primary)' : 'var(--color-gray-400)', borderBottom: activeTab === 'inventory' ? '2px solid var(--color-primary)' : '2px solid transparent', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Package size={18} /> Inventory
        </button>
        <button 
          className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', color: activeTab === 'billing' ? 'var(--color-primary)' : 'var(--color-gray-400)', borderBottom: activeTab === 'billing' ? '2px solid var(--color-primary)' : '2px solid transparent', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Receipt size={18} /> Billing
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-8)' }}>
        
        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                   Pharmacy Queue
                </h2>
                <div className="search-bar" style={{ background: 'var(--color-highlight)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-full)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', width: '250px' }}>
                   <Search size={16} className="text-muted" />
                   <input 
                     type="text" 
                     placeholder="Search patient or RX ID..." 
                     value={searchRx}
                     onChange={(e) => setSearchRx(e.target.value)}
                     style={{ background: 'transparent', border: 'none', color: 'var(--color-white)', outline: 'none', width: '100%', fontSize: '14px' }} 
                   />
                </div>
             </div>

             <div className="table-card glass-panel hover-glow-card" style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                <div className="table-responsive">
                   <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead>
                         <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '16px' }}>Prescription</th>
                            <th style={{ padding: '16px' }}>Patient</th>
                            <th style={{ padding: '16px' }}>Date</th>
                            <th style={{ padding: '16px' }}>Items</th>
                            <th style={{ padding: '16px' }}>Status</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                         </tr>
                      </thead>
                      <tbody>
                         {filteredPrescriptions.map(rx => {
                            const patient = patients.find(p => p.id === rx.patientId);
                            return (
                               <tr key={rx.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background var(--transition-fast)' }}>
                                  <td style={{ padding: '16px' }}>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '8px', background: 'var(--color-highlight)', borderRadius: '8px' }}>
                                           <FileText size={16} className="text-primary" />
                                        </div>
                                        <div>
                                           <div style={{ fontWeight: '600', fontSize: '15px' }}>{rx.id}</div>
                                           <div style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>Visit: {rx.visitId}</div>
                                        </div>
                                     </div>
                                  </td>
                                  <td style={{ padding: '16px', fontWeight: '500' }}>{patient ? patient.name : 'Unknown'}</td>
                                  <td style={{ padding: '16px', color: 'var(--color-gray-300)', fontSize: '14px' }}>{new Date(rx.date).toLocaleDateString()}</td>
                                  <td style={{ padding: '16px', fontSize: '14px' }}>{rx.items.length} meds</td>
                                  <td style={{ padding: '16px' }}>
                                     {rx.status === 'PRESCRIBED' && <span className="badge badge-warning">Pending</span>}
                                     {rx.status === 'PARTIALLY_DISPENSED' && <span className="badge badge-primary">Partial</span>}
                                     {rx.status === 'DISPENSED' && <span className="badge badge-success">Dispensed</span>}
                                     {rx.status === 'CANCELLED' && <span className="badge badge-danger">Cancelled</span>}
                                  </td>
                                  <td style={{ padding: '16px', textAlign: 'right' }}>
                                     {(rx.status === 'PRESCRIBED' || rx.status === 'PARTIALLY_DISPENSED') && (
                                        <button 
                                          className="btn btn-primary" 
                                          style={{ padding: '6px 16px', fontSize: '13px' }}
                                          onClick={() => handleOpenDispenseModal(rx)}
                                        >
                                          Dispense
                                        </button>
                                     )}
                                     {rx.status === 'DISPENSED' && (
                                        <button className="btn" style={{ padding: '6px 16px', fontSize: '13px', background: 'var(--color-highlight)', color: 'var(--color-gray-400)', cursor: 'not-allowed' }} disabled>
                                          Completed
                                        </button>
                                     )}
                                  </td>
                               </tr>
                            );
                         })}
                         {filteredPrescriptions.length === 0 && (
                            <tr>
                               <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--color-gray-400)' }}>
                                  No prescriptions found.
                               </td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              Active Inventory
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="search-bar" style={{ background: 'var(--color-highlight)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-full)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', width: '200px' }}>
                <Search size={16} className="text-muted" />
                <input type="text" placeholder="Search meds..." style={{ background: 'transparent', border: 'none', color: 'var(--color-white)', outline: 'none', width: '100%', fontSize: '14px' }} />
              </div>
              <button 
                className="btn btn-primary" 
                onClick={() => setIsAddMedOpen(true)}
                style={{ padding: '6px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={16} /> Add Medicine
              </button>
            </div>
          </div>
          
          <div className="table-card glass-panel hover-glow-card" style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '16px' }}>Medication</th>
                    <th style={{ padding: '16px' }}>Stock</th>
                    <th style={{ padding: '16px' }}>Price</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(med => (
                    <tr key={med.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background var(--transition-fast)' }}>
                      <td style={{ padding: '16px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: 'var(--color-highlight)', borderRadius: '8px' }}>
                               <Package size={16} className="text-primary" />
                            </div>
                            <div>
                               <div style={{ fontWeight: '600', fontSize: '15px' }}>{med.name}</div>
                               <div style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>{med.category}</div>
                            </div>
                         </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '15px', fontWeight: '500' }}>{med.stock} <span className="text-muted" style={{ fontSize: '12px' }}>units</span></td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{med.unitPrice} ETB</td>
                      <td style={{ padding: '16px' }}>
                        {med.status === 'Low Stock' ? (
                           <span className="badge badge-danger"><AlertTriangle size={12}/> Low Stock</span>
                        ) : (
                           <span className="badge badge-success"><CheckCircle2 size={12}/> In Stock</span>
                        )}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button 
                          className="btn" 
                          style={{ padding: '6px 12px', fontSize: '13px', background: 'var(--color-highlight)', color: 'var(--color-white)', border: '1px solid var(--glass-border)' }}
                          onClick={() => setAdjustStockMed(med)}
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
               Recent Invoices
            </h2>
            <button 
              className="btn btn-primary" 
              style={{ padding: '6px 16px', fontSize: '13px' }}
              onClick={() => setIsCreateInvoiceOpen(true)}
            >
               <Plus size={16} /> Create Invoice
            </button>
          </div>

          <div className="table-card glass-panel hover-glow-card" style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <div className="table-responsive">
              <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '16px' }}>Invoice</th>
                    <th style={{ padding: '16px' }}>Date</th>
                    <th style={{ padding: '16px' }}>Source</th>
                    <th style={{ padding: '16px' }}>Amount</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background var(--transition-fast)' }}>
                      <td style={{ padding: '16px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '8px', background: 'var(--color-highlight)', borderRadius: '8px' }}>
                               <Receipt size={16} className="text-success" />
                            </div>
                            <div>
                               <div style={{ fontWeight: '600', fontSize: '15px' }}>{bill.patientName}</div>
                               <div style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>{bill.id}</div>
                            </div>
                         </div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--color-gray-300)', fontSize: '14px' }}>{bill.date}</td>
                      <td style={{ padding: '16px', color: 'var(--color-gray-300)', fontSize: '14px' }}>{bill.source || 'GENERAL'}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', fontSize: '15px' }}>{bill.total} ETB</div>
                        {bill.status !== 'Paid' && <div style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px' }}>Rem: {bill.total - (bill.paidAmount || 0)} ETB</div>}
                      </td>
                      <td style={{ padding: '16px' }}>
                        {bill.status === 'Unpaid' && <span className="badge badge-danger">Unpaid</span>}
                        {bill.status === 'Partial' && <span className="badge badge-warning">Partial</span>}
                        {bill.status === 'Paid' && <span className="badge badge-success">Paid</span>}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        {bill.status !== 'Paid' ? (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                            onClick={() => setSelectedBillForPayment(bill)}
                          >
                            Accept Payment
                          </button>
                        ) : (
                          <button 
                            className="btn" 
                            style={{ padding: '6px 12px', fontSize: '13px', background: 'var(--color-highlight)', color: 'var(--color-gray-400)', cursor: 'not-allowed' }}
                            disabled
                          >
                            Cleared
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}
        
      </div>

      {/* Dispense Modal */}
      {selectedRx && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '800px', maxWidth: '90%', borderRadius: 'var(--radius-2xl)', padding: 'var(--spacing-6)', background: 'var(--color-bg-base)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <div>
                 <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>Dispense Medication</h2>
                 <p style={{ color: 'var(--color-gray-400)', fontSize: '14px', marginTop: '4px' }}>RX ID: {selectedRx.id}</p>
              </div>
              <button onClick={() => setSelectedRx(null)} style={{ background: 'none', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer', padding: '8px', borderRadius: '50%', ':hover': { background: 'var(--color-highlight)' } }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: 'var(--spacing-6)' }}>
               <table className="data-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                     <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '12px' }}>Medication</th>
                        <th style={{ padding: '12px' }}>Requested</th>
                        <th style={{ padding: '12px' }}>Available</th>
                        <th style={{ padding: '12px', width: '120px' }}>Dispense</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {selectedRx.items.map((item, index) => {
                        const formItem = dispenseForm.find(df => df.itemId === item.itemId);
                        const isDispensedAlready = item.status === 'DISPENSED' || item.requestedQty === item.dispensedQty;
                        
                        return (
                           <tr key={index} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                              <td style={{ padding: '12px' }}>
                                 <div style={{ fontWeight: '500' }}>{item.name}</div>
                                 <div style={{ fontSize: '12px', color: 'var(--color-gray-400)' }}>{item.dosage}</div>
                              </td>
                              <td style={{ padding: '12px' }}>{item.requestedQty - item.dispensedQty}</td>
                              <td style={{ padding: '12px' }}>
                                 {formItem?.availableStock || 0}
                                 {(formItem?.availableStock || 0) < (item.requestedQty - item.dispensedQty) && <AlertTriangle size={12} className="text-warning" style={{ marginLeft: '4px' }}/>}
                              </td>
                              <td style={{ padding: '12px' }}>
                                 {isDispensedAlready ? (
                                    <span className="badge badge-success">Completed</span>
                                 ) : (
                                    <input 
                                       type="number" 
                                       min="0"
                                       max={Math.min(formItem?.availableStock || 0, item.requestedQty - item.dispensedQty)}
                                       value={formItem?.dispensedQty || 0}
                                       onChange={(e) => handleDispenseQtyChange(item.itemId, e.target.value)}
                                       style={{ width: '80px', padding: '6px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: 'var(--color-highlight)', color: 'white' }}
                                    />
                                 )}
                              </td>
                              <td style={{ padding: '12px', textAlign: 'right' }}>
                                 {!isDispensedAlready && (
                                    <button 
                                       className="btn"
                                       onClick={() => handleMarkOutOfStock(item.itemId)}
                                       style={{ fontSize: '12px', padding: '4px 8px', background: 'rgba(248, 113, 113, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(248, 113, 113, 0.2)' }}
                                    >
                                       Mark OOS
                                    </button>
                                 )}
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="btn" 
                onClick={() => setSelectedRx(null)} 
                style={{ padding: '10px 20px', background: 'var(--color-highlight)', color: 'var(--color-white)' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleDispenseSubmit}
                style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <CheckCircle2 size={18} /> Confirm Dispense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Medicine Modal */}
      {isAddMedOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '400px', maxWidth: '90%', borderRadius: 'var(--radius-2xl)', padding: 'var(--spacing-6)', background: 'var(--color-bg-base)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>Add New Medicine</h2>
              <button onClick={() => setIsAddMedOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer', padding: '8px' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddMedicineSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Medicine Name</label>
                  <input type="text" className="form-control" required value={newMedForm.name} onChange={e => setNewMedForm({...newMedForm, name: e.target.value})} placeholder="e.g., Aspirin 100mg" />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <input type="text" className="form-control" required value={newMedForm.category} onChange={e => setNewMedForm({...newMedForm, category: e.target.value})} placeholder="e.g., Painkiller" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Initial Stock</label>
                    <input type="number" min="0" className="form-control" required value={newMedForm.stock} onChange={e => setNewMedForm({...newMedForm, stock: e.target.value})} />
                  </div>
                  <div>
                    <label className="form-label">Unit Price (ETB)</label>
                    <input type="number" min="0" step="0.01" className="form-control" required value={newMedForm.unitPrice} onChange={e => setNewMedForm({...newMedForm, unitPrice: e.target.value})} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn" onClick={() => setIsAddMedOpen(false)} style={{ padding: '10px 20px', background: 'var(--color-highlight)', color: 'var(--color-white)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Save Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustStockMed && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '400px', maxWidth: '90%', borderRadius: 'var(--radius-2xl)', padding: 'var(--spacing-6)', background: 'var(--color-bg-base)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <div>
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>Adjust Stock</h2>
                <p style={{ color: 'var(--color-gray-400)', fontSize: '14px', marginTop: '4px' }}>{adjustStockMed.name}</p>
              </div>
              <button onClick={() => setAdjustStockMed(null)} style={{ background: 'none', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer', padding: '8px' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdjustStockSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--color-highlight)', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-gray-400)', fontSize: '14px' }}>Current Stock</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{adjustStockMed.stock}</p>
                </div>
                <div>
                  <label className="form-label">Adjustment Amount</label>
                  <input type="number" className="form-control" required value={adjustStockAmount} onChange={e => setAdjustStockAmount(e.target.value)} placeholder="e.g., +100 or -5" />
                  <p style={{ color: 'var(--color-gray-500)', fontSize: '12px', marginTop: '4px' }}>Use negative numbers to reduce stock manually.</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn" onClick={() => setAdjustStockMed(null)} style={{ padding: '10px 20px', background: 'var(--color-highlight)', color: 'var(--color-white)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Apply Adjustment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Manual Invoice Modal */}
      {isCreateInvoiceOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--radius-2xl)', padding: 'var(--spacing-6)', background: 'var(--color-bg-base)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>Create Walk-in Invoice</h2>
              <button onClick={() => setIsCreateInvoiceOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer', padding: '8px' }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateManualInvoice}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Patient Name (Optional)</label>
                  <input type="text" className="form-control" value={manualInvoiceForm.patientName} onChange={e => setManualInvoiceForm({...manualInvoiceForm, patientName: e.target.value})} placeholder="Walk-in Patient" />
                </div>
                
                <div>
                  <label className="form-label">Items to Bill</label>
                  {manualInvoiceForm.items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <select 
                          className="form-control" 
                          required 
                          value={item.medicineId} 
                          onChange={(e) => {
                            const newItems = [...manualInvoiceForm.items];
                            newItems[index].medicineId = e.target.value;
                            setManualInvoiceForm({...manualInvoiceForm, items: newItems});
                          }}
                          style={{ appearance: 'auto' }}
                        >
                          <option value="" disabled>-- Select Item --</option>
                          {inventory.map(med => (
                            <option key={med.id} value={med.id}>{med.name} ({med.unitPrice} ETB) - Stock: {med.stock}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ width: '100px' }}>
                        <input 
                          type="number" 
                          min="1" 
                          className="form-control" 
                          required 
                          value={item.qty} 
                          onChange={(e) => {
                            const newItems = [...manualInvoiceForm.items];
                            newItems[index].qty = Number(e.target.value);
                            setManualInvoiceForm({...manualInvoiceForm, items: newItems});
                          }} 
                        />
                      </div>
                      {manualInvoiceForm.items.length > 1 && (
                        <button type="button" className="btn" style={{ background: 'rgba(248, 113, 113, 0.1)', color: 'var(--color-danger)', border: 'none', padding: '0 12px' }} onClick={() => {
                          const newItems = manualInvoiceForm.items.filter((_, i) => i !== index);
                          setManualInvoiceForm({...manualInvoiceForm, items: newItems});
                        }}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline" style={{ fontSize: '13px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => {
                    setManualInvoiceForm({
                      ...manualInvoiceForm, 
                      items: [...manualInvoiceForm.items, { medicineId: '', qty: 1 }]
                    });
                  }}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn" onClick={() => setIsCreateInvoiceOpen(false)} style={{ padding: '10px 20px', background: 'var(--color-highlight)', color: 'var(--color-white)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Generate Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Accept Payment Modal */}
      {selectedBillForPayment && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content glass-panel" style={{ width: '400px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', borderRadius: 'var(--radius-2xl)', padding: 'var(--spacing-6)', background: 'var(--color-bg-base)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>Accept Payment</h2>
              <button onClick={() => setSelectedBillForPayment(null)} style={{ background: 'none', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer', padding: '8px' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ background: 'var(--color-highlight)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-gray-400)', fontSize: '13px' }}>Total Amount</span>
                <span style={{ fontWeight: '600' }}>{selectedBillForPayment.total} ETB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-gray-400)', fontSize: '13px' }}>Paid So Far</span>
                <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>{selectedBillForPayment.paidAmount || 0} ETB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '8px', marginTop: '8px' }}>
                <span style={{ color: 'var(--color-gray-300)', fontSize: '14px', fontWeight: 'bold' }}>Remaining Balance</span>
                <span style={{ fontWeight: 'bold', color: 'var(--color-danger)' }}>{selectedBillForPayment.total - (selectedBillForPayment.paidAmount || 0)} ETB</span>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const amount = Number(paymentForm.amount);
              const remaining = selectedBillForPayment.total - (selectedBillForPayment.paidAmount || 0);
              if (amount > 0 && amount <= remaining) {
                 addPaymentToBill(selectedBillForPayment.id, amount, paymentForm.method, 'System');
                 setSelectedBillForPayment(null);
                 setPaymentForm({ amount: '', method: 'Cash' });
              }
            }}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Payment Amount (ETB)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  required 
                  min="1"
                  max={selectedBillForPayment.total - (selectedBillForPayment.paidAmount || 0)}
                  value={paymentForm.amount} 
                  onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Payment Method</label>
                <select 
                  className="form-control" 
                  value={paymentForm.method} 
                  onChange={e => setPaymentForm({...paymentForm, method: e.target.value})}
                  style={{ appearance: 'auto' }}
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile Money">Mobile Money</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn" onClick={() => setSelectedBillForPayment(null)} style={{ padding: '10px 20px', background: 'var(--color-highlight)', color: 'var(--color-white)' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Log Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
