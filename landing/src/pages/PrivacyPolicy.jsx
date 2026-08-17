import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-gray-300 relative">
      <button onClick={() => navigate(-1)} className="fixed top-36 right-6 md:top-40 md:right-12 p-3 bg-[#1A1C23] border border-white/10 hover:bg-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-full transition-all z-[100] hover:scale-110">
        <X className="w-6 h-6 text-gray-400 hover:text-white" />
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 border-l-4 border-[#06B6D4] pl-4">Privacy Policy</h1>
        
        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Data Controller</h2>
            <p>In accordance with Regulation (EU) 2016/679 (GDPR) and Organic Law 3/2018 (LOPDGDD), we inform you that the controller of your data is:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
              <li><strong>Company Name:</strong> SeedLab Control SL</li>
              <li><strong>Email:</strong> privacidad@seedlab.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Purpose of Processing</h2>
            <p>The personal data collected (such as name and email in contact forms) will be used exclusively for:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
              <li>Managing the request for a demo or B2B consulting.</li>
              <li>Sending commercial and technical communications strictly related to our software.</li>
              <li>Maintaining the contractual relationship, in case of acquiring our SaaS licenses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Data Retention</h2>
            <p>Data will be retained as long as there is a mutual interest to maintain the purpose of the processing or for the time required by legal obligations (typically 5 fiscal years).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. User Rights (ARCO)</h2>
            <p>You can exercise your rights of Access, Rectification, Cancellation, and Opposition (as well as limitation and portability) by writing to our privacy email. In case of divergences, you have the right to file a claim with the Spanish Data Protection Agency (AEPD).</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;




