import { ArrowRight, MessageSquare, Play, User, Activity, ClipboardList, Clock, CheckCircle2 } from 'lucide-react';

export default function Hero({ onGetStarted }) {
  return (
    <section id="home" className="hero-section">
      <div className="orb-center"></div>

      <div className="container hero-container">

        {/* Main Content Column */}
        <div className="hero-left animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="hero-tag-wrapper">
            <span className="hero-tag">
              <span className="pulse-dot"></span>
              Built for Awetu Mendera Health Center
            </span>
          </div>

          <h1 className="hero-h1">
            Digitalize your clinic. <br />
            Better care for your <span className="text-gradient">community</span>.
          </h1>

          <p className="hero-description" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
            Designed for healthcare centers from Awetu Mendera Kebele and beyond. HealthCare Pro replaces lost paper files with reliable digital records, connecting your doctors, labs, and pharmacies to cut down patient waiting times and bring practical, life-saving efficiency to your daily work.
          </p>

          <div className="hero-actions" style={{ justifyContent: 'flex-start', marginBottom: '3rem' }}>
            <button className="btn btn-primary" onClick={onGetStarted}>
              Get Started <ArrowRight size={20} />
            </button>
            <button className="btn btn-secondary">
              <MessageSquare size={20} /> Request Demo
            </button>
          </div>

          <div className="hero-stats-row">
            <div className="stat-card-mini">
              <span className="stat-val">Digital</span>
              <span className="stat-lbl">Patient Records</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-val">Connected</span>
              <span className="stat-lbl">Labs & Pharmacy</span>
            </div>
            <div className="stat-card-mini">
              <span className="stat-val">Shorter</span>
              <span className="stat-lbl">Wait Times</span>
            </div>
          </div>
        </div>

        {/* Visual Mockup Column */}
        <div className="hero-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="hero-visual">
            <div className="floating-node node-1">✦</div>
            <div className="floating-node node-2">✦</div>
            <div className="floating-node node-3">✦</div>

            <div className="hero-mockup-wrapper relative">
              <div className="hero-mockup-main relative">
                <div className="mockup-inner">
                  {/* Glowing core visualization */}
                  <div className="mockup-core-visual">
                    <div className="core-circle c1"></div>
                    <div className="core-circle c2"></div>
                    <div className="core-circle c3"></div>
                    <div className="core-icon">
                      <Play size={40} fill="var(--color-primary)" color="var(--color-primary)" style={{ filter: 'drop-shadow(0 0 15px rgba(0,240,255,0.8))' }} />
                    </div>
                  </div>
                </div>

                {/* Floating Mock Records */}
                {/* 1. Patient Card */}
                <div className="absolute -top-10 -left-12 lg:-left-24 bg-gray-900/80 backdrop-blur-xl border border-[var(--color-border)] p-3.5 rounded-2xl shadow-lg flex items-center gap-3 w-64 transform hover:scale-105 transition-all duration-300 z-10 hover:border-blue-500/50" style={{ animation: 'bounce 4s infinite' }}>
                  <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl border border-blue-500/20">
                    <User size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white tracking-wide">Aster Tadesse</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-blue-300/80">OPD - Room 2</span>
                      <span className="text-[10px] flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full"><Clock size={10} /> 5 min</span>
                    </div>
                  </div>
                </div>

                {/* 2. Lab Results Card */}
                <div className="absolute top-24 -right-10 left-10 lg:-right-20 bg-gray-900/80 backdrop-blur-xl border border-[var(--color-border)] p-3.5 rounded-2xl shadow-lg flex items-center gap-3 w-64 transform hover:scale-105 transition-all duration-300 z-10 hover:border-emerald-500/50" style={{ animation: 'bounce 5s infinite 1s' }}>
                  <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/20 flex-shrink-0">
                    <Activity size={20} className="text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white">Lab Results</div>
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    </div>
                    <div className="text-xs text-emerald-300/80 mt-0.5">Malaria Rapid Test: <span className="font-medium text-emerald-400">Negative</span></div>
                  </div>
                </div>

                {/* 3. Pharmacy Card */}
                <div className="absolute -bottom-0 -left-2 lg:left-8 bg-gray-900/80 backdrop-blur-xl border border-[var(--color-border)] p-3.5 rounded-2xl shadow-lg flex items-center gap-3 w-60 transform hover:scale-105 transition-all duration-300 z-10 hover:border-purple-500/50" style={{ animation: 'bounce 4.5s infinite 0.5s' }}>
                  <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl border border-purple-500/20 flex-shrink-0">
                    <ClipboardList size={20} className="text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">Pharmacy</div>
                    <div className="text-xs text-purple-300/80 mt-0.5">Amoxicillin • <span className="text-amber-400 animate-pulse">Dispensing</span></div>
                  </div>
                </div>

                {/* 4. Mini Offline-Ready Badge */}
                <div className="absolute -top-4 right-0 lg:-right-8 bg-gray-900/90 backdrop-blur-md border border-[var(--color-border)] px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 transform hover:scale-105 transition-all z-20">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] font-medium tracking-wider text-emerald-400 uppercase">Local Network Active</span>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
