import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Network, Package, FlaskConical, Link2, ArrowRight, ShieldAlert, AlertOctagon, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function TraceabilityExplorer({ initialQuery = '', onClose }) {
  const { batches, varieties, tests, invoices, crosses, mothers, clones, runImpactAnalysis, executeCascadingQuarantine, qualityEvents } = useAppContext();
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('visual');
  const [impactData, setImpactData] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');

  const performSearch = (searchStr) => {
    if (!searchStr) {
      setResult(null);
      return;
    }
    
    const term = searchStr.toUpperCase();
    let found = null;

    // Search in Batches
    const batch = batches.find(b => b.id.toUpperCase() === term || b.id.toUpperCase().includes(term));
    if (batch) {
      found = { type: 'Batch', data: batch, id: batch.id };
    }
    // Search in Tests
    if (!found) {
      const test = tests.find(t => t.id.toUpperCase() === term || t.id.toUpperCase().includes(term));
      if (test) found = { type: 'Test', data: test, id: test.id };
    }
    // Search in Invoices
    if (!found) {
      const inv = invoices?.find(i => i.id.toUpperCase() === term || i.id.toUpperCase().includes(term));
      if (inv) found = { type: 'Invoice', data: inv, id: inv.id };
    }
    
    // Search in Mothers
    if (!found) {
      const mother = mothers?.find(m => m.id.toUpperCase() === term || m.id.toUpperCase().includes(term));
      if (mother) found = { type: 'Mother', data: mother, id: mother.id };
    }
    // Search in Clones
    if (!found) {
      const clone = clones?.find(c => c.id.toUpperCase() === term || c.id.toUpperCase().includes(term));
      if (clone) found = { type: 'Clone', data: clone, id: clone.id };
    }
    
    // Build tree
    if (found) {
      const tree = buildTraceabilityTree(found);
      const impact = runImpactAnalysis(found.id);
      setResult({ ...found, tree });
      setImpactData(impact);
    } else {
      setResult(null);
      setImpactData(null);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const buildTraceabilityTree = (node) => {
    const upstream = [];
    const downstream = [];

    if (node.type === 'Batch') {
      const variety = varieties.find(v => v.name === node.data.variety);
      if (variety) {
        upstream.push({ type: 'Variety', id: variety.code || variety.id, label: variety.name });
        
        // Find if this variety came from a cross
        const cross = crosses?.find(c => c.newStrainName === variety.name);
        if (cross) {
          upstream.push({ type: 'Cross', id: cross.id || cross.custom_id, label: `Cross: ${cross.femaleId} x ${cross.maleId}` });
        }
      }

      // Downstream: Tests
      const relatedTests = tests.filter(t => t.batch === node.id);
      relatedTests.forEach(t => downstream.push({ type: 'Test', id: t.id, label: `Germination Test (${t.status})` }));
      
      // Downstream: Invoices
      invoices?.forEach(inv => {
        if (inv.items && inv.items.some(item => item.batchId === node.id)) {
          downstream.push({ type: 'Invoice', id: inv.id, label: `Sale to ${inv.clientId}` });
        }
      });
    }

    if (node.type === 'Test') {
      upstream.push({ type: 'Batch', id: node.data.batch, label: `Source Batch` });
    }

    if (node.type === 'Invoice') {
       if (node.data.items) {
           node.data.items.forEach(item => {
               upstream.push({ type: 'Batch', id: item.batchId, label: `Included Batch` });
           });
       }
    }

    return { upstream, downstream };
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/95 backdrop-blur-md">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#06111f] border border-primary-cyan/30 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        
        <div className="p-4 border-b border-border flex justify-between items-center bg-card/50">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Network className="w-6 h-6 mr-3 text-primary-cyan" /> 
            Universal Traceability Explorer
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-border/50 bg-card">
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-primary-cyan" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') performSearch(query);
              }}
              placeholder="Enter Batch ID, Test ID, Invoice ID..." 
              className="w-full bg-background border-2 border-primary-cyan/30 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary-cyan focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all font-mono text-lg"
            />
            <button 
              onClick={() => performSearch(query)}
              className="absolute right-2 top-2 bottom-2 px-6 bg-primary-cyan text-black rounded-full font-bold hover:bg-primary-cyan/90 transition-colors"
            >
              TRACE
            </button>
          </div>
          
          {result && (
            <div className="flex justify-center mt-6 space-x-4">
              <button onClick={() => setActiveTab('visual')} className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'visual' ? 'bg-primary-cyan text-black' : 'bg-background text-text-muted hover:text-white'}`}>
                Visual Tree
              </button>
              <button onClick={() => setActiveTab('impact')} className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center ${activeTab === 'impact' ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'bg-background text-text-muted hover:text-orange-400'}`}>
                <ShieldAlert className="w-4 h-4 mr-2" /> Impact & Recall Analysis
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <Network className="w-24 h-24 text-text-muted mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">No Traceability Data Found</h3>
              <p className="text-text-muted max-w-md">
                Enter an ID in the search bar above to map the entire lifecycle (Upstream & Downstream) of the material.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              
              {activeTab === 'visual' ? (
                <>
                  {/* UPSTREAM */}
                  {result.tree.upstream.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center">
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Upstream Origins
                      </h4>
                      <div className="space-y-3">
                        {result.tree.upstream.map((node, i) => (
                          <div key={i} className="glass-panel p-4 flex items-center border-l-4 border-l-purple-500 hover:border-l-purple-400 transition-colors cursor-pointer" onClick={() => {setQuery(node.id); performSearch(node.id);}}>
                            <Link2 className="w-5 h-5 text-purple-400 mr-4" />
                            <div>
                              <p className="text-sm font-bold text-white">{node.id}</p>
                              <p className="text-xs text-text-muted">{node.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TARGET NODE */}
                  <div className="my-12 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-primary-cyan/30 -z-10"></div>
                    <div className={`bg-card border-2 ${result.data?.status === 'Quarantined' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-primary-cyan shadow-[0_0_30px_rgba(6,182,212,0.2)]'} rounded-xl p-6 max-w-lg mx-auto text-center transform scale-105 relative`}>
                      
                      {/* Quality Events Badge */}
                      {(() => {
                        const relatedEvents = qualityEvents?.filter(ev => ev.relatedEntity?.toUpperCase() === result.id.toUpperCase()) || [];
                        const openEvents = relatedEvents.filter(ev => ev.status === 'Open');
                        if (openEvents.length > 0 || result.data?.status === 'Quarantined') {
                          return (
                            <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center border-2 border-background animate-pulse">
                              <AlertOctagon className="w-4 h-4 mr-1" />
                              {result.data?.status === 'Quarantined' ? 'QUARANTINED' : `${openEvents.length} OPEN EVENT(S)`}
                            </div>
                          );
                        }
                        return null;
                      })()}

                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${result.data?.status === 'Quarantined' ? 'bg-red-500/20 text-red-500' : 'bg-primary-cyan/20 text-primary-cyan'} mb-4`}>
                        {result.type === 'Batch' ? <Package className="w-6 h-6" /> : <FlaskConical className="w-6 h-6" />}
                      </div>
                      <h2 className="text-2xl font-bold text-white font-mono mb-1">{result.id}</h2>
                      <p className={`text-sm uppercase tracking-widest font-bold ${result.data?.status === 'Quarantined' ? 'text-red-500' : 'text-primary-cyan'}`}>{result.type}</p>
                    </div>
                  </div>

                  {/* DOWNSTREAM */}
                  {result.tree.downstream.length > 0 && (
                    <div className="mt-8 text-right">
                      <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center justify-end">
                        Downstream Distribution <ArrowRight className="w-4 h-4 ml-2" />
                      </h4>
                      <div className="space-y-3 flex flex-col items-end">
                        {result.tree.downstream.map((node, i) => (
                          <div key={i} className="glass-panel p-4 flex items-center justify-between w-full max-w-sm border-r-4 border-r-orange-400 hover:border-r-orange-300 transition-colors cursor-pointer" onClick={() => {setQuery(node.id); performSearch(node.id);}}>
                            <div className="text-left">
                              <p className="text-sm font-bold text-white">{node.id}</p>
                              <p className="text-xs text-text-muted">{node.label}</p>
                            </div>
                            <Link2 className="w-5 h-5 text-orange-400 ml-4" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-card p-6 rounded-xl border border-orange-500/30">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center"><AlertOctagon className="w-6 h-6 text-orange-500 mr-3" /> Impact & Recall Analysis</h3>
                      <p className="text-text-muted mt-2">Displaying all downstream entities affected by <strong>{result.id}</strong>.</p>
                    </div>
                    <button onClick={() => setShowPinModal(true)} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors flex items-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                      <ShieldAlert className="w-5 h-5 mr-2" /> Initiate Cascading Quarantine
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-5">
                      <h4 className="font-bold text-white mb-4 flex items-center"><Users className="w-5 h-5 text-blue-400 mr-2" /> Affected Clients (Recall)</h4>
                      {impactData?.clients.length === 0 ? <p className="text-sm text-text-muted">No clients affected.</p> : (
                        <ul className="space-y-3">
                          {impactData?.clients.map((c, i) => (
                            <li key={i} className="text-sm p-3 bg-background rounded border border-border">
                              <p className="font-bold text-primary-cyan">{c.client.name}</p>
                              <p className="text-text-muted text-xs mt-1">Invoices: {c.invoices.map(inv => inv.id).join(', ')}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div className="glass-panel p-5">
                      <h4 className="font-bold text-white mb-4 flex items-center"><Package className="w-5 h-5 text-orange-400 mr-2" /> Affected Inventory (Quarantine Risk)</h4>
                      {impactData?.batches.length === 0 ? <p className="text-sm text-text-muted">No downstream batches affected.</p> : (
                        <ul className="space-y-2">
                          {impactData?.batches.map((b, i) => (
                            <li key={i} className="text-sm p-2 flex justify-between bg-background rounded border border-border">
                              <span className="font-mono text-white">{b.id}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${b.status === 'Quarantined' ? 'bg-red-500/20 text-red-400' : 'bg-primary-green/20 text-primary-green'}`}>{b.status}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Cascading Quarantine Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card border-2 border-red-500 rounded-xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(220,38,38,0.3)]">
              <div className="flex items-center text-red-500 mb-4">
                <AlertOctagon className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold">Cascading Quarantine</h3>
              </div>
              <p className="text-text-muted text-sm mb-4">This action will instantly lock all <strong>{impactData?.batches.length}</strong> downstream batches connected to <strong>{result?.id}</strong>. This action is immutable and will be logged under 21 CFR Part 11.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-text-muted uppercase mb-1">Reason for Quarantine</label>
                  <input type="text" id="quarantineReason" placeholder="e.g. Positive for Hop Latent Viroid" className="w-full bg-background border border-border rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-red-400 uppercase mb-1">QA Approval PIN</label>
                  <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" className="w-full bg-background border border-red-500/50 rounded p-2 text-white font-mono text-center tracking-widest text-lg" maxLength={4} />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button onClick={() => setShowPinModal(false)} className="flex-1 py-2 bg-background hover:bg-border text-white rounded transition-colors">Cancel</button>
                <button onClick={async () => {
                  try {
                    const reason = document.getElementById('quarantineReason').value || 'Unspecified Critical Failure';
                    await executeCascadingQuarantine(result.id, reason, pin);
                    setShowPinModal(false);
                    setPin('');
                    alert('Cascading Quarantine Executed Successfully.');
                    performSearch(result.id); // Refresh data
                  } catch (e) {
                    alert(e.message);
                  }
                }} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow-[0_0_15px_rgba(220,38,38,0.5)]">EXECUTE BLOCK</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(modalContent, document.body);
}
