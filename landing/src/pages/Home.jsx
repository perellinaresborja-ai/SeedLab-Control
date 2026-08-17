import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ParticleNetwork from '../components/ParticleNetwork';
import GeneticsSimulator from '../components/GeneticsSimulator';
import WhitepaperModal from '../components/WhitepaperModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ComplianceVault, ImmuneSystemSimulator, LicensingTiers } from '../components/EnterpriseFeatures';
import { 
  FlaskConical, ShieldCheck, QrCode, 
  Settings, Lock, 
  CheckCircle, CheckCircle2, AlertTriangle, Database, 
  FileText, Activity, 
  Bell, Search, Box,
  TrendingUp, Shield, ListChecks,
  Download, Printer, Mail,
  Receipt, Truck, PieChart, Send, Building, GitMerge
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);





// --- Component: Germination Simulator (Section 5) ---
const GerminationSimulator = () => {
  const { i18n } = useTranslation();
  const [day, setDay] = useState(1);
  const [isSigned, setIsSigned] = useState(false);

  const timelineData = {
    1: { germinated: 0, anomaly: 0, dead: 0, desc: i18n.resolvedLanguage?.startsWith('en') ? 'Sowing and initial latency phase.' : 'Siembra y fase de latencia inicial.' },
    3: { germinated: 45, anomaly: 2, dead: 0, desc: i18n.resolvedLanguage?.startsWith('en') ? 'First radicles visible. Good vigor.' : 'Primeras radículas visibles. Buen vigor.' },
    5: { germinated: 99, anomaly: 0, dead: 1, desc: i18n.resolvedLanguage?.startsWith('en') ? 'Optimal cotyledon development. Test finished.' : 'Desarrollo de cotiledones óptimo. Prueba finalizada.' }
  };

  const currentStats = timelineData[day] || timelineData[1];
  const finalGermination = currentStats.germinated;
  
  // Traffic Light Logic based on finalGermination
  const getTrafficLight = (val) => {
    if(val >= 95) return { color: 'text-green-400', border: 'border-green-400', glow: 'shadow-[0_0_20px_#4ade80]', label: i18n.resolvedLanguage?.startsWith('en') ? 'Excellent' : 'Excelente' };
    if(val >= 90) return { color: 'text-[#10B981]', border: 'border-[#10B981]', glow: 'shadow-[0_0_20px_#10B981]', label: i18n.resolvedLanguage?.startsWith('en') ? 'Suitable' : 'Apto' };
    if(val >= 85) return { color: 'text-yellow-400', border: 'border-yellow-400', glow: 'shadow-[0_0_20px_#facc15]', label: i18n.resolvedLanguage?.startsWith('en') ? 'Review Needed' : 'Revisión Necesaria' };
    if(val >= 75) return { color: 'text-orange-400', border: 'border-orange-400', glow: 'shadow-[0_0_20px_#fb923c]', label: i18n.resolvedLanguage?.startsWith('en') ? 'Follow-up' : 'Seguimiento' };
    return { color: 'text-red-500', border: 'border-red-500', glow: 'shadow-[0_0_20px_#ef4444]', label: i18n.resolvedLanguage?.startsWith('en') ? 'Blocked' : 'Bloqueado' };
  };

  const tl = getTrafficLight(finalGermination);

  return (
    <div className="bg-[#0B101E] border border-white/10 border-l-[4px] border-l-[#10B981] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)] relative z-10">
      <div className="border-b border-white/10 p-4 bg-black/40 flex justify-between items-center">
         <div className="flex items-center gap-3">
           <Activity className="w-5 h-5 text-[#06B6D4]" />
           <span className="font-mono text-sm font-bold tracking-widest text-white">TEST-SIMULATOR-01</span>
         </div>
         <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">Muestra: 100 unidades | Shaman OG</span>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-12">
        {/* Visual Lab (Petri Dish) */}
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 rounded-full border-[6px] border-white/5 bg-[#02040A] relative flex items-center justify-center mb-8 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
             <motion.div 
               key={`photo-${day}`}
               initial={{ opacity: 0, scale: 1.05 }} 
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               className="absolute inset-0 bg-cover bg-center"
               style={{ 
                 backgroundImage: day === 1 ? "url('/day1.jpg')" : day === 3 ? "url('/day2.jpg')" : "url('/day3.jpg')"
               }}
             />
             
             <div className="absolute inset-0 bg-[#10B981]/10 rounded-full blur-md pointer-events-none" />
          </div>

          <div className="w-full bg-[#1A1C23] p-4 rounded-xl border border-white/5 shadow-lg">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">{i18n.resolvedLanguage?.startsWith('en') ? 'Test Timeline' : 'Línea de Tiempo del Test'}</p>
            <div className="flex justify-between gap-2 mb-2">
              {[1, 3, 5].map(d => (
                <button 
                  key={d} 
                  onClick={() => setIsSigned(false) || setDay(d)}
                  className={`flex-1 py-2 mx-1 rounded text-xs font-bold transition-all ${day === d ? 'bg-[#06B6D4] text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-black/50 text-gray-400 hover:bg-white/10'}`}
                >
                  {i18n.resolvedLanguage?.startsWith('en') ? 'DAY' : 'DÍA'} {d}
                </button>
              ))}
            </div>
            <p className="text-xs text-center text-gray-400 italic font-mono mt-3">"{currentStats.desc}"</p>
          </div>
        </div>

        {/* Analytics & Decision */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-4 flex-1">
              <p className="text-xs text-gray-400 mb-1">{i18n.resolvedLanguage?.startsWith('en') ? 'Germination Rate' : 'Tasa de Germinación'}</p>
              <motion.p 
                key={`germ-${day}`}
                initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold text-white font-mono"
              >
                {currentStats.germinated}%
              </motion.p>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
              <p className="text-xs text-gray-400 mb-1">Anomalías / Muertas</p>
              <p className="text-xl font-bold text-gray-300 font-mono">{currentStats.anomaly} / {currentStats.dead}</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-bold flex items-center gap-2">
               Motor de Decisión Automático
            </p>
            <div className="bg-[#1A1C23] p-4 rounded-xl border border-white/5 space-y-3 relative shadow-lg">
               <div className={`absolute inset-0 ${tl.glow} opacity-10 rounded-xl pointer-events-none transition-all duration-1000`} />
               
               {[
                  { r: '95–100%', t: i18n.resolvedLanguage?.startsWith('en') ? 'Excellent' : 'Excelente', c: 'text-green-400' },
                  { r: '90–94.9%', t: i18n.resolvedLanguage?.startsWith('en') ? 'Suitable' : 'Apto', c: 'text-[#10B981]' },
                  { r: '85–89.9%', t: i18n.resolvedLanguage?.startsWith('en') ? 'Review' : 'Revisión', c: 'text-yellow-400' },
                  { r: '< 85%', t: i18n.resolvedLanguage?.startsWith('en') ? 'Blocked' : 'Bloqueado', c: 'text-red-500' },
               ].map((lvl, i) => {
                 const isActive = day === 5 && lvl.t === tl.label;
                 return (
                   <div key={i} className={`flex items-center justify-between p-2 rounded transition-all ${isActive ? 'bg-white/10' : 'opacity-50'}`}>
                     <span className={`font-mono text-xs ${isActive ? lvl.c : 'text-gray-500'} font-bold`}>{lvl.r}</span>
                     <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>{lvl.t}</span>
                     <div className={`w-3 h-3 rounded-full ${isActive ? `bg-current ${lvl.c} shadow-[0_0_10px_currentColor]` : 'bg-gray-700'}`} />
                   </div>
                 );
               })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {day === 5 && !isSigned && (
              <motion.button 
                key="sign-btn"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setIsSigned(true)}
                className="w-full bg-gradient-to-r from-[#10B981] to-[#06B6D4] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] text-black font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                <Lock className="w-5 h-5" /> {i18n.resolvedLanguage?.startsWith('en') ? 'Review and Sign Certificate' : 'Revisar y Firmar Certificado'}
              </motion.button>
            )}
            {isSigned && (
              <motion.div 
                key="signed-msg"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-[#10B981]/10 border border-[#10B981] text-[#10B981] font-bold py-4 rounded-xl flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <ShieldCheck className="w-5 h-5" /> {i18n.resolvedLanguage?.startsWith('en') ? 'Certificate Signed and Immutable' : 'Certificado Sellado e Inmutable'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// --- Component: QrSimulator (Section 6) ---
const QrSimulator = () => {
  const { i18n } = useTranslation();
  const [scanned, setScanned] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
      {/* Physical Bag with QR */}
      <div 
        className="relative cursor-pointer group"
        onClick={() => setScanned(true)}
      >
        <div className="w-64 h-80 bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 border-l-[4px] border-l-[#06B6D4] relative p-6 flex flex-col items-center justify-end group-hover:-translate-y-2 transition-transform duration-500">
          <div className="absolute top-0 w-full h-8 bg-black/40 rounded-t-xl border-b border-white/5" />
          <div className="text-center mb-auto mt-4">
            <h4 className="font-bold tracking-widest text-gray-300 text-sm">SHAMAN OG</h4>
            <p className="text-[10px] text-gray-500 font-mono mt-1">LOTE: SHOG-260615</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg w-36 h-36 relative z-10 shadow-2xl mb-4 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-shadow">
            <QrCode className="w-full h-full text-black" />
            {!scanned && (
              <div className="absolute inset-0 bg-[#10B981]/10 flex flex-col items-center justify-center backdrop-blur-[1px] rounded-lg">
                <span className="bg-[#02040A] text-[#10B981] border border-[#10B981] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">{i18n.resolvedLanguage?.startsWith('en') ? 'Click to Scan' : 'Clic para Escanear'}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <ShieldCheck className="w-3 h-3 text-[#10B981]"/> {i18n.resolvedLanguage?.startsWith('en') ? 'Certified Quality' : 'Calidad Certificada'}
          </div>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="w-[320px] h-[640px] bg-black border-[14px] border-[#1E293B] rounded-[2.5rem] relative shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-7 bg-[#1E293B] w-40 mx-auto rounded-b-3xl z-20" />
        
        <AnimatePresence mode="wait">
          {!scanned ? (
            <motion.div 
              key="camera"
              exit={{ opacity: 0 }}
              className="h-full w-full flex flex-col items-center justify-center bg-gray-900 relative"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620325867502-221ddb5b4f2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-30 blur-sm" />
              <div className="w-48 h-48 border-2 border-[#10B981] rounded-2xl relative z-10 flex items-center justify-center">
                 <div className="w-full h-0.5 bg-[#10B981] absolute top-1/2 shadow-[0_0_10px_#10B981] animate-[scan_2s_ease-in-out_infinite]" />
                 <Corners />
              </div>
              <p className="mt-8 text-white/50 text-sm font-medium z-10">{i18n.resolvedLanguage?.startsWith('en') ? 'Point to the package QR' : 'Apunta al QR del envase'}</p>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              className="h-full w-full bg-[#0B101E] text-white flex flex-col pt-12 overflow-y-auto"
            >
              <div className="bg-[#10B981] text-black text-center py-4 px-6 relative">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-black" />
                <h3 className="font-bold text-lg leading-tight">
                  {i18n.resolvedLanguage?.startsWith('en') ? (
                    <>VALID<br/>CERTIFICATE</>
                  ) : (
                    <>CERTIFICADO<br/>VÁLIDO</>
                  )}
                </h3>
                <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#10B981]" />
              </div>              <div className="p-5 pb-12 flex-1 space-y-3">
                <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{i18n.resolvedLanguage?.startsWith('en') ? 'Issuing Company' : 'Empresa Emisora'}</p>
                  <p className="font-bold text-sm text-gray-200">SeedLab Control</p>
                </div>
                
                <div className="bg-black/50 p-3 rounded-xl border border-[#10B981]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#10B981]/10 blur-xl" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{i18n.resolvedLanguage?.startsWith('en') ? 'Variety & Batch' : 'Variedad & Lote'}</p>
                  <p className="font-bold text-sm text-white mb-2">Shaman OG <span className="text-gray-500 font-mono font-normal">#SHOG-2606</span></p>
                  
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{i18n.resolvedLanguage?.startsWith('en') ? 'Germination Rate' : 'Tasa de Germinación'}</p>
                    <p className="text-xl font-bold text-[#10B981] font-mono">98% <span className="text-xs uppercase bg-[#10B981]/20 px-2 py-1 rounded ml-2">{i18n.resolvedLanguage?.startsWith('en') ? 'Suitable' : 'Apto'}</span></p>
                  </div>
                </div>

                <div className="bg-black/50 p-3 rounded-xl border border-white/5 text-xs text-gray-400 space-y-1 font-mono">
                  <div className="flex justify-between"><span className="text-gray-500">{i18n.resolvedLanguage?.startsWith('en') ? 'Analysis Date:' : 'Fecha Anålisis:'}</span> <span className="text-gray-300">2026-05-26</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">{i18n.resolvedLanguage?.startsWith('en') ? 'Expiration:' : 'Caducidad V.:'}</span> <span className="text-gray-300">2028-05-26</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">{i18n.resolvedLanguage?.startsWith('en') ? 'Hash (SHA):' : 'Hash (SHA):'}</span> <span className="text-gray-300 truncate w-24">a3f9d8c...</span></div>
                </div>

                <div className="flex justify-center mt-2 pt-2 border-t border-white/10">
                  <img src="/sello.png" alt="Sello Oficial" className="w-24 h-24 object-contain rounded-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Corners = () => (
  <>
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#10B981] rounded-tl-sm" />
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#10B981] rounded-tr-sm" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#10B981] rounded-bl-sm" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#10B981] rounded-br-sm" />
  </>
);

// --- Main Application ---



const Home = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const [activeSciTab, setActiveSciTab] = useState(() => {
    const saved = localStorage.getItem('activeSciTab');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [showWhitepaper, setShowWhitepaper] = useState(false);

  useEffect(() => {
    localStorage.setItem('activeSciTab', activeSciTab);
  }, [activeSciTab]);
  return (
    <>
      <main className="relative z-10">
        
        {/* HERO */}
        <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
          <ParticleNetwork />
          
          <FadeIn className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-bold tracking-widest uppercase mb-8">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> {t('home_1')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1] text-white" dangerouslySetInnerHTML={{ __html: t('home_2') }}></h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
              {t('home_3')}
            </p>
            
            {/* Interactive Flow Diagram */}
            <div className="w-full max-w-4xl mx-auto bg-[#0B101E] border border-white/10 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/30 transition-all rounded-2xl p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-16 group">
               {[
                 { t: t('home_168'), c: 'text-gray-400' },
                 { t: t('home_101'), c: 'text-gray-400' },
                 { t: t('home_169'), c: 'text-[#06B6D4]' },
                 { t: t('home_170'), c: 'text-[#06B6D4]' },
                 { t: t('home_171'), c: 'text-[#10B981]' },
                 { t: t('home_172'), c: 'text-[#10B981]' },
                 { t: t('home_173'), c: 'text-white' },
                 { t: t('home_174'), c: 'text-white' }
               ].map((step, i, arr) => (
                 <React.Fragment key={i}>
                   <div className="group relative flex flex-col items-center cursor-pointer">
                     <div className="w-3 h-3 rounded-full bg-gray-700 group-hover:bg-[#10B981] group-hover:shadow-[0_0_15px_#10B981] transition-all mb-2 z-10" />
                     <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${step.c} group-hover:text-[#10B981] transition-colors`}>{step.t}</span>
                   </div>
                   {i < arr.length - 1 && (
                     <div className="hidden md:block flex-1 h-px bg-white/10 mx-2 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-[#10B981] to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
                     </div>
                   )}
                 </React.Fragment>
               ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button 
                onClick={() => setShowWhitepaper(true)} 
                className="inline-block bg-gradient-to-r from-[#10B981] to-[#06B6D4] text-[#02040A] px-10 py-5 rounded-xl font-black text-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all text-center w-full sm:w-auto"
              >
                {i18n.language && i18n.language.startsWith('en') ? "Read Technical Whitepaper" : "Leer Whitepaper Técnico"}
              </button>
            </div>
          </FadeIn>
        </section>

        {/* SECTION 2: DIAGNÓSTICO DEL CAOS */}
        <section className="py-24 border-y border-white/5 bg-[#060913]">
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{t('home_5')}</h2>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6" dangerouslySetInnerHTML={{ __html: t('home_6') }}></h3>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">{t('home_7')}</p>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { i: FileText, t: t('home_8'), d: t('home_9'), border: 'border-l-[#10B981]', hoverBorder: 'hover:border-[#10B981]/30', glow: 'bg-[#10B981]/5', hoverGlow: 'group-hover:bg-[#10B981]/10', iconHover: 'group-hover:text-[#10B981]' },
                { i: AlertTriangle, t: t('home_10'), d: t('home_11'), border: 'border-l-[#06B6D4]', hoverBorder: 'hover:border-[#06B6D4]/30', glow: 'bg-[#06B6D4]/5', hoverGlow: 'group-hover:bg-[#06B6D4]/10', iconHover: 'group-hover:text-[#06B6D4]' },
                { i: Search, t: t('home_12'), d: t('home_13'), border: 'border-l-[#F59E0B]', hoverBorder: 'hover:border-[#F59E0B]/30', glow: 'bg-[#F59E0B]/5', hoverGlow: 'group-hover:bg-[#F59E0B]/10', iconHover: 'group-hover:text-[#F59E0B]' }
              ].map((card, i) => (
                <FadeIn key={i} delay={i * 0.1} className={`bg-[#0B101E] border border-white/5 border-l-[4px] ${card.border} p-8 rounded-2xl ${card.hoverBorder} transition-colors group relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 ${card.glow} blur-[80px] ${card.hoverGlow} transition-colors`} />
                  <card.i className={`w-10 h-10 text-gray-600 ${card.iconHover} transition-colors mb-6`} />
                  <h3 className="text-xl font-bold text-white mb-3">{card.t}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{card.d}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: VISIÓN GENERAL Y DASHBOARD */}
        <section className="py-24 max-w-7xl mx-auto px-6">
             <FadeIn className="mb-16 text-center">
               <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{t('home_26')}</h2>
               <h3 className="text-3xl md:text-5xl font-black text-white mb-4">{t('home_27')}</h3>
               <p className="text-xl text-gray-400">{t('home_28')}</p>
             </FadeIn>

           <FadeIn delay={0.2} className="bg-[#0B101E] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]">
             <div className="flex overflow-x-auto whitespace-nowrap border-b border-white/10 bg-black/40">
               {[t('home_29'), t('home_30'), t('home_31')].map((tab, i) => (
                 <div 
                   key={i} 
                   onClick={() => setActiveSciTab(i)}
                   className={`px-6 py-4 text-sm font-bold cursor-pointer transition-colors ${i===activeSciTab ? 'text-[#06B6D4] border-b-2 border-[#06B6D4] bg-[#06B6D4]/5' : 'text-gray-500 hover:text-gray-300'}`}>
                   {tab}
                 </div>
               ))}
             </div>
             <div className="p-8">
               {activeSciTab === 0 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-[#1A1C23] border border-white/5 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/30 transition-all p-6 rounded-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4"><Database className="w-6 h-6 text-gray-600"/></div>
                     <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">{t('home_32')}</p>
                     <p className="text-4xl font-black text-white font-mono">1.75M</p>
                     <p className="text-xs text-[#10B981] mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> +2.4% vs Q3</p>
                   </div>
                   <div className="bg-[#1A1C23] border border-white/5 border-l-[4px] border-l-[#F59E0B] hover:border-[#F59E0B]/30 transition-all p-6 rounded-xl group">
                     <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">{t('home_33')}</p>
                     <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-full border-4 border-[#1A1C23] border-t-[#10B981] border-r-[#10B981] border-b-yellow-500 border-l-red-500 flex items-center justify-center font-bold text-lg font-mono">342</div>
                       <div className="text-xs space-y-1 font-mono">
                         <div className="text-[#10B981]">{t('home_105')}</div>
                         <div className="text-yellow-500">{t('home_106')}</div>
                         <div className="text-red-500">7 {t('home_99')}</div>
                       </div>
                     </div>
                   </div>
                   <div className="bg-[#1A1C23] border border-white/5 border-l-[4px] border-l-[#06B6D4] hover:border-[#06B6D4]/30 transition-all p-6 rounded-xl group">
                     <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">{t('home_34')}</p>
                     <div className="flex items-end justify-between mb-4 mt-6">
                       <p className="text-4xl font-black text-white font-mono">98.6% <span className="text-sm font-bold text-[#06B6D4] tracking-widest">{t('home_107')}</span></p>
                     </div>
                     <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden">
                       <div className="bg-gradient-to-r from-[#10B981] to-[#06B6D4] h-full w-[98.6%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                     </div>
                   </div>
                 </motion.div>
               )}
               {activeSciTab === 1 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-gray-400 font-mono">
                     <thead className="border-b border-white/10 text-gray-500">
                       <tr>
                         <th className="pb-3 font-normal">{t('home_83')}</th>
                         <th className="pb-3 font-normal">{t('home_84')}</th>
                         <th className="pb-3 font-normal">{t('home_85')}</th>
                         <th className="pb-3 font-normal">{t('home_86')}</th>
                         <th className="pb-3 font-normal">{t('home_87')}</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                       <tr className="hover:bg-white/5 transition-colors">
                         <td className="py-4 font-bold text-white">AK-260615-004</td>
                         <td className="py-4">AK-47 Auto</td>
                         <td className="py-4">{t('home_108')}</td>
                         <td className="py-4 text-[#10B981]">{t('home_111')}</td>
                         <td className="py-4"><span className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] rounded text-xs border border-[#10B981]/20">{t('home_88')}</span></td>
                       </tr>
                       <tr className="hover:bg-white/5 transition-colors">
                         <td className="py-4 font-bold text-white">#SHOG-2606</td>
                         <td className="py-4">Shaman OG</td>
                         <td className="py-4">{t('home_109')}</td>
                         <td className="py-4 text-[#F59E0B]">{t('home_112')}</td>
                         <td className="py-4"><span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs border border-yellow-500/20">{t('home_89')}</span></td>
                       </tr>
                       <tr className="hover:bg-white/5 transition-colors">
                         <td className="py-4 font-bold text-white">#MMX-4421</td>
                         <td className="py-4">Mango Kush</td>
                         <td className="py-4">{t('home_110')}</td>
                         <td className="py-4 text-red-500">{t('home_113')}</td>
                         <td className="py-4"><span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs border border-red-500/20">{t('home_90')}</span></td>
                       </tr>
                     </tbody>
                   </table>
                 </motion.div>
               )}
               {activeSciTab === 2 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-[#1A1C23] p-6 rounded-xl border border-white/5 border-l-[4px] border-l-[#06B6D4] hover:border-[#06B6D4]/30 transition-all flex flex-col items-center justify-center text-center group">
                     <div className="w-16 h-16 rounded-full bg-[#06B6D4]/10 flex items-center justify-center mb-4 border border-[#06B6D4]/30 animate-pulse">
                       <Activity className="w-8 h-8 text-[#06B6D4]" />
                     </div>
                     <h4 className="text-white font-bold mb-2">{t('home_91')}</h4>
                     <p className="text-3xl font-black font-mono text-[#06B6D4]">14 <span className="text-sm font-normal text-gray-500">{t('home_92')}</span></p>
                   </div>
                   <div className="bg-[#1A1C23] p-6 rounded-xl border border-white/5 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/30 transition-all group">
                     <h4 className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4 border-b border-white/5 pb-2">{t('home_93')}</h4>
                     <div className="space-y-3 font-mono text-sm">
                       <div className="flex justify-between items-center bg-black/40 p-2 rounded">
                         <span className="text-white">Lote #CRIT-992</span>
                         <span className="text-[#F59E0B] text-xs">{t('home_94')}</span>
                       </div>
                       <div className="flex justify-between items-center bg-black/40 p-2 rounded">
                         <span className="text-white">Lote #AMN-110</span>
                         <span className="text-[#10B981] text-xs">{t('home_95')}</span>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               )}
             </div>
           </FadeIn>
         </section>


        
        {/* SECTION 2: B2B FEATURES GRID */}
        <section className="py-24 max-w-7xl mx-auto px-6 relative z-10" id="features">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{i18n.resolvedLanguage?.startsWith('en') ? 'Technological Infrastructure' : 'Infraestructura Tecnológica'}</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{i18n.resolvedLanguage?.startsWith('en') ? 'Master every batch.' : 'Domina cada lote.'}</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {i18n.resolvedLanguage?.startsWith('en') ? 'A suite of advanced tools to guarantee the traceability, security, and viability of your entire inventory in real time.' : 'Un conjunto de herramientas avanzadas para garantizar la trazabilidad, seguridad y viabilidad de todo tu inventario en tiempo real.'}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-[#1A1C23] p-8 rounded-2xl border border-white/5 border-l-[4px] border-l-[#F59E0B] hover:border-[#F59E0B]/30 transition-all group flex flex-col md:flex-row items-start gap-6">
               <div className="w-14 h-14 bg-black/50 border border-white/5 rounded-full flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                 <Activity className="w-6 h-6 text-[#F59E0B]" />
               </div>
               <div>
                 <h4 className="text-white font-bold text-xl mb-2">{i18n.resolvedLanguage?.startsWith('en') ? 'Exact Mapping' : 'Mapeo Exacto'}</h4>
                 <p className="text-gray-400 text-sm leading-relaxed text-balance">
                   {i18n.resolvedLanguage?.startsWith('en') ? 'From the mother seed to the final batch. Instant bidirectional genealogical traceability for ISO audits.' : 'Desde la semilla madre hasta el lote final. Trazabilidad genealógica bidireccional instantánea para auditorías ISO.'}
                 </p>
               </div>
             </div>

             <div className="bg-[#1A1C23] p-8 rounded-2xl border border-white/5 border-l-[4px] border-l-[#06B6D4] hover:border-[#06B6D4]/30 transition-all group flex flex-col md:flex-row items-start gap-6">
               <div className="w-14 h-14 bg-black/50 border border-white/5 rounded-full flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                 <Shield className="w-6 h-6 text-[#06B6D4]" />
               </div>
               <div>
                 <h4 className="text-white font-bold text-xl mb-2">{i18n.resolvedLanguage?.startsWith('en') ? 'Real Stock Cascade' : 'Cascada de Stock Real'}</h4>
                 <p className="text-gray-400 text-sm leading-relaxed text-balance">
                   {i18n.resolvedLanguage?.startsWith('en') ? 'Visualize the natural depreciation of viability with a predictive engine. No more surprises in aging inventories.' : 'Visualiza la depreciación natural de la viabilidad con un motor predictivo. No más sorpresas en inventarios envejecidos.'}
                 </p>
               </div>
             </div>

             <div className="bg-[#1A1C23] p-8 rounded-2xl border border-white/5 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/30 transition-all group flex flex-col md:flex-row items-start gap-6">
               <div className="w-14 h-14 bg-black/50 border border-white/5 rounded-full flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                 <Lock className="w-6 h-6 text-[#10B981]" />
               </div>
               <div>
                 <h4 className="text-white font-bold text-xl mb-2">{i18n.resolvedLanguage?.startsWith('en') ? 'Client-Ready PDFs' : 'PDFs Listos para el Cliente'}</h4>
                 <p className="text-gray-400 text-sm leading-relaxed text-balance">
                   {i18n.resolvedLanguage?.startsWith('en') ? 'Automatic generation of PDF certificates in one click. Export all traceability and germination tests to send to your clients.' : 'Generación automática de certificados en PDF a un solo clic. Exporta toda la trazabilidad y las pruebas de germinación para mandárselas a tus clientes.'}
                 </p>
               </div>
             </div>
          </div>
        </section>

        
        
        {/* SECTION 4: INVENTARIO DE PRECISIÓN (Cascada) */}
        <section className="py-24 border-y border-white/5 bg-[#060913]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              <FadeIn>
                <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{i18n.resolvedLanguage?.startsWith('en') ? 'Batch Management' : 'Gestión de Lotes'}</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{i18n.resolvedLanguage?.startsWith('en') ? 'Precision inventory.' : 'Inventario de precisión.'}</h3>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  {i18n.resolvedLanguage?.startsWith('en') ? 'No stock movement goes unidentified. Know the exact anatomy of every batch, from the initial quantity to the last package sold, including losses and germination tests.' : 'Ningún movimiento de stock queda sin identificar. Conoce la anatomía exacta de cada lote, desde la cantidad inicial hasta el último paquete vendido, pasando por mermas y test de germinación.'}
                </p>
                <div className="bg-[#0B101E] border border-[#06B6D4]/30 border-l-[4px] border-l-[#06B6D4] rounded-xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Box className="w-5 h-5 text-[#06B6D4]"/> {i18n.resolvedLanguage?.startsWith('en') ? 'Unique Batch Anatomy' : 'Anatomía del Lote Único'}</h4>
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">{i18n.resolvedLanguage?.startsWith('en') ? 'Strain:' : 'Variedad:'}</span> <span className="text-white font-bold">Shaman OG</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-gray-500">{i18n.resolvedLanguage?.startsWith('en') ? 'Batch ID:' : 'ID Lote:'}</span> <span className="text-[#06B6D4] font-bold">SHOG-260615-004</span></div>
                    <div className="flex justify-between pb-2"><span className="text-gray-500">{i18n.resolvedLanguage?.startsWith('en') ? 'Initial Input:' : 'Input Inicial:'}</span> <span className="text-gray-300">{i18n.resolvedLanguage?.startsWith('en') ? '8,000 units' : '8,000 unidades'}</span></div>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{i18n.resolvedLanguage?.startsWith('en') ? 'Inventory Control' : 'Control de Inventario'}</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{i18n.resolvedLanguage?.startsWith('en') ? 'The pulse of your Batches.' : 'El pulso de tus Lotes.'}</h3>
                <div className="bg-[#1A1C23] border border-white/10 rounded-2xl p-8 mb-8">
                  {[
                    { label: i18n.resolvedLanguage?.startsWith('en') ? 'Total Produced' : 'Total Producido', val: '10,000', w: 'w-full', c: 'from-[#06B6D4] to-[#10B981]' },
                    { label: i18n.resolvedLanguage?.startsWith('en') ? 'Available' : 'Disponible', val: '6,450', w: 'w-[64%]', c: 'from-[#10B981] to-[#047857]' },
                    { label: i18n.resolvedLanguage?.startsWith('en') ? 'Sold B2B' : 'Vendido B2B', val: '3,000', w: 'w-[30%]', c: 'from-blue-500 to-blue-600' },
                    { label: i18n.resolvedLanguage?.startsWith('en') ? 'Losses / Waste' : 'Mermas / Descarte', val: '350', w: 'w-[15%]', c: 'from-red-500 to-red-600' },
                    { label: i18n.resolvedLanguage?.startsWith('en') ? 'Germination Test' : 'Test de Germinación', val: '200', w: 'w-[10%]', c: 'from-gray-600 to-gray-700' },
                  ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1.5 mb-4 last:mb-0">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-xs uppercase text-gray-300">{stat.label}</span>
                      <span className="text-white font-mono text-sm font-bold">{stat.val}</span>
                    </div>
                    <div className="w-full bg-[#060913] h-2 rounded-full overflow-hidden border border-white/5">
                      <div className={`${stat.w} h-full bg-gradient-to-r ${stat.c} rounded-full`} />
                    </div>
                  </div>
                ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* SECTION 4.5: TRAZABILIDAD GENÉTICA Y CULTIVO */}
        <section className="py-32 max-w-7xl mx-auto px-6 relative border-t border-white/5">
          <FadeIn className="text-center mb-16 relative z-10">
            <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{i18n.resolvedLanguage?.startsWith('en') ? 'Total Traceability' : 'Trazabilidad Total'}</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{i18n.resolvedLanguage?.startsWith('en') ? "The Breeder's Holy Grail" : 'El Santo Grial del Breeder'}</h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {i18n.resolvedLanguage?.startsWith('en') ? 'Records genetic origin, pollen donor, and the exact seed batch. Everything connected.' : 'Registra el origen genético, el donante de polen y el lote exacto de semillas. Todo conectado.'}
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="relative z-10">
            <GeneticsSimulator />
          </FadeIn>
        </section>

        {/* SECTION 5: SIMULADOR DE LABORATORIO */}
        <section id="lab" className="py-32 max-w-7xl mx-auto px-6 relative border-t border-white/5">
          <FadeIn className="text-center mb-16 relative z-10">
            <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{t("home_41")}</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{t("home_42")}</h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t("home_43")}
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="relative z-10">
            <GerminationSimulator />
          </FadeIn>
        </section>

        
        
        {/* SECTION 6: MARCA BLANCA */}
        <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/5">
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{i18n.resolvedLanguage?.startsWith('en') ? 'Fully Customizable' : 'Totalmente Personalizable'}</h2>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{i18n.resolvedLanguage?.startsWith('en') ? 'Your Brand. Your Software.' : 'Tu Marca. Tu Software.'}</h3>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {i18n.resolvedLanguage?.startsWith('en') ? 'The system adapts to your corporate identity. Show your own colors, logos, and certificates as if you had developed the software yourself.' : 'El sistema se adapta a tu identidad corporativa. Muestra tus propios colores, logotipos y certificados como si hubieras desarrollado el software tú mismo.'}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              <FadeIn className="relative order-2 md:order-1">
                <div className="bg-[#1A1C23] border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 border-l-[4px] border-l-[#10B981]">
                  <div className="flex justify-between items-start border-b border-white/10 pb-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{t('home_78')}</h4>
                        <p className="text-xs text-gray-500">{t('home_79')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <p className="text-sm text-gray-400 italic mb-6">{i18n.resolvedLanguage?.startsWith('en') ? '"All your corporate info here. Fully customizable design and data."' : '"Toda tu información corporativa aquí. Diseño y datos totalmente personalizables."'}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{i18n.resolvedLanguage?.startsWith('en') ? 'Germination Rate' : 'Tasa de Germinación'}</p>
                        <p className="text-[#10B981] font-mono font-bold text-xl">98.5%</p>
                      </div>
                      <div className="bg-[#0B101E] p-4 rounded-xl border border-white/5">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{t('home_83')}</p>
                        <p className="text-lg font-mono font-bold text-white">AK-260615-004</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6 pt-6 border-t border-white/10">
                     <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="SeedLab" className="h-6 w-auto opacity-50 grayscale" />
                        <div className="text-left">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{t('home_81')}</p>
                          <p className="text-xs font-bold text-gray-300">SEEDLAB CONTROL</p>
                        </div>
                     </div>
                     <button type="button" className="w-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] py-3 rounded-lg text-sm font-bold hover:bg-[#10B981]/20 transition-colors flex items-center justify-center gap-2">
                       <FileText className="w-4 h-4" /> {t('home_82')}
                     </button>
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none" />
              </FadeIn>

              <FadeIn delay={0.2} className="order-1 md:order-2 space-y-6">
                <div className="bg-[#0B101E] border border-[#06B6D4]/20 border-l-[4px] border-l-[#06B6D4] hover:border-[#06B6D4]/40 transition-all p-6 rounded-xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#06B6D4]/10 blur-[50px] pointer-events-none group-hover:bg-[#06B6D4]/20 transition-colors" />
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#06B6D4]" /> {t('home_50')}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                    {t('home_51')}
                  </p>
                </div>

                <div className="bg-[#0B101E] border border-[#10B981]/20 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/40 transition-all p-6 rounded-xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#10B981]/10 blur-[50px] pointer-events-none group-hover:bg-[#10B981]/20 transition-colors" />
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#10B981]" /> {t('home_52')}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                    {t('home_53')}
                  </p>
                </div>

                <div className="bg-[#0B101E] border border-[#F59E0B]/20 border-l-[4px] border-l-[#F59E0B] hover:border-[#F59E0B]/40 transition-all p-6 rounded-xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#F59E0B]/10 blur-[50px] pointer-events-none group-hover:bg-[#F59E0B]/20 transition-colors" />
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" /> {i18n.resolvedLanguage?.startsWith('en') ? 'Automatic Decision Engine' : 'Motor de Decisión Automático'}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                    {t('home_55')}
                  </p>
                </div>
              </FadeIn>
              
            </div>
        </section>

        {/* SECTION 9: GENERACIN DE PDF */}
          <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#06B6D4]/5 via-transparent to-transparent pointer-events-none" />
            <div className="flex flex-col items-center">
              <FadeIn className="text-center mb-16 max-w-5xl w-full flex flex-col items-center">
                <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{t("home_pdf_1")}</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6 md:whitespace-nowrap">{t("home_pdf_2")}</h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">{t("home_pdf_3")}</p>
              </FadeIn>
              <div className="grid lg:grid-cols-2 gap-16 items-center w-full relative z-10">
                <FadeIn className="order-2 md:order-1">
                  <div className="relative">
                    <div className="bg-[#1A1C23] border border-white/10 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/30 transition-all rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group h-full flex flex-col items-center justify-center min-h-[400px]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#06B6D4]/[0.03] blur-[80px] group-hover:bg-[#06B6D4]/[0.08] transition-colors pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10B981]/[0.03] blur-[80px] group-hover:bg-[#10B981]/[0.08] transition-colors pointer-events-none" />
                      
                      <FileText className="w-32 h-32 text-[#06B6D4]/80 relative z-10 transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-4" style={{ filter: "drop-shadow(0 0 30px rgba(6,182,212,0.3))" }} />
                      
                      <div className="mt-8 flex flex-col gap-3 relative z-10 w-full px-8">
                        <a href={i18n.language === "es" ? "/certificate_es.pdf" : "/certificate_en.pdf"} target="_blank" rel="noopener noreferrer" className="bg-[#06B6D4] text-black w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                          <Download className="w-5 h-5" /> {t("home_pdf_4")}
                        </a>
                        <div className="flex gap-3">
                          <a href={i18n.language === "es" ? "/certificate_es.pdf" : "/certificate_en.pdf"} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 text-white w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                            <Printer className="w-4 h-4" /> {t("home_pdf_5")}
                          </a>
                          <a href={i18n.language === "es" ? "/certificate_es.pdf" : "/certificate_en.pdf"} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 text-white w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                            <Mail className="w-4 h-4" /> {t("home_pdf_6")}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
                <div className="flex flex-col gap-6 w-full order-1 md:order-2">
                  <FadeIn delay={0.1}>
                    <div className="bg-[#0B101E] border border-[#06B6D4]/20 border-l-[4px] border-l-[#06B6D4] hover:border-[#06B6D4]/40 transition-all p-6 rounded-xl relative overflow-hidden group cursor-default">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-[#06B6D4]/10 blur-[50px] pointer-events-none group-hover:bg-[#06B6D4]/20 transition-colors" />
                      <h4 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10 text-lg">
                        <Shield className="w-5 h-5 text-[#06B6D4]" /> {t("home_pdf_7")}
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed relative z-10">{t("home_pdf_8")}</p>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <div className="bg-[#0B101E] border border-[#F59E0B]/20 border-l-[4px] border-l-[#F59E0B] hover:border-[#F59E0B]/40 transition-all p-6 rounded-xl relative overflow-hidden group cursor-default">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-[#F59E0B]/10 blur-[50px] pointer-events-none group-hover:bg-[#F59E0B]/20 transition-colors" />
                      <h4 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10 text-lg">
                        <ShieldCheck className="w-5 h-5 text-[#F59E0B]" /> {t("home_pdf_9")}
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed relative z-10">{t("home_pdf_10")}</p>
                    </div>
                  </FadeIn>
                  <FadeIn delay={0.3}>
                    <div className="bg-[#0B101E] border border-[#10B981]/20 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/40 transition-all p-6 rounded-xl relative overflow-hidden group cursor-default">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-[#10B981]/10 blur-[50px] pointer-events-none group-hover:bg-[#10B981]/20 transition-colors" />
                      <h4 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10 text-lg">
                        <QrCode className="w-5 h-5 text-[#10B981]" /> {t("home_pdf_11")}
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed relative z-10">{t("home_pdf_12")}</p>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </section>
          

        {/* SECTION 7: CONFIANZA TRANSPARENTE QR */}
        <section id="trace" className="py-32 border-y border-white/5 bg-[#060913] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <FadeIn className="text-center mb-20">
              <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{t("home_44")}</h2>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{t("home_45")}</h3>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                {t("home_46")}
              </p>
            </FadeIn>

            <FadeIn delay={0.2} className="mb-24">
              <QrSimulator />
            </FadeIn>
          </div>
        </section>

        {/* SECTION 8: SELLO DE GARANTA */}
        <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10B981]/5 via-transparent to-transparent pointer-events-none" />
          <div className="flex flex-col items-center">
            <FadeIn className="text-center mb-16 max-w-5xl w-full">
              <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{t("home_seal_1")}</h2>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6 md:whitespace-nowrap">{t("home_seal_2")}</h3>
              <p className="text-gray-400 text-lg leading-relaxed">{t("home_seal_3")}</p>
            </FadeIn>
            <div className="grid lg:grid-cols-2 gap-16 items-center w-full relative z-10">
              <FadeIn className="order-2 md:order-1">
                <div className="relative">
                  <div className="bg-[#1A1C23] border border-white/10 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/30 transition-all rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group h-full flex flex-col items-center justify-center min-h-[400px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/[0.03] blur-[80px] group-hover:bg-[#10B981]/[0.08] transition-colors pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#06B6D4]/[0.03] blur-[80px] group-hover:bg-[#06B6D4]/[0.08] transition-colors pointer-events-none" />
                    <img src="/sello.png" alt="SeedLab Control Official Seal" className="w-full max-w-[280px] aspect-square object-cover rounded-full relative z-10 transition-transform duration-700 group-hover:scale-105" style={{ filter: "drop-shadow(0 0 20px rgba(16,185,129,0.15))" }} />
                  </div>
                </div>
              </FadeIn>
              <div className="flex flex-col gap-6 w-full">
                <FadeIn delay={0.1}>
                  <div className="bg-[#0B101E] border border-[#06B6D4]/20 border-l-[4px] border-l-[#06B6D4] hover:border-[#06B6D4]/40 transition-all p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-[#06B6D4]/10 blur-[50px] pointer-events-none group-hover:bg-[#06B6D4]/20 transition-colors" />
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10">
                      <Shield className="w-5 h-5 text-[#06B6D4]" /> {i18n.resolvedLanguage?.startsWith('en') ? 'Premium Perception' : 'Percepción Premium'}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed relative z-10">{i18n.resolvedLanguage?.startsWith('en') ? 'Reinforce trust by offering a superior quality standard.' : 'Refuerza la confianza ofreciendo un estándar de calidad superior.'}</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <div className="bg-[#0B101E] border border-[#10B981]/20 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/40 transition-all p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-[#10B981]/10 blur-[50px] pointer-events-none group-hover:bg-[#10B981]/20 transition-colors" />
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10">
                      <CheckCircle2 className="w-5 h-5 text-[#10B981]" /> {i18n.resolvedLanguage?.startsWith('en') ? 'Absolute Trust' : 'Confianza Absoluta'}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed relative z-10">{i18n.resolvedLanguage?.startsWith('en') ? 'Eliminates buyer doubts about viability.' : 'Elimina las dudas del comprador sobre la viabilidad.'}</p>
                  </div>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <div className="bg-[#0B101E] border border-[#F59E0B]/20 border-l-[4px] border-l-[#F59E0B] hover:border-[#F59E0B]/40 transition-all p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-[#F59E0B]/10 blur-[50px] pointer-events-none group-hover:bg-[#F59E0B]/20 transition-colors" />
                    <h4 className="text-white font-bold mb-2 flex items-center gap-2 relative z-10">
                      <ShieldCheck className="w-5 h-5 text-[#F59E0B]" /> {i18n.resolvedLanguage?.startsWith('en') ? 'Anti-Counterfeiting Shield' : 'Blindaje Anti-Falsificación'}
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed relative z-10">{i18n.resolvedLanguage?.startsWith('en') ? 'Protect your reputation. Unique scanning guarantees the global authenticity of your genetics.' : 'Protege tu reputación. El escaneo único garantiza la autenticidad global de tus genéticas.'}</p>
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8.5: EU PLANT PASSPORT */}
        <section className="py-32 border-y border-white/5 bg-[#060913] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10B981]/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center">
              <FadeIn className="text-center mb-16 max-w-5xl w-full flex flex-col items-center">
                <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3 flex items-center gap-2">
                  {t("home_passport_tag")}
                </h2>
                <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                  {t("home_passport_title")}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                  {t("home_passport_desc")}
                </p>
              </FadeIn>

              <div className="grid lg:grid-cols-2 gap-16 items-center w-full relative z-10">
                <FadeIn className="order-2 md:order-1">
                  <div className="flex flex-col gap-6 w-full">
                    {[
                      { title: t("home_passport_f1"), desc: t("home_passport_f1_desc"), icon: CheckCircle, color: "10B981" },
                      { title: t("home_passport_f2"), desc: t("home_passport_f2_desc"), icon: FileText, color: "06B6D4" },
                      { title: t("home_passport_f3"), desc: t("home_passport_f3_desc"), icon: GitMerge, color: "F59E0B" }
                    ].map((feature, i) => (
                      <div key={i} className={`bg-[#0B101E] border border-[#${feature.color}]/20 border-l-[4px] border-l-[#${feature.color}] hover:border-[#${feature.color}]/40 transition-all p-6 rounded-xl relative overflow-hidden group cursor-default`}>
                        <div className={`absolute right-0 top-0 w-32 h-32 bg-[#${feature.color}]/10 blur-[50px] pointer-events-none group-hover:bg-[#${feature.color}]/20 transition-colors`} />
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                          <feature.icon className={`w-4 h-4 text-[#${feature.color}]`} /> {feature.title}
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                          {feature.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </FadeIn>

                <FadeIn className="order-1 md:order-2 w-full flex justify-center">
                <div className="bg-[#1A1C23] border border-white/10 border-l-[4px] border-l-[#10B981] rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center min-h-[400px]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#06B6D4]/[0.03] blur-[80px] pointer-events-none" />
                  
                  {/* Stacked Mockups Container */}
                  <div className="relative w-full min-w-[300px] sm:min-w-[400px] h-[400px] flex items-center justify-center">
                    {/* Mock IPPC Certificate (Stacked Furthest Behind) */}
                    <div className="absolute top-2 right-16 bg-white text-black p-4 border border-gray-300 w-[280px] h-[360px] font-sans shadow-xl transform rotate-12 opacity-30 hover:opacity-100 hover:rotate-4 hover:z-30 hover:scale-105 transition-all duration-500 z-0 flex flex-col">
                      <div className="text-center mb-2 border-b border-black pb-2">
                        <h3 className="font-bold text-[10px] uppercase">Phytosanitary Certificate</h3>
                        <h4 className="font-medium text-[6px] uppercase mt-1">Certificado Fitosanitario</h4>
                      </div>
                      <div className="bg-gray-100 p-1 mb-1 text-[6px] font-bold uppercase border border-gray-300">I. Consignment</div>
                      <div className="grid grid-cols-2 gap-1 mb-2">
                        <div className="border border-gray-300 p-1 text-[6px]">
                          <p className="font-bold text-gray-500">Exporter</p>
                          <p className="font-medium mt-0.5">SeedLab Genetics Inc.</p>
                        </div>
                        <div className="border border-gray-300 p-1 text-[6px]">
                          <p className="font-bold text-gray-500">Origin</p>
                          <p className="font-medium mt-0.5">ES</p>
                        </div>
                      </div>
                      <div className="border border-black mb-2 flex-1">
                        <div className="grid grid-cols-[1fr_2fr] bg-gray-50 text-[6px] font-bold uppercase border-b border-black p-1">
                          <div>Quantity</div>
                          <div>Botanical name</div>
                        </div>
                        <div className="grid grid-cols-[1fr_2fr] text-[6px] font-medium p-1">
                          <div>1 Lot</div>
                          <div className="italic">Cannabis sativa L.</div>
                        </div>
                      </div>
                      <div className="bg-gray-100 p-1 mb-1 text-[6px] font-bold uppercase border border-gray-300">II. Declaration</div>
                      <div className="text-[5px] text-justify italic leading-tight p-1 border border-gray-300">
                        Plants are considered to be free from quarantine pests.
                      </div>
                    </div>

                    {/* Mock USDA APHIS Certificate (Stacked Behind) */}
                    <div className="absolute top-0 right-8 bg-white text-black p-4 border border-gray-300 w-[280px] h-[360px] font-serif shadow-xl transform rotate-6 opacity-50 hover:opacity-100 hover:rotate-2 hover:z-20 hover:scale-105 transition-all duration-500 z-0 flex flex-col">
                      <div className="text-center mb-2 border-b border-black pb-2">
                        <h3 className="font-bold text-[8px] uppercase">United States Department of Agriculture</h3>
                        <h4 className="font-bold text-[10px] uppercase mt-1">Phytosanitary Certificate</h4>
                        <p className="text-[6px] text-gray-600 mt-0.5">FORM PPQ 577</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1 mb-2">
                        <div className="border border-gray-400 p-1 text-[6px]">
                          <p className="font-bold uppercase text-gray-500">Exporter</p>
                          <p className="font-medium mt-0.5">SeedLab Genetics Inc.</p>
                        </div>
                        <div className="border border-gray-400 p-1 text-[6px]">
                          <p className="font-bold uppercase text-gray-500">Consignee</p>
                          <p className="font-medium mt-0.5">Int. Partners LLC</p>
                        </div>
                      </div>
                      <div className="border-t border-b border-black py-2 mb-2 flex-1">
                        <div className="grid grid-cols-2 gap-1 text-[6px] font-bold uppercase mb-1">
                          <div>Botanical Name</div>
                          <div>Traceability</div>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[8px] font-medium">
                          <div className="italic">Cannabis sativa L.</div>
                          <div>UKC-260807</div>
                        </div>
                      </div>
                      <div className="text-[5px] text-justify leading-tight">
                        <p className="font-bold italic">This is to certify that the plants described herein have been inspected and are considered to be free from quarantine pests and to conform with phytosanitary requirements.</p>
                      </div>
                      <div className="mt-2 text-[6px] border-t border-black pt-1 flex justify-between">
                        <div>
                          <p className="font-bold">Date</p>
                          <p>{new Date().toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">Officer</p>
                          <p className="italic text-blue-800">System API</p>
                        </div>
                      </div>
                    </div>

                    {/* Mock Passport Label Visual (Foreground) */}
                    <div className="absolute bottom-8 left-4 bg-white text-black p-4 border-2 border-black w-full max-w-[320px] font-sans shadow-2xl transform -rotate-3 hover:rotate-0 hover:scale-105 hover:z-20 transition-all duration-500 z-10">
                      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-7 bg-blue-700 flex items-center justify-center mr-3">
                            <svg viewBox="0 0 100 100" className="w-5 h-5 text-yellow-400 fill-current">
                              <polygon points="50,5 61,39 98,39 68,60 79,95 50,74 21,95 32,60 2,39 39,39" />
                            </svg>
                          </div>
                          <div className="font-bold leading-tight">
                            <div className="text-xs">Plant Passport</div>
                            <div className="text-[8px]">Pasaporte Fitosanitario</div>
                          </div>
                        </div>
                        <QrCode className="w-8 h-8" />
                      </div>
                      
                      <div className="grid grid-cols-[20px_1fr] gap-y-2 text-xs font-bold">
                        <div className="text-gray-500">A</div><div className="italic">Cannabis sativa L.</div>
                        <div className="text-gray-500">B</div><div>ES-280491X</div>
                        <div className="text-gray-500">C</div><div>UKC-260807-B003</div>
                        <div className="text-gray-500">D</div><div>ES</div>
                      </div>
                      
                      <div className="absolute bottom-2 right-2 border border-black px-1.5 py-0.5 text-[10px] font-bold">
                        PZ
                      </div>
                    </div>
                  </div>

                </div>
              </FadeIn>

            </div>
            </div>
          </div>
        </section>

                  {/* SECTION 10: FACTURACIN Y LOGSTICA */}

{/* SECTION 7.5: FACTURACIÓN Y LOGÍSTICA */}
        <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/5">
          <FadeIn className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{t('home_erp_title')}</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{i18n.resolvedLanguage?.startsWith('en') ? 'Billing & Logistics' : 'Facturación y Logística'}</h3>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">{i18n.resolvedLanguage?.startsWith('en') ? <>Centralize the entire commercial flow.<br/>From automatic invoice generation to integration with transport agencies, everything connected to your inventory in real time.</> : <>Centraliza todo el flujo comercial.<br/>Desde la generación automática de facturas hasta la integración con agencias de transporte, todo conectado a tu inventario en tiempo real.</>}</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12">
            <FadeIn delay={0.1} className="bg-[#0B101E] border border-white/5 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/30 transition-all rounded-2xl p-8 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Receipt className="w-32 h-32 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
                <div className="p-3 rounded-lg bg-[#10B981]/10 text-[#10B981]">
                  <PieChart className="w-6 h-6" />
                </div>
                {t('home_billing_title')}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 relative z-10">
                {t('home_billing_desc')}
              </p>
              
              <div className="bg-[#1A1C23] border border-white/10 rounded-lg p-4 relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-500 font-bold uppercase">Live Revenue</span>
                  <span className="text-xs text-[#10B981] font-mono">+14.2%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                  <div className="h-full bg-[#10B981] w-[60%] animate-pulse"></div>
                  <div className="h-full bg-[#06B6D4] w-[25%]"></div>
                  <div className="h-full bg-yellow-400 w-[15%]"></div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3} className="bg-[#0B101E] border border-white/5 border-l-[4px] border-l-[#06B6D4] hover:border-[#06B6D4]/30 transition-all rounded-2xl p-8 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Truck className="w-32 h-32 text-[#06B6D4]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3 relative z-10">
                <div className="p-3 rounded-lg bg-[#06B6D4]/10 text-[#06B6D4]">
                  <Send className="w-6 h-6" />
                </div>
                {t('home_logistics_title')}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 relative z-10">
                {t('home_logistics_desc')}
              </p>
              
              <div className="bg-[#1A1C23] border border-white/10 rounded-lg p-4 relative z-10">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <span className="text-xs text-gray-500 font-bold uppercase">Shipment TRK-8492</span>
                  <span className="text-[10px] bg-[#10B981]/20 text-[#10B981] px-2 py-1 rounded border border-[#10B981]/30">Dispatched</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1"><Truck className="w-4 h-4 text-[#06B6D4]"/> UPS API</div>
                  <div className="w-full h-[1px] bg-gradient-to-r from-[#06B6D4]/50 to-transparent"></div>
                  <span className="text-white font-mono">1.2s</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        
        {/* SECTION 7: CONTROL OPERATIVO */}
        <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{t("home_47")}</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{t("home_48")}</h3>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">{t("home_49")}</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Alertas */}
            <FadeIn delay={0.1} className="bg-[#0B101E] border border-white/5 border-l-[4px] border-l-yellow-500 rounded-2xl p-8 hover:border-white/10 transition-colors">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Bell className="w-5 h-5 text-yellow-500"/> Notificaciones del Sistema</h3>
              <div className="space-y-4">
                <div className="bg-red-500/10 border-l-2 border-red-500 p-4 rounded-r-lg">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-red-400 uppercase">Bloqueo de Seguridad</span>
                    <span className="text-[10px] text-gray-500">hace 2 min</span>
                  </div>
                  <p className="text-sm text-gray-300">El lote SHOG-260 ha caído por debajo del umbral de viabilidad (72%). Congelado para su venta.</p>
                </div>
                <div className="bg-yellow-500/10 border-l-2 border-yellow-500 p-4 rounded-r-lg">
                   <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-yellow-400 uppercase">Prueba Expirada</span>
                    <span className="text-[10px] text-gray-500">hace 1h</span>
                  </div>
                  <p className="text-sm text-gray-300">La variedad Apex-4 requiere una nueva prueba de germinación obligatoria (6 meses transcurridos).</p>
                </div>
              </div>
            </FadeIn>

            {/* Audit Log */}
            <FadeIn delay={0.3} className="bg-[#0B101E] border border-[#06B6D4]/20 border-l-[4px] border-l-[#06B6D4] rounded-2xl p-8 shadow-[0_0_30px_rgba(6,182,212,0.05)] hover:border-[#06B6D4]/40 transition-colors">
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><ListChecks className="w-5 h-5 text-[#06B6D4]"/> Registro de Auditoría</h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs text-gray-400 font-mono whitespace-nowrap">
                   <thead className="border-b border-white/10 text-gray-500">
                     <tr>
                       <th className="pb-2 font-normal">FECHA/HORA</th>
                       <th className="pb-2 font-normal">ID_USUARIO</th>
                       <th className="pb-2 font-normal">REGISTRO_ACCIÓN</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     <tr>
                       <td className="py-3">10/26 14:32</td>
                       <td className="py-3 text-[#06B6D4]">ADM_JDOE</td>
                       <td className="py-3 text-gray-300">AJUSTE_STOCK: <span className="text-red-400 line-through">8000</span> ➔ <span className="text-green-400">7950</span> <span className="text-gray-500">(Pérdida registrada)</span></td>
                     </tr>
                     <tr>
                       <td className="py-3">10/26 16:15</td>
                       <td className="py-3 text-[#10B981]">LAB_TECH_02</td>
                       <td className="py-3 text-gray-300">FIRMA_PRUEBA_APLICADA: Cert_SHOG_2606</td>
                     </tr>
                     <tr>
                       <td className="py-3">10/26 16:45</td>
                       <td className="py-3 text-gray-500">SYSTEM_AUTO</td>
                       <td className="py-3 text-gray-300">ACTUALIZACIÓN_ESTADO: Lote SHOG-260 ➔ <span className="text-[#10B981]">APROBADO</span></td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </FadeIn>
          </div>
        </section>



        {/* SECTION 9: MODELO ENTERPRISE Y LEAD CAPTURE */}
        <ComplianceVault />
        <ImmuneSystemSimulator />
        <LicensingTiers />

        {/* SECTION 8: MATRIZ DE BENEFICIOS (MOVED HERE) */}
        <section className="py-24 border-y border-white/5 bg-[#060913]">
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">{t('home_141')}</h2>
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6">{t('home_142')}</h3>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {t('home_143')}
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { t: t('home_144'), i: FlaskConical, c: 'text-[#10B981]', border: 'border-l-[#10B981]', hoverBorder: 'hover:border-[#10B981]/30', d: t('home_145') },
                { t: t('home_146'), i: Settings, c: 'text-[#06B6D4]', border: 'border-l-[#06B6D4]', hoverBorder: 'hover:border-[#06B6D4]/30', d: t('home_147') },
                { t: t('home_148'), i: ShieldCheck, c: 'text-white', border: 'border-l-white', hoverBorder: 'hover:border-white/30', d: t('home_149') },
                { t: t('home_150'), i: TrendingUp, c: 'text-yellow-400', border: 'border-l-yellow-400', hoverBorder: 'hover:border-yellow-400/30', d: t('home_151') },
                { t: t('home_172'), i: Truck, c: 'text-[#F59E0B]', border: 'border-l-[#F59E0B]', hoverBorder: 'hover:border-[#F59E0B]/30', d: t('home_173') },
                { t: t('home_174'), i: Building, c: 'text-[#6366F1]', border: 'border-l-[#6366F1]', hoverBorder: 'hover:border-[#6366F1]/30', d: t('home_175') }
              ].map((b, i) => (
                <FadeIn key={i} delay={i * 0.1} className={`bg-[#1A1C23] border border-white/5 border-l-[4px] ${b.border} ${b.hoverBorder} p-6 rounded-xl hover:bg-white/5 transition-all group cursor-default`}>
                  <b.i className={`w-8 h-8 ${b.c} mb-4 group-hover:scale-110 transition-transform`} />
                  <h4 className="font-bold text-white mb-2 tracking-wide text-sm">{b.t}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{b.d}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section id="demo-form" className="py-32 max-w-4xl mx-auto px-6 text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#10B981]/10 via-transparent to-transparent pointer-events-none" />
          
          <FadeIn>
            <div className="relative bg-[#0B101E] border border-white/10 border-l-[4px] border-l-[#06B6D4] hover:border-[#06B6D4]/30 transition-all rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-left">
              <h3 className="text-2xl font-bold text-white mb-2 text-center">{t('home_165')}</h3>
              <p className="text-sm text-gray-400 mb-8 text-center">{t('home_166')}</p>
              
              <form className="space-y-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder={t('home_154')} className="w-full bg-[#1A1C23] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] transition-colors" />
                  <input type="email" placeholder={t('home_155')} className="w-full bg-[#1A1C23] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] transition-colors" />
                </div>
                <input type="text" placeholder={t('home_156')} className="w-full bg-[#1A1C23] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] transition-colors" />
                <textarea rows="3" placeholder={t('home_167')} className="w-full bg-[#1A1C23] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#06B6D4] transition-colors resize-none" />
                <button className="w-full bg-gradient-to-r from-[#10B981] to-[#06B6D4] text-[#02040A] font-black py-4 rounded-lg text-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all mt-4">
                  {t('home_157')}
                </button>
                <p className="text-[10px] text-gray-500 text-center mt-4">{t('home_158')}</p>
              </form>
            </div>
          </FadeIn>
        </section>

      </main>



      <WhitepaperModal isOpen={showWhitepaper} onClose={() => setShowWhitepaper(false)} />
    </>
  );
};

export default Home;
