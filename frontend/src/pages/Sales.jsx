import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, Plus, X, Receipt, Download, Building, FileSignature, BarChart3, TrendingUp, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ItemCard } from '../components/ui/ItemCard';

export default function Sales() {
  const { clients, addClient, invoices, addInvoice, batches, companyProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState('clients');
  
  // Client Modal
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientForm, setClientForm] = useState({ name: '', taxId: '', email: '', address: '', phone: '' });

  // Invoice Modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ clientId: '', type: 'Factura', date: new Date().toISOString().split('T')[0], language: 'es' });
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [itemForm, setItemForm] = useState({ batchId: '', quantity: '', price: '' });

  // Metrics State
  const [selectedYear, setSelectedYear] = useState(Math.max(new Date().getFullYear(), 2026));

  // PDF Preview
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleAddClient = (e) => {
    e.preventDefault();
    if(clientForm.name) {
      addClient(clientForm);
      setShowClientModal(false);
      setClientForm({ name: '', taxId: '', email: '', address: '', phone: '' });
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if(itemForm.batchId && itemForm.quantity && itemForm.price) {
      setInvoiceItems([...invoiceItems, {
        batchId: itemForm.batchId,
        quantity: parseInt(itemForm.quantity),
        price: parseFloat(itemForm.price)
      }]);
      setItemForm({ batchId: '', quantity: '', price: '' });
    }
  };

  const removeItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    if(invoiceForm.clientId && invoiceItems.length > 0) {
      const totalAmount = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      await addInvoice({ ...invoiceForm, totalAmount }, invoiceItems);
      setShowInvoiceModal(false);
      setInvoiceForm({ clientId: '', type: 'Factura', date: new Date().toISOString().split('T')[0], language: 'es' });
      setInvoiceItems([]);
    } else {
      alert("Debes seleccionar un cliente y añadir al menos una línea.");
    }
  };

  const openPreview = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPreviewModal(true);
  };

  const downloadPDF = () => {
    window.print();
  };

  const getClientName = (id) => clients.find(c => c.id === id)?.name || 'Unknown';
  const getBatchName = (id) => {
    const b = batches.find(b => b.id === id);
    return b ? `${b.variety} (${b.id})` : id;
  };

  // Metrics calculations
  const getMonthlyRevenue = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(m => ({ month: m, total: 0 }));
    
    invoices.forEach(inv => {
      if (inv.type === 'Proforma') return; // Only real sales
      const date = new Date(inv.date);
      if (date.getFullYear() === parseInt(selectedYear)) {
        data[date.getMonth()].total += inv.totalAmount;
      }
    });
    return data;
  };

  const monthlyData = getMonthlyRevenue();
  const maxRevenue = Math.max(...monthlyData.map(d => d.total), 100);
  const yearlyTotal = monthlyData.reduce((sum, d) => sum + d.total, 0);
  const currentMonthRevenue = monthlyData[new Date().getMonth()].total;

  const getTopClients = () => {
    const clientTotals = {};
    invoices.forEach(inv => {
      if (inv.type === 'Proforma') return;
      const date = new Date(inv.date);
      if (date.getFullYear() === parseInt(selectedYear)) {
        clientTotals[inv.clientId] = (clientTotals[inv.clientId] || 0) + inv.totalAmount;
      }
    });
    
    return Object.entries(clientTotals)
      .map(([clientId, total]) => ({
        client: getClientName(clientId),
        total
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };
  const topClients = getTopClients();

  return (
    <div className="relative h-full flex flex-col pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 drop-shadow-md flex items-center">
            <Receipt className="mr-3 text-primary-cyan w-8 h-8" />
            Invoicing
          </h1>
          <p className="text-text-muted">Manage your client portfolio and issue fiscal documents integrated with inventory.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab('clients')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center ${activeTab === 'clients' ? 'border-primary-green text-primary-green' : 'border-transparent text-text-muted hover:text-white'}`}
        >
          <Users className="w-4 h-4 mr-2" /> Clients
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center ${activeTab === 'invoices' ? 'border-primary-green text-primary-green' : 'border-transparent text-text-muted hover:text-white'}`}
        >
          <FileText className="w-4 h-4 mr-2" /> Documents
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center ${activeTab === 'metrics' ? 'border-primary-green text-primary-green' : 'border-transparent text-text-muted hover:text-white'}`}
        >
          <BarChart3 className="w-4 h-4 mr-2" /> Analytics & Metrics
        </button>
      </div>

      {activeTab === 'clients' && (
        <div className="flex-1">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Cartera de Clients</h2>
            <button onClick={() => setShowClientModal(true)} className="tech-button bg-primary-green/10 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Add Client
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {clients.length === 0 ? (
                 <div className="col-span-full p-8 text-center text-text-muted">No clients registered.</div>
              ) : clients.map(client => (
                <ItemCard
                  key={client.id}
                  id={client.taxId || client.id}
                  title={client.name}
                  icon={Building}
                  borderColor="border-l-primary-cyan"
                  badgeText={client.status || 'Active'}
                  badgeColor="text-primary-green bg-primary-green/10 border-primary-green/30"
                  fields={[
                    { label: 'Email', value: client.email || '-' },
                    { label: 'Address', value: <span className="truncate block max-w-[150px]">{client.address || '-'}</span> }
                  ]}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="flex-1">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Invoices & Delivery Notes</h2>
            <button onClick={() => setShowInvoiceModal(true)} className="tech-button bg-primary-green/10 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black flex items-center">
              <FileSignature className="w-4 h-4 mr-2" /> Issue Document
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {invoices.length === 0 ? (
                 <div className="col-span-full p-8 text-center text-text-muted">No documents issued.</div>
              ) : invoices.map(invoice => {
                const isFactura = invoice.type === 'Factura';
                const isAlbaran = invoice.type === 'Albarán';
                return (
                  <ItemCard
                    key={invoice.id}
                    id={invoice.id}
                    title={getClientName(invoice.clientId)}
                    icon={FileText}
                    borderColor={isFactura ? 'border-l-primary-green' : isAlbaran ? 'border-l-orange-400' : 'border-l-primary-cyan'}
                    badgeText={invoice.type}
                    badgeColor={isFactura ? 'text-primary-green bg-primary-green/10 border-primary-green/30' : isAlbaran ? 'text-orange-400 bg-orange-400/10 border-orange-400/30' : 'text-primary-cyan bg-primary-cyan/10 border-primary-cyan/30'}
                    fields={[
                      { label: 'Date', value: invoice.date },
                      { label: 'Amount', value: <span className="text-primary-green font-mono font-bold">${invoice.totalAmount.toFixed(2)}</span> }
                    ]}
                    actions={
                      <button onClick={() => openPreview(invoice)} className="w-full text-text-muted hover:text-white bg-card border border-border px-3 py-1.5 rounded transition-colors text-sm flex items-center justify-center">
                         View PDF <Download className="w-4 h-4 ml-2" />
                      </button>
                    }
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-white">Financial Performance {selectedYear}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-6 border-t-2 border-t-primary-green">
              <p className="text-sm text-text-muted mb-1">Annual Revenue</p>
              <h3 className="text-3xl font-bold text-white flex items-center">
                ${yearlyTotal.toFixed(2)}
              </h3>
            </div>
            <div className="glass-panel p-6 border-t-2 border-t-purple-500">
              <p className="text-sm text-text-muted mb-1">Monthly Revenue</p>
              <h3 className="text-3xl font-bold text-white flex items-center">
                ${currentMonthRevenue.toFixed(2)}
              </h3>
            </div>
            <div className="glass-panel p-6 border-t-2 border-t-primary-cyan">
              <p className="text-sm text-text-muted mb-1">Issued Invoices</p>
              <h3 className="text-3xl font-bold text-white">
                {invoices.filter(i => i.type !== 'Proforma' && new Date(i.date).getFullYear() === parseInt(selectedYear)).length}
              </h3>
            </div>
            <div className="glass-panel p-6 border-t-2 border-t-orange-400">
              <p className="text-sm text-text-muted mb-1">Average Ticket</p>
              <h3 className="text-3xl font-bold text-white">
                ${invoices.filter(i => i.type !== 'Proforma' && new Date(i.date).getFullYear() === parseInt(selectedYear)).length > 0 ? (yearlyTotal / invoices.filter(i => i.type !== 'Proforma' && new Date(i.date).getFullYear() === parseInt(selectedYear)).length).toFixed(2) : '0.00'}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary-cyan" /> Monthly Evolution
                </h3>
                <select 
                  value={selectedYear} 
                  onChange={e => setSelectedYear(e.target.value)}
                  className="input-field py-1 px-2 text-sm w-24 bg-card/80 border-border/50 text-white"
                >
                  {[2026, 2027, 2028, 2029, 2030].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="h-64 flex items-end justify-between space-x-2 pt-4 border-b border-border/50 pb-2">
                {monthlyData.map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center flex-1 group">
                    <div className="w-full relative flex items-end justify-center h-56 bg-white/5 rounded-t-md hover:bg-white/10 transition-colors">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(data.total / maxRevenue) * 100}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className="w-4/5 sm:w-2/3 bg-gradient-to-t from-primary-cyan/80 to-primary-green/80 rounded-t-sm group-hover:opacity-100 opacity-80 transition-opacity relative"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-primary-green/50 shadow-[0_0_10px_#10b98140] text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none transition-opacity z-10 font-mono">
                          ${data.total.toFixed(2)}
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-text-muted mt-3 font-medium uppercase tracking-wider">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" /> Top Clients
              </h3>
              <div className="space-y-4">
                {topClients.length === 0 ? (
                  <p className="text-sm text-text-muted italic">No invoices issued yet.</p>
                ) : topClients.map((tc, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded border border-border/50 hover:bg-white/10 transition-colors">
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${idx === 0 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50 shadow-[0_0_10px_#facc1540]' : idx === 1 ? 'bg-gray-400/20 text-gray-300 border border-gray-400/50' : idx === 2 ? 'bg-orange-700/20 text-orange-400 border border-orange-700/50' : 'bg-white/10 text-text-muted'}`}>
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-white truncate max-w-[140px]">{tc.client}</span>
                    </div>
                    <span className="text-primary-green font-mono text-sm font-bold">${tc.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      <AnimatePresence>
        {showClientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowClientModal(false)} />
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="glass-panel p-6 w-full max-w-md relative z-10 border-t-4 border-t-primary-green">
              <button onClick={() => setShowClientModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              <h3 className="text-xl font-bold text-white mb-4">Add New Client</h3>
              <form onSubmit={handleAddClient} className="space-y-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Name / Company</label>
                  <input type="text" required value={clientForm.name} onChange={e=>setClientForm({...clientForm, name: e.target.value})} className="input-field w-full" placeholder="Ej: GrowShop Madrid" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Tax ID / VAT</label>
                  <input type="text" value={clientForm.taxId} onChange={e=>setClientForm({...clientForm, taxId: e.target.value})} className="input-field w-full" placeholder="B12345678" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Email</label>
                  <input type="email" value={clientForm.email} onChange={e=>setClientForm({...clientForm, email: e.target.value})} className="input-field w-full" placeholder="contacto@empresa.com" />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Address Completa</label>
                  <textarea value={clientForm.address} onChange={e=>setClientForm({...clientForm, address: e.target.value})} className="input-field w-full h-20" placeholder="Calle, Ciudad, Código Postal..." />
                </div>
                <button type="submit" className="btn-primary w-full bg-primary-green hover:bg-primary-green/80 text-black">Save Client</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowInvoiceModal(false)} />
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}} className="glass-panel p-6 w-full max-w-2xl relative z-10 border-t-4 border-t-primary-cyan max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowInvoiceModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-white"><X className="w-5 h-5"/></button>
              <h3 className="text-xl font-bold text-white mb-6">Issue Document</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Tipo de Document</label>
                  <select value={invoiceForm.type} onChange={e=>setInvoiceForm({...invoiceForm, type: e.target.value})} className="input-field w-full bg-card text-white">
                    <option value="Factura">Invoice (Deducts Stock)</option>
                    <option value="Albarán">Delivery Note (Deducts Stock)</option>
                    <option value="Proforma">Proforma (Quote Only)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">PDF Language</label>
                  <select value={invoiceForm.language} onChange={e=>setInvoiceForm({...invoiceForm, language: e.target.value})} className="input-field w-full bg-card text-white">
                    <option value="es">Spanish</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-text-muted mb-1">Client</label>
                  <select value={invoiceForm.clientId} onChange={e=>setInvoiceForm({...invoiceForm, clientId: e.target.value})} className="input-field w-full bg-card text-white">
                    <option value="">-- Select a Client --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.taxId})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6 p-4 border border-border/50 rounded-lg bg-card/30">
                <h4 className="text-sm font-bold text-white mb-3">Add Line Item (Batch)</h4>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <select value={itemForm.batchId} onChange={e=>setItemForm({...itemForm, batchId: e.target.value})} className="input-field w-full text-sm py-1.5 px-2 bg-card text-white">
                      <option value="">Batch...</option>
                      {batches.filter(b => b.currentQty > 0).map(b => (
                        <option key={b.id} value={b.id}>{b.variety} ({b.id}) - Stock: {b.currentQty}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input type="number" min="1" placeholder="Qty" value={itemForm.quantity} onChange={e=>setItemForm({...itemForm, quantity: e.target.value})} className="input-field w-full text-sm py-1.5 px-2" />
                  </div>
                  <div className="w-24">
                    <input type="number" min="0" step="0.01" placeholder="Unit Price" value={itemForm.price} onChange={e=>setItemForm({...itemForm, price: e.target.value})} className="input-field w-full text-sm py-1.5 px-2" />
                  </div>
                  <button onClick={handleAddItem} className="bg-primary-green text-black p-2 rounded hover:bg-primary-green/80 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-white mb-2">Added Line Items</h4>
                {invoiceItems.length === 0 ? (
                  <p className="text-xs text-text-muted italic">No line items yet. Add batches above.</p>
                ) : (
                  <ul className="space-y-2">
                    {invoiceItems.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center text-sm p-2 bg-card rounded border border-border">
                        <span className="text-white flex-1">{getBatchName(item.batchId)}</span>
                        <span className="text-text-muted w-20 text-right">{item.quantity} units</span>
                        <span className="text-text-muted w-20 text-right">${item.price}</span>
                        <span className="text-primary-green font-mono font-bold w-24 text-right">${(item.quantity * item.price).toFixed(2)}</span>
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300 ml-3"><X className="w-4 h-4"/></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button onClick={handleAddInvoice} className="btn-primary w-full bg-primary-green text-black hover:bg-primary-green/80">
                Issue Document (Total: ${invoiceItems.reduce((s, i) => s + (i.quantity * i.price), 0).toFixed(2)})
              </button>
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedInvoice && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:p-0 print:bg-white print:block">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-background/90 backdrop-blur-md print:hidden" onClick={() => setShowPreviewModal(false)} />
            
            <div className="relative z-10 w-full max-w-3xl flex flex-col h-[90vh] print:h-auto print:max-w-none print:w-full">
              {/* Header solo visible en pantalla */}
              <div className="flex justify-between items-center bg-card p-4 rounded-t-lg border-b border-border print:hidden">
                <h3 className="text-white font-bold flex items-center"><FileText className="w-5 h-5 mr-2 text-primary-cyan"/> Preview of {selectedInvoice.type}</h3>
                <div className="flex space-x-2">
                  <button onClick={downloadPDF} className="btn-primary py-1.5 text-sm flex items-center"><Download className="w-4 h-4 mr-2"/> Print / PDF</button>
                  <button onClick={() => setShowPreviewModal(false)} className="text-text-muted hover:text-white p-2"><X className="w-5 h-5"/></button>
                </div>
              </div>

              {/* El Document (Lo que se imprime) */}
              <div className="bg-white flex-1 overflow-y-auto p-8 md:p-12 text-black print:overflow-visible print:p-0">
                
                {/* Cabecera Factura */}
                <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
                  <div>
                    {companyProfile?.logo ? (
                       <img src={companyProfile.logo} alt="Logo" className="h-16 mb-4 object-contain" />
                    ) : (
                      <h2 className="text-2xl font-black text-gray-800 tracking-tighter mb-4">{companyProfile?.name || 'YOUR SEED BANK'}</h2>
                    )}
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>{companyProfile?.address || 'Address de la empresa'}</p>
                      <p>VAT/NIF: {companyProfile?.taxId || '---'}</p>
                      <p>{companyProfile?.email || 'email@empresa.com'}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <h1 className="text-4xl font-light text-gray-300 uppercase tracking-widest">{
                      selectedInvoice.language === 'en' 
                        ? (selectedInvoice.type === 'Factura' ? 'INVOICE' : selectedInvoice.type === 'Albarán' ? 'DELIVERY NOTE' : 'PROFORMA') 
                        : selectedInvoice.type
                    }</h1>
                    <div className="mt-4 space-y-1 text-sm">
                      <p><span className="font-bold text-gray-700">{selectedInvoice.language === 'en' ? 'Invoice No:' : 'Nº Document:'}</span> {selectedInvoice.id}</p>
                      <p><span className="font-bold text-gray-700">{selectedInvoice.language === 'en' ? 'Date:' : 'Date:'}</span> {selectedInvoice.date}</p>
                    </div>
                  </div>
                </div>

                {/* Datos del Cliente */}
                <div className="mb-10 p-6 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{selectedInvoice.language === 'en' ? 'BILLED TO:' : 'FACTURADO A:'}</h3>
                  {(() => {
                    const client = clients.find(c => c.id === selectedInvoice.clientId);
                    return client ? (
                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="text-lg font-bold text-gray-900">{client.name}</p>
                        <p>VAT/NIF: {client.taxId || '-'}</p>
                        <p>{client.address}</p>
                        <p>{client.email}</p>
                      </div>
                    ) : <p className="text-gray-500">Cliente no encontrado</p>;
                  })()}
                </div>

                {/* Tabla de Conceptos */}
                <table className="w-full text-left mb-8">
                  <thead>
                    <tr className="border-b-2 border-gray-800 text-sm">
                      <th className="py-3 font-bold text-gray-800">{selectedInvoice.language === 'en' ? 'DESCRIPTION' : 'CONCEPTO / LOTE'}</th>
                      <th className="py-3 font-bold text-gray-800 text-center">{selectedInvoice.language === 'en' ? 'QTY' : 'CANTIDAD'}</th>
                      <th className="py-3 font-bold text-gray-800 text-right">{selectedInvoice.language === 'en' ? 'PRICE' : 'PRECIO U.'}</th>
                      <th className="py-3 font-bold text-gray-800 text-right">{selectedInvoice.language === 'en' ? 'AMOUNT' : 'IMPORTE'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx} className="text-sm">
                        <td className="py-4 text-gray-800">
                          {getBatchName(item.batchId)}
                        </td>
                        <td className="py-4 text-gray-600 text-center">{item.quantity}</td>
                        <td className="py-4 text-gray-600 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-4 text-gray-900 font-bold text-right">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totales */}
                <div className="flex justify-end">
                  <div className="w-1/2 p-6 bg-gray-50 rounded-lg">
                    <div className="flex justify-between text-lg font-black text-gray-900">
                      <span>TOTAL:</span>
                      <span>${selectedInvoice.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
                  <p>{selectedInvoice.language === 'en' ? 'Thank you for your business.' : 'Gracias por confiar en nosotros.'}</p>
                  <p className="mt-1">Powered by SeedLab Control OS</p>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0.z-\\[100\\] { position: absolute; left: 0; top: 0; right: 0; bottom: 0; }
          .fixed.inset-0.z-\\[100\\] * { visibility: visible; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}
