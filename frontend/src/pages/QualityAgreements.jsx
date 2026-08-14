import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, ShieldCheck, X, Briefcase, Percent, Droplets, Biohazard, Edit, Thermometer, Lock, Cpu, Truck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function QualityAgreements() {
  const { qualityAgreements, setQualityAgreements, clients } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: '',
    minGermination: 98,
    maxMoisture: 8,
    minFeminisation: 99,
    requiresPathogenFree: true,
    requiresColdChain: false,
    maxTransportTemp: 8,
    requiresDataLogger: false,
    requiresTamperSeal: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientId) return;
    
    // Check if client already has an agreement
    const existingIndex = qualityAgreements.findIndex(qa => qa.clientId === formData.clientId);
    
    const newAgreement = {
      id: existingIndex >= 0 ? qualityAgreements[existingIndex].id : `QA-${Math.floor(Math.random()*10000)}`,
      ...formData
    };
    
    if (existingIndex >= 0) {
       const updated = [...qualityAgreements];
       updated[existingIndex] = newAgreement;
       setQualityAgreements(updated);
    } else {
       setQualityAgreements([newAgreement, ...qualityAgreements]);
    }
    
    setShowModal(false);
  };

  const getClientName = (clientId) => {
    const c = clients.find(c => c.id === clientId);
    return c ? c.name : 'Unknown Client';
  };

  return (
    <div className="relative h-full flex flex-col pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Quality Agreements</h1>
          <p className="text-sm text-text-muted">B2B Custom Quality Gates & Specifications Engine</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ clientId: '', minGermination: 98, maxMoisture: 8, minFeminisation: 99, requiresPathogenFree: true, requiresColdChain: false, maxTransportTemp: 8, requiresDataLogger: false, requiresTamperSeal: false });
            setShowModal(true);
          }}
          className="tech-button bg-primary-cyan text-black hover:bg-primary-cyan/90 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> New Agreement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {qualityAgreements.map(qa => (
          <motion.div key={qa.id} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="glass-panel p-6 border-l-4 border-l-primary-cyan relative group">
             <button 
                onClick={() => { setFormData(qa); setShowModal(true); }}
                className="absolute top-4 right-4 text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
             >
                <Edit className="w-4 h-4" />
             </button>
             <div className="flex items-center mb-4">
                <Briefcase className="w-8 h-8 text-primary-cyan mr-3" />
                <div>
                  <h3 className="text-lg font-bold text-white">{getClientName(qa.clientId)}</h3>
                  <p className="text-xs text-text-muted font-mono">{qa.id}</p>
                </div>
             </div>
             
             <div className="space-y-3 mt-4 border-t border-border/50 pt-4">
                <div className="flex justify-between items-center">
                   <span className="text-sm text-text-muted flex items-center"><Percent className="w-4 h-4 mr-2 text-primary-green"/> Min Germination</span>
                   <span className="text-white font-bold">{qa.minGermination}%</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-text-muted flex items-center"><Droplets className="w-4 h-4 mr-2 text-blue-400"/> Max Moisture</span>
                   <span className="text-white font-bold">{qa.maxMoisture}%</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-text-muted flex items-center"><Percent className="w-4 h-4 mr-2 text-purple-400"/> Min Feminisation</span>
                   <span className="text-white font-bold">{qa.minFeminisation}%</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-text-muted flex items-center"><Biohazard className="w-4 h-4 mr-2 text-red-400"/> Pathogen Free</span>
                   {qa.requiresPathogenFree ? <ShieldCheck className="w-5 h-5 text-primary-green" /> : <span className="text-text-muted">No</span>}
                </div>
             </div>
             
             <div className="space-y-3 mt-4 border-t border-border/50 pt-4">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center"><Truck className="w-4 h-4 mr-1"/> Transport & Logistics</h4>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-text-muted flex items-center"><Thermometer className="w-4 h-4 mr-2 text-blue-300"/> Cold Chain / Max Temp</span>
                   {qa.requiresColdChain ? <span className="text-white font-bold text-blue-300">Yes (Max {qa.maxTransportTemp}°C)</span> : <span className="text-text-muted">No</span>}
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-text-muted flex items-center"><Cpu className="w-4 h-4 mr-2 text-orange-400"/> Data Logger Required</span>
                   {qa.requiresDataLogger ? <span className="text-orange-400 font-bold">Yes</span> : <span className="text-text-muted">No</span>}
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm text-text-muted flex items-center"><Lock className="w-4 h-4 mr-2 text-primary-cyan"/> Tamper Seal Required</span>
                   {qa.requiresTamperSeal ? <span className="text-primary-cyan font-bold">Yes</span> : <span className="text-text-muted">No</span>}
                </div>
             </div>
          </motion.div>
        ))}
        {qualityAgreements.length === 0 && (
           <div className="lg:col-span-3 flex flex-col items-center justify-center py-12 glass-panel border border-dashed border-border text-center">
              <FileText className="w-12 h-12 text-text-muted mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Quality Agreements</h3>
              <p className="text-text-muted mb-4 max-w-md">Define specific quality requirements for your enterprise clients to automatically block dispatches that don't meet their criteria.</p>
           </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white">Quality Agreement</h3>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Target Client *</label>
                  <select required value={formData.clientId} onChange={e=>setFormData({...formData, clientId: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none">
                    <option value="" disabled>Select Client...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-medium text-text-muted mb-1">Min Germination (%)</label>
                     <input type="number" min="0" max="100" value={formData.minGermination} onChange={e=>setFormData({...formData, minGermination: parseFloat(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-text-muted mb-1">Max Moisture (%)</label>
                     <input type="number" min="0" max="100" step="0.1" value={formData.maxMoisture} onChange={e=>setFormData({...formData, maxMoisture: parseFloat(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-medium text-text-muted mb-1">Min Feminisation (%)</label>
                     <input type="number" min="0" max="100" step="0.1" value={formData.minFeminisation} onChange={e=>setFormData({...formData, minFeminisation: parseFloat(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                   </div>
                   <div className="flex flex-col justify-center pt-4">
                     <label className="flex items-center space-x-2 text-sm text-white cursor-pointer">
                       <input type="checkbox" checked={formData.requiresPathogenFree} onChange={e=>setFormData({...formData, requiresPathogenFree: e.target.checked})} className="form-checkbox text-primary-cyan bg-background border-border rounded focus:ring-primary-cyan" />
                       <span>Pathogen Free Required</span>
                     </label>
                   </div>
                </div>

                <div className="border-t border-border/50 pt-4 mt-2">
                   <h4 className="text-sm font-bold text-white mb-4 flex items-center"><Truck className="w-4 h-4 mr-2 text-primary-cyan"/> Transport & Logistics GxP Gates</h4>
                   
                   <div className="grid grid-cols-2 gap-4 mb-4">
                     <div className="flex flex-col justify-center">
                       <label className="flex items-center space-x-2 text-sm text-white cursor-pointer">
                         <input type="checkbox" checked={formData.requiresColdChain} onChange={e=>setFormData({...formData, requiresColdChain: e.target.checked})} className="form-checkbox text-blue-400 bg-background border-border rounded focus:ring-blue-400" />
                         <span className={formData.requiresColdChain ? "text-blue-400 font-bold" : ""}>Requires Cold Chain</span>
                       </label>
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-text-muted mb-1">Max Transport Temp (°C)</label>
                       <input disabled={!formData.requiresColdChain} type="number" step="0.1" value={formData.maxTransportTemp} onChange={e=>setFormData({...formData, maxTransportTemp: parseFloat(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-blue-400 focus:outline-none font-mono disabled:opacity-50" />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col justify-center">
                       <label className="flex items-center space-x-2 text-sm text-white cursor-pointer">
                         <input type="checkbox" checked={formData.requiresDataLogger} onChange={e=>setFormData({...formData, requiresDataLogger: e.target.checked})} className="form-checkbox text-orange-400 bg-background border-border rounded focus:ring-orange-400" />
                         <span>Require Data Logger</span>
                       </label>
                     </div>
                     <div className="flex flex-col justify-center">
                       <label className="flex items-center space-x-2 text-sm text-white cursor-pointer">
                         <input type="checkbox" checked={formData.requiresTamperSeal} onChange={e=>setFormData({...formData, requiresTamperSeal: e.target.checked})} className="form-checkbox text-primary-cyan bg-background border-border rounded focus:ring-primary-cyan" />
                         <span>Require Tamper Seal</span>
                       </label>
                     </div>
                   </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-cyan text-black font-medium hover:bg-primary-cyan/90 transition-colors">Save Agreement</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
