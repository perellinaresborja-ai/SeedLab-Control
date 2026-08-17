import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const LegalNotice = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-gray-300 relative">
      <button onClick={() => navigate(-1)} className="fixed top-36 right-6 md:top-40 md:right-12 p-3 bg-[#1A1C23] border border-white/10 hover:bg-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-full transition-all z-[100] hover:scale-110">
        <X className="w-6 h-6 text-gray-400 hover:text-white" />
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 border-l-4 border-[#10B981] pl-4">Legal Notice</h1>
        
        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. Identifying Data</h2>
            <p>In compliance with the duty of information set forth in Article 10 of Law 34/2002, of July 11, on Services of the Information Society and Electronic Commerce (LSSI-CE), the following data is reflected below:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
              <li><strong>Website owner:</strong> SeedLab Control SL (Fictitious Company for Demo)</li>
              <li><strong>NIF (Tax ID):</strong> B-12345678</li>
              <li><strong>Registered Office:</strong> Calle Innovación, 123, 28000 Madrid, Spain</li>
              <li><strong>Email:</strong> legal@seedlab.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Intellectual and Industrial Property</h2>
            <p>SeedLab Control, by itself or as an assignee, owns all intellectual and industrial property rights of its website, as well as the elements contained therein (by way of example, images, sound, audio, video, software, or texts; brands or logos, color combinations, structure and design, selection of materials used, computer programs necessary for its operation, access and use, etc.). All rights reserved.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Terms of Use</h2>
            <p>The user assumes responsibility for the use of the portal. This responsibility extends to the registration that may be necessary to access certain services or content. In said registration, the user will be responsible for providing true and lawful information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4. Exclusion of Guarantees and Liability</h2>
            <p>SeedLab Control is not responsible, under any circumstances, for damages of any kind that may cause, by way of example: errors or omissions in the content, lack of availability of the portal, or the transmission of viruses or malicious or harmful programs in the content, despite having adopted all the necessary technological measures to prevent it.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default LegalNotice;




