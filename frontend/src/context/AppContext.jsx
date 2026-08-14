import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [varieties, setVarieties] = useState(() => JSON.parse(localStorage.getItem('seedlab_varieties')) || [
    { id: 'VAR-001', name: 'UK Cheese', code: 'UKC-26-001', breeder: 'Exodus Collective', type: 'Feminized', description: 'Legendary UK strain with intense cheese aroma.', minStock: 500, avgViability: 95, activeBatches: 3, status: 'Active' },
    { id: 'VAR-002', name: 'Amnesia Haze Original', code: 'AMH-25-002', breeder: 'Soma Seeds', type: 'Feminized', description: 'Sativa dominant classic.', minStock: 300, avgViability: 92, activeBatches: 2, status: 'Active' }
  ]);
  const [batches, setBatches] = useState(() => JSON.parse(localStorage.getItem('seedlab_batches')) || []);
  const [tests, setTests] = useState(() => JSON.parse(localStorage.getItem('seedlab_tests')) || []);
  const [auditLogs, setAuditLogs] = useState(() => JSON.parse(localStorage.getItem('seedlab_logs')) || []);
  const [customTasks, setCustomTasks] = useState(() => JSON.parse(localStorage.getItem('seedlab_tasks')) || []);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('seedlab_users')) || []);
  const [companyProfile, setCompanyProfile] = useState(() => JSON.parse(localStorage.getItem('seedlab_company')) || { costPerSeed: 0.50 });
  const [clients, setClients] = useState(() => JSON.parse(localStorage.getItem('seedlab_clients')) || []);
  const [invoices, setInvoices] = useState(() => JSON.parse(localStorage.getItem('seedlab_invoices')) || []);
  const [facilities, setFacilities] = useState(() => {
    try {
      const localString = localStorage.getItem('seedlab_facilities');
      if (localString) {
        const local = JSON.parse(localString);
        if (Array.isArray(local) && local.length > 0) return local;
      }
    } catch (e) {
      console.error('Error reading facilities from localStorage', e);
    }
    return [
      'HQ / Main Vault / A1',
      'HQ / Cold Storage / Fridge 1',
      'HQ / Quarantine Area'
    ];
  });
  const [webhookLogs, setWebhookLogs] = useState(() => JSON.parse(localStorage.getItem('seedlab_webhooks')) || []);
  
  // Feature Flags / Modular Licensing
  const [subscriptionTier, setSubscriptionTier] = useState(() => {
    return localStorage.getItem('seedlab_tier') || 'Enterprise';
  });

  const [isAuditMode, setIsAuditMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('seedlab_tier', subscriptionTier);
  }, [subscriptionTier]);

  // Genetics Engine States
  const [origins, setOrigins] = useState(() => JSON.parse(localStorage.getItem('seedlab_origins')) || [
    { id: 'ORG-1001', name: 'Amnesia Haze Original', type: 'Strain Hunter (Wild)', date: '2025-01-15' }
  ]);
  const [mothers, setMothers] = useState(() => JSON.parse(localStorage.getItem('seedlab_mothers')) || [
    { id: 'MOM-2005', strain: 'Amnesia Haze Original', originId: 'ORG-1001', location: 'Sala Madres Norte', status: 'Vegetative', createdAt: '2025-02-10' }
  ]);
  const [clones, setClones] = useState(() => JSON.parse(localStorage.getItem('seedlab_clones')) || [
    { id: 'CLN-5501', motherId: 'MOM-2005', quantity: 200, date: '2026-08-01' }
  ]);
  const [pollen, setPollen] = useState(() => JSON.parse(localStorage.getItem('seedlab_pollen')) || [
    { id: 'POL-9002', strain: 'Skunk #1 Macho', extractionDate: '2026-07-20', quantityGrams: 45.5, viability: 88 }
  ]);
  const [crosses, setCrosses] = useState(() => JSON.parse(localStorage.getItem('seedlab_crosses')) || []);
  const [cultivationLogs, setCultivationLogs] = useState(() => JSON.parse(localStorage.getItem('seedlab_cultivation_logs')) || []);

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sync Supabase Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchCurrentUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchCurrentUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCurrentUserProfile = async (authId) => {
    try {
      const { data, error } = await supabase.from('app_users').select('*').eq('auth_id', authId).single();
      if (data) {
        setCurrentUser({ ...data, id: data.custom_id });
      }
    } catch (e) {
      console.error('Error fetching user profile:', e);
    } finally {
      setAuthLoading(false);
    }
  };

  // Fetch initial data from Supabase (Sync cache from cloud in background)
  useEffect(() => {
    const fetchAllData = async () => {
      if (!currentUser) return; // Only fetch data if logged in
      
      try {
        const [
          { data: vData },
          { data: bData },
          { data: tData },
          { data: lData },
          { data: uData },
          { data: cData },
          { data: cpData },
          { data: clData },
          { data: invData }
        ] = await Promise.all([
          supabase.from('varieties').select('*').order('name', { ascending: true }),
          supabase.from('batches').select('*').order('variety', { ascending: true }),
          supabase.from('tests').select('*').order('created_at', { ascending: false }),
          supabase.from('audit_logs').select('*').order('created_at', { ascending: false }),
          supabase.from('app_users').select('*'),
          supabase.from('custom_tasks').select('*').order('created_at', { ascending: false }),
          supabase.from('company_profile').select('*').single(),
          supabase.from('clients').select('*').order('name', { ascending: true }),
          supabase.from('invoices').select('*').order('created_at', { ascending: false })
        ]);

        // Map data to match old ID structure (custom_id)
        if (vData) {
          const mapped = vData.map(v => ({...v, id: v.custom_id, avgViability: v.avg_viability, activeBatches: v.active_batches, minStock: v.min_stock, salesHistory: v.sales_history, yearlySales: v.yearly_sales, mother: v.mother, father: v.father}));
          setVarieties(mapped.sort((a,b) => a.name.localeCompare(b.name)));
        }
        if (bData) setBatches(bData.map(b => ({...b, id: b.custom_id, initialQty: b.initial_qty, currentQty: b.current_qty})));
        if (tData) setTests(tData.map(t => ({...t, id: t.custom_id, sampleSize: t.sample_size, startDate: t.start_date, targetTemp: t.target_temp, dailyCounts: t.daily_counts, finalPct: t.final_pct})));
        if (lData) setAuditLogs(lData.map(l => ({...l, id: l.custom_id, userName: l.user_name})));
        if (uData) setUsers(uData.map(u => ({...u, id: u.custom_id})));
        if (cData) setCustomTasks(cData);
        if (cpData) setCompanyProfile({
          name: cpData.name, address: cpData.address, email: cpData.email, taxId: cpData.tax_id, logo: cpData.logo
        });
        if (clData) setClients(clData.map(c => ({...c, id: c.custom_id, taxId: c.tax_id})));
        if (invData) setInvoices(invData.map(i => ({...i, id: i.custom_id, clientId: i.client_id, totalAmount: i.total_amount})));
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      }
    };
    fetchAllData();
  }, []);

  // Save to localStorage whenever states change (Keep cache fresh)
  useEffect(() => {
    if (!currentUser) return;
    const saveToLocal = (key, data) => {
      try {
        if (data && (!Array.isArray(data) || data.length > 0) || Object.keys(data).length > 0) {
          localStorage.setItem(key, JSON.stringify(data));
        }
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    };
    saveToLocal('seedlab_varieties', varieties);
    saveToLocal('seedlab_batches', batches);
    saveToLocal('seedlab_tests', tests);
    saveToLocal('seedlab_logs', auditLogs);
    saveToLocal('seedlab_tasks', customTasks);
    saveToLocal('seedlab_users', users);
    saveToLocal('seedlab_company', companyProfile);
    saveToLocal('seedlab_clients', clients);
    saveToLocal('seedlab_invoices', invoices);
    saveToLocal('seedlab_origins', origins);
    saveToLocal('seedlab_mothers', mothers);
    saveToLocal('seedlab_clones', clones);
    saveToLocal('seedlab_pollen', pollen);
    saveToLocal('seedlab_crosses', crosses);
    saveToLocal('seedlab_cultivation_logs', cultivationLogs);
    saveToLocal('seedlab_facilities', facilities);
    saveToLocal('seedlab_webhooks', webhookLogs);
  }, [varieties, batches, tests, auditLogs, customTasks, users, companyProfile, clients, invoices, origins, mothers, clones, pollen, crosses, cultivationLogs, facilities, webhookLogs, currentUser]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const addAuditLog = async (action, entity, details) => {
    const newLog = {
      custom_id: `LOG-${Date.now()}`,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user_name: currentUser?.name || 'SYSTEM',
      action,
      entity,
      details
    };
    // Optimistic UI
    setAuditLogs(prev => [{...newLog, id: newLog.custom_id, userName: newLog.user_name}, ...prev]);
    await supabase.from('audit_logs').insert([newLog]);
  };

  const updateCompanyProfile = async (data) => {
    setCompanyProfile(data);
    await supabase.from('company_profile').update({
      name: data.name, address: data.address, email: data.email, tax_id: data.taxId, logo: data.logo
    }).eq('id', 1);
    addAuditLog('Updated Config', 'Company Profile', 'Modified white-label and financial settings');
  };

  const addUser = async (userData) => {
    const customId = `USR-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`;
    const newUser = {
      custom_id: customId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: 'Active',
      password: 'seedlab123'
    };
    // Optimistic UI
    setUsers(prev => [{...newUser, id: customId}, ...prev]);
    await supabase.from('app_users').insert([newUser]);
    addAuditLog('Created User', newUser.email, `Assigned role: ${newUser.role}`);
  };

  const addCustomTask = async (content) => {
    const newTask = { id: Date.now().toString(), content, completed: false };
    setCustomTasks(prev => [newTask, ...prev]);
    await supabase.from('custom_tasks').insert([newTask]);
  };
  const toggleCustomTask = async (id) => {
    const task = customTasks.find(t => t.id === id);
    if (!task) return;
    setCustomTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    await supabase.from('custom_tasks').update({ completed: !task.completed }).eq('id', id);
  };
  const deleteCustomTask = async (id) => {
    setCustomTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from('custom_tasks').delete().eq('id', id);
  };

  const addVariety = async (variety) => {
    const customId = `VAR-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`;
    const newVariety = {
      custom_id: customId,
      name: variety.name,
      code: variety.code,
      breeder: variety.breeder,
      type: variety.type,
      status: variety.status || 'Active',
      description: variety.description,
      image: variety.image,
      mother: variety.mother || null,
      father: variety.father || null,
      thc: variety.thc || '',
      cbd: variety.cbd || '',
      terpenes: variety.terpenes || '',
      avg_viability: 0,
      active_batches: 0,
      min_stock: parseInt(variety.minStock) || 0,
      history: [{m:'Initial',r:0}],
      sales_history: [{m:'Jan',s:0},{m:'Feb',s:0},{m:'Mar',s:0},{m:'Apr',s:0},{m:'May',s:0},{m:'Jun',s:0}],
      yearly_sales: [{y:'2022',s:0},{y:'2023',s:0},{y:'2024',s:0},{y:'2025',s:0}]
    };
    
    // UI mapping
    const uiVariety = {...newVariety, id: customId, avgViability: 0, activeBatches: 0, minStock: newVariety.min_stock, salesHistory: newVariety.sales_history, yearlySales: newVariety.yearly_sales, thc: newVariety.thc, cbd: newVariety.cbd, terpenes: newVariety.terpenes};
    setVarieties(prev => {
      const updated = [uiVariety, ...prev];
      return updated.sort((a,b) => a.name.localeCompare(b.name));
    });
    
    const { error } = await supabase.from('varieties').insert([newVariety]);
    if (error) {
       console.error(error);
       alert("Error from Supabase: " + error.message + " - Details: " + error.details);
    }
    addAuditLog('Created Variety', newVariety.code, `Added new genetic profile: ${newVariety.name}`);
  };

  const updateVariety = async (id, updates) => {
    setVarieties(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, ...updates } : v);
      return updated.sort((a,b) => a.name.localeCompare(b.name));
    });
    
    const dbUpdates = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.breeder) dbUpdates.breeder = updates.breeder;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.minStock !== undefined) dbUpdates.min_stock = parseInt(updates.minStock) || 0;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.mother !== undefined) dbUpdates.mother = updates.mother;
    if (updates.father !== undefined) dbUpdates.father = updates.father;
    if (updates.thc !== undefined) dbUpdates.thc = updates.thc;
    if (updates.cbd !== undefined) dbUpdates.cbd = updates.cbd;
    if (updates.terpenes !== undefined) dbUpdates.terpenes = updates.terpenes;
    
    await supabase.from('varieties').update(dbUpdates).eq('custom_id', id);
    addAuditLog('Updated Variety', id, `Modified genetic profile`);
  };

  const removeVariety = async (id) => {
    const varietyToDelete = varieties.find(v => v.id === id);
    if (!varietyToDelete) return;

    setVarieties(prev => prev.filter(v => v.id !== id));
    setBatches(prev => prev.filter(b => b.variety !== varietyToDelete.name));
    
    await supabase.from('varieties').delete().eq('custom_id', id);
    await supabase.from('batches').delete().eq('variety', varietyToDelete.name);
    
    addAuditLog('Deleted Variety', varietyToDelete.name, 'Removed from catalog and deleted all associated batches');
  };

  const addBatch = async (batch) => {
    const customId = batch.id;
    const newBatch = {
      custom_id: customId,
      variety: batch.variety,
      date: batch.date,
      initial_qty: parseInt(batch.initialQty),
      current_qty: parseInt(batch.initialQty),
      location: batch.location,
      conditions: batch.conditions,
      status: 'Apto',
      ledger: [{ date: new Date().toISOString().split('T')[0], user: currentUser?.name || 'SYSTEM', change: parseInt(batch.initialQty), reason: 'Initial Intake' }]
    };
    
    // UI mapping
    const uiBatch = {...newBatch, id: customId, initialQty: newBatch.initial_qty, currentQty: newBatch.current_qty};
    setBatches(prev => {
      const updated = [uiBatch, ...prev];
      return updated.sort((a,b) => a.variety.localeCompare(b.variety));
    });
    
    // Update variety active batches
    const variety = varieties.find(v => v.name === batch.variety);
    if (variety) {
      setVarieties(prev => prev.map(v => v.name === batch.variety ? { ...v, activeBatches: v.activeBatches + 1 } : v));
      await supabase.from('varieties').update({ active_batches: variety.activeBatches + 1 }).eq('custom_id', variety.id);
    }
    
    await supabase.from('batches').insert([newBatch]);
    addAuditLog('Received Batch', customId, `Intake of ${newBatch.initial_qty} seeds. Location: ${newBatch.location}`);
  };

  const adjustBatchStock = async (batchId, change, reason, witness = null, reasonCategory = 'General') => {
    const numChange = parseInt(change);
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;
    
    const isDestruction = witness !== null;

    // GACP/GMP BLOCK: Status Enforcement
    if ((batch.status === 'Quarantined' || batch.status === 'Rejected') && numChange < 0 && !isDestruction) {
      throw new Error(`GACP GMP Violation: Cannot deduct stock from a ${batch.status} batch unless it is a Destruction protocol.`);
    }
    
    const newQty = batch.currentQty + numChange;
    const lostValue = isDestruction ? Math.abs(numChange) * (companyProfile.costPerSeed || 0.50) : 0;
    
    // GACP ledger requirement
    const newLedgerEntry = { 
      date: new Date().toISOString().split('T')[0], 
      user: currentUser?.name || 'SYSTEM', 
      change: numChange, 
      reason: isDestruction ? `[GACP DESTRUCTION: ${reasonCategory}] ${reason} (Witness: ${witness}) - COGS Impact: $${lostValue.toFixed(2)}` : reason 
    };
    const newLedger = [newLedgerEntry, ...(batch.ledger || [])];
    
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, currentQty: newQty, ledger: newLedger } : b));
    
    await supabase.from('batches').update({ current_qty: newQty, ledger: newLedger }).eq('custom_id', batchId);
    addAuditLog(isDestruction ? 'GACP Destruction' : 'Stock Adjustment', batchId, `Change: ${numChange > 0 ? '+' : ''}${numChange}. Reason: ${reason}${isDestruction ? ` | Witnessed by: ${witness}` : ''}`);
  };

  const updateBatchStatus = async (id, newStatus) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    await supabase.from('batches').update({ status: newStatus }).eq('custom_id', id);
    addAuditLog('Updated Status', id, `Changed to ${newStatus}`);
  };

  const releaseBatch = async (batchId, qaPin) => {
    if (qaPin !== '0000') throw new Error('Invalid QA PIN for release');
    
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    if (batch.status !== 'Quarantined') {
       throw new Error('Only Quarantined batches can be released via QA workflow.');
    }

    await updateBatchStatus(batchId, 'Apto');
    addAuditLog('QA Batch Release', batchId, `Batch released from Quarantine by QA override. Approver: ${currentUser?.name || 'QA Admin'}`);
  };

  const updateBatch = async (id, updates) => {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    
    const dbUpdates = {};
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.conditions) dbUpdates.conditions = updates.conditions;
    
    await supabase.from('batches').update(dbUpdates).eq('custom_id', id);
    addAuditLog('Updated Batch', id, `Modified storage conditions`);
  };

  const removeBatch = async (id) => {
    setBatches(prev => prev.filter(b => b.id !== id));
    await supabase.from('batches').delete().eq('custom_id', id);
    addAuditLog('Deleted Batch', id, 'Removed from inventory');
  };

  const addTest = async (test) => {
    const customId = `TEST-${Math.floor(Math.random()*10000)}`;
    const newTest = {
      custom_id: customId,
      batch: test.batch,
      sample_size: test.sampleSize,
      technician: test.technician,
      method: test.method,
      target_temp: test.targetTemp,
      start_date: test.startDate,
      status: 'In Progress',
      daily_counts: {},
      notes: test.notes || ''
    };
    
    const uiTest = {...newTest, id: customId, sampleSize: newTest.sample_size, targetTemp: newTest.target_temp, startDate: newTest.start_date, dailyCounts: {}};
    setTests(prev => [uiTest, ...prev]);
    
    // Deduct stock
    await adjustBatchStock(test.batch, -test.sampleSize, `Lab Sample for Test ${customId}`);
    
    await supabase.from('tests').insert([newTest]);
    addAuditLog('Initiated Test', customId, `Started germination test on batch ${test.batch}`);
    return customId;
  };

  const updateTest = async (testId, updates) => {
    setTests(prev => prev.map(t => t.id === testId ? { ...t, ...updates } : t));
    
    const dbUpdates = {};
    if (updates.dailyCounts) dbUpdates.daily_counts = updates.dailyCounts;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    
    await supabase.from('tests').update(dbUpdates).eq('custom_id', testId);
  };

  const finalizeTest = async (testId, finalPct, status, qaPin) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    // GACP/GMP BLOCK: Segregation of Duties
    if (test.technician === currentUser?.name) {
       throw new Error(`GMP Violation: Segregation of Duties. The technician who initiated the test (${test.technician}) cannot be the one to approve and finalize it.`);
    }
    if (!qaPin || qaPin !== '0000') {
       throw new Error(`Invalid QA PIN. Dual Approval required.`);
    }

    setTests(prev => prev.map(t => t.id === testId ? { ...t, status: 'Completed', finalPct } : t));
    await supabase.from('tests').update({ status: 'Completed', final_pct: finalPct }).eq('custom_id', testId);
    
    // Cross-Module Integrity: If Rejected, trigger Cascading Quarantine automatically
    let impactReport = null;
    if (status === 'Rejected') {
       addAuditLog('OOS Result', testId, `Out of Specification (${finalPct}%). Auto-triggering Cascading Quarantine on Batch ${test.batch}`);
       impactReport = await executeCascadingQuarantine(test.batch, `OOS Lab Test Result (${finalPct}%)`, qaPin);
    } else {
       await updateBatchStatus(test.batch, status);
       addAuditLog('Test Finalized', testId, `Signed off with ${finalPct}%. QA Approved by ${currentUser?.name || 'QA Admin'}. Batch status auto-set to ${status}.`);
    }
    
    return impactReport;
  };

  const addClient = async (client) => {
    const customId = `CLI-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`;
    const newClient = {
      custom_id: customId,
      name: client.name,
      tax_id: client.taxId,
      email: client.email,
      address: client.address,
      phone: client.phone || '',
      status: 'Active'
    };
    
    const uiClient = {...newClient, id: customId, taxId: newClient.tax_id};
    setClients(prev => {
      const updated = [uiClient, ...prev];
      return updated.sort((a,b) => a.name.localeCompare(b.name));
    });
    
    await supabase.from('clients').insert([newClient]);
    addAuditLog('Created Client', customId, `Added new client: ${newClient.name}`);
  };

  const addInvoice = async (invoice, invoiceItems) => {
    const customId = `INV-${new Date().getFullYear()}-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`;
    const newInvoice = {
      custom_id: customId,
      client_id: invoice.clientId,
      type: invoice.type,
      date: invoice.date,
      language: invoice.language || 'es',
      total_amount: invoice.totalAmount,
      status: 'Emitida',
      items: invoiceItems
    };
    
    const uiInvoice = {...newInvoice, id: customId, clientId: newInvoice.client_id, totalAmount: newInvoice.total_amount};
    setInvoices(prev => [uiInvoice, ...prev]);
    
    if (invoice.type === 'Factura' || invoice.type === 'Albarán') {
      // GACP/GMP BLOCK: Check statuses before allowing invoice
      for (const item of invoiceItems) {
        const batch = batches.find(b => b.id === item.batchId);
        if (batch && batch.status !== 'Apto') {
           throw new Error(`GMP Violation: Batch ${item.batchId} is not 'Apto' (Current Status: ${batch.status}). Cannot process sale.`);
        }
      }
      for (const item of invoiceItems) {
        await adjustBatchStock(item.batchId, -item.quantity, `Sale - ${customId}`);
      }
    }
    
    await supabase.from('invoices').insert([newInvoice]);
    addAuditLog(`Issued ${invoice.type}`, customId, `Issued to client ${invoice.clientId} for $${invoice.totalAmount}`);
    return customId;
  };

  // Genetics CRUD
  const addOrigin = async (origin) => {
    const id = `ORG-${Date.now()}`;
    const newItem = { ...origin, id, createdAt: new Date().toISOString() };
    setOrigins(prev => [newItem, ...prev]);
    addAuditLog('Added Origin', id, `New genetic source: ${origin.name}`);
  };

  const addMother = async (mother) => {
    const id = `MOM-${Date.now()}`;
    const newItem = { ...mother, id, createdAt: new Date().toISOString() };
    setMothers(prev => [newItem, ...prev]);
    addAuditLog('Added Mother Plant', id, `From strain: ${mother.strain}`);
  };

  const addCloneBatch = async (clone) => {
    const id = `CLN-${Date.now()}`;
    const newItem = { ...clone, id, createdAt: new Date().toISOString() };
    setClones(prev => [newItem, ...prev]);
    addAuditLog('Cut Clones', id, `${clone.quantity} clones from mother ${clone.motherId}`);
  };

  const addPollen = async (p) => {
    const id = `POL-${Date.now()}`;
    const newItem = { ...p, id, createdAt: new Date().toISOString() };
    setPollen(prev => [newItem, ...prev]);
    addAuditLog('Extracted Pollen', id, `From strain: ${p.strain}`);
  };

  const addCross = async (cross) => {
    const id = `CRS-${Date.now()}`;
    const newItem = { ...cross, id, date: new Date().toISOString().split('T')[0] };
    setCrosses(prev => [newItem, ...prev]);
    addAuditLog('Genetics Crossed', id, `Female ${cross.femaleId} x Male ${cross.maleId}`);
    
    const strainName = cross.newStrainName || 'Hybrid Strain';

    // Auto-create Variety if it doesn't exist
    const existingVariety = varieties.find(v => v.name.toLowerCase() === strainName.toLowerCase());
    if (!existingVariety) {
      await addVariety({
        name: strainName,
        code: `HYB-${new Date().getFullYear().toString().slice(-2)}-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`,
        breeder: 'SeedLab (In-house Cross)',
        type: 'Regular / Hybrid',
        description: `Cross between clone batch ${cross.femaleId} and pollen ${cross.maleId}`,
        minStock: 100,
        mother: cross.femaleId,
        father: cross.maleId
      });
    }

    // Auto-create a seed batch in the inventory system
    const batchId = `BAT-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`;
    await addBatch({
      id: batchId,
      variety: strainName,
      date: newItem.date,
      initialQty: cross.seedYield || 1000,
      location: 'Main Vault',
      conditions: 'Temp: 4°C, HR: 20%'
    });
  };

  const addCultivationLog = async (log) => {
    const id = `CLOG-${Date.now()}`;
    const newLog = { ...log, id, date: log.date, time: log.time, operator: log.operator };
    setCultivationLogs(prev => [newLog, ...prev]);
    addAuditLog('Cultivation Log', log.entityId, `Applied ${log.type}: ${log.product} (${log.dose}) by ${log.operator}`);
  };

  // Phase 3: Actionable Genealogy 360 & Recalls
  const runImpactAnalysis = (entityId) => {
    // Finds downstream affected entities.
    // 1. If Mother -> find clones
    const affectedClones = clones.filter(c => c.motherId === entityId);
    
    // 2. Clones or Mother -> find Crosses
    const affectedCrosses = crosses.filter(c => 
      c.femaleId === entityId || 
      c.maleId === entityId || 
      affectedClones.some(cln => cln.id === c.femaleId)
    );
    
    // 3. Find Varieties created from these crosses
    // (Our simple model: cross.newStrainName maps to variety)
    const affectedVarieties = varieties.filter(v => 
      affectedCrosses.some(c => c.newStrainName === v.name) ||
      v.mother === entityId ||
      v.father === entityId ||
      affectedClones.some(cln => cln.id === v.mother)
    );
    
    // 4. Find Batches of these varieties
    const affectedBatches = batches.filter(b => 
      affectedVarieties.some(v => v.name === b.variety) || b.id === entityId
    );
    
    // 5. Find Invoices containing these batches -> Recalls
    const affectedInvoices = invoices.filter(inv => 
      inv.items.some(item => affectedBatches.some(b => b.id === item.batchId))
    );
    
    // 6. Map to Clients
    const affectedClientsMap = new Map();
    affectedInvoices.forEach(inv => {
      const client = clients.find(c => c.id === inv.clientId);
      if (client) {
        if (!affectedClientsMap.has(client.id)) affectedClientsMap.set(client.id, { client, invoices: [] });
        affectedClientsMap.get(client.id).invoices.push(inv);
      }
    });

    return {
      clones: affectedClones,
      crosses: affectedCrosses,
      varieties: affectedVarieties,
      batches: affectedBatches,
      invoices: affectedInvoices,
      clients: Array.from(affectedClientsMap.values())
    };
  };

  const executeCascadingQuarantine = async (entityId, reason, qaPin) => {
    if (!qaPin || qaPin !== '0000') {
      throw new Error('Invalid QA PIN. GxP Dual Approval required for Cascading Quarantines.');
    }

    const impact = runImpactAnalysis(entityId);
    let totalRiskValue = 0;
    const firedWebhooks = [];
    
    // Quarantine all affected batches
    const updatedBatches = batches.map(b => {
      if (impact.batches.some(ab => ab.id === b.id) && b.status !== 'Quarantined') {
        const batchValue = b.currentQty * (companyProfile.costPerSeed || 0.50);
        totalRiskValue += batchValue;

        const newLedgerEntry = { 
          date: new Date().toISOString().split('T')[0], 
          user: currentUser?.name || 'QA SYSTEM', 
          change: 0, 
          reason: `[GACP CASCADING QUARANTINE] Root cause in ${entityId}: ${reason}`
        };
        const newLedger = [newLedgerEntry, ...(b.ledger || [])];
        
        // Push update to DB
        supabase.from('batches').update({ status: 'Quarantined', ledger: newLedger }).eq('custom_id', b.id).then();
        addAuditLog('Cascading Quarantine', b.id, `Triggered by ${entityId}`);
        
        // Fire simulated webhook
        const whLog = {
          id: `WH-${Date.now()}-${Math.floor(Math.random()*10000)}`,
          timestamp: new Date().toISOString(),
          endpoint: 'POST /api/ecommerce/update_stock',
          payload: { batchId: b.id, stock: 0, status: 'Quarantined', reason: 'Cross-Module Integrity Lock' },
          status: '200 OK'
        };
        firedWebhooks.push(whLog);

        return { ...b, status: 'Quarantined', ledger: newLedger };
      }
      return b;
    });
    
    if (firedWebhooks.length > 0) {
       setWebhookLogs(prev => [...firedWebhooks, ...prev]);
    }
    
    setBatches(updatedBatches);
    addAuditLog('Emergency Protocol Executed', entityId, `Cascading quarantine applied to ${impact.batches.length} batches. Financial Risk Blocked: $${totalRiskValue.toFixed(2)}`);
    return { ...impact, totalRiskValue, firedWebhooks };
  };

  return (
    <AppContext.Provider value={{
      authLoading,
      varieties, addVariety, removeVariety, updateVariety,
      batches, addBatch, adjustBatchStock, updateBatchStatus, removeBatch,
      tests, addTest, updateTest, finalizeTest,
      auditLogs, addAuditLog,
      users, addUser, currentUser,
      customTasks, addCustomTask, toggleCustomTask, deleteCustomTask,
      companyProfile, updateCompanyProfile,
      clients, addClient,
      invoices, addInvoice,
      origins, addOrigin,
      mothers, addMother,
      clones, addCloneBatch,
      pollen, addPollen,
      crosses, addCross,
      updateBatch, releaseBatch,
      cultivationLogs, addCultivationLog,
      subscriptionTier, setSubscriptionTier,
      isAuditMode, setIsAuditMode,
      facilities, setFacilities,
      webhookLogs, setWebhookLogs,
      runImpactAnalysis, executeCascadingQuarantine
    }}>
      {children}
    </AppContext.Provider>
  );
}
