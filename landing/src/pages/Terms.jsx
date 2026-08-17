import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const Terms = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-gray-300 relative">
      <button onClick={() => navigate(-1)} className="fixed top-36 right-6 md:top-40 md:right-12 p-3 bg-[#1A1C23] border border-white/10 hover:bg-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-full transition-all z-[100] hover:scale-110">
        <X className="w-6 h-6 text-gray-400 hover:text-white" />
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 border-l-4 border-[#06B6D4] pl-4">Terms and Conditions</h1>
        
        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Object of the Contract</h2>
            <p>These General Conditions regulate the use (including mere access) of the web pages, members of the SeedLab Control SL website, including the contents and services made available on them (B2B software).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Software Use (SaaS)</h2>
            <p>The contracting of SeedLab Control services is subject to the signing of a cloud software service provision contract (SaaS). Unauthorized use, copying, or reverse engineering of the systems is strictly prohibited and protected by international intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Company Liability</h2>
            <p>The company is not responsible for damages of any kind caused to the client that are due to failures or disconnections in telecommunications networks that produce the suspension, cancellation, or interruption of the portal service during the provision of the same or prior thereto, except as stipulated in the Service Level Agreement (SLA).</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default Terms;




