import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, Database, Key, KeyRound, HardDrive, Cpu, AlertTriangle, Building, X, Search, Plus, Save, CheckSquare, Download, Activity } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ItemCard } from '../components/ui/ItemCard';

export default function Settings() {
  const { auditLogs, batches, users, addUser, companyProfile, updateCompanyProfile, currentUser, subscriptionTier, setSubscriptionTier, facilities, setFacilities, webhookLogs } = useAppContext();
  const [activeTab, setActiveTab] = useState('company'); // 'company', 'team', 'ledger', 'license', 'compliance', 'facilities', 'integrations'

  // Temporarily bypassed for client demos
  // if (currentUser?.role !== 'Admin') {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full text-center">
  //       <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
  //       <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
  //       <p className="text-text-muted">You do not have the necessary permissions to view this page.</p>
  //     </div>
  //   );
  // }

  const [companyForm, setCompanyForm] = useState(companyProfile);
  const [isSaved, setIsSaved] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Lab Technician' });
  const [newFacility, setNewFacility] = useState('');
  
  // API Key State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('seedlab_api_key') || 'sk_live_1234567890abcdefghijklmnopqrstuvwxyz');
  const [keyCopied, setKeyCopied] = useState(false);

  // Company Handlers
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyForm(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    updateCompanyProfile(companyForm);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Invite Handlers
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    addUser(inviteForm);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', role: 'Lab Technician' });
  };

  const handleAddFacility = (e) => {
    e.preventDefault();
    if (newFacility.trim() && !facilities.includes(newFacility.trim())) {
      setFacilities([...facilities, newFacility.trim()]);
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (fac) => {
    setFacilities(facilities.filter(f => f !== fac));
  };

  const handleGenerateKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let newKey = 'sk_live_';
    for(let i=0; i<32; i++) {
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(newKey);
    localStorage.setItem('seedlab_api_key', newKey);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleDownloadAuditPackage = () => {
    const data = {
      timestamp: new Date().toISOString(),
      company: companyProfile,
      users: users,
      immutableAuditLedger: auditLogs,
      inventoryLedgers: batches.map(b => ({ batchId: b.id, variety: b.variety, ledger: b.ledger }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SeedLab_AuditPackage_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Action', 'Entity', 'Actor', 'Details'];
    const rows = auditLogs.map(log => [
      log.time,
      `"${log.action}"`,
      `"${log.entity}"`,
      `"${log.userName || log.user || log.user_name || 'SYSTEM'}"`,
      `"${log.details}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SeedLab_AuditLedger_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative h-full flex flex-col pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Settings</h1>
          <p className="text-sm text-text-muted">Manage your white-label settings, team, and view audit logs.</p>
        </div>
      </div>

      <div className="flex space-x-6 border-b border-border mb-6">
        <button onClick={() => setActiveTab('company')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'company' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white whitespace-nowrap'}`}>
          <div className="flex items-center"><Building className="w-4 h-4 mr-2"/> Company</div>
        </button>
        <button onClick={() => setActiveTab('team')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'team' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white whitespace-nowrap'}`}>
          <div className="flex items-center"><Users className="w-4 h-4 mr-2"/> Team</div>
        </button>
        <button onClick={() => setActiveTab('facilities')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'facilities' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white whitespace-nowrap'}`}>
          <div className="flex items-center"><Building className="w-4 h-4 mr-2"/> Facilities</div>
        </button>
        <button onClick={() => setActiveTab('ledger')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'ledger' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white whitespace-nowrap'}`}>
          <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2"/> Ledger</div>
        </button>
        <button onClick={() => setActiveTab('compliance')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'compliance' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white whitespace-nowrap'}`}>
          <Database className="w-4 h-4 inline-block mr-2" />
          Audit & Compliance
        </button>
        <button onClick={() => setActiveTab('integrations')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'integrations' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white whitespace-nowrap'}`}>
          <Cpu className="w-4 h-4 inline-block mr-2" />
          Integrations
        </button>
        <button onClick={() => setActiveTab('license')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'license' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white whitespace-nowrap'}`}>
          <KeyRound className="w-4 h-4 inline-block mr-2" />
          License
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {activeTab === 'company' && (
            <motion.div key="company" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-8 max-w-3xl mx-auto border-l-4 border-l-primary-cyan">
              <h2 className="text-lg font-bold text-white mb-6">White-Label Branding</h2>
              <form onSubmit={handleSaveCompany} className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="shrink-0">
                    <label className="block text-xs font-medium text-text-muted mb-2">Company Logo</label>
                    <div className="w-24 h-24 rounded bg-background border border-border flex items-center justify-center overflow-hidden mb-2 relative group cursor-pointer">
                      {companyForm.logo ? (
                        <img src={companyForm.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <Building className="w-8 h-8 text-text-muted" />
                      )}
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white">Upload</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">Company Name</label>
                      <input required type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">VAT / Tax ID</label>
                      <input type="text" value={companyForm.taxId} onChange={e => setCompanyForm({...companyForm, taxId: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Contact Email</label>
                    <input required type="email" value={companyForm.email} onChange={e => setCompanyForm({...companyForm, email: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">Headquarters Address</label>
                    <input type="text" value={companyForm.address} onChange={e => setCompanyForm({...companyForm, address: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <button type="submit" className={`tech-button text-black flex items-center transition-colors ${isSaved ? 'bg-primary-green hover:bg-primary-green/90' : 'bg-primary-cyan hover:bg-primary-cyan/90'}`}>
                    {isSaved ? <ShieldCheck className="w-4 h-4 mr-2"/> : <Save className="w-4 h-4 mr-2"/>} 
                    {isSaved ? 'Saved successfully!' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex bg-background border border-border rounded-md px-3 py-2 w-72 focus-within:border-primary-cyan transition-all">
                  <Search className="w-4 h-4 text-text-muted mr-2" />
                  <input type="text" placeholder="Search team members..." className="bg-transparent border-none outline-none text-sm text-white w-full" />
                </div>
                <button onClick={() => setShowInviteModal(true)} className="tech-button bg-primary-green/10 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Invite Employee
                </button>
              </div>

              <div className="overflow-y-auto pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((user) => (
                    <ItemCard
                      key={user.id}
                      id={user.id}
                      title={user.name}
                      icon={Users}
                      borderColor={user.status === 'Active' ? 'border-l-primary-green' : 'border-l-text-muted'}
                      badgeText={user.status}
                      badgeColor={user.status === 'Active' ? 'text-primary-green bg-primary-green/10 border-primary-green/30' : 'text-text-muted bg-background border-border'}
                      fields={[
                        { label: 'Role', value: user.role },
                        { label: 'Email', value: <span className="text-xs truncate block max-w-[150px]" title={user.email}>{user.email}</span> }
                      ]}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'facilities' && (
            <motion.div key="facilities" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-8 max-w-3xl mx-auto border-l-4 border-l-primary-green">
              <h2 className="text-lg font-bold text-white mb-2">Facility Mapping</h2>
              <p className="text-sm text-text-muted mb-6">Manage a hierarchical list of physical storage locations (e.g., Facility / Room / Fridge / Shelf).</p>
              
              <form onSubmit={handleAddFacility} className="flex space-x-4 mb-8">
                <input required type="text" value={newFacility} onChange={e=>setNewFacility(e.target.value)} placeholder="e.g. Warehouse 1 / Vault A / Shelf 3" className="flex-1 bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                <button type="submit" className="tech-button bg-primary-green/10 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black flex items-center">
                  <Plus className="w-4 h-4 mr-2" /> Add Location
                </button>
              </form>

              <div className="space-y-3">
                {facilities.map((fac, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-background border border-border rounded-lg p-3">
                    <div className="flex items-center text-white text-sm">
                      <Building className="w-4 h-4 mr-3 text-primary-cyan" />
                      {fac}
                    </div>
                    <button onClick={() => handleRemoveFacility(fac)} className="text-red-500 hover:bg-red-500/20 p-1.5 rounded transition-colors"><X className="w-4 h-4"/></button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'ledger' && (
            <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="glass-panel border-l-4 border-l-primary-cyan flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="p-4 border-b border-border/50 bg-background/50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-primary-cyan"/> Immutable Event Log</h3>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 rounded bg-background border border-border text-[10px] text-text-muted font-mono flex items-center"><Key className="w-3 h-3 mr-1"/> WORM STORAGE</span>
                  </div>
                </div>
                <div className="overflow-y-auto pb-8 pt-4 px-4 flex-1 custom-scrollbar">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {auditLogs.map((log) => (
                      <ItemCard
                        key={log.id}
                        id={log.time}
                        title={log.action}
                        icon={ShieldCheck}
                        borderColor="border-l-primary-cyan"
                        badgeText={log.entity}
                        badgeColor="text-primary-cyan bg-primary-cyan/10 border-primary-cyan/30"
                        fields={[
                          { label: 'Actor', value: log.userName || log.user || log.user_name || 'SYSTEM' },
                          { label: 'Details', value: <span className="text-xs">{log.details}</span> }
                        ]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'license' && (
            <motion.div key="license" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-8 max-w-4xl mx-auto border-l-4 border-l-orange-400">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center"><Key className="w-5 h-5 mr-2 text-orange-400"/> Feature Flags & Licensing</h2>
              <p className="text-sm text-text-muted mb-8">Switch between subscription tiers to see how the software adapts dynamically. Unused modules are completely hidden.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Lite */}
                <div 
                  onClick={() => setSubscriptionTier('Lite')}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${subscriptionTier === 'Lite' ? 'border-primary-cyan bg-primary-cyan/5 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'border-border bg-background hover:border-border/80'}`}
                >
                  {subscriptionTier === 'Lite' && <div className="absolute top-3 right-3"><ShieldCheck className="w-5 h-5 text-primary-cyan"/></div>}
                  <h3 className="text-xl font-bold text-white mb-1">Lite</h3>
                  <p className="text-xs text-text-muted mb-4">Retail & Distribution</p>
                  <ul className="text-sm space-y-2 text-text-muted">
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> Inventory Management</li>
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> Facturación B2B y Logística</li>
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> Basic Traceability</li>
                    <li className="flex items-center opacity-30"><X className="w-4 h-4 mr-2"/> Lab Germination Tests</li>
                    <li className="flex items-center opacity-30"><X className="w-4 h-4 mr-2"/> API & Integrations</li>
                  </ul>
                </div>

                {/* Producer */}
                <div 
                  onClick={() => setSubscriptionTier('Producer')}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${subscriptionTier === 'Producer' ? 'border-primary-green bg-primary-green/5 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-border bg-background hover:border-border/80'}`}
                >
                  {subscriptionTier === 'Producer' && <div className="absolute top-3 right-3"><ShieldCheck className="w-5 h-5 text-primary-green"/></div>}
                  <h3 className="text-xl font-bold text-white mb-1">Producer</h3>
                  <p className="text-xs text-text-muted mb-4">Seed Farmers</p>
                  <ul className="text-sm space-y-2 text-text-muted">
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> Everything in Lite</li>
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> Cultivation Logs</li>
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> Lab Germination Tests</li>
                    <li className="flex items-center opacity-30"><X className="w-4 h-4 mr-2"/> Advanced Breeding</li>
                    <li className="flex items-center opacity-30"><X className="w-4 h-4 mr-2"/> API & Integrations</li>
                  </ul>
                </div>

                {/* Enterprise */}
                <div 
                  onClick={() => setSubscriptionTier('Enterprise')}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${subscriptionTier === 'Enterprise' ? 'border-purple-500 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-border bg-background hover:border-border/80'}`}
                >
                  {subscriptionTier === 'Enterprise' && <div className="absolute top-3 right-3"><ShieldCheck className="w-5 h-5 text-purple-500"/></div>}
                  <h3 className="text-xl font-bold text-white mb-1">Enterprise</h3>
                  <p className="text-xs text-text-muted mb-4">Breeder Pro (GACP)</p>
                  <ul className="text-sm space-y-2 text-text-muted">
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> Everything in Producer</li>
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> Full Genetics Engine</li>
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> API & E-Commerce Integrations</li>
                    <li className="flex items-center"><CheckSquare className="w-4 h-4 mr-2 text-primary-green"/> Universal Traceability 360</li>
                  </ul>
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div key="compliance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-8 max-w-4xl mx-auto border-l-4 border-l-blue-400">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Database className="w-6 h-6 mr-3 text-blue-400"/> Regulatory Audit Package</h2>
                  <p className="text-sm text-text-muted">
                    Generate a cryptographically complete export of all GxP records,<br/>
                    ledgers, and system configurations for 21 CFR Part 11 compliance.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <button onClick={handleDownloadCSV} className="px-4 py-2 bg-primary-green hover:bg-primary-green/90 text-black text-sm font-medium rounded transition-colors flex items-center w-48 justify-center">
                    <Download className="w-4 h-4 mr-2" /> Download CSV
                  </button>
                  <button onClick={handleDownloadAuditPackage} className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-600/50 text-sm font-medium rounded transition-colors flex items-center w-48 justify-center">
                    <Download className="w-4 h-4 mr-2" /> Download JSON
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background border border-border rounded-lg p-4">
                  <h4 className="font-bold text-white flex items-center mb-2"><ShieldCheck className="w-4 h-4 mr-2 text-primary-cyan"/> Immutable Event Log</h4>
                  <p className="text-xs text-text-muted">{auditLogs.length} total signed transactions exported.</p>
                </div>
                <div className="bg-background border border-border rounded-lg p-4">
                  <h4 className="font-bold text-white flex items-center"><HardDrive className="w-4 h-4 mr-2 text-primary-green"/> Inventory Ledgers</h4>
                  <p className="text-xs text-text-muted">{batches.length} batch histories and adjustments exported.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div key="integrations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-8 max-w-4xl mx-auto border-l-4 border-l-purple-500">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center"><Cpu className="w-6 h-6 mr-3 text-purple-500"/> B2B API & Integrations</h2>
              <p className="text-sm text-text-muted mb-8">
                Connect SeedLab Control to your external e-commerce (Shopify, WooCommerce) to sync inventory automatically.
              </p>

              <div className="space-y-8">
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-border pb-2">API Keys</h3>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-text-muted">Use these keys to authenticate your custom applications.</p>
                    <button onClick={handleGenerateKey} className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded text-sm hover:bg-purple-500 hover:text-white transition-colors">Generate New Key</button>
                  </div>
                  <div className="p-3 bg-black/50 border border-border rounded flex justify-between items-center font-mono text-sm text-text-muted">
                    <span>{apiKey}</span>
                    <button onClick={handleCopyKey} className="text-primary-cyan hover:underline text-xs">
                      {keyCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-border pb-2">Webhooks (Shopify / WooCommerce)</h3>
                  <p className="text-sm text-text-muted mb-4">Set up these endpoints in your e-commerce platform to notify SeedLab of new sales.</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-black/50 border border-border rounded flex justify-between items-center text-sm">
                      <div>
                        <div className="text-primary-cyan font-bold mb-1">Order Created (Sync Stock)</div>
                        <div className="font-mono text-xs text-text-muted">POST https://api.seedlab.com/v2/webhooks/orders/create</div>
                      </div>
                      <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">Active</div>
                    </div>
                    <div className="p-3 bg-black/50 border border-border rounded flex justify-between items-center text-sm">
                      <div>
                        <div className="text-orange-400 font-bold mb-1">Order Cancelled (Refund Stock)</div>
                        <div className="font-mono text-xs text-text-muted">POST https://api.seedlab.com/v2/webhooks/orders/cancel</div>
                      </div>
                      <div className="px-2 py-1 bg-background text-text-muted text-xs rounded border border-border">Inactive</div>
                    </div>
                  </div>
                </div>

                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-border pb-2 flex items-center"><Activity className="w-5 h-5 mr-2 text-primary-cyan"/> Webhook Activity Log (Outbound)</h3>
                  <p className="text-sm text-text-muted mb-4">Real-time log of automated actions sent to your E-commerce platform by SeedLab's Cross-Module Engine.</p>
                  {webhookLogs.length === 0 ? (
                    <div className="text-center p-6 text-text-muted text-sm border border-border border-dashed rounded">No webhooks fired yet.</div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {webhookLogs.map(log => (
                        <div key={log.id} className="p-3 bg-black/50 border border-border rounded text-xs font-mono">
                          <div className="flex justify-between text-text-muted mb-2">
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                            <span className="text-primary-green">{log.status}</span>
                          </div>
                          <div className="text-white mb-1">➔ {log.endpoint}</div>
                          <div className="text-text-muted overflow-x-auto whitespace-pre-wrap bg-background p-2 rounded border border-border/50">
                            {JSON.stringify(log.payload, null, 2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-5 border-b border-border flex justify-between items-center bg-card/50">
                <h3 className="text-lg font-bold text-white">Invite Employee</h3>
                <button onClick={() => setShowInviteModal(false)} className="text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Full Name *</label>
                  <input required type="text" value={inviteForm.name} onChange={e=>setInviteForm({...inviteForm, name: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Email Address *</label>
                  <input required type="email" value={inviteForm.email} onChange={e=>setInviteForm({...inviteForm, email: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">System Role *</label>
                  <select required value={inviteForm.role} onChange={e=>setInviteForm({...inviteForm, role: e.target.value})} className="w-full bg-background border border-border rounded p-2 text-white focus:border-primary-cyan focus:outline-none">
                    <option>Admin</option>
                    <option>Quality Manager</option>
                    <option>Lab Technician</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowInviteModal(false)} className="px-4 py-2 rounded text-text-muted hover:bg-border transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-primary-green text-black font-medium hover:bg-primary-green/90 transition-colors">Send Invite</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
