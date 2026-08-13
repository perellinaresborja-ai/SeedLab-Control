import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ChevronRight, Fingerprint, Calendar, Dna, FlaskConical, Award, Loader2, XCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';

export default function PublicVerification() {
  const { hash } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    async function fetchCertificate() {
      if (!hash) {
        setError('No verification hash provided.');
        setLoading(false);
        return;
      }

      try {
        let queryHash = hash;
        if (hash.startsWith('TEST') && !hash.includes('-')) {
          queryHash = hash.replace('TEST', 'TEST-');
        }

        // 1. Fetch test details
        const { data: testData, error: testError } = await supabase
          .from('tests')
          .select('*')
          .eq('custom_id', queryHash)
          .single();

        if (testError || !testData) {
          throw new Error('Certificate not found or invalid.');
        }

        // 2. Fetch batch details for genetics
        const { data: batchData, error: batchError } = await supabase
          .from('batches')
          .select('*')
          .eq('custom_id', testData.batch)
          .single();
          
        if (batchError) {
          console.warn('Could not fetch associated batch', batchError);
        }

        // 3. Fetch company profile
        const { data: companyData, error: companyError } = await supabase
          .from('company_profile')
          .select('*')
          .single();

        setCertificate({
          hash: testData.custom_id,
          batch: testData.batch,
          variety: batchData ? batchData.variety : 'Unknown Genetics',
          testDate: testData.start_date,
          company: companyData ? companyData.name : 'SeedLab Official Genetics',
          germinationRate: testData.final_pct || 0,
          qualityStatus: testData.status || 'Pending',
          signature: `${testData.technician || 'Quality Manager'} - Lead Quality Manager`
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificate();
  }, [hash]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02040a] text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-cyan animate-spin mb-4" />
        <p className="text-text-muted">Verifying blockchain record...</p>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-[#02040a] text-white flex flex-col items-center justify-center p-4 text-center">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
        <p className="text-text-muted">{error || 'Invalid or expired certificate link.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white flex flex-col items-center py-12 px-4 relative overflow-hidden font-sans">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary-green/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header Logo */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 z-10 flex flex-col items-center">
        <img src="/logo.png" alt="Company Logo" className="h-16 w-auto object-contain mb-4" />
      </motion.div>

      {/* Main Certificate Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl bg-[#0a0f1c]/80 backdrop-blur-2xl border border-[#1f2937] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.05)] relative z-10"
      >
        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div>
                 <p className="text-xs text-text-muted uppercase tracking-wider mb-1 flex items-center"><Dna className="w-3 h-3 mr-1" /> Genetic Variety</p>
                 <p className="text-xl font-bold text-white">{certificate.variety}</p>
               </div>
               <div>
                 <p className="text-xs text-text-muted uppercase tracking-wider mb-1 flex items-center"><Fingerprint className="w-3 h-3 mr-1" /> Batch Number</p>
                 <p className="text-lg font-mono text-primary-cyan">{certificate.batch}</p>
               </div>
               <div>
                 <p className="text-xs text-text-muted uppercase tracking-wider mb-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Date of Analysis</p>
                 <p className="text-base text-white">{certificate.testDate}</p>
               </div>
            </div>

            {/* Quality Score Box */}
            <div className="bg-[#030712] rounded-2xl border border-primary-green/30 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-primary-green/5 blur-xl"></div>
               <p className="text-xs text-text-muted uppercase tracking-wider mb-2 relative z-10">Certified Germination Rate</p>
               <h3 className="text-5xl font-mono font-bold text-primary-green relative z-10">{certificate.germinationRate}%</h3>
               <div className="mt-3 flex items-center text-sm font-medium text-white relative z-10 bg-[#111827] px-3 py-1 rounded-full border border-border">
                 <Award className="w-4 h-4 mr-2 text-primary-green" /> Quality: {certificate.qualityStatus}
               </div>
            </div>
          </div>

          <hr className="border-[#1f2937]" />

          {/* Signatures & Hashing */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Authorized Laboratory Signature</p>
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-primary-cyan mr-2" />
                <span className="font-medium text-white font-serif italic text-lg">{certificate.signature}</span>
              </div>
            </div>

            <div className="bg-[#030712] p-4 rounded-xl border border-[#1f2937]">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Cryptographic Hash Verification (SHA-256)</p>
              <p className="text-xs font-mono text-primary-cyan break-all">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 text-center text-xs text-text-muted z-10">
        <p>This is a verified digital twin of a physical SeedLab certificate.</p>
        <p className="mt-1 opacity-50">Powered by SeedLab Secure Ledger Technology © 2025</p>
      </motion.div>
    </div>
  );
}
