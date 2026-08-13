import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Package, Clock, CheckCircle2, ChevronRight, Send, Search, RefreshCw, X, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ItemCard } from '../components/ui/ItemCard';

export default function Logistics() {
  const { invoices, clients } = useAppContext();
  
  // Create mock shipments state derived from invoices initially
  const [shipments, setShipments] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);

  useEffect(() => {
    // Generate mock shipments from actual invoices
    if (invoices.length > 0 && shipments.length === 0) {
      const mockShipments = invoices.filter(inv => inv.type !== 'Proforma').map(inv => {
        const client = clients.find(c => c.id === inv.clientId) || { name: 'Unknown Client', address: 'Unknown Address' };
        return {
          id: `SHP-${inv.id}`,
          invoiceId: inv.id,
          clientName: client.name,
          destination: client.address,
          date: inv.date,
          status: 'Pending',
          agency: 'GLS',
          trackingNumber: null,
          weight: (Math.random() * 5 + 0.5).toFixed(1) // Random weight for demo
        };
      });
      setShipments(mockShipments);
    }
  }, [invoices, clients, shipments.length]);

  const handleGenerateLabel = (id) => {
    // Start loading animation for this specific shipment
    setLoadingIds(prev => [...prev, id]);

    // Simulate API call to DHL/GLS
    setTimeout(() => {
      setShipments(prev => prev.map(s => {
        if (s.id === id) {
          const agencies = { 'GLS': 'GLS', 'DHL': 'DHL', 'UPS': 'UPS' };
          const prefix = agencies[s.agency] || 'TRK';
          const randomTracking = `${prefix}-${Math.floor(Math.random() * 90000000 + 10000000)}`;
          return {
            ...s,
            status: 'Ready',
            trackingNumber: randomTracking
          };
        }
        return s;
      }));
      setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
    }, 1500);
  };

  const updateAgency = (id, newAgency) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, agency: newAgency } : s));
  };

  const pendingCount = shipments.filter(s => s.status === 'Pending').length;
  const readyCount = shipments.filter(s => s.status === 'Ready').length;

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Logistics & Shipping</h1>
          <p className="text-sm text-text-muted">Manage shipments, tracking, and carrier integrations.</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search tracking..." 
              className="bg-background border border-border rounded-md py-2 pl-9 pr-4 text-sm focus:border-primary-cyan focus:outline-none text-white w-64"
            />
          </div>
          <button className="tech-button bg-primary-green/10 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Sync API
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-panel p-6 border-t-2 border-t-orange-400">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-text-muted">Pending Shipments</p>
            <Clock className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-3xl font-bold text-white">{pendingCount}</h3>
        </div>
        <div className="glass-panel p-6 border-t-2 border-t-primary-green">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-text-muted">Ready for Pickup</p>
            <Package className="w-5 h-5 text-primary-green" />
          </div>
          <h3 className="text-3xl font-bold text-white">{readyCount}</h3>
        </div>
        <div className="glass-panel p-6 border-t-2 border-t-primary-cyan relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary-cyan/5 group-hover:bg-primary-cyan/10 transition-colors"></div>
          <div className="flex justify-between items-center mb-2 relative z-10">
            <p className="text-sm text-text-muted">Carrier Status</p>
            <Truck className="w-5 h-5 text-primary-cyan" />
          </div>
          <div className="flex items-center space-x-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse"></span>
            <span className="text-sm font-medium text-white">GLS, DHL Connected</span>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {shipments.length === 0 ? (
            <div className="col-span-full p-8 text-center text-text-muted border border-dashed border-border/50 rounded-lg">
              <Truck className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No shipments available.</p>
            </div>
          ) : shipments.map(shipment => {
            const isPending = shipment.status === 'Pending';
            return (
              <ItemCard
                key={shipment.id}
                id={shipment.id}
                title={shipment.clientName}
                icon={Truck}
                borderColor={isPending ? 'border-l-orange-400' : 'border-l-primary-green'}
                badgeText={isPending ? 'Pending Label' : 'Ready'}
                badgeColor={isPending ? 'text-orange-400 bg-orange-400/10 border-orange-400/30' : 'text-primary-green bg-primary-green/10 border-primary-green/30'}
                fields={[
                  { label: 'Destination', value: <span className="truncate block max-w-[150px] text-xs" title={shipment.destination}>{shipment.destination}</span> },
                  { label: 'Carrier', value: isPending ? (
                    <select 
                      value={shipment.agency}
                      onChange={(e) => updateAgency(shipment.id, e.target.value)}
                      className="bg-background border border-border rounded px-1 py-0.5 text-xs text-white focus:border-primary-cyan focus:outline-none"
                    >
                      <option value="GLS">GLS</option>
                      <option value="DHL">DHL Express</option>
                      <option value="UPS">UPS</option>
                    </select>
                  ) : <span className="font-bold">{shipment.agency}</span> },
                  { label: 'Weight', value: `${shipment.weight} kg` },
                  { label: 'Tracking', value: isPending ? '-' : <span className="font-mono text-primary-cyan text-[10px] break-all">{shipment.trackingNumber}</span> }
                ]}
                actions={
                  isPending ? (
                    <button 
                      onClick={() => handleGenerateLabel(shipment.id)}
                      disabled={loadingIds.includes(shipment.id)}
                      className="w-full tech-button bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30 hover:bg-primary-cyan hover:text-black inline-flex items-center justify-center text-xs py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingIds.includes(shipment.id) ? (
                        <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> API Sync...</>
                      ) : (
                        <><Send className="w-3.5 h-3.5 mr-1.5" /> Generate Label</>
                      )}
                    </button>
                  ) : (
                    <button className="w-full tech-button bg-primary-green/10 text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-black inline-flex items-center justify-center text-xs py-1.5">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Label PDF
                    </button>
                  )
                }
              />
            )
          })}
        </div>
      </div>
    </div>
  );
}
