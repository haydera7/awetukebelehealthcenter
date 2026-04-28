import { UserPlus, FileText, History, Activity, Pill, FlaskConical } from 'lucide-react';

export default function Features() {
  const features = [
    { icon: <UserPlus />, title: "Smart Patient Registration", desc: "Automate intake workflows with intelligent form processing." },
    { icon: <FileText />, title: "Unified Medical Records", desc: "Complete 360° view of patient histories securely stored." },
    { icon: <History />, title: "Visit & History Tracking", desc: "Granular logging of all clinical interactions and timestamps." },
    { icon: <Activity />, title: "Clinical Diagnosis System", desc: "Advanced algorithmic support for identifying complex conditions." },
    { icon: <Pill />, title: "Intelligent Prescription", desc: "Automated routing and safety cross-checking for medications." },
    { icon: <FlaskConical />, title: "Integrated Lab Results", desc: "Zero-latency synchronization with local laboratory equipment." }
  ];

  return (
    <section id="features" className="premium-section grid-features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="heading-2 section-title">Unrivaled <span className="text-gradient">Capabilities</span></h2>
          <p className="section-subtitle">
            Engineered exclusively for absolute clinical dominance.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((item, idx) => (
            <div key={idx} className="feature-card glass-panel hover-glow-card">
               <div className="feature-icon-wrapper">
                  {item.icon}
               </div>
               <h3 className="feature-title">{item.title}</h3>
               <p className="feature-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
