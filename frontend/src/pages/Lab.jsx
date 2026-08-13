import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Search, Calendar, User, ThermometerSun, Save, FileSignature, FileText, Microscope, AlertCircle, Play, X, ShieldCheck, Activity, Printer, Download, Mail, CheckCircle2, Dna } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { generateCertificate } from '../utils/pdfGenerator';

export default function Lab() {
  const { tests, addTest, updateTest, finalizeTest, batches, varieties, companyProfile } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTestId, setActiveTestId] = useState(tests.length > 0 ? tests[0].id : null);
  const [showNewTestModal, setShowNewTestModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfDataUri, setPdfDataUri] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');
  const [emailPromptOpen, setEmailPromptOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const activeTest = tests.find(t => t.id === activeTestId);
  const activeBatch = activeTest ? batches.find(b => b.id === activeTest.batch) : null;
  const [dailyCounts, setDailyCounts] = useState({});
  const [notes, setNotes] = useState('');
  
  // New test form state
  const [formData, setFormData] = useState({ batch: '', sampleSize: 100, targetTemp: '22°C', method: 'Petri dish + paper' });

  useEffect(() => {
    if (activeTest) {
      setDailyCounts(activeTest.dailyCounts || {});
      setNotes(activeTest.notes || '');
    }
  }, [activeTestId, tests]);

  const handleDayChange = (day, field, value) => {
    setDailyCounts(prev => {
      const prevDay = prev[day];
      const isLegacy = typeof prevDay === 'number';
      const baseObj = isLegacy ? { germinated: prevDay, dead: '', notes: '', image: null } : (prevDay || { germinated: '', dead: '', notes: '', image: null });
      
      const parsedValue = (field === 'germinated' || field === 'dead') ? (value === '' ? '' : parseInt(value) || 0) : value;
      return { ...prev, [day]: { ...baseObj, [field]: parsedValue } };
    });
  };

  const handleDayImageUpload = (day, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleDayChange(day, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    if (activeTest) {
      updateTest(activeTest.id, { dailyCounts, notes });
    }
  };

  const handleSignOff = () => {
    if (activeTest) {
      handleSaveDraft();
      finalizeTest(activeTest.id, calculateEngine(dailyCounts, activeTest.sampleSize).finalPct, calculateEngine(dailyCounts, activeTest.sampleSize).status);
    }
  };

  const handleGeneratePDF = async () => {
    if (!activeTest) return;
    const batch = batches.find(b => b.id === activeTest.batch);
    const variety = varieties.find(v => v.name === batch?.variety);
    const batchTests = tests.filter(t => t.batch === activeTest.batch);
    try {
      const result = await generateCertificate(batchTests, batch || {}, variety, companyProfile, activeTest);
      setPdfDataUri(result.dataUri);
      setPdfBlobUrl(result.blobUrl);
      setShowPdfModal(true);
      setEmailPromptOpen(false);
      setEmailSent(false);
      setCustomerEmail('');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error interno al generar PDF: ' + (error.message || error.toString()));
    }
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = `Certificado-${activeTest?.id || 'Test'}.pdf`;
    link.click();
  };

  const handlePrintPDF = () => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfDataUri;
    document.body.appendChild(iframe);
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  const handleEmailPDF = async (e) => {
    e.preventDefault();
    if (customerEmail) {
      try {
        const apiKey = import.meta.env.VITE_RESEND_API_KEY;
        if (!apiKey || apiKey === 're_tu_api_key_aqui') {
          alert('Por favor, configura tu VITE_RESEND_API_KEY en el archivo .env de frontend');
          return;
        }

        const base64Data = pdfDataUri.split('base64,')[1];
        
        const response = await fetch('/api/resend/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            from: 'SeedLab Control <onboarding@resend.dev>',
            to: [customerEmail],
            subject: `Certificado de Trazabilidad - ${activeTest?.id}`,
            html: `<p>Hola,</p><p>Le enviamos adjunto el certificado de trazabilidad de su lote.</p><p>Puede verificar la autenticidad del documento online aquí: <a href="https://seedlab.local/verify/${activeTest?.id.replace('-','')}">Verificación Oficial</a></p><p>Gracias.</p>`,
            attachments: [
              {
                filename: `Certificado-${activeTest?.id}.pdf`,
                content: base64Data,
              }
            ]
          })
        });

        if (response.ok) {
          setEmailSent(true);
          setTimeout(() => {
            setEmailPromptOpen(false);
            setEmailSent(false);
            setCustomerEmail('');
          }, 2000);
        } else {
          const errorData = await response.json();
          alert('Error de Resend: ' + (errorData.message || 'Desconocido'));
        }
      } catch (err) {
        console.error('Error enviando email:', err);
        alert('Fallo de red o CORS al contactar con Resend.');
      }
    }
  };

  const handleNewTestSubmit = (e) => {
    e.preventDefault();
    if (!formData.batch) return;
    const newId = addTest({
      batch: formData.batch,
      sampleSize: parseInt(formData.sampleSize),
      targetTemp: formData.targetTemp,
      method: formData.method,
      technician: 'Dr. Sarah Chen',
      startDate: new Date().toISOString().split('T')[0]
    });
    
    // Set the new test as active so the user sees it immediately
    newId.then(id => {
      if (id) setActiveTestId(id);
    });
    
    setShowNewTestModal(false);
    setFormData({ batch: '', sampleSize: 100, targetTemp: '22°C', method: 'Petri dish + paper' });
  };

  const calculateEngine = (counts, sampleSize = 100) => {
    const activeDays = Object.keys(counts).map(Number).sort((a,b)=>a-b);
    if(activeDays.length === 0) return { finalPct: 0, mgt: 0, cvg: 0, status: 'Incomplete' };
    
    let totalGerminated = 0;
    let sumNiTi = 0;
    
    activeDays.forEach(day => {
      const dayData = counts[day];
      const count = typeof dayData === 'number' ? dayData : (dayData?.germinated || 0);
      totalGerminated += count;
      sumNiTi += (count * day);
    });

    const finalPct = Math.min(100, Math.round((totalGerminated / sampleSize) * 100));
    const mgt = totalGerminated > 0 ? (sumNiTi / totalGerminated).toFixed(2) : 0;
    const cvg = mgt > 0 ? (100 / mgt).toFixed(1) : 0;
    
    let status = 'Review';
    if(finalPct >= 95) status = 'Excellent';
    else if(finalPct >= 90) status = 'Apto';
    else if(finalPct < 85 && finalPct > 0) status = 'Blocked';

    return { finalPct, mgt, cvg, status };
  };

  const engine = activeTest ? calculateEngine(dailyCounts, activeTest.sampleSize) : { finalPct: 0, mgt: 0, cvg: 0, status: 'N/A' };

  return (
    <div className="relative h-full flex flex-col pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Germination Test</h1>
          <p className="text-sm text-text-muted">Automated quality testing and viability calculations.</p>
        </div>
        <div className="flex space-x-3">
          <select 
            value={activeTestId || ''} 
            onChange={(e) => setActiveTestId(e.target.value)}
            className="bg-background border border-border rounded-md py-2 px-4 text-sm focus:border-primary-cyan focus:outline-none text-white w-64"
          >
            <option value="" disabled>Select Active Test...</option>
            {tests.map(t => <option key={t.id} value={t.id}>{t.id} - {t.batch} ({t.status})</option>)}
          </select>
          <button className="tech-button bg-primary-green/10 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black flex items-center"
            onClick={() => setShowNewTestModal(true)}>
            <Play className="w-4 h-4 mr-2" /> Start New Test
          </button>
        </div>
      </div>

      {!activeTest ? (
        <div className="flex-1 flex flex-col items-center justify-center glass-panel rounded-xl border-l-4 border-l-text-muted">
          <Beaker className="w-16 h-16 text-text-muted mb-4 opacity-50" />
          <h2 className="text-xl font-bold text-white mb-2">No Active Test Selected</h2>
          <p className="text-text-muted">Select a test from the dropdown or start a new one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col h-full space-y-6">
            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="glass-panel p-5 border-l-4 border-l-primary-cyan">
              <h3 className="text-lg font-bold text-white mb-4 border-b border-border/50 pb-2">Test Parameters</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-text-muted flex items-center"><Search className="w-3.5 h-3.5 mr-1.5"/> Batch ID</span><span className="font-mono text-white">{activeTest.batch}</span></div>
                <div className="flex justify-between"><span className="text-text-muted flex items-center"><Dna className="w-3.5 h-3.5 mr-1.5"/> Genetics</span><span className="text-primary-cyan font-medium">{activeBatch?.variety || 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-text-muted flex items-center"><User className="w-3.5 h-3.5 mr-1.5"/> Technician</span><span className="text-white">{activeTest.technician}</span></div>
                <div className="flex justify-between"><span className="text-text-muted flex items-center"><Calendar className="w-3.5 h-3.5 mr-1.5"/> Start Date</span><span className="font-mono text-white">{activeTest.startDate}</span></div>
                <div className="flex justify-between"><span className="text-text-muted flex items-center"><Beaker className="w-3.5 h-3.5 mr-1.5"/> Sample Size</span><span className="font-mono text-white">{activeTest.sampleSize} seeds</span></div>
                <div className="flex justify-between"><span className="text-text-muted flex items-center"><ThermometerSun className="w-3.5 h-3.5 mr-1.5"/> Target Temp</span><span className="text-white">{activeTest.targetTemp}</span></div>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: 0.1}} className="glass-panel p-5 bg-gradient-to-b from-card/80 to-background border-l-4 border-l-blue-500">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center"><Activity className="w-4 h-4 mr-2"/> Real-Time Telemetry</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">Germination Rate</p>
                  <p className="text-3xl font-mono text-primary-cyan font-bold">{engine.finalPct.toFixed(1)}%</p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Mean Germ Time</p>
                    <p className="text-lg font-mono text-white">{engine.mgt} <span className="text-xs text-text-muted">days</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Velocity Coef.</p>
                    <p className="text-lg font-mono text-white">{engine.cvg}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: 0.2}} className="glass-panel p-5 border border-primary-green/30 relative overflow-hidden border-l-4 border-l-primary-green">
              <div className="absolute inset-0 bg-primary-green/5 blur-xl"></div>
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2 relative z-10">Automated Decision</h3>
              <div className="flex items-center space-x-3 relative z-10">
                {engine.status === 'Excellent' && <ShieldCheck className="w-8 h-8 text-primary-green" />}
                {engine.status === 'Apto' && <ShieldCheck className="w-8 h-8 text-primary-cyan" />}
                {engine.status === 'Review' && <AlertCircle className="w-8 h-8 text-yellow-400" />}
                {engine.status === 'Blocked' && <X className="w-8 h-8 text-red-500" />}
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Quality Engine Status</p>
                  <p className={`text-xl font-bold ${engine.status === 'Excellent' ? 'text-primary-green' : engine.status === 'Apto' ? 'text-primary-cyan' : engine.status === 'Review' ? 'text-yellow-400' : 'text-red-500'}`}>{engine.status}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 flex flex-col h-full space-y-6">
            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.3}} className="glass-panel p-6 flex-1 flex flex-col border-l-4 border-l-purple-500">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center"><Microscope className="w-5 h-5 mr-2 text-primary-cyan"/> Daily Tracking Grid</h3>
                <button onClick={handleSaveDraft} className="text-xs bg-background border border-border text-text-muted px-3 py-1.5 rounded flex items-center hover:text-white hover:border-primary-cyan transition-colors" disabled={activeTest.status === 'Completed'}>
                  <Save className="w-3.5 h-3.5 mr-1.5"/> Save Draft
                </button>
              </div>
              
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar" style={{maxHeight: '400px'}}>
                {Array.from({length: 7}).map((_, i) => {
                  const day = i + 1;
                  const dayData = dailyCounts[day] || { germinated: '', dead: '', notes: '', image: null };
                  const isLegacy = typeof dailyCounts[day] === 'number';
                  const gCount = isLegacy ? dailyCounts[day] : dayData.germinated;

                  return (
                    <div key={day} className="bg-background border border-border/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-primary-cyan uppercase tracking-wider">Day {day}</h4>
                        {dayData.image && !isLegacy && <span className="text-xs text-primary-green flex items-center"><ShieldCheck className="w-3 h-3 mr-1" /> Photo Attached</span>}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Germinated</label>
                          <input 
                            type="number" 
                            min="0"
                            disabled={activeTest.status === 'Completed'}
                            value={gCount === 0 && gCount !== '' ? 0 : gCount || ''} 
                            onChange={(e) => handleDayChange(day, 'germinated', e.target.value)}
                            className="w-full bg-card border border-border rounded px-3 py-2 text-white focus:border-primary-cyan focus:outline-none disabled:opacity-50 font-mono" 
                            placeholder="0" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Dead / Failed</label>
                          <input 
                            type="number" 
                            min="0"
                            disabled={activeTest.status === 'Completed'}
                            value={isLegacy ? '' : (dayData.dead === 0 && dayData.dead !== '' ? 0 : dayData.dead || '')} 
                            onChange={(e) => handleDayChange(day, 'dead', e.target.value)}
                            className="w-full bg-card border border-border rounded px-3 py-2 text-white focus:border-orange-400 focus:outline-none disabled:opacity-50 font-mono" 
                            placeholder="0" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Day Photo</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            disabled={activeTest.status === 'Completed'}
                            onChange={(e) => handleDayImageUpload(day, e)}
                            className="w-full bg-card border border-border rounded p-1.5 text-sm text-text-muted file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-primary-cyan/10 file:text-primary-cyan hover:file:bg-primary-cyan/20 cursor-pointer disabled:opacity-50" 
                          />
                        </div>
                        <div className="md:col-span-3">
                           <label className="block text-[10px] text-text-muted uppercase tracking-wider mb-1">Notes</label>
                           <input
                              type="text"
                              disabled={activeTest.status === 'Completed'}
                              value={isLegacy ? '' : (dayData.notes || '')}
                              onChange={(e) => handleDayChange(day, 'notes', e.target.value)}
                              className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-white focus:border-primary-cyan focus:outline-none disabled:opacity-50"
                              placeholder="Record any anomalies for this day..."
                           />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex-1">
                <AlertCircle className="w-5 h-5 text-orange-400 mr-3 shrink-0" />
                <div className="w-full flex flex-col h-full">
                  <p className="text-sm font-medium text-orange-400 mb-2">Technician Notes</p>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={activeTest.status === 'Completed'}
                    className="w-full bg-background border border-border/50 rounded-md p-3 text-sm text-text-main focus:outline-none focus:border-orange-400/50 flex-1 resize-y disabled:opacity-50"
                    placeholder="Record any anomalies (e.g. mold, abnormal seedlings)..."
                  ></textarea>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.4}} className="glass-panel p-6 bg-[#06111f] border-primary-cyan/20 border-l-4 border-l-orange-400">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center mb-1"><FileSignature className="w-5 h-5 mr-2 text-primary-cyan"/> Cryptographic Sign-off</h3>
                  <p className="text-sm text-text-muted">Approve results and generate public verification PDF.</p>
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                  <button 
                    onClick={handleGeneratePDF} 
                    disabled={activeTest.status !== 'Completed'}
                    className="flex-1 md:flex-none tech-button bg-background border border-border text-white hover:text-primary-cyan disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-white"
                  >
                    Generar Certificado
                  </button>
                  <button onClick={handleSignOff} disabled={activeTest.status === 'Completed'} className="flex-1 md:flex-none tech-button bg-primary-cyan text-black hover:bg-primary-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    {activeTest.status === 'Completed' ? 'Signed & Authorized' : 'Sign & Authorize'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* New Test Modal */}
      <AnimatePresence>
        {showNewTestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white">Start New Germination Test</h3>
                <button onClick={() => setShowNewTestModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleNewTestSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Target Batch ID *</label>
                  <select required value={formData.batch} onChange={e=>setFormData({...formData, batch: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono">
                    <option value="">Select Batch...</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.id} - {b.variety} ({b.currentQty} seeds avail)</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Sample Size (Seeds) *</label>
                    <input required type="number" min="10" value={formData.sampleSize} onChange={e=>setFormData({...formData, sampleSize: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Target Temp</label>
                    <input type="text" value={formData.targetTemp} onChange={e=>setFormData({...formData, targetTemp: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Testing Method</label>
                  <input type="text" value={formData.method} onChange={e=>setFormData({...formData, method: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowNewTestModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-green text-black font-medium hover:bg-primary-green/90 transition-colors">Initialize Test</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPdfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#06111f] border border-border rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border flex justify-between items-center bg-card/80">
                <h3 className="text-lg font-bold text-white flex items-center"><FileText className="w-5 h-5 mr-2 text-primary-cyan"/> Certificate Preview</h3>
                <div className="flex items-center space-x-2">
                  <button onClick={handleDownloadPDF} className="flex items-center px-3 py-1.5 text-sm rounded bg-background border border-border text-white hover:text-primary-cyan transition-colors">
                    <Download className="w-4 h-4 mr-1.5"/> Download
                  </button>
                  <button onClick={handlePrintPDF} className="flex items-center px-3 py-1.5 text-sm rounded bg-background border border-border text-white hover:text-primary-cyan transition-colors">
                    <Printer className="w-4 h-4 mr-1.5"/> Print
                  </button>
                  <button onClick={() => setEmailPromptOpen(!emailPromptOpen)} className="flex items-center px-3 py-1.5 text-sm rounded bg-primary-cyan text-black font-medium hover:bg-primary-cyan/90 transition-colors">
                    <Mail className="w-4 h-4 mr-1.5"/> Send via Email
                  </button>
                  <div className="w-px h-6 bg-border mx-2"></div>
                  <button onClick={() => setShowPdfModal(false)} className="text-text-muted hover:text-white p-1"><X className="w-5 h-5"/></button>
                </div>
              </div>
              
              {emailPromptOpen && (
                <div className="p-4 bg-card border-b border-border">
                  <form onSubmit={handleEmailPDF} className="flex items-end space-x-4 max-w-lg">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-text-muted mb-1">Email del Cliente</label>
                      <input type="email" required value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="cliente@empresa.com" className="w-full bg-background border border-border rounded p-2 text-sm text-white focus:border-primary-cyan focus:outline-none" />
                    </div>
                    <button type="submit" className="px-4 py-2 rounded bg-primary-cyan text-black text-sm font-medium hover:bg-primary-cyan/90 transition-colors disabled:opacity-50">
                      {emailSent ? <CheckCircle2 className="w-5 h-5" /> : 'Enviar Documento'}
                    </button>
                  </form>
                  {emailSent && <p className="text-xs text-primary-green mt-2 flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Documento enviado con éxito.</p>}
                </div>
              )}

              <div className="flex-1 bg-gray-500/10 p-4">
                <iframe src={pdfBlobUrl} className="w-full h-full rounded shadow-lg bg-white" title="PDF Preview" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
