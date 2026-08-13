import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, Database, Key, HardDrive, Cpu, AlertTriangle, Building, X, Search, Plus, Save } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ItemCard } from '../components/ui/ItemCard';

export default function Settings() {
  const { auditLogs, users, addUser, companyProfile, updateCompanyProfile, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState('company'); // 'company', 'team', 'ledger'

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

  // Form States
  const [companyForm, setCompanyForm] = useState(companyProfile);
  const [isSaved, setIsSaved] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Lab Technician' });

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

  return (
    <div className="relative h-full flex flex-col pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Settings</h1>
          <p className="text-sm text-text-muted">Manage your white-label settings, team, and view audit logs.</p>
        </div>
      </div>

      <div className="flex space-x-6 border-b border-border mb-6">
        <button onClick={() => setActiveTab('company')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'company' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white'}`}>
          <div className="flex items-center"><Building className="w-4 h-4 mr-2"/> Company Profile</div>
        </button>
        <button onClick={() => setActiveTab('team')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'team' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white'}`}>
          <div className="flex items-center"><Users className="w-4 h-4 mr-2"/> Team Management</div>
        </button>
        <button onClick={() => setActiveTab('ledger')} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'ledger' ? 'text-primary-cyan border-primary-cyan' : 'text-text-muted border-transparent hover:text-white'}`}>
          <div className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2"/> Audit Ledger</div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {activeTab === 'company' && (
            <motion.div key="company" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-panel p-8 max-w-3xl border-l-4 border-l-primary-cyan">
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

          {activeTab === 'ledger' && (
            <motion.div key="ledger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="glass-panel overflow-hidden border-l-4 border-l-primary-cyan">
                <div className="p-4 border-b border-border/50 bg-background/50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-primary-cyan"/> Immutable Event Log</h3>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 rounded bg-background border border-border text-[10px] text-text-muted font-mono flex items-center"><Key className="w-3 h-3 mr-1"/> WORM STORAGE</span>
                  </div>
                </div>
                <div className="overflow-y-auto pb-8 pt-4">
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
                          { label: 'Actor', value: log.user },
                          { label: 'Details', value: <span className="text-xs">{log.details}</span> }
                        ]}
                      />
                    ))}
                  </div>
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
