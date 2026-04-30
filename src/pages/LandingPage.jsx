import { useState, useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import Trust from '../components/landing/Trust';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Services from '../components/landing/Services';
import Features from '../components/landing/Features';
import Comparison from '../components/landing/Comparison';
import SystemPreview from '../components/landing/SystemPreview';
import LoginModal from '../components/auth/LoginModal';
import './LandingPage.css';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      <Navbar
        isScrolled={isScrolled}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
      <main>
        <Hero onGetStarted={() => setIsLoginModalOpen(true)} />
        <About />
        <Trust />
        <Services />
        <Features />
        <Comparison />
        <SystemPreview />
        <Testimonials />
        <CTA onGetStarted={() => setIsLoginModalOpen(true)} />
      </main>

      {/* Premium Footer */}
      <footer className="landing-footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <div className="navbar-logo" style={{ marginBottom: 'var(--spacing-4)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.4))' }}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              <span>HealthCare Pro</span>
            </div>
            <p className="footer-desc">
              The premier simulated medical and clinical analytics platform for industry leaders building the future of digital health.
            </p>
          </div>

          <div className="footer-links">
            <div className="link-column">
              <h4>Platform</h4>
              <a href="#">Overview</a>
              <a href="#">Features</a>
              <a href="#">Integrations</a>
            </div>
            <div className="link-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="link-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container bottom-container">
            <p>&copy; {new Date().getFullYear()} HealthCare Pro. All rights reserved.</p>
            <div className="footer-socials">
              <a href="#">Twitter</a>
              <a href="#">Discord</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>

      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </div>
  );
}
