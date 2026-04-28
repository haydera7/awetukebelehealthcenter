import { Users, FolderOpen, Network, CheckCircle2 } from 'lucide-react';

export default function Services() {
   const services = [
      {
         title: "Smooth Patient Registration",
         desc: "Long lines stress clinic staff and frustrate patients. We simplify the reception desk, making registration fast and organizing patient queues so that everyone knows exactly who is next without the confusion.",
         icon: <Users size={64} style={{ color: 'var(--color-primary)' }} />,
         reverse: false
      },
      {
         title: "Reliable Digital Records",
         desc: "Stop wasting time searching through dusty cabinets for lost paper folders. We safely digitize patient forms so that doctors can view a patient's complete medical history instantly and accurately.",
         icon: <FolderOpen size={64} style={{ color: 'var(--color-purple)' }} />,
         reverse: true
      },
      {
         title: "Connected Doctors & Labs",
         desc: "When a doctor orders a test, the lab receives it immediately. When results are ready, they go straight to the doctor and the pharmacy. We connect your rooms to eliminate the need for running around with paper slips.",
         icon: <Network size={64} style={{ color: 'var(--color-success)' }} />,
         reverse: false
      },
      {
         title: "Simplified Daily Operations",
         desc: "Local clinics don't need overly complicated software. Our platform is easy to learn and built specifically for the day-to-day realities of Ethiopian health centers, helping your entire team focus on healing.",
         icon: <CheckCircle2 size={64} style={{ color: 'var(--color-blue)' }} />,
         reverse: true
      }
   ];

   return (
      <section id="services" className="premium-section services-section">
         <div className="container mx-auto px-6" style={{ padding: '4rem 2rem' }}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: 'var(--spacing-24)' }}>
               <h2 className="heading-2 section-title text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                  Real Services for <br className="hidden md:block" />
                  <span className="text-gradient">Local Clinics</span>
               </h2>
               <p className="section-subtitle text-slate-300 mx-auto max-w-2xl text-lg mt-4">
                  Practical, easy-to-use tools designed specifically to solve the daily struggles of healthcare centers like those in Awetu Mendera.
               </p>
            </div>
            {services.map((item, i) => (
               <div key={i} className={`service-row ${item.reverse ? 'reverse' : ''} flex flex-col ${item.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24 mb-24`}>
                  <div className="service-text lg:w-1/2">
                     <h3 className="heading-2 service-title text-2xl md:text-3xl font-bold text-white mb-4">{item.title}</h3>
                     <p className="service-desc text-slate-300 text-lg leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="service-visual lg:w-1/2 flex justify-center">
                     <div className="relative">
                        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full"></div>
                        <div className="glass-panel service-floating-block bg-gray-900/80 backdrop-blur-xl border border-[var(--color-border)] p-12 rounded-3xl shadow-2xl relative transform hover:-translate-y-2 transition-transform duration-300">
                           {item.icon}
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
}
