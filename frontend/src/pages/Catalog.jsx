import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, FileText, ChevronRight, Activity, Leaf, Dna, Download, Plus, Trash2, Edit2, Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip, BarChart, Bar, XAxis } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { ItemCard } from '../components/ui/ItemCard';

export default function Catalog() {
  const { varieties, addVariety, removeVariety, updateVariety } = useAppContext();
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', date: new Date().toISOString().split('T')[0], breeder: '', type: 'Feminized', description: '', minStock: '', image: null, mother: '', father: '', thc: '', cbd: '', terpenes: '' });
  const [editFormData, setEditFormData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      let added = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple comma split (assuming no commas inside values for this basic importer)
        const [name, code, breeder, type, minStock] = line.split(',');
        
        if (name && code) {
          addVariety({
            name: name.trim(),
            code: code.trim(),
            breeder: breeder ? breeder.trim() : 'Unknown',
            type: type ? type.trim() : 'Feminized',
            description: 'Imported via CSV',
            minStock: minStock ? parseInt(minStock) : 0,
            image: null,
            status: 'Active'
          });
          added++;
        }
      }
      
      if (added > 0) {
        alert(`Successfully imported ${added} varieties!`);
      } else {
        alert('No valid data found. Ensure CSV format: Name,Code,Breeder,Type,MinStock');
      }
      
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditFormData(prev => ({ ...prev, image: reader.result }));
        } else {
          setFormData(prev => ({ ...prev, image: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (formData.name && formData.date) {
      const prefix = formData.name.replace(/\s+/g, '').substring(0, 3).toUpperCase().padEnd(3, 'X');
      const dateSuffix = formData.date.replace(/-/g, '').substring(2);
      const correlative = (varieties.length + 1).toString().padStart(3, '0');
      setFormData(prev => ({ ...prev, code: `${prefix}-${dateSuffix}-${correlative}` }));
    } else {
      setFormData(prev => ({ ...prev, code: '' }));
    }
  }, [formData.name, formData.date, varieties.length]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addVariety({
      name: formData.name,
      code: formData.code,
      breeder: formData.breeder,
      type: formData.type,
      description: formData.description,
      minStock: parseInt(formData.minStock) || 0,
      image: formData.image,
      mother: formData.mother || null,
      father: formData.father || null,
      thc: formData.thc,
      cbd: formData.cbd,
      terpenes: formData.terpenes,
      status: 'Active'
    });
    setShowAddModal(false);
    setFormData({ name: '', code: '', date: new Date().toISOString().split('T')[0], breeder: '', type: 'Feminized', description: '', minStock: '', image: null, mother: '', father: '', thc: '', cbd: '', terpenes: '' });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateVariety(selectedVariety.id, {
      name: editFormData.name,
      breeder: editFormData.breeder,
      type: editFormData.type,
      description: editFormData.description,
      minStock: parseInt(editFormData.minStock) || 0,
      image: editFormData.image,
      mother: editFormData.mother || null,
      father: editFormData.father || null,
      thc: editFormData.thc,
      cbd: editFormData.cbd,
      terpenes: editFormData.terpenes
    });
    setSelectedVariety(prev => ({ ...prev, ...editFormData, minStock: parseInt(editFormData.minStock) || 0 }));
    setShowEditModal(false);
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Genetic Catalog</h1>
          <p className="text-sm text-text-muted">Manage seed varieties and genetic profiles.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search genetics..." 
              className="bg-background border border-border rounded-md py-2 pl-9 pr-4 text-sm focus:border-primary-cyan focus:outline-none text-white w-64"
            />
          </div>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button className="tech-button bg-card border border-border text-text-muted hover:text-white flex items-center"
            onClick={() => fileInputRef.current.click()}>
            <Download className="w-4 h-4 mr-2" /> Import CSV
          </button>
          <button className="tech-button bg-primary-green/10 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black flex items-center"
            onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Variety
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {varieties.map((variety) => {
            const isWarning = variety.status !== 'Active';
            return (
              <ItemCard 
                key={variety.id}
                id={variety.code}
                title={variety.name}
                icon={Leaf}
                borderColor={isWarning ? 'border-l-orange-400' : 'border-l-primary-green'}
                badgeText={variety.status}
                badgeColor={isWarning ? 'text-orange-400 bg-orange-400/10 border-orange-400/30' : 'text-primary-green bg-primary-green/10 border-primary-green/30'}
                fields={[
                  { label: 'Type', value: variety.type },
                  { label: 'Breeder', value: variety.breeder },
                  { label: 'Avg Viability', value: <span className="font-mono text-primary-cyan">{variety.avgViability}%</span> },
                  { label: 'Active Batches', value: variety.activeBatches }
                ]}
                actions={
                  <button 
                    onClick={() => setSelectedVariety(variety)}
                    className="px-3 py-1.5 bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30 rounded text-xs font-medium hover:bg-primary-cyan hover:text-black transition-colors flex items-center w-full justify-center"
                  >
                    <Info className="w-3 h-3 mr-1"/> View Genetic Profile
                  </button>
                }
              />
            );
          })}
          {varieties.length === 0 && (
            <div className="col-span-full p-12 text-center text-text-muted border border-dashed border-border/50 rounded-lg">
              <Leaf className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No genetics in the catalog yet.</p>
              <button onClick={() => setShowAddModal(true)} className="mt-4 text-primary-cyan hover:underline">Add the first one</button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedVariety && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVariety(null)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-xl bg-card border-l border-border z-50 shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-card/90 backdrop-blur-md p-6 border-b border-border flex justify-between items-center z-10">
                <div className="flex items-center space-x-4">
                  {selectedVariety.image ? (
                    <img src={selectedVariety.image} alt={selectedVariety.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary-cyan/50" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-border flex items-center justify-center text-text-muted border-2 border-border"><Leaf className="w-6 h-6" /></div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedVariety.name}</h2>
                    <p className="text-sm font-mono text-primary-cyan">{selectedVariety.code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => { setEditFormData(selectedVariety); setShowEditModal(true); }} className="p-2 bg-background border border-border text-text-muted hover:text-white rounded transition-colors" title="Edit Variety"><Edit2 className="w-5 h-5" /></button>
                  <button onClick={() => { removeVariety(selectedVariety.id); setSelectedVariety(null); }} className="p-2 bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors" title="Delete Variety"><Trash2 className="w-5 h-5" /></button>
                  <button onClick={() => setSelectedVariety(null)} className="p-2 hover:bg-border rounded-full text-text-muted hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4 border border-border/50">
                    <div className="flex items-center text-text-muted mb-2"><Dna className="w-4 h-4 mr-2" /> Genetics</div>
                    <div className="text-lg text-white font-medium">{selectedVariety.type}</div>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-border/50">
                    <div className="flex items-center text-text-muted mb-2"><Leaf className="w-4 h-4 mr-2" /> Breeder</div>
                    <div className="text-lg text-white font-medium">{selectedVariety.breeder}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Technical Profile</h3>
                  <p className="text-text-main text-sm leading-relaxed bg-background p-4 rounded-lg border border-border/30">{selectedVariety.description}</p>
                </div>
                
                {(selectedVariety.thc || selectedVariety.cbd || selectedVariety.terpenes) && (
                  <div>
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center"><Dna className="w-4 h-4 mr-2 text-primary-cyan"/> Chemotype & COA Profile</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {selectedVariety.thc && (
                        <div className="bg-background rounded-lg p-3 border border-border/50 text-center col-span-1">
                          <p className="text-xs text-text-muted mb-1">THC</p>
                          <p className="text-lg font-bold text-white">{selectedVariety.thc}%</p>
                        </div>
                      )}
                      {selectedVariety.cbd && (
                        <div className="bg-background rounded-lg p-3 border border-border/50 text-center col-span-1">
                          <p className="text-xs text-text-muted mb-1">CBD</p>
                          <p className="text-lg font-bold text-white">{selectedVariety.cbd}%</p>
                        </div>
                      )}
                      {selectedVariety.terpenes && (
                        <div className="bg-background rounded-lg p-3 border border-border/50 text-center col-span-2">
                          <p className="text-xs text-text-muted mb-1">Dominant Terpenes</p>
                          <p className="text-sm font-bold text-white truncate" title={selectedVariety.terpenes}>{selectedVariety.terpenes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center">
                      <Activity className="w-4 h-4 mr-2" /> Historical Viability
                    </h3>
                    <div className="h-32 bg-background rounded-lg border border-border/30 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedVariety.history}>
                          <defs>
                            <linearGradient id="colorVar" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="m" hide />
                          <YAxis domain={[50, 100]} hide />
                          <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                          <Area type="monotone" dataKey="r" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorVar)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-primary-cyan" /> Monthly Sales
                    </h3>
                    <div className="h-32 bg-background rounded-lg border border-border/30 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedVariety.salesHistory}>
                          <XAxis dataKey="m" hide />
                          <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                          <Bar dataKey="s" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3 flex items-center">
                      <Activity className="w-4 h-4 mr-2 text-primary-green" /> Yearly Sales
                    </h3>
                    <div className="h-32 bg-background rounded-lg border border-border/30 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedVariety.yearlySales}>
                          <XAxis dataKey="y" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                          <Bar dataKey="s" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
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
                <h3 className="text-lg font-bold text-white">Register New Variety</h3>
                <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Commercial Name *</label>
                    <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Entry Date *</label>
                    <input required type="date" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Internal Code (Auto-generated) *</label>
                  <input readOnly type="text" value={formData.code} className="w-full bg-background/50 border border-border/50 rounded p-2 text-primary-cyan font-mono uppercase cursor-not-allowed" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Breeder Source *</label>
                    <input required type="text" value={formData.breeder} onChange={e=>setFormData({...formData, breeder: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Genetics Type</label>
                    <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none">
                      <option>Feminized</option>
                      <option>Autoflowering</option>
                      <option>Fast F1</option>
                      <option>Feminized CBD</option>
                      <option>Autoflowering CBD</option>
                      <option>Regular</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Low Stock Alert Minimum (Seeds) *</label>
                  <input required type="number" min="1" value={formData.minStock} onChange={e=>setFormData({...formData, minStock: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Technical Description</label>
                  <textarea rows="3" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none"></textarea>
                </div>

                <div className="grid grid-cols-4 gap-4 border-t border-border/50 pt-4">
                  <div className="col-span-4">
                    <h4 className="text-sm font-bold text-white flex items-center"><Dna className="w-4 h-4 mr-2 text-primary-cyan"/> Chemotype (COA)</h4>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">% THC</label>
                    <input type="number" step="0.01" value={formData.thc} onChange={e=>setFormData({...formData, thc: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">% CBD</label>
                    <input type="number" step="0.01" value={formData.cbd} onChange={e=>setFormData({...formData, cbd: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-text-muted mb-1">Terpenes</label>
                    <input type="text" placeholder="Myrcene, Pinene..." value={formData.terpenes} onChange={e=>setFormData({...formData, terpenes: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <label className="block text-xs font-medium text-text-muted mb-1">Variety Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="w-full bg-background border border-border rounded p-1.5 text-sm text-text-muted file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-cyan/10 file:text-primary-cyan hover:file:bg-primary-cyan/20 cursor-pointer" />
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-green text-black font-medium hover:bg-primary-green/90 transition-colors">Save Variety</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && editFormData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white">Edit Variety</h3>
                <button onClick={() => setShowEditModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Commercial Name *</label>
                  <input required type="text" value={editFormData.name} onChange={e=>setEditFormData({...editFormData, name: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Breeder Source *</label>
                    <input required type="text" value={editFormData.breeder} onChange={e=>setEditFormData({...editFormData, breeder: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Genetics Type</label>
                    <select value={editFormData.type} onChange={e=>setEditFormData({...editFormData, type: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none">
                      <option>Feminized</option>
                      <option>Autoflowering</option>
                      <option>Fast F1</option>
                      <option>Feminized CBD</option>
                      <option>Autoflowering CBD</option>
                      <option>Regular</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Low Stock Alert Minimum (Seeds) *</label>
                  <input required type="number" min="1" value={editFormData.minStock} onChange={e=>setEditFormData({...editFormData, minStock: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Technical Description</label>
                  <textarea rows="3" value={editFormData.description} onChange={e=>setEditFormData({...editFormData, description: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none"></textarea>
                </div>
                
                <div className="grid grid-cols-4 gap-4 border-t border-border/50 pt-4">
                  <div className="col-span-4">
                    <h4 className="text-sm font-bold text-white flex items-center"><Dna className="w-4 h-4 mr-2 text-primary-cyan"/> Chemotype (COA)</h4>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">% THC</label>
                    <input type="number" step="0.01" value={editFormData.thc} onChange={e=>setEditFormData({...editFormData, thc: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-medium text-text-muted mb-1">% CBD</label>
                    <input type="number" step="0.01" value={editFormData.cbd} onChange={e=>setEditFormData({...editFormData, cbd: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-text-muted mb-1">Terpenes</label>
                    <input type="text" placeholder="Myrcene, Pinene..." value={editFormData.terpenes} onChange={e=>setEditFormData({...editFormData, terpenes: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <label className="block text-xs font-medium text-text-muted mb-1">Update Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="w-full bg-background border border-border rounded p-1.5 text-sm text-text-muted file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-cyan/10 file:text-primary-cyan hover:file:bg-primary-cyan/20 cursor-pointer" />
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
