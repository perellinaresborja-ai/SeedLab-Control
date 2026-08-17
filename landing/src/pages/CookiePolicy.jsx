import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const CookiePolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto text-gray-300 relative">
      <button onClick={() => navigate(-1)} className="fixed top-36 right-6 md:top-40 md:right-12 p-3 bg-[#1A1C23] border border-white/10 hover:bg-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-full transition-all z-[100] hover:scale-110">
        <X className="w-6 h-6 text-gray-400 hover:text-white" />
      </button>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 border-l-4 border-[#F59E0B] pl-4">Cookie Policy</h1>
        
        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">1. What are cookies?</h2>
            <p>A cookie is a file that is downloaded to your computer when you access certain web pages. Cookies allow a website, among other things, to store and retrieve information about the browsing habits of a user or their equipment and, depending on the information they contain and the way you use your equipment, they can be used to recognize the user.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">2. Types of cookies used on this website</h2>
            <ul className="list-disc pl-6 space-y-4 text-gray-400">
              <li><strong>Technical cookies (Mandatory):</strong> These are cookies that allow the user to navigate through the web page and use the different options or services (for example: controlling traffic and data communication, identifying the session of technical demos).</li>
              <li><strong>Analysis cookies (Optional):</strong> These are cookies that allow the tracking and analysis of user behavior (for example: Google Analytics). Currently, this B2B portal minimizes the use of external analytics cookies to protect customer privacy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">3. Revocation and deletion of cookies</h2>
            <p>You can allow, block, or delete the cookies installed on your equipment by configuring the options of the browser installed on your computer (Chrome, Firefox, Safari, Edge).</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default CookiePolicy;




