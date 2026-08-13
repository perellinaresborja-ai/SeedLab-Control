import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, TreePine, Scissors, Wind, Beaker, Plus, X, Search, ShieldCheck, GitMerge, ArrowRight, ArrowDown, Droplets, Leaf, Bug } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ItemCard } from '../components/ui/ItemCard';

export default function Genetics() {
  const { origins, mothers, clones, pollen, crosses, addOrigin, addMother, addCloneBatch, addPollen, addCross, varieties } = useAppContext();
  const [activeTab, setActiveTab] = useState('origins');
  
  // Modal states
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [showMotherModal, setShowMotherModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showPollenModal, setShowPollenModal] = useState(false);
  const [showCrossModal, setShowCrossModal] = useState(false);

  // Form states
  const [originForm, setOriginForm] = useState({ name: '', type: 'In-house Breeder', date: new Date().toISOString().split('T')[0], notes: '' });
  const [motherForm, setMotherForm] = useState({ originId: '', strain: '', location: 'Room A', status: 'Vegetative' });
  const [cloneForm, setCloneForm] = useState({ motherId: '', quantity: 50, date: new Date().toISOString().split('T')[0] });
  const [pollenForm, setPollenForm] = useState({ strain: '', extractionDate: new Date().toISOString().split('T')[0], quantityGrams: 10, viability: 95 });
  const [crossForm, setCrossForm] = useState({ femaleId: '', maleId: '', newStrainName: '', seedYield: 1000 });
  const [logForm, setLogForm] = useState({ 
    type: 'Nutrient', product: '', dose: '', 
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    operator: '' 
  });

  // Cultivation Log State
  const [selectedEntityForLog, setSelectedEntityForLog] = useState(null);

  const tabs = [
    { id: 'origins', label: 'Orígenes (Hunters)', icon: TreePine },
    { id: 'mothers', label: 'Plantas Madre', icon: Dna },
    { id: 'clones', label: 'Esquejes', icon: Scissors },
    { id: 'pollen', label: 'Banco de Polen', icon: Wind },
    { id: 'crosses', label: 'Cruces (Lotes)', icon: Beaker },
    { id: 'traceability', label: 'Trazabilidad (Grafo)', icon: GitMerge },
  ];

  const handleOriginSubmit = (e) => {
    e.preventDefault();
    addOrigin(originForm);
    setShowOriginModal(false);
    setOriginForm({ name: '', type: 'In-house Breeder', date: new Date().toISOString().split('T')[0], notes: '' });
  };

  const handleMotherSubmit = (e) => {
    e.preventDefault();
    addMother(motherForm);
    setShowMotherModal(false);
    setMotherForm({ originId: '', strain: '', location: 'Room A', status: 'Vegetative' });
  };

  const handleCloneSubmit = (e) => {
    e.preventDefault();
    addCloneBatch(cloneForm);
    setShowCloneModal(false);
    setCloneForm({ motherId: '', quantity: 50, date: new Date().toISOString().split('T')[0] });
  };

  const handlePollenSubmit = (e) => {
    e.preventDefault();
    addPollen(pollenForm);
    setShowPollenModal(false);
    setPollenForm({ strain: '', extractionDate: new Date().toISOString().split('T')[0], quantityGrams: 10, viability: 95 });
  };

  const handleCrossSubmit = (e) => {
    e.preventDefault();
    addCross(crossForm);
    setShowCrossModal(false);
    setCrossForm({ femaleId: '', maleId: '', newStrainName: '', seedYield: 1000 });
  };

  const handleLogSubmit = (e) => {
    e.preventDefault();
    if (!selectedEntityForLog) return;
    addCultivationLog({
      entityId: selectedEntityForLog.id,
      entityType: selectedEntityForLog.type, // 'Mother' or 'Clone'
      type: logForm.type,
      product: logForm.product,
      dose: logForm.dose,
      date: logForm.date,
      time: logForm.time,
      operator: logForm.operator
    });
    setLogForm({ 
      type: 'Nutrient', product: '', dose: '', 
      date: new Date().toISOString().split('T')[0], 
      time: new Date().toTimeString().slice(0, 5), 
      operator: '' 
    });
  };

  const getEntityLogs = (entityId) => {
    return (useAppContext().cultivationLogs || []).filter(l => l.entityId === entityId);
  };

  return (
    <div className="h-full flex flex-col pb-12 relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Genetics Engine</h1>
          <p className="text-sm text-text-muted">Trazabilidad End-to-End: Del Origen al Lote Final.</p>
        </div>
      </div>

      <div className="flex space-x-1 bg-card border border-border p-1 rounded-lg mb-6 w-fit overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-primary-cyan/20 text-primary-cyan' : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 relative flex flex-col">
        {/* --- ORIGINS TAB --- */}
        {activeTab === 'origins' && (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Orígenes y Genéticas</h2>
              <button onClick={() => setShowOriginModal(true)} className="tech-button bg-primary-cyan text-black hover:bg-primary-cyan/90 flex items-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Plus className="w-4 h-4 mr-2"/> Registrar Origen
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 flex-1 content-start">
              {origins.length === 0 ? (
                <div className="col-span-full p-8 text-center text-text-muted glass-panel rounded-lg h-fit border-l-4 border-l-text-muted">No hay orígenes registrados.</div>
              ) : origins.map(o => (
                <ItemCard 
                  key={o.id} id={o.id} title={o.name} icon={TreePine}
                  borderColor="border-l-primary-cyan"
                  badgeText="Validado" badgeColor="bg-primary-cyan/10 text-primary-cyan border-primary-cyan/20"
                  fields={[
                    { label: 'Adquisición', value: o.type },
                    { label: 'Fecha', value: o.date }
                  ]}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- MOTHERS TAB --- */}
        {activeTab === 'mothers' && (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Plantas Madre (Vegetativo)</h2>
              <button onClick={() => setShowMotherModal(true)} className="tech-button bg-primary-green text-black hover:bg-primary-green/90 flex items-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Plus className="w-4 h-4 mr-2"/> Alta Madre
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 content-start">
              {mothers.length === 0 ? (
                <div className="col-span-full p-8 text-center text-text-muted glass-panel rounded-lg border-l-4 border-l-text-muted">No hay madres registradas.</div>
              ) : mothers.map(m => (
                <ItemCard 
                  key={m.id} id={m.id} title={m.strain} icon={Dna}
                  borderColor="border-l-primary-green"
                  badgeText={m.status} badgeColor="bg-primary-green/10 text-primary-green border-primary-green/20"
                  fields={[
                    { label: 'Origen ID', value: <span className="font-mono text-primary-cyan">{m.originId}</span> },
                    { label: 'Sala', value: m.location },
                    { label: 'Fecha Alta', value: new Date(m.createdAt).toLocaleDateString() }
                  ]}
                  actions={
                    <button onClick={() => setSelectedEntityForLog({ id: m.id, title: m.strain, type: 'Mother' })} className="w-full text-text-muted hover:text-white bg-card border border-border px-3 py-1.5 rounded transition-colors text-xs flex items-center justify-center">
                       <Leaf className="w-3.5 h-3.5 mr-1.5" /> Cuaderno GACP
                    </button>
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* --- CLONES TAB --- */}
        {activeTab === 'clones' && (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Lotes de Esquejes</h2>
              <button onClick={() => setShowCloneModal(true)} className="tech-button bg-blue-400 text-black hover:bg-blue-500 flex items-center shadow-[0_0_15px_rgba(96,165,250,0.3)]">
                <Plus className="w-4 h-4 mr-2"/> Cortar Esquejes
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 flex-1 content-start">
              {clones.length === 0 ? (
                <div className="col-span-full p-8 text-center text-text-muted glass-panel rounded-lg h-fit border-l-4 border-l-text-muted">No hay lotes de esquejes.</div>
              ) : clones.map(c => (
                <ItemCard 
                  key={c.id} id={c.id} title={`${c.quantity} Esquejes`} icon={Scissors}
                  borderColor="border-l-blue-400"
                  badgeText="Enraizando" badgeColor="bg-blue-400/10 text-blue-400 border-blue-400/20"
                  fields={[
                    { label: 'Madre Donante', value: <span className="font-mono text-primary-green">{c.motherId}</span> },
                    { label: 'Corte', value: c.date },
                    { label: 'Viabilidad', value: '90%' }
                  ]}
                  actions={
                    <button onClick={() => setSelectedEntityForLog({ id: c.id, title: `${c.quantity} Esquejes`, type: 'Clone' })} className="w-full text-text-muted hover:text-white bg-card border border-border px-3 py-1.5 rounded transition-colors text-xs flex items-center justify-center">
                       <Leaf className="w-3.5 h-3.5 mr-1.5" /> Cuaderno GACP
                    </button>
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* --- POLLEN TAB --- */}
        {activeTab === 'pollen' && (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Banco de Polen</h2>
              <button onClick={() => setShowPollenModal(true)} className="tech-button bg-yellow-400 text-black hover:bg-yellow-500 flex items-center shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                <Plus className="w-4 h-4 mr-2"/> Extraer Polen
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 flex-1 content-start">
              {pollen.length === 0 ? (
                <div className="col-span-full p-8 text-center text-text-muted glass-panel rounded-lg h-fit border-l-4 border-l-text-muted">El banco de polen está vacío.</div>
              ) : pollen.map(p => (
                <ItemCard 
                  key={p.id} id={p.id} title={p.strain} icon={Wind}
                  borderColor="border-l-yellow-400"
                  badgeText={`${p.viability}% Viabilidad`} badgeColor="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                  fields={[
                    { label: 'Stock Disp.', value: `${p.quantityGrams}g` },
                    { label: 'Extracción', value: p.extractionDate }
                  ]}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- CROSSES TAB --- */}
        {activeTab === 'crosses' && (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center"><Beaker className="w-6 h-6 mr-2 text-purple-400"/> Motor de Cruces Genéticos</h2>
                <p className="text-sm text-text-muted mt-1">Cruza Esquejes (Hembra) con Polen (Macho) para crear el lote inicial de semillas.</p>
              </div>
              <button onClick={() => setShowCrossModal(true)} className="tech-button bg-purple-500 text-white hover:bg-purple-600 flex items-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <Plus className="w-4 h-4 mr-2"/> Generar Cruce
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5 flex-1 content-start">
              {crosses.length === 0 ? (
                <div className="col-span-full p-8 flex flex-col items-center justify-center text-center text-text-muted glass-panel rounded-lg h-full border-l-4 border-l-text-muted">
                  <Beaker className="w-12 h-12 mb-4 text-text-muted/50" />
                  No has registrado ningún cruce todavía.
                </div>
              ) : crosses.map(crs => (
                <ItemCard 
                  key={crs.id} id={crs.id} title={crs.newStrainName} icon={Beaker}
                  borderColor="border-l-purple-500"
                  badgeText="Lote Enviado" badgeColor="bg-purple-500/10 text-purple-400 border-purple-500/20"
                  fields={[
                    { label: 'Hembra', value: <span className="font-mono text-blue-400">{crs.femaleId}</span> },
                    { label: 'Macho', value: <span className="font-mono text-yellow-400">{crs.maleId}</span> },
                    { label: 'Semillas Yield', value: `${crs.seedYield} uds` },
                    { label: 'Fecha', value: crs.date }
                  ]}
                  actions={
                    <button onClick={() => {
                        setActiveTab('traceability');
                        // Small hack to scroll/focus to this in the next tab if we had local state for it, but for now just switching tab is fine
                    }} className="w-full text-purple-400 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded transition-colors text-xs flex items-center justify-center">
                       <GitMerge className="w-4 h-4 mr-2" /> Ver Trazabilidad
                    </button>
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* --- TRACEABILITY TAB --- */}
        {activeTab === 'traceability' && (
          <div className="flex-1 flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center"><GitMerge className="w-6 h-6 mr-2 text-primary-cyan"/> Grafo de Trazabilidad</h2>
              <p className="text-sm text-text-muted mt-1">Explora el ciclo de vida completo: Origen ➔ Madre ➔ Lote ➔ Polen ➔ Semillas.</p>
            </div>
            
            <div className="flex-1 bg-background/50 border border-border rounded-xl p-8 overflow-y-auto">
              {crosses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-text-muted glass-panel rounded-lg border-l-4 border-l-text-muted p-8">
                  <GitMerge className="w-16 h-16 mb-4 text-text-muted/30" />
                  <p className="text-lg">No hay cruces registrados para trazar.</p>
                </div>
              ) : (
                <div className="space-y-16 max-w-4xl mx-auto">
                  {crosses.map((crs, index) => {
                    const clone = clones.find(c => c.id === crs.femaleId);
                    const mother = clone ? mothers.find(m => m.id === clone.motherId) : null;
                    const origin = mother ? origins.find(o => o.id === mother.originId) : null;
                    const pol = pollen.find(p => p.id === crs.maleId);
                    
                    return (
                      <div key={crs.id} className="relative p-8 glass-panel rounded-2xl shadow-xl border-l-4 border-l-purple-500">
                        <h3 className="text-xl font-bold text-white mb-8 border-b border-white/10 pb-4 text-center">
                          <span className="text-purple-400 font-mono text-sm mr-2">{crs.id}</span>
                          Cepa Final: {crs.newStrainName}
                        </h3>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center md:items-start md:justify-around gap-8 relative">
                          
                          {/* Female Branch */}
                          <div className="flex flex-col items-center space-y-4 w-64">
                            <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-2">Rama Femenina (Hembra)</div>
                            
                            {/* Origin */}
                            <div className="w-full bg-background border border-primary-cyan/50 rounded-lg p-3 text-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                              <TreePine className="w-6 h-6 mx-auto mb-2 text-primary-cyan" />
                              <div className="text-xs text-text-muted font-mono">{origin ? origin.id : 'N/A'}</div>
                              <div className="font-bold text-sm text-white">{origin ? origin.name : 'Unknown Origin'}</div>
                            </div>
                            
                            <ArrowDown className="text-border" />
                            
                            {/* Mother */}
                            <div className="w-full bg-background border border-primary-green/50 rounded-lg p-3 text-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                              <Dna className="w-6 h-6 mx-auto mb-2 text-primary-green" />
                              <div className="text-xs text-text-muted font-mono">{mother ? mother.id : 'N/A'}</div>
                              <div className="font-bold text-sm text-white">Planta Madre</div>
                            </div>
                            
                            <ArrowDown className="text-border" />
                            
                            {/* Clone */}
                            <div className="w-full bg-background border border-blue-400/50 rounded-lg p-3 text-center shadow-[0_0_15px_rgba(96,165,250,0.1)] relative">
                              <Scissors className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                              <div className="text-xs text-text-muted font-mono">{clone ? clone.id : 'N/A'}</div>
                              <div className="font-bold text-sm text-white">Lote Esquejes</div>
                            </div>
                          </div>
                          
                          {/* Male Branch */}
                          <div className="flex flex-col items-center space-y-4 w-64 mt-12 md:mt-0">
                            <div className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider mb-2">Rama Masculina (Macho)</div>
                            
                            {/* Pollen Source */}
                            <div className="w-full bg-background border border-yellow-400/50 rounded-lg p-3 text-center shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                              <TreePine className="w-6 h-6 mx-auto mb-2 text-yellow-400 opacity-50" />
                              <div className="text-xs text-text-muted">Cepa Origen</div>
                              <div className="font-bold text-sm text-white">{pol ? pol.strain : 'Unknown Strain'}</div>
                            </div>
                            
                            <ArrowDown className="text-border" />
                            
                            {/* Pollen */}
                            <div className="w-full bg-background border border-yellow-400/50 rounded-lg p-3 text-center shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                              <Wind className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                              <div className="text-xs text-text-muted font-mono">{pol ? pol.id : 'N/A'}</div>
                              <div className="font-bold text-sm text-white">Lote de Polen</div>
                            </div>
                          </div>
                          
                        </div>
                        
                        {/* Final Cross Node */}
                        <div className="mt-8 flex flex-col items-center">
                           <div className="flex space-x-2 md:space-x-16 mb-4">
                              <ArrowDown className="text-purple-500/50 w-8 h-8 rotate-[-30deg]" />
                              <ArrowDown className="text-purple-500/50 w-8 h-8 rotate-[30deg]" />
                           </div>
                           <div className="w-64 bg-card border-2 border-purple-500 rounded-xl p-4 text-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                              <Beaker className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                              <div className="text-xs text-purple-400 font-mono mb-1">{crs.id}</div>
                              <div className="font-bold text-lg text-white mb-2">{crs.newStrainName}</div>
                              <div className="text-xs text-primary-green bg-primary-green/10 px-2 py-1 rounded inline-block">
                                + {crs.seedYield} Semillas al Inventario
                              </div>
                           </div>
                        </div>
                        
                        {index !== crosses.length - 1 && <div className="absolute -bottom-8 left-1/2 w-[2px] h-16 bg-gradient-to-b from-border to-transparent -translate-x-1/2"></div>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* Origin Modal */}
        {showOriginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-t-primary-cyan">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white flex items-center"><TreePine className="w-5 h-5 mr-2 text-primary-cyan"/> Registrar Origen Genético</h3>
                <button onClick={() => setShowOriginModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleOriginSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Nombre de la Cepa (Strain) *</label>
                  <input required type="text" value={originForm.name} onChange={e => setOriginForm({...originForm, name: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Tipo de Adquisición</label>
                  <select value={originForm.type} onChange={e => setOriginForm({...originForm, type: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none">
                    <option>In-house Breeder</option>
                    <option>Strain Hunter (Wild)</option>
                    <option>B2B Import</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Fecha de Adquisición</label>
                  <input type="date" value={originForm.date} onChange={e => setOriginForm({...originForm, date: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowOriginModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-cyan text-black font-medium hover:bg-primary-cyan/90 transition-colors">Guardar Origen</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Mother Modal */}
        {showMotherModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-t-primary-green">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white flex items-center"><Dna className="w-5 h-5 mr-2 text-primary-green"/> Alta Planta Madre</h3>
                <button onClick={() => setShowMotherModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleMotherSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Origen Genético (Donante) *</label>
                  <select required value={motherForm.originId} onChange={e => setMotherForm({...motherForm, originId: e.target.value, strain: origins.find(o => o.id === e.target.value)?.name || ''})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none font-mono">
                    <option value="">Selecciona Origen...</option>
                    {origins.map(o => <option key={o.id} value={o.id}>{o.id} - {o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Ubicación (Sala)</label>
                  <input type="text" value={motherForm.location} onChange={e => setMotherForm({...motherForm, location: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none" />
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowMotherModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-green text-black font-medium hover:bg-primary-green/90 transition-colors">Guardar Madre</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Clone Modal */}
        {showCloneModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-t-blue-400">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white flex items-center"><Scissors className="w-5 h-5 mr-2 text-blue-400"/> Cortar Lote de Esquejes</h3>
                <button onClick={() => setShowCloneModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleCloneSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Planta Madre Donante *</label>
                  <select required value={cloneForm.motherId} onChange={e => setCloneForm({...cloneForm, motherId: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-blue-400 focus:outline-none font-mono">
                    <option value="">Selecciona Madre...</option>
                    {mothers.map(m => <option key={m.id} value={m.id}>{m.id} - {m.strain}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Cantidad de Esquejes</label>
                  <input type="number" required min="1" value={cloneForm.quantity} onChange={e => setCloneForm({...cloneForm, quantity: parseInt(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-blue-400 focus:outline-none font-mono" />
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowCloneModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-400 text-black font-medium hover:bg-blue-500 transition-colors">Generar Lote</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Pollen Modal */}
        {showPollenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-t-yellow-400">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white flex items-center"><Wind className="w-5 h-5 mr-2 text-yellow-400"/> Extraer Polen</h3>
                <button onClick={() => setShowPollenModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handlePollenSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Cepa Macho (Donante) *</label>
                  <select required value={pollenForm.strain} onChange={e => setPollenForm({...pollenForm, strain: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-yellow-400 focus:outline-none">
                    <option value="">Selecciona Genética (Del Catálogo)...</option>
                    {varieties.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Cantidad (Gramos)</label>
                    <input type="number" required min="1" step="0.1" value={pollenForm.quantityGrams} onChange={e => setPollenForm({...pollenForm, quantityGrams: parseFloat(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-yellow-400 focus:outline-none font-mono" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Viabilidad Testada (%)</label>
                    <input type="number" required min="1" max="100" value={pollenForm.viability} onChange={e => setPollenForm({...pollenForm, viability: parseInt(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-yellow-400 focus:outline-none font-mono" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowPollenModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancelar</button>
                  <button type="submit" className="px-4 py-2 rounded bg-yellow-400 text-black font-medium hover:bg-yellow-500 transition-colors">Añadir al Banco</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Cross Modal */}
        {showCrossModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border-t-4 border-t-purple-500">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white flex items-center"><Beaker className="w-5 h-5 mr-2 text-purple-400"/> Generar Nuevo Cruce</h3>
                <button onClick={() => setShowCrossModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleCrossSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background p-3 rounded border border-border/50">
                    <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-2"><Scissors className="w-3 h-3 inline mr-1"/> Hembra (Receptor)</label>
                    <select required value={crossForm.femaleId} onChange={e => setCrossForm({...crossForm, femaleId: e.target.value})} className="w-full bg-card border border-border rounded p-2 text-sm text-white focus:border-purple-500 focus:outline-none font-mono">
                      <option value="">Lote Esquejes...</option>
                      {clones.map(c => <option key={c.id} value={c.id}>{c.id} ({c.quantity} uds)</option>)}
                    </select>
                  </div>
                  <div className="bg-background p-3 rounded border border-border/50">
                    <label className="block text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-2"><Wind className="w-3 h-3 inline mr-1"/> Macho (Donante)</label>
                    <select required value={crossForm.maleId} onChange={e => setCrossForm({...crossForm, maleId: e.target.value})} className="w-full bg-card border border-border rounded p-2 text-sm text-white focus:border-purple-500 focus:outline-none font-mono">
                      <option value="">Lote Polen...</option>
                      {pollen.map(p => <option key={p.id} value={p.id}>{p.id} ({p.strain})</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <label className="block text-xs font-medium text-text-muted mb-1">Nombre de la Nueva Cepa (Hybrid) *</label>
                  <input required type="text" value={crossForm.newStrainName} onChange={e => setCrossForm({...crossForm, newStrainName: e.target.value})} placeholder="Ej: Super Lemon Haze F1" className="w-full bg-background border border-border rounded p-2 text-white focus:border-purple-500 focus:outline-none text-lg font-medium" />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1 flex justify-between">
                    <span>Semillas Producidas (Estimado)</span>
                    <span className="text-primary-green">Irán directo al inventario</span>
                  </label>
                  <input type="number" required min="1" value={crossForm.seedYield} onChange={e => setCrossForm({...crossForm, seedYield: parseInt(e.target.value)})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-purple-500 focus:outline-none font-mono text-lg" />
                </div>

                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowCrossModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancelar</button>
                  <button type="submit" className="px-6 py-2 rounded bg-purple-500 text-white font-bold hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/30">Fusionar & Generar Lote</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Cultivation Log Modal (GACP) */}
        {selectedEntityForLog && (
           <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-primary-green/50 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.15)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-5 border-b border-border flex justify-between items-center bg-primary-green/5">
                 <div>
                   <h3 className="text-lg font-bold text-white flex items-center"><Leaf className="w-5 h-5 mr-2 text-primary-green"/> Cuaderno de Cultivo GACP</h3>
                   <div className="text-sm text-text-muted mt-1">Entidad: <span className="text-primary-cyan font-mono">{selectedEntityForLog.id}</span> ({selectedEntityForLog.title})</div>
                 </div>
                 <button onClick={() => setSelectedEntityForLog(null)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
                 
                 {/* Left: Add New Log */}
                 <div className="w-full md:w-1/2">
                   <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2">Registrar Insumo / Tarea</h4>
                   <form onSubmit={handleLogSubmit} className="space-y-4">
                     <div>
                       <label className="block text-xs font-medium text-text-muted mb-1">Tipo de Tarea *</label>
                       <select required value={logForm.type} onChange={e => setLogForm({...logForm, type: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none">
                         <option value="Watering">Riego (Watering)</option>
                         <option value="Nutrient">Abono / Nutrientes</option>
                         <option value="IPM">Pesticida (IPM)</option>
                         <option value="Pruning">Poda / Defoliación</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-text-muted mb-1">Producto Utilizado *</label>
                       <input required type="text" value={logForm.product} onChange={e => setLogForm({...logForm, product: e.target.value})} placeholder="Ej: BioBizz Grow (Lote A1)" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none" />
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-text-muted mb-1">Dosis / Detalles *</label>
                       <input required type="text" value={logForm.dose} onChange={e => setLogForm({...logForm, dose: e.target.value})} placeholder="Ej: 2ml/L" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-xs font-medium text-text-muted mb-1">Fecha *</label>
                         <input required type="date" value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none" />
                       </div>
                       <div>
                         <label className="block text-xs font-medium text-text-muted mb-1">Hora *</label>
                         <input required type="time" value={logForm.time} onChange={e => setLogForm({...logForm, time: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none" />
                       </div>
                     </div>
                     <div>
                       <label className="block text-xs font-medium text-text-muted mb-1">Operario *</label>
                       <input required type="text" value={logForm.operator} onChange={e => setLogForm({...logForm, operator: e.target.value})} placeholder="Nombre o ID del Operario" className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-green focus:outline-none" />
                     </div>
                     <button type="submit" className="w-full px-4 py-2 rounded bg-primary-green/10 text-primary-green border border-primary-green/30 font-medium hover:bg-primary-green hover:text-black transition-colors">
                       Registrar en Cuaderno
                     </button>
                   </form>
                 </div>
                 
                 {/* Right: History */}
                 <div className="w-full md:w-1/2 flex flex-col">
                   <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2 flex justify-between">
                     <span>Historial de Tareas</span>
                   </h4>
                   <div className="flex-1 overflow-y-auto space-y-3">
                     {getEntityLogs(selectedEntityForLog.id).length === 0 ? (
                       <div className="text-center text-text-muted text-sm py-8 border border-dashed border-border rounded">No hay registros GACP.</div>
                     ) : getEntityLogs(selectedEntityForLog.id).map(log => (
                       <div key={log.id} className="bg-background border border-border/50 p-3 rounded flex flex-col">
                         <div className="flex justify-between items-start mb-1">
                           <span className="text-xs font-bold text-white flex items-center">
                             {log.type === 'Watering' && <Droplets className="w-3 h-3 mr-1 text-blue-400" />}
                             {log.type === 'Nutrient' && <Leaf className="w-3 h-3 mr-1 text-primary-green" />}
                             {log.type === 'IPM' && <Bug className="w-3 h-3 mr-1 text-red-400" />}
                             {log.type === 'Pruning' && <Scissors className="w-3 h-3 mr-1 text-yellow-400" />}
                             {log.type}
                           </span>
                           <span className="text-[10px] text-text-muted font-mono">{log.date} {log.time}</span>
                         </div>
                         <div className="text-sm text-text-main">{log.product}</div>
                         <div className="flex justify-between items-end mt-1">
                           <div className="text-xs text-text-muted font-mono">Dosis: {log.dose}</div>
                           <div className="text-[10px] bg-card border border-border px-1.5 py-0.5 rounded text-text-muted">{log.operator}</div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
                 
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
