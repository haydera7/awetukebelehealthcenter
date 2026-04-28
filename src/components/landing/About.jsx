import { Users, MapPin, Activity } from 'lucide-react';
import doctorImg from '../../assets/doctor-about.png';

export default function About() {
  return (
    <section id="about" className="premium-section about-section" style={{ paddingTop: '8rem' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: 'var(--spacing-16)' }}>
        <h2 className="heading-2 section-title">About <span className="text-gradient">Our Mission</span></h2>
      </div>
      <div className="container mx-auto lg:flex lg:items-center lg:justify-between lg:gap-16">

        {/* Left Column Text content */}
        <div className="about-content lg:w-1/2 w-full mb-12 lg:mb-0">
          <h2 className="heading-2 about-title text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Technology understands <br />
            our <span className="text-gradient">local clinics.</span>
          </h2>
          <p className="about-desc flex flex-col gap-4 text-slate-300 text-lg leading-relaxed">
            <span>
              <strong>Our mission is clear:</strong> to give Ethiopian health workers the practical tools they need to provide faster, better care to their communities.
            </span>
            <span>
              In places like Awetu Mendera Kebele, misplaced paper folders and poor communication between doctors, labs, and pharmacies lead to painfully long clinic wait times. HealthCare Pro was created specifically to solve these everyday struggles.
            </span>
            <span>
              We digitize your records and seamlessly connect your departments, so your clinic can run smoothly and your staff can focus purely on what they do best: healing patients.
            </span>
          </p>

          <div className="highlight-list mt-8 flex flex-col gap-4">
            <div className="highlight-item glass-panel flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl transition-all duration-300 hover:bg-white/10">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                <Users className="text-blue-400" size={24} />
              </div>
              <span className="text-white font-medium">Empowers Health Workers</span>
            </div>

            <div className="highlight-item glass-panel flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl transition-all duration-300 hover:bg-white/10">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
                <MapPin className="text-purple-400" size={24} />
              </div>
              <span className="text-white font-medium">Community-First Focus</span>
            </div>

            <div className="highlight-item glass-panel flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl transition-all duration-300 hover:bg-white/10">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                <Activity className="text-emerald-400" size={24} />
              </div>
              <span className="text-white font-medium">Improves Patient Flow</span>
            </div>
          </div>
        </div>

        {/* Right Column Visual Mockup */}
        <div className="about-visual lg:w-1/2 w-full relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/30 via-transparent to-purple-500/30 rounded-[3rem] blur-2xl opacity-50"></div>

          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-[var(--color-border)] rounded-[2rem] shadow-2xl overflow-hidden group w-full lg:max-w-md mx-auto">
            {/* Mockup Header */}
            <div className="flex gap-2 px-5 py-4 border-b border-[var(--color-border)] bg-gray-900/50">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>

            {/* Mockup Image & Gradient */}
            <div className="relative w-full h-[450px] overflow-hidden">
              <img
                src={doctorImg}
                alt="Professional Doctor"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>

              {/* Doctor Info Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl transform group-hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">Dr. Bontu Mengistu</h3>
                    <p className="text-xs text-blue-300">Lead Physician, Awetu Mendera</p>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center bg-emerald-500/20 rounded-xl border border-emerald-500/20">
                    <Activity size={20} className="text-emerald-400" />
                  </div>
                </div>

                {/* Embedded Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">Patients Today</span>
                    <span className="text-sm font-bold text-white">120+</span>
                  </div>
                  <div className="w-px h-6 bg-white/10"></div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">Avg. Wait</span>
                    <span className="text-sm font-bold text-emerald-400">12 min</span>
                  </div>
                </div>
              </div>

              {/* Floating Sync Badge */}
              <div className="absolute top-6 right-6 bg-gray-900/90 backdrop-blur-md border border-[var(--color-border)] px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-300">System Synced</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
