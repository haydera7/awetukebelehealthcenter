import { Check, Minus } from 'lucide-react';

export default function Comparison() {
  const comparisonData = [
    { feature: "Simulated Data Engine", us: true, others: false },
    { feature: "End-to-end Encryption", us: true, others: true },
    { feature: "Real-time Lab Feed", us: true, others: false },
    { feature: "No Delay Executions", us: true, others: false },
    { feature: "Biometric Login Sync", us: true, others: true },
  ];

  return (
    <section id="comparison" className="features-section">
      <div className="container">
        
        <div className="section-header">
          <h2 className="heading-2 section-title">How does <span className="text-gradient">HealthCare Pro</span> compare?</h2>
          <p className="section-subtitle">
            Industry leading infrastructure that outperforms standard EMS providers.
          </p>
        </div>

        <div className="comparison-grid">
          
          {/* Legacy Card */}
          <div className="comp-card">
            <h3>Legacy Systems</h3>
            <div className="comp-list">
              {comparisonData.map((item, i) => (
                <div key={i} className="comp-item">
                  {item.others ? <Check size={16} className="comp-icon-yes"/> : <Minus size={16} className="comp-icon-no"/>}
                  <span>{item.feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlighted Card */}
          <div className="comp-card highlight">
            <h3>HealthCare Pro</h3>
            <div className="comp-list">
              {comparisonData.map((item, i) => (
                <div key={i} className="comp-item">
                  <Check size={18} className="comp-icon-yes" style={{ color: 'var(--color-primary)' }}/>
                  <span>{item.feature}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-glow w-full" style={{ marginTop: '32px' }}>Start Challenge</button>
          </div>

          {/* Another Competitor Card */}
          <div className="comp-card">
             <h3>Standard SaaS</h3>
             <div className="comp-list">
              {comparisonData.map((item, i) => (
                <div key={i} className="comp-item">
                  {i % 2 === 0 ? <Check size={16} className="comp-icon-yes"/> : <Minus size={16} className="comp-icon-no"/>}
                  <span>{item.feature}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
