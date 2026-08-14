import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Plus, X, FileSignature, CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function QualityEvents() {
  const { qualityEvents, addQualityEvent, updateQualityEvent, currentUser, executeCascadingQuarantine } = useAppContext();
  const [showNewModal, setShowNewModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'NC', // NC, CAPA, Complaint
    description: '',
    relatedEntity: '' // batch, mother, clone etc
  });

  const [closeData, setCloseData] = useState({
    resolution: '',
    qaPin: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    await addQualityEvent(formData);
    setShowNewModal(false);
    setFormData({ title: '', type: 'NC', description: '', relatedEntity: '' });
  };

  const handleCloseSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !closeData.qaPin) return;
    
    try {
      await updateQualityEvent(selectedEventId, { status: 'Closed', resolution: closeData.resolution }, closeData.qaPin);
      setShowCloseModal(false);
      setCloseData({ resolution: '', qaPin: '' });
      setSelectedEventId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExpandToCapa = async (id) => {
     try {
       await updateQualityEvent(id, { CAPA: true, type: 'CAPA' }, '0000');
     } catch(e) {
       alert('QA PIN 0000 required to elevate to CAPA - (hardcoded to 0000 for this action for simplicity)');
     }
  };

  const handleTriggerRecall = async (id, entity) => {
    if(confirm('Trigger cascading quarantine based on this event?')) {
       try {
         await executeCascadingQuarantine(entity, `Triggered by Event ${id}`, '0000');
         await updateQualityEvent(id, { recall: true }, '0000');
       } catch (e) {
         alert(e.message);
       }
    }
  };

  return (
    <div className="relative h-full flex flex-col pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Quality Events</h1>
          <p className="text-sm text-text-muted">Unified NC, CAPA, and Complaints Management</p>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="tech-button bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500 hover:text-black flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Log Event
        </button>
      </div>

      <div className="space-y-4">
        {qualityEvents.map(ev => (
          <motion.div key={ev.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className={`glass-panel p-5 border-l-4 ${ev.status === 'Closed' ? 'border-l-primary-green opacity-60' : ev.type === 'CAPA' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
             <div className="flex justify-between items-start">
               <div>
                 <div className="flex items-center space-x-3 mb-2">
                   <span className={`px-2 py-0.5 text-xs rounded font-bold ${ev.type === 'CAPA' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{ev.type}</span>
                   <span className="text-white font-bold">{ev.title}</span>
                   <span className="text-xs text-text-muted font-mono">{ev.id}</span>
                   {ev.status === 'Closed' ? <span className="flex items-center text-xs text-primary-green"><CheckCircle className="w-3 h-3 mr-1"/> Closed</span> : <span className="flex items-center text-xs text-yellow-500"><Clock className="w-3 h-3 mr-1"/> Open</span>}
                   {ev.recall && <span className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/50">RECALL ACTIVE</span>}
                 </div>
                 <p className="text-sm text-text-muted mb-3">{ev.description}</p>
                 {ev.relatedEntity && <p className="text-xs text-primary-cyan font-mono">Entity: {ev.relatedEntity}</p>}
                 {ev.status === 'Closed' && ev.resolution && (
                   <div className="mt-3 p-3 bg-black/30 border border-border rounded text-sm text-text-main">
                     <span className="text-primary-green font-bold text-xs uppercase block mb-1">Resolution</span>
                     {ev.resolution}
                   </div>
                 )}
               </div>
               
               {ev.status === 'Open' && (
                 <div className="flex flex-col space-y-2">
                   {!ev.CAPA && (
                     <button onClick={() => handleExpandToCapa(ev.id)} className="px-3 py-1.5 text-xs bg-card border border-border text-white hover:text-red-400 hover:border-red-400 rounded transition-colors">
                       Elevate to CAPA
                     </button>
                   )}
                   {!ev.recall && ev.relatedEntity && (
                     <button onClick={() => handleTriggerRecall(ev.id, ev.relatedEntity)} className="px-3 py-1.5 text-xs bg-card border border-border text-white hover:text-purple-400 hover:border-purple-400 rounded transition-colors">
                       Trigger Recall (Quarantine)
                     </button>
                   )}
                   <button onClick={() => { setSelectedEventId(ev.id); setShowCloseModal(true); }} className="px-3 py-1.5 text-xs bg-primary-green/20 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black rounded transition-colors flex items-center justify-center">
                     <FileSignature className="w-3 h-3 mr-1" /> QA Close
                   </button>
                 </div>
               )}
             </div>
          </motion.div>
        ))}
        {qualityEvents.length === 0 && (
           <div className="flex flex-col items-center justify-center py-12 glass-panel border border-dashed border-border text-center">
              <AlertTriangle className="w-12 h-12 text-text-muted mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-white mb-2">No Quality Events</h3>
              <p className="text-text-muted max-w-md">Record non-conformances, complaints or initiate CAPA workflows.</p>
           </div>
        )}
      </div>

      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white">Log Quality Event</h3>
                <button onClick={() => setShowNewModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-text-muted mb-1">Title *</label>
                    <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Type</label>
                    <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none">
                      <option value="NC">Non-Conformance</option>
                      <option value="Complaint">Customer Complaint</option>
                      <option value="CAPA">CAPA</option>
                    </select>
                  </div>
                </div>
                
                <div>
                   <label className="block text-xs font-medium text-text-muted mb-1">Related Entity ID (Optional)</label>
                   <input type="text" placeholder="e.g. BAT-001 or MOM-123" value={formData.relatedEntity} onChange={e=>setFormData({...formData, relatedEntity: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                </div>

                <div>
                   <label className="block text-xs font-medium text-text-muted mb-1">Description *</label>
                   <textarea required rows="4" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none resize-y" />
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowNewModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition-colors">Log Event</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCloseModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-primary-green/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-5 border-b border-primary-green/30 flex justify-between items-center bg-primary-green/10">
                <h3 className="text-lg font-bold text-primary-green flex items-center"><FileSignature className="w-5 h-5 mr-2"/> Close Quality Event</h3>
                <button onClick={() => { setShowCloseModal(false); setSelectedEventId(null); }} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleCloseSubmit} className="p-6 space-y-4">
                <p className="text-sm text-text-muted mb-2">Provide resolution details and sign off to close this event.</p>
                <div>
                   <label className="block text-xs font-medium text-text-muted mb-1">Resolution Summary *</label>
                   <textarea required rows="3" value={closeData.resolution} onChange={e=>setCloseData({...closeData, resolution: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none resize-y" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">QA Authorization PIN *</label>
                  <input required type="password" placeholder="e.g. 0000" value={closeData.qaPin} onChange={e=>setCloseData({...closeData, qaPin: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none text-center tracking-[0.5em] font-mono text-lg" />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button type="button" onClick={() => { setShowCloseModal(false); setSelectedEventId(null); }} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-green text-black font-medium hover:bg-primary-green/90 transition-colors">Sign & Close</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
