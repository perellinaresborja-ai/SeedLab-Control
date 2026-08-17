import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { ShieldCheck, Database, Server } from 'lucide-react';

const SLA = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-gray-300 relative">
      <button onClick={() => navigate(-1)} className="fixed top-36 right-6 md:top-40 md:right-12 p-3 bg-[#1A1C23] border border-white/10 hover:bg-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-full transition-all z-[100] hover:scale-110">
        <X className="w-6 h-6 text-gray-400 hover:text-white" />
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 border-l-4 border-[#10B981] pl-4">Service Level Agreement (SLA)</h1>
        
        <p className="text-lg text-gray-400 mb-12">
          This Service Level Agreement governs the use of SeedLab Control cloud services for clients with Enterprise licenses.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1A1C23] border border-[#10B981]/20 p-6 rounded-xl flex flex-col items-center text-center">
            <Server className="w-8 h-8 text-[#10B981] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">99.99%</h3>
            <p className="text-xs text-gray-400">Annual Guaranteed Uptime</p>
          </div>
          <div className="bg-[#1A1C23] border border-[#06B6D4]/20 p-6 rounded-xl flex flex-col items-center text-center">
            <ShieldCheck className="w-8 h-8 text-[#06B6D4] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">&lt; 2h</h3>
            <p className="text-xs text-gray-400">Maximum Response Time (P1)</p>
          </div>
          <div className="bg-[#1A1C23] border border-[#F59E0B]/20 p-6 rounded-xl flex flex-col items-center text-center">
            <Database className="w-8 h-8 text-[#F59E0B] mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">24h</h3>
            <p className="text-xs text-gray-400">RPO (Recovery Point Objective)</p>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Availability Commitment</h2>
            <p>We guarantee that the SaaS platform will be operational and available for customer access 99.99% of the time during any calendar month. If we do not meet this commitment, the customer will be entitled to receive service credits applicable to their next invoices.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Maintenance Windows</h2>
            <p>Scheduled maintenance that requires service interruption will be performed during weekends (UTC -0) and will be notified at least 48 hours in advance in the administrator dashboard.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default SLA;




