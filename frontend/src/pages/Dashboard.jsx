import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Database, Layers, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { varieties, batches, tests, auditLogs } = useAppContext();
  const navigate = useNavigate();

  const totalStock = batches.reduce((sum, b) => sum + b.currentQty, 0);
  const activeBatchesCount = batches.length;
  const avgViability = varieties.length ? Math.round(varieties.reduce((sum, v) => sum + v.avgViability, 0) / varieties.length) : 0;
  const pendingTests = tests.filter(t => t.status !== 'Completed').length;

  const kpis = [
    { title: 'Total Genetics', value: varieties.length, icon: ShieldCheck, trend: '0%', status: 'optimal', link: '/catalog' },
    { title: 'Active Seed Batches', value: activeBatchesCount, icon: Layers, trend: '+4', status: 'normal', link: '/inventory' },
    { title: 'Total Stock (Seeds)', value: totalStock.toLocaleString(), icon: Database, trend: '-2.1%', status: 'normal', link: '/inventory' },
    { title: 'Pending Lab Tests', value: pendingTests, icon: Activity, trend: pendingTests > 0 ? 'Action Req' : 'Up to Date', status: pendingTests > 0 ? 'warning' : 'optimal', link: '/lab' }
  ];

  // Derive mock chart data based on average viability to make it look somewhat dynamic
  const data = [
    { name: 'Jan', val: avgViability - 4 },
    { name: 'Feb', val: avgViability - 2 },
    { name: 'Mar', val: avgViability },
    { name: 'Apr', val: avgViability + 1 },
    { name: 'May', val: avgViability + 2 },
    { name: 'Jun', val: avgViability }
  ];

  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="relative h-full flex flex-col pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 drop-shadow-md">Command Center</h1>
          <p className="text-text-muted">Global overview of genetic viability and seed inventory.</p>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <motion.div 
            key={kpi.title}
            onClick={() => navigate(kpi.link)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-panel p-6 cursor-pointer hover:border-primary-cyan/50 transition-colors border-l-4 ${
              kpi.status === 'optimal' ? 'border-l-primary-green' : 
              kpi.status === 'warning' ? 'border-l-orange-400' : 'border-l-primary-cyan'
            } relative overflow-hidden group`}
          >
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <kpi.icon className="w-32 h-32" />
            </div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 bg-background/50 rounded-lg border border-border/50">
                <kpi.icon className="w-5 h-5 text-primary-cyan" />
              </div>
              <span className={`text-xs font-mono px-2 py-1 rounded bg-background/80 border ${
                kpi.status === 'warning' ? 'text-orange-400 border-orange-400/30' : 'text-primary-green border-primary-green/30'
              }`}>
                {kpi.trend}
              </span>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-1 font-mono tracking-tight">{kpi.value}</h3>
              <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{kpi.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Main Chart */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="glass-panel p-6 lg:col-span-2 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary-cyan" />
                Global Viability Trend
              </h3>
              <p className="text-xs text-text-muted mt-1">Average germination rate across all active batches.</p>
            </div>
            <button className="tech-button border border-border text-xs flex items-center hover:border-primary-cyan">
              Export Data <ArrowUpRight className="w-3 h-3 ml-1" />
            </button>
          </div>
          
          <div className="flex-1 w-full bg-background rounded-lg border border-border/50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0f1c', borderColor: '#1f2937', color: '#fff' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Line type="monotone" dataKey="val" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#0a0f1c', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-6 flex flex-col h-full overflow-hidden">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
            <h3 className="text-lg font-bold text-white">System Activity</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="relative pl-6 pb-4 border-l border-border/50 last:border-0 last:pb-0 group">
                <div className="absolute w-3 h-3 bg-card border-2 border-primary-cyan rounded-full -left-[6.5px] top-1 group-hover:bg-primary-cyan transition-colors" />
                <div className="bg-background rounded-lg p-3 border border-border/50 group-hover:border-primary-cyan/30 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-primary-cyan">{log.action}</span>
                    <span className="text-[10px] text-text-muted font-mono">{log.time.split(' ')[1]}</span>
                  </div>
                  <p className="text-sm text-white font-medium mb-1">{log.entity}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{log.details}</p>
                </div>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <p className="text-sm text-text-muted text-center py-10">No recent activity.</p>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
