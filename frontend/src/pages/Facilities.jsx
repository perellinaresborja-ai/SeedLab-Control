import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, AlertTriangle, CheckCircle2, History, Download, Server, Box } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Facilities() {
  const { facilities } = useAppContext();
  
  // Real-time mock telemetry
  const [telemetry, setTelemetry] = useState({});

  useEffect(() => {
    // Initialize mock telemetry
    const initialTelemetry = {};
    facilities.forEach(fac => {
      initialTelemetry[fac] = {
        temp: fac.includes('Cold') ? 4.2 : 21.5,
        humidity: fac.includes('Cold') ? 15 : 45,
        airQuality: 98,
        status: 'Optimal'
      };
    });
    setTelemetry(initialTelemetry);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTelemetry(prev => {
        const updated = { ...prev };
        facilities.forEach(fac => {
          if (updated[fac]) {
            const tempJitter = (Math.random() * 0.4 - 0.2);
            const humJitter = (Math.random() * 2 - 1);
            updated[fac] = {
              ...updated[fac],
              temp: parseFloat((updated[fac].temp + tempJitter).toFixed(1)),
              humidity: parseFloat((updated[fac].humidity + humJitter).toFixed(1)),
            };
          }
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [facilities]);

  const getStatusColor = (temp, isCold) => {
    if (isCold) {
      return temp > 8 ? 'text-red-500' : temp > 6 ? 'text-orange-400' : 'text-primary-green';
    }
    return temp > 28 ? 'text-red-500' : temp > 25 ? 'text-orange-400' : 'text-primary-green';
  };

  return (
    <div className="relative h-full flex flex-col pb-12">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Facilities & Vaults</h1>
          <p className="text-sm text-text-muted">Real-time environmental monitoring and IoT telemetry.</p>
        </div>
        <button className="tech-button bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/30 hover:bg-primary-cyan hover:text-black flex items-center">
          <Download className="w-4 h-4 mr-2" /> Export 30-Day Log
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {facilities.map((fac, idx) => {
          const isCold = fac.includes('Cold');
          const data = telemetry[fac] || { temp: 0, humidity: 0, airQuality: 0, status: 'Unknown' };
          const statusColor = getStatusColor(data.temp, isCold);
          
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="glass-panel p-6 border-l-4 border-l-primary-cyan flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-background/50 rounded-lg border border-border/50 mr-4">
                    {isCold ? <Box className="w-6 h-6 text-blue-400" /> : <Server className="w-6 h-6 text-primary-cyan" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{fac}</h3>
                    <p className="text-xs text-text-muted flex items-center mt-1">
                      <CheckCircle2 className="w-3 h-3 text-primary-green mr-1" /> Sensors Online
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-bold border flex items-center ${statusColor.replace('text-', 'bg-').replace('500', '500/10').replace('400', '400/10')} ${statusColor.replace('text-', 'border-').replace('500', '500/30').replace('400', '400/30')} ${statusColor}`}>
                  {statusColor.includes('red') ? <AlertTriangle className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {statusColor.includes('red') ? 'CRITICAL' : statusColor.includes('orange') ? 'WARNING' : 'OPTIMAL'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-background/50 border border-border/50 rounded-lg p-4 text-center">
                  <Thermometer className={`w-5 h-5 mx-auto mb-2 ${statusColor}`} />
                  <p className="text-xs text-text-muted mb-1">Temperature</p>
                  <p className={`text-2xl font-bold font-mono ${statusColor}`}>{data.temp.toFixed(1)}°C</p>
                </div>
                <div className="bg-background/50 border border-border/50 rounded-lg p-4 text-center">
                  <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                  <p className="text-xs text-text-muted mb-1">Humidity</p>
                  <p className="text-2xl font-bold font-mono text-white">{data.humidity.toFixed(1)}%</p>
                </div>
                <div className="bg-background/50 border border-border/50 rounded-lg p-4 text-center">
                  <Wind className="w-5 h-5 text-primary-green mx-auto mb-2" />
                  <p className="text-xs text-text-muted mb-1">Air Quality</p>
                  <p className="text-2xl font-bold font-mono text-white">{data.airQuality}%</p>
                </div>
              </div>

              <div className="mt-auto border-t border-border/50 pt-4">
                <h4 className="text-xs font-bold text-text-muted uppercase mb-3 flex items-center">
                  <History className="w-4 h-4 mr-2" /> 24h Trend (Mock)
                </h4>
                <div className="h-16 flex items-end space-x-1 opacity-70">
                  {/* Mock bar chart generation */}
                  {Array.from({ length: 24 }).map((_, i) => {
                    const height = isCold ? 20 + Math.random() * 20 : 40 + Math.random() * 40;
                    return (
                      <div key={i} className="flex-1 bg-primary-cyan/20 hover:bg-primary-cyan/50 transition-colors rounded-t-sm relative group">
                        <div style={{ height: `${height}%` }} className="absolute bottom-0 w-full bg-primary-cyan rounded-t-sm" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
