import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, QrCode, Plus, History, X, ShieldCheck, AlertCircle, Lock, Package, Trash2, Edit2, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import QRCode from 'qrcode';
import { ItemCard } from '../components/ui/ItemCard';

export default function Inventory() { 
  const { batches, addBatch, varieties, adjustBatchStock, removeBatch, updateBatch } = useAppContext();
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  const [formData, setFormData] = useState({ id: '', variety: '', date: new Date().toISOString().split('T')[0], initialQty: '', location: '', temperature: '', humidity: '' });
  const [editFormData, setEditFormData] = useState({ id: '', variety: '', date: '', initialQty: '', location: '', temperature: '', humidity: '' });
  const [adjustData, setAdjustData] = useState({ type: 'standard', change: '', reason: '', witnessName: '', opPin: '', witPin: '' });

  useEffect(() => {
    if (selectedBatch) {
      QRCode.toDataURL(selectedBatch.id, {
        color: { dark: '#000000', light: '#ffffff' },
        margin: 1
      }).then(url => setQrCodeUrl(url)).catch(err => console.error(err));
    } else {
      setQrCodeUrl('');
    }
  }, [selectedBatch]);

  const getBatchAgeMonths = (dateStr) => {
    if (!dateStr) return 0;
    const batchDate = new Date(dateStr);
    const now = new Date();
    return (now.getFullYear() - batchDate.getFullYear()) * 12 + (now.getMonth() - batchDate.getMonth());
  };

  const getExpiryAlert = (dateStr) => {
    const months = getBatchAgeMonths(dateStr);
    if (months >= 12) return { text: 'Risk (12m+)', color: 'text-red-500 bg-red-500/10 border-red-500/30' };
    if (months >= 6) return { text: 'Warn (6m+)', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' };
    return { text: 'Fresh', color: 'text-primary-green bg-primary-green/10 border-primary-green/30' };
  };

  useEffect(() => {
    if (formData.variety && formData.date) {
      const prefix = formData.variety.replace(/\s+/g, '').substring(0, 3).toUpperCase().padEnd(3, 'X');
      const dateSuffix = formData.date.replace(/-/g, '').substring(2);
      const correlative = (batches.length + 1).toString().padStart(3, '0');
      setFormData(prev => ({ ...prev, id: `${prefix}-${dateSuffix}-B${correlative}` }));
    } else {
      setFormData(prev => ({ ...prev, id: '' }));
    }
  }, [formData.variety, formData.date, batches.length]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return { text: 'text-primary-green bg-primary-green/10 border-primary-green/30', border: 'border-l-primary-green' };
      case 'Apto': return { text: 'text-primary-cyan bg-primary-cyan/10 border-primary-cyan/30', border: 'border-l-primary-cyan' };
      case 'Review': return { text: 'text-orange-400 bg-orange-400/10 border-orange-400/30', border: 'border-l-orange-400' };
      case 'Locked': return { text: 'text-red-500 bg-red-500/10 border-red-500/30', border: 'border-l-red-500' };
      default: return { text: 'text-text-muted bg-border/50 border-border', border: 'border-l-border' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Excellent': return <ShieldCheck className="w-4 h-4 mr-1" />;
      case 'Apto': return <ShieldCheck className="w-4 h-4 mr-1" />;
      case 'Review': return <AlertCircle className="w-4 h-4 mr-1" />;
      case 'Locked': return <Lock className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const batchToSave = {
      ...formData,
      conditions: formData.temperature && formData.humidity ? `${formData.temperature}°C, ${formData.humidity}% RH` : formData.conditions || 'N/A'
    };
    addBatch(batchToSave);
    setShowAddModal(false);
    setFormData({ id: '', variety: '', date: new Date().toISOString().split('T')[0], initialQty: '', location: '', temperature: '', humidity: '' });
  };

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    const isDestruction = adjustData.type === 'destruction';
    if (isDestruction) {
       // Simulate PIN validation
       if (adjustData.opPin.length < 4 || adjustData.witPin.length < 4) {
         alert("GACP Violation: Electronic signatures (PINs) are required for destruction.");
         return;
       }
       if (adjustData.opPin === adjustData.witPin) {
         alert("GACP Violation: Witness cannot be the same as the Operator.");
         return;
       }
       if (parseInt(adjustData.change) > 0) {
         alert("GACP Violation: Destruction must be a negative quantity.");
         return;
       }
    }
    
    const witness = isDestruction ? adjustData.witnessName : null;
    adjustBatchStock(selectedBatch.id, parseInt(adjustData.change), adjustData.reason, witness);
    
    // Optimistic UI update
    const ledgerReason = isDestruction ? `[GACP DESTRUCTION] ${adjustData.reason} (Witness: ${witness})` : adjustData.reason;
    setSelectedBatch(prev => ({...prev, currentQty: prev.currentQty + parseInt(adjustData.change), ledger: [{ date: new Date().toISOString().split('T')[0], user: 'Dr. Sarah Chen', change: parseInt(adjustData.change), reason: ledgerReason }, ...prev.ledger]}));
    
    setShowAdjustModal(false);
    setAdjustData({ type: 'standard', change: '', reason: '', witnessName: '', opPin: '', witPin: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const conditions = editFormData.temperature && editFormData.humidity ? `${editFormData.temperature}°C, ${editFormData.humidity}% RH` : editFormData.conditions || 'N/A';
    
    // Calculate difference in initialQty to adjust currentQty
    const qtyDiff = parseInt(editFormData.initialQty) - selectedBatch.initialQty;
    const newCurrentQty = selectedBatch.currentQty + qtyDiff;
    
    const updates = { 
      variety: editFormData.variety,
      date: editFormData.date,
      initial_qty: parseInt(editFormData.initialQty),
      current_qty: newCurrentQty,
      location: editFormData.location, 
      conditions 
    };
    
    updateBatch(selectedBatch.id, updates);
    setSelectedBatch(prev => ({...prev, variety: editFormData.variety, date: editFormData.date, initialQty: parseInt(editFormData.initialQty), currentQty: newCurrentQty, location: editFormData.location, conditions }));
    setShowEditModal(false);
  };


  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Batch Inventory</h1>
          <p className="text-sm text-text-muted">Traceability, stock management, and audit ledgers.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input type="text" placeholder="Search batch ID or variety..." className="bg-background border border-border rounded-md py-2 pl-9 pr-4 text-sm focus:border-primary-cyan focus:outline-none text-white w-64" />
          </div>
          <button className="tech-button bg-card border border-border text-white flex items-center">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button className="tech-button bg-primary-green/10 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black flex items-center"
            onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Receive Batch
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {batches.map((batch) => {
            const statusStyle = getStatusColor(batch.status);
            const alert = getExpiryAlert(batch.date);
            return (
              <ItemCard
                key={batch.id}
                id={batch.id}
                title={batch.variety}
                icon={Package}
                borderColor={statusStyle.border}
                badgeText={batch.status}
                badgeColor={statusStyle.text}
                fields={[
                  { label: 'Available Stock', value: <span className="font-mono text-primary-cyan">{batch.currentQty.toLocaleString()}</span> },
                  { label: 'Location', value: batch.location },
                  { label: 'Age / Expiry', value: <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${alert.color}`}>{alert.text}</span> }
                ]}
                actions={
                  <>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation();
                        setSelectedBatch(batch);
                        const temp = batch.conditions?.match(/(\d+)\s*°C/)?.[1] || '';
                        const hum = batch.conditions?.match(/(\d+)\s*%\s*RH/)?.[1] || '';
                        setEditFormData({ id: batch.id, variety: batch.variety, date: batch.date, initialQty: batch.initialQty, location: batch.location, temperature: temp, humidity: hum });
                        setShowEditModal(true);
                      }}
                      className="p-1.5 bg-background border border-border text-text-muted rounded hover:text-white hover:border-primary-cyan transition-colors"
                      title="Edit Storage Conditions"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setSelectedBatch(batch)}
                      className="px-3 py-1.5 bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30 rounded text-xs font-medium hover:bg-primary-cyan hover:text-black transition-colors flex items-center"
                    >
                      <Info className="w-3 h-3 mr-1"/> Details
                    </button>
                  </>
                }
              />
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedBatch && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBatch(null)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border z-50 shadow-2xl flex flex-col">
              <div className="bg-card/90 backdrop-blur-md p-6 border-b border-border flex justify-between items-start z-10 shrink-0">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h2 className="text-2xl font-bold text-white font-mono">{selectedBatch.id}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium ${getStatusColor(selectedBatch.status).text}`}>{selectedBatch.status}</span>
                  </div>
                  <p className="text-sm text-text-muted">Variety: <span className="text-primary-cyan">{selectedBatch.variety}</span> • Intake: {selectedBatch.date} <span className={`ml-2 px-2 py-0.5 rounded text-[10px] border font-bold ${getExpiryAlert(selectedBatch.date).color}`}>{getExpiryAlert(selectedBatch.date).text}</span></p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => {
                    const temp = selectedBatch.conditions?.match(/(\d+)\s*°C/)?.[1] || '';
                    const hum = selectedBatch.conditions?.match(/(\d+)\s*%\s*RH/)?.[1] || '';
                    setEditFormData({ location: selectedBatch.location, temperature: temp, humidity: hum });
                    setShowEditModal(true);
                  }} className="p-2 bg-background border border-border text-text-muted hover:text-white hover:border-primary-cyan rounded transition-colors" title="Edit Batch"><Edit2 className="w-5 h-5" /></button>
                  <button onClick={() => { removeBatch(selectedBatch.id); setSelectedBatch(null); }} className="p-2 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors" title="Delete Batch"><Trash2 className="w-5 h-5" /></button>
                  <button onClick={() => setSelectedBatch(null)} className="p-2 hover:bg-border rounded-full text-text-muted hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-background rounded-lg p-4 border border-border/50">
                    <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Initial Stock</p>
                    <p className="text-xl font-mono text-white">{selectedBatch.initialQty.toLocaleString()}</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-primary-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                    <p className="text-xs text-text-muted mb-1 uppercase tracking-wider text-primary-cyan">Available Stock</p>
                    <p className="text-xl font-mono text-primary-cyan">{selectedBatch.currentQty.toLocaleString()}</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border/50">
                    <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Discrepancy</p>
                    <p className="text-xl font-mono text-text-muted">{(selectedBatch.initialQty - selectedBatch.currentQty).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-background rounded-lg p-4 border border-border/50 mb-8 flex justify-between items-center">
                   <div>
                     <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Storage Conditions</p>
                     <p className="text-sm font-medium text-white flex items-center"><Package className="w-4 h-4 mr-2 text-text-muted"/> {selectedBatch.location} ({selectedBatch.conditions})</p>
                   </div>
                   <div className="flex items-center space-x-4">
                     {qrCodeUrl && (
                       <div className="flex flex-col items-center">
                         <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16 rounded shadow-lg bg-white" />
                         <span className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">Batch QR</span>
                       </div>
                     )}
                   </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Immutable Audit Ledger</h3>
                    <button className="tech-button bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30 text-xs py-1"
                      onClick={() => setShowAdjustModal(true)}>
                      + Record Adjustment
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedBatch.ledger.map((log, idx) => (
                      <div key={idx} className="bg-background rounded-lg p-3 border border-border/50 relative pl-4 overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${log.change > 0 ? 'bg-primary-green' : log.change < 0 ? 'bg-orange-400' : 'bg-border'}`} />
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-medium text-white">{log.user}</span>
                          <span className="font-mono text-[10px] text-text-muted">{log.date}</span>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <span className="text-xs text-text-muted max-w-[70%]">{log.reason}</span>
                          <span className={`font-mono text-sm font-bold ${log.change > 0 ? 'text-primary-green' : log.change < 0 ? 'text-orange-400' : 'text-text-muted'}`}>
                            {log.change > 0 ? '+' : ''}{log.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center mt-4 text-[10px] text-text-muted/50 font-mono uppercase tracking-widest">End of cryptographically sealed ledger</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white">Receive New Batch</h3>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Batch ID (Auto-generated) *</label>
                    <input readOnly type="text" value={formData.id} className="w-full bg-background/50 border border-border/50 rounded p-2 text-primary-cyan focus:outline-none font-mono uppercase cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Genetics *</label>
                    <select required value={formData.variety} onChange={e=>setFormData({...formData, variety: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none">
                      <option value="">Select Genetics...</option>
                      {varieties.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Initial Quantity (Seeds) *</label>
                    <input required type="number" min="1" value={formData.initialQty} onChange={e=>setFormData({...formData, initialQty: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Arrival Date *</label>
                    <input required type="date" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Storage Location *</label>
                    <input required type="text" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="e.g. Cold Room A" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Temperature (°C)</label>
                      <input type="number" value={formData.temperature} onChange={e=>setFormData({...formData, temperature: e.target.value})} placeholder="e.g. 18" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Humidity (% RH)</label>
                      <input type="number" value={formData.humidity} onChange={e=>setFormData({...formData, humidity: e.target.value})} placeholder="e.g. 45" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-green text-black font-medium hover:bg-primary-green/90 transition-colors">Register Batch</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showAdjustModal && selectedBatch && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className={`bg-card border rounded-xl shadow-2xl w-full max-w-md overflow-hidden ${adjustData.type === 'destruction' ? 'border-red-500/50 shadow-red-500/20' : 'border-border'}`}>
               <div className={`p-5 border-b flex justify-between items-center ${adjustData.type === 'destruction' ? 'border-red-500/30 bg-red-500/10' : 'border-border bg-card/50'}`}>
                 <h3 className={`text-lg font-bold flex items-center ${adjustData.type === 'destruction' ? 'text-red-400' : 'text-white'}`}>
                   {adjustData.type === 'destruction' ? <AlertCircle className="w-5 h-5 mr-2"/> : null} 
                   Record Stock Adjustment
                 </h3>
                 <button onClick={() => setShowAdjustModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
               </div>
               <form onSubmit={handleAdjustSubmit} className="p-6 space-y-4">
                 
                 <div className="flex space-x-2 bg-background p-1 rounded border border-border">
                   <button type="button" onClick={() => setAdjustData({...adjustData, type: 'standard'})} className={`flex-1 py-1.5 text-xs rounded transition-colors ${adjustData.type === 'standard' ? 'bg-card text-white shadow' : 'text-text-muted hover:text-white'}`}>Standard Adjustment</button>
                   <button type="button" onClick={() => setAdjustData({...adjustData, type: 'destruction'})} className={`flex-1 py-1.5 text-xs rounded transition-colors ${adjustData.type === 'destruction' ? 'bg-red-500/20 text-red-400 shadow border border-red-500/30' : 'text-text-muted hover:text-red-400'}`}>GACP Destruction</button>
                 </div>

                 <div>
                   <label className="block text-xs font-medium text-text-muted mb-1">Amount to Adjust (Use - for deductions) *</label>
                   <input required type="number" value={adjustData.change} onChange={e=>setAdjustData({...adjustData, change: e.target.value})} placeholder="e.g. -50" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-text-muted mb-1">Reason Code / Justification *</label>
                   <textarea required rows="2" value={adjustData.reason} onChange={e=>setAdjustData({...adjustData, reason: e.target.value})} placeholder={adjustData.type === 'destruction' ? "e.g. Fungal contamination" : "e.g. Order #1024 or Sample"} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none"></textarea>
                 </div>

                 {adjustData.type === 'destruction' && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2 border-t border-border/50 space-y-4">
                      <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-xs text-red-400 flex items-start">
                        <Lock className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                        <div>GACP regulations require dual electronic signatures for seed destruction/waste.</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text-muted mb-1">Witness Name *</label>
                        <input required type="text" value={adjustData.witnessName} onChange={e=>setAdjustData({...adjustData, witnessName: e.target.value})} placeholder="e.g. Dr. A. Smith" className="w-full bg-background border border-border rounded p-2 text-white focus:border-red-500 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-medium text-text-muted mb-1">Operator PIN *</label>
                           <input required type="password" maxLength="4" value={adjustData.opPin} onChange={e=>setAdjustData({...adjustData, opPin: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-red-500 focus:outline-none text-center tracking-widest font-mono" placeholder="****" />
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-text-muted mb-1">Witness PIN *</label>
                           <input required type="password" maxLength="4" value={adjustData.witPin} onChange={e=>setAdjustData({...adjustData, witPin: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-red-500 focus:outline-none text-center tracking-widest font-mono" placeholder="****" />
                        </div>
                      </div>
                   </motion.div>
                 )}

                 <div className="pt-4 flex justify-end space-x-3">
                   <button type="button" onClick={() => setShowAdjustModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancel</button>
                   <button type="submit" className={`px-4 py-2 rounded font-medium transition-colors ${adjustData.type === 'destruction' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-primary-cyan hover:bg-primary-cyan/90 text-black'}`}>
                     {adjustData.type === 'destruction' ? 'Certify Destruction' : 'Submit to Ledger'}
                   </button>
                 </div>
               </form>
             </motion.div>
           </div>
        )}
        {showEditModal && selectedBatch && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
               <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                 <h3 className="text-lg font-bold text-white">Edit Storage Conditions</h3>
                 <button onClick={() => setShowEditModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
               </div>
               <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-medium text-text-muted mb-1">Batch ID (Cannot be changed)</label>
                     <input readOnly type="text" value={editFormData.id} className="w-full bg-background/50 border border-border/50 rounded p-2 text-primary-cyan focus:outline-none font-mono uppercase cursor-not-allowed" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-text-muted mb-1">Genetics *</label>
                     <select required value={editFormData.variety} onChange={e=>setEditFormData({...editFormData, variety: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none">
                       <option value="">Select Genetics...</option>
                       {varieties.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                     </select>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-medium text-text-muted mb-1">Initial Quantity (Seeds) *</label>
                     <input required type="number" min="1" value={editFormData.initialQty} onChange={e=>setEditFormData({...editFormData, initialQty: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-text-muted mb-1">Arrival Date *</label>
                     <input required type="date" value={editFormData.date} onChange={e=>setEditFormData({...editFormData, date: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-medium text-text-muted mb-1">Storage Location *</label>
                     <input required type="text" value={editFormData.location} onChange={e=>setEditFormData({...editFormData, location: e.target.value})} placeholder="e.g. Cold Room A" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-xs font-medium text-text-muted mb-1">Temp (°C)</label>
                       <input type="number" value={editFormData.temperature} onChange={e=>setEditFormData({...editFormData, temperature: e.target.value})} placeholder="e.g. 18" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-text-muted mb-1">Hum (% RH)</label>
                       <input type="number" value={editFormData.humidity} onChange={e=>setEditFormData({...editFormData, humidity: e.target.value})} placeholder="e.g. 45" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                     </div>
                   </div>
                 </div>
                 <div className="pt-4 flex justify-end space-x-3">
                   <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancel</button>
                   <button type="submit" className="px-4 py-2 rounded bg-primary-cyan text-black font-medium hover:bg-primary-cyan/90 transition-colors">Save Changes</button>
                 </div>
               </form>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
