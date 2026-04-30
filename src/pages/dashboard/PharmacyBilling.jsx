import React, { useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Pill, CreditCard, AlertTriangle, CheckCircle2, Search, Plus, Package, Receipt, DollarSign } from 'lucide-react';
import './PatientsList.css'; // Re-use list styles

export default function PharmacyBilling() {
  const { inventory, bills, updateInventoryStock, markBillPaid } = useData();

  const lowStockCount = useMemo(() => inventory.filter(m => m.stock <= 100).length, [inventory]);
  const unpaidTotal = useMemo(() => bills.filter(b => b.status === 'Unpaid').reduce((acc, b) => acc + b.total, 0), [bills]);
  const paidTotal = useMemo(() => bills.filter(b => b.status === 'Paid').reduce((acc, b) => acc + b.total, 0), [bills]);

  return (
    <div className="dashboard-page animate-fade-in" style={{ padding: 'var(--spacing-6)', maxWidth: '1600px', margin: '0 auto' }}>
      
      {/* KPI Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-8)' }}>
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

        <div className="glass-panel" style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
           <div style={{ padding: '16px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '16px' }}>
              <CreditCard size={28} className="text-success" />
           </div>
           <div>
              <div style={{ fontSize: '14px', color: 'var(--color-gray-400)', fontWeight: '500' }}>Cleared Revenue</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{paidTotal} <span style={{ fontSize: '16px', color: 'var(--color-gray-500)', fontWeight: 'normal' }}>ETB</span></div>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 'var(--spacing-8)' }}>
        
        {/* Inventory Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Pill size={20} className="text-primary" /> Active Inventory
            </h2>
            <div className="search-bar" style={{ background: 'var(--color-highlight)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-full)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', width: '200px' }}>
              <Search size={16} className="text-muted" />
              <input type="text" placeholder="Search meds..." style={{ background: 'transparent', border: 'none', color: 'var(--color-white)', outline: 'none', width: '100%', fontSize: '14px' }} />
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
                          style={{ padding: '6px 12px', fontSize: '13px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--color-primary)', border: '1px solid rgba(56, 189, 248, 0.2)' }}
                          onClick={() => updateInventoryStock(med.id, 100)}
                        >
                          <Plus size={14} /> Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <Receipt size={20} className="text-success" /> Recent Invoices
            </h2>
            <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '13px' }}>
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
                      <td style={{ padding: '16px', fontWeight: '600', fontSize: '15px' }}>{bill.total} ETB</td>
                      <td style={{ padding: '16px' }}>
                        {bill.status === 'Unpaid' ? (
                           <span className="badge badge-warning">Unpaid</span>
                        ) : (
                           <span className="badge badge-success">Paid</span>
                        )}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        {bill.status === 'Unpaid' ? (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '6px 12px', fontSize: '13px' }}
                            onClick={() => markBillPaid(bill.id)}
                          >
                            Mark Paid
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
        
      </div>
    </div>
  );
}
