import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Settings, ShieldCheck, MapPin, Smartphone, FileText, Shield, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Home from './pages/Home';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import Terms from './pages/Terms';
import SLA from './pages/SLA';

// --- Shared Footer Component ---
const Footer = () => {
  const { t } = useTranslation();
  return (
  <footer className="border-t border-white/10 bg-[#02040A] pt-16 pb-8 relative z-10">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-12 mb-8">
        {/* Columna 1: Marca */}
        <div className="flex flex-col gap-6">
          <Link to="/">
            <img src="/logo.png" alt="Official Logo" className="h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" style={{ objectPosition: 'left' }} />
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed">
            {t('app_140')}
          </p>
          <div className="flex gap-4 text-gray-500 mt-2">
            <a href="https://www.instagram.com/seedlabcontrol?utm_source=qr&igsh=MTF3YjBzZDVmMnJwOA==" target="_blank" rel="noopener noreferrer" className="hover:text-[#E1306C] transition-colors cursor-pointer flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <span className="hover:text-white transition-colors cursor-pointer"><ShieldCheck className="w-6 h-6"/></span>
          </div>
        </div>

        {/* Columna 2: Legal y Cumplimiento */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-2">{t('app_134')}</h4>
          <Link to="/aviso-legal" className="text-xs text-gray-500 hover:text-[#10B981] transition-colors">{t('app_135')}</Link>
          <Link to="/privacidad" className="text-xs text-gray-500 hover:text-[#10B981] transition-colors">{t('app_136')}</Link>
          <Link to="/cookies" className="text-xs text-gray-500 hover:text-[#10B981] transition-colors">{t('app_137')}</Link>
          <Link to="/terminos" className="text-xs text-gray-500 hover:text-[#10B981] transition-colors">{t('app_138')}</Link>
          <Link to="/sla" className="text-xs text-gray-500 hover:text-[#10B981] transition-colors">{t('app_139')}</Link>
        </div>

        {/* Columna 3: Soporte y Contacto */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-2">{t('app_132')}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4"/> {t('app_133')}</p>
          <p className="text-xs text-gray-500 flex items-center gap-2"><Smartphone className="w-4 h-4"/> +34 900 000 000</p>
          <a href="mailto:legal@seedlabcontrol.com" className="text-xs text-gray-500 hover:text-[#06B6D4] transition-colors flex items-center gap-2"><FileText className="w-4 h-4"/> legal@seedlabcontrol.com</a>
          <a href="https://www.instagram.com/seedlabcontrol?utm_source=qr&igsh=MTF3YjBzZDVmMnJwOA==" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-[#E1306C] transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            @seedlabcontrol
          </a>
          <a href="https://www.linkedin.com/company/seedlabcontrol" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-[#0077b5] transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            SeedLab Control
          </a>
        </div>

        {/* Columna 4: Certificaciones */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-2">Data Security</h4>
          <div className="bg-[#1A1C23] border border-white/10 border-l-[4px] border-l-[#10B981] p-4 rounded-lg flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#10B981]" />
            <div>
              <p className="text-xs font-bold text-white">ISO 27001 Ready</p>
              <p className="text-[10px] text-gray-500">End-to-End Encryption</p>
            </div>
          </div>
          <div className="bg-[#1A1C23] border border-white/10 border-l-[4px] border-l-[#06B6D4] p-4 rounded-lg flex items-center gap-3">
            <Database className="w-8 h-8 text-[#06B6D4]" />
            <div>
              <p className="text-xs font-bold text-white">Immutable Backups</p>
              <p className="text-[10px] text-gray-500">Cryptographic Traceability</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center text-center text-xs text-gray-600 gap-6 pt-4">
        <div className="max-w-2xl md:max-w-3xl">
          <p>&copy; {new Date().getFullYear()} SeedLab Control. An exclusive and isolated cloud environment for your organization.<br className="hidden md:block"/>Logos, domains, traffic light rules, and databases completely independent to protect your intellectual property.</p>
        </div>
        <span className="flex items-center gap-2 bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full border border-[#10B981]/20">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> Global Operational Systems: ONLINE
        </span>
      </div>
    </div>
  </footer>
  );
};

// --- Shared Navbar Component ---
const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#02040A]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-32 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src="/logo.png" alt="Official Logo" className="h-24 md:h-28 w-auto object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]" />
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-gray-400">
            <a href="#lab" className="hover:text-white transition-colors">{t('app_102')}</a>
            <a href="#trace" className="hover:text-white transition-colors">{t('app_103')}</a>
            <a href="#security" className="hover:text-white transition-colors">{t('app_104')}</a>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold bg-[#1A1C23] border border-white/10 rounded-full px-3 py-1">
            <button 
              onClick={() => changeLanguage('en')} 
              className={`hover:text-white transition-colors ${i18n.language === 'en' ? 'text-[#10B981]' : 'text-gray-500'}`}
            >EN</button>
            <span className="text-gray-600">|</span>
            <button 
              onClick={() => changeLanguage('es')} 
              className={`hover:text-white transition-colors ${i18n.language === 'es' ? 'text-[#10B981]' : 'text-gray-500'}`}
            >ES</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#02040A] text-white font-sans selection:bg-[#06B6D4]/30 relative flex flex-col overflow-x-hidden w-full max-w-[100vw]">
        {/* Background Cyber Texture & Glows */}
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-[0.02] pointer-events-none z-0" />
        <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#06B6D4]/10 rounded-full blur-[150px] pointer-events-none z-0" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#10B981]/10 rounded-full blur-[150px] pointer-events-none z-0" />

        <Navbar />

        <main className="relative z-10 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aviso-legal" element={<LegalNotice />} />
            <Route path="/privacidad" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/terminos" element={<Terms />} />
            <Route path="/sla" element={<SLA />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
