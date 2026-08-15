import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Truck, Search, Plus, TrendingUp, BarChart3, AlertTriangle, CheckCircle, Store, Box, Download, Link2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell, PieChart, Pie } from 'recharts';

export default function Acquisitions() {
  const { acquisitions, addAcquisition, varieties, batches } = useAppContext();
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, replenishment, new
  const [searchTerm, setSearchTerm] = useState('');

  // Analytics Logic
  const analytics = useMemo(() => {
    let totalSpend = 0;
    const bySupplier = {};
    const byGenetics = {};
    const monthlySpend = {};

    acquisitions.forEach(acq => {
      totalSpend += parseFloat(acq.totalCost || 0);
      
      // Supplier
      if(!bySupplier[acq.supplier]) bySupplier[acq.supplier] = 0;
      bySupplier[acq.supplier] += parseFloat(acq.totalCost || 0);
      
      // Genetics
      if(!byGenetics[acq.variety]) byGenetics[acq.variety] = 0;
      byGenetics[acq.variety] += parseFloat(acq.totalCost || 0);

      // Monthly
      const month = acq.date.substring(0, 7); // YYYY-MM
      if(!monthlySpend[month]) monthlySpend[month] = 0;
      monthlySpend[month] += parseFloat(acq.totalCost || 0);
    });

    const topSuppliers = Object.entries(bySupplier).map(([name, value]) => ({name, value})).sort((a,b) => b.value - a.value).slice(0,5);
    const topGenetics = Object.entries(byGenetics).map(([name, value]) => ({name, value})).sort((a,b) => b.value - a.value).slice(0,5);
    
    // Sort months properly
    const trendData = Object.entries(monthlySpend).sort((a,b) => a[0].localeCompare(b[0])).map(([name, value]) => ({name, value}));

    return { totalSpend, topSuppliers, topGenetics, trendData };
  }, [acquisitions]);

  // Replenishment Logic
  const replenishmentOrders = useMemo(() => {
    // 1. Calculate current stock for each variety
    const varietyStock = {};
    batches.forEach(b => {
      if(!varietyStock[b.variety]) varietyStock[b.variety] = 0;
      varietyStock[b.variety] += parseInt(b.currentQty || 0);
    });

    // 2. Find varieties below minStock and group by supplier
    const grouped = {};
    varieties.forEach(v => {
      const current = varietyStock[v.name] || 0;
      if (current < v.minStock) {
        const supplier = v.breeder || 'Unknown Supplier';
        if (!grouped[supplier]) grouped[supplier] = [];
        
        grouped[supplier].push({
          variety: v.name,
          currentQty: current,
          minStock: v.minStock,
          suggestedQty: (v.minStock - current) + Math.round(v.minStock * 0.2) // order 20% more than min
        });
      }
    });
    return grouped;
  }, [varieties, batches]);

  // Form State
  const [formData, setFormData] = useState({
    supplier: '',
    materialType: 'Clones',
    variety: '',
    quantity: '',
    unitCost: '',
    phytosanitaryId: '',
    batchId: ''
  });

  const handleSaveAcquisition = (e) => {
    e.preventDefault();
    addAcquisition({
      ...formData,
      quantity: parseInt(formData.quantity),
      unitCost: parseFloat(formData.unitCost),
      totalCost: parseInt(formData.quantity) * parseFloat(formData.unitCost)
    });
    setActiveTab('analytics');
    setFormData({ supplier: '', materialType: 'Clones', variety: '', quantity: '', unitCost: '', phytosanitaryId: '', batchId: ''});
  };

  const COLORS = ['#10B981', '#06B6D4', '#F59E0B', '#6366F1', '#EC4899'];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Store className="text-primary-green" /> Acquisitions & B2B Purchasing
          </h1>
          <p className="text-text-muted">Manage supplier relations, inbound materials, and auto-replenishment.</p>
        </div>
        <div className="flex bg-background border border-border rounded-lg p-1">
          <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-surface text-white shadow' : 'text-text-muted hover:text-white'}`}>Analytics</button>
          <button onClick={() => setActiveTab('replenishment')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'replenishment' ? 'bg-surface text-white shadow' : 'text-text-muted hover:text-white'}`}>
            Orders <span className="bg-primary-cyan/20 text-primary-cyan text-[10px] px-2 py-0.5 rounded-full">{Object.keys(replenishmentOrders).length}</span>
          </button>
          <button onClick={() => setActiveTab('new')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'new' ? 'bg-primary-green text-black shadow' : 'text-primary-green hover:bg-primary-green/10'}`}>
            <Plus className="w-4 h-4"/> New Receipt
          </button>
        </div>
      </div>

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border border-l-4 border-l-primary-green p-6 rounded-xl flex items-center gap-4">
              <div className="bg-primary-green/20 p-4 rounded-full"><TrendingUp className="text-primary-green w-6 h-6"/></div>
              <div>
                <p className="text-sm text-text-muted uppercase tracking-wider mb-1">YTD Spend</p>
                <p className="text-3xl font-mono text-white font-bold">€{analytics.totalSpend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
            </div>
            <div className="bg-surface border border-border border-l-4 border-l-[#06B6D4] p-6 rounded-xl flex items-center gap-4">
              <div className="bg-primary-cyan/20 p-4 rounded-full"><Store className="text-primary-cyan w-6 h-6"/></div>
              <div>
                <p className="text-sm text-text-muted uppercase tracking-wider mb-1">Total Suppliers</p>
                <p className="text-3xl font-mono text-white font-bold">{Object.keys(analytics.topSuppliers).length}</p>
              </div>
            </div>
            <div className="bg-surface border border-border border-l-4 border-l-[#F59E0B] p-6 rounded-xl flex items-center gap-4">
              <div className="bg-[#F59E0B]/20 p-4 rounded-full"><Box className="text-[#F59E0B] w-6 h-6"/></div>
              <div>
                <p className="text-sm text-text-muted uppercase tracking-wider mb-1">Total Deliveries</p>
                <p className="text-3xl font-mono text-white font-bold">{acquisitions.length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-border border-l-4 border-l-[#6366F1] p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-6">Spend by Supplier</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.topSuppliers} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                      {analytics.topSuppliers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{backgroundColor: '#1E293B', border: '1px solid #334155'}} itemStyle={{color: '#fff'}} formatter={(value) => `€${value.toLocaleString()}`}/>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-surface border border-border border-l-4 border-l-primary-green p-6 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-6">Spend Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.trendData}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false}/>
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={12}/>
                    <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(val) => `€${val/1000}k`}/>
                    <RechartsTooltip contentStyle={{backgroundColor: '#1E293B', border: '1px solid #334155'}} itemStyle={{color: '#10B981'}} formatter={(value) => `€${value.toLocaleString()}`}/>
                    <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorSpend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border border-l-4 border-l-white/20 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-white">Recent Inbound Deliveries</h3>
            </div>
            <table className="w-full">
              <thead className="bg-background">
                <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Supplier</th>
                  <th className="p-4 font-medium">Material</th>
                  <th className="p-4 font-medium">Phyto ID</th>
                  <th className="p-4 font-medium">Qty</th>
                  <th className="p-4 font-medium">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {acquisitions.map(acq => (
                  <tr key={acq.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-gray-300">{acq.date}</td>
                    <td className="p-4 font-medium text-white">{acq.supplier}</td>
                    <td className="p-4 text-sm text-gray-300">
                      <span className="text-primary-cyan">{acq.variety}</span> <br/>
                      <span className="text-xs text-text-muted">{acq.materialType}</span>
                    </td>
                    <td className="p-4 text-sm font-mono text-gray-400">{acq.phytosanitaryId}</td>
                    <td className="p-4 text-sm text-gray-300">{acq.quantity.toLocaleString()}</td>
                    <td className="p-4 font-mono text-white font-bold">€{acq.totalCost.toLocaleString(undefined, {minimumFractionDigits:2})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'replenishment' && (
        <div className="space-y-6">
          <div className="bg-[#06B6D4]/10 border border-[#06B6D4]/30 rounded-xl p-4 flex items-start gap-4">
            <AlertTriangle className="text-[#06B6D4] shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-[#06B6D4] mb-1">Smart Auto-Replenishment</h4>
              <p className="text-sm text-gray-300">The system analyzes inventory levels against configured `minStock` thresholds and automatically groups suggested purchases by the default breeder/supplier.</p>
            </div>
          </div>

          {Object.keys(replenishmentOrders).length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border border-l-4 border-l-primary-green rounded-xl">
              <CheckCircle className="w-16 h-16 text-primary-green mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">Inventory is Healthy</h3>
              <p className="text-text-muted">No varieties are below their minimum stock threshold.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {Object.entries(replenishmentOrders).map(([supplier, items]) => (
                <div key={supplier} className="bg-surface border border-border border-l-4 border-l-[#F59E0B] rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-background border-b border-border p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-lg flex items-center gap-2"><Store className="w-5 h-5 text-[#F59E0B]" /> {supplier}</h3>
                      <p className="text-xs text-text-muted">Draft Purchase Order • {items.length} items</p>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4"/> Generate PO (PDF)
                    </button>
                  </div>
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                        <th className="p-4 font-medium">Genetics</th>
                        <th className="p-4 font-medium">Current Stock</th>
                        <th className="p-4 font-medium">Min. Threshold</th>
                        <th className="p-4 font-medium">Suggested Order</th>
                        <th className="p-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-4 font-bold text-white">{item.variety}</td>
                          <td className="p-4">
                            <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded text-xs font-mono font-bold">
                              {item.currentQty.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-gray-400">{item.minStock.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <input type="number" defaultValue={item.suggestedQty} className="w-24 bg-background border border-border rounded px-2 py-1 text-white font-mono text-sm focus:border-primary-cyan focus:outline-none" />
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button className="text-primary-cyan text-sm hover:underline">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'new' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface border border-border border-l-4 border-l-primary-green rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-border pb-4">Register B2B Receipt</h2>
            <form onSubmit={handleSaveAcquisition} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">Supplier / Breeder</label>
                  <input required type="text" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary-green focus:outline-none" placeholder="e.g. Greenhouse Seeds" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">Material Type</label>
                  <select value={formData.materialType} onChange={e => setFormData({...formData, materialType: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary-green focus:outline-none">
                    <option>Clones</option>
                    <option>Seeds</option>
                    <option>Pollen</option>
                    <option>Tissue Culture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">Genetics / Variety</label>
                  <input required type="text" value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-white focus:border-primary-green focus:outline-none" placeholder="e.g. Super Lemon Haze" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">Supplier Batch ID</label>
                  <input required type="text" value={formData.batchId} onChange={e => setFormData({...formData, batchId: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-white font-mono focus:border-primary-green focus:outline-none" placeholder="e.g. GS-SLH-26" />
                </div>
              </div>

              <div className="bg-background border border-border p-4 rounded-lg">
                <label className="block text-sm font-medium text-[#06B6D4] mb-2 flex items-center gap-2">
                   Phytosanitary Certificate / Plant Passport ID
                </label>
                <input required type="text" value={formData.phytosanitaryId} onChange={e => setFormData({...formData, phytosanitaryId: e.target.value})} className="w-full bg-surface border border-border rounded-lg p-3 text-white font-mono focus:border-[#06B6D4] focus:outline-none" placeholder="Enter official phyto ID..." />
                <p className="text-xs text-gray-500 mt-2">Required for GxP/Agri compliance on all inbound biological materials.</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">Quantity Received</label>
                  <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-white font-mono focus:border-primary-green focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">Unit Cost (€)</label>
                  <input required type="number" step="0.01" min="0" value={formData.unitCost} onChange={e => setFormData({...formData, unitCost: e.target.value})} className="w-full bg-background border border-border rounded-lg p-3 text-white font-mono focus:border-primary-green focus:outline-none" />
                </div>
              </div>

              <div className="border-t border-border pt-6 mt-6 flex justify-between items-center">
                <div className="text-text-muted text-sm flex items-center gap-2">
                  <Link2 className="w-4 h-4"/> 
                  Will automatically generate Genetic Origin on save.
                </div>
                <button type="submit" className="bg-primary-green hover:bg-[#0EA5E9] text-black font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
                  <CheckCircle className="w-5 h-5"/> Approve & Register Inbound
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
