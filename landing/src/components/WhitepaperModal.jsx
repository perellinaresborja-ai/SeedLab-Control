import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import html2pdf from 'html2pdf.js';

// Import raw markdown files
import whitepaperEn from '../assets/whitepaper_v2_en.md?raw';
import whitepaperEs from '../assets/whitepaper_v1_es.md?raw';

const WhitepaperModal = ({ isOpen, onClose }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.resolvedLanguage || i18n.language || 'es';
  const isEn = currentLang.startsWith('en');
  const [isExporting, setIsExporting] = useState(false);
  
  const markdownContent = isEn ? whitepaperEn : whitepaperEs;
  const headerTitle = isEn ? "Technical Whitepaper" : "Whitepaper Técnico";
  const headerSub = isEn ? "360º Architecture & Traceability" : "Arquitectura y Trazabilidad 360º";
  const btnExport = isEn ? "Export PDF" : "Exportar PDF";

  const exportToPDF = () => {
    setIsExporting(true);
    
    const sourceElement = document.getElementById('pdf-export-container');
    
    // Create a hidden iframe for native printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>SeedLab_Control_Whitepaper</title>
          <base href="${window.location.origin}">
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              color: #111827; 
              background: #ffffff; 
              padding: 20px; 
            }
            @page { margin: 20mm; }
            
            /* Prevent headings from being orphaned at the bottom of a page */
            h1, h2, h3, h4, h5, h6 { 
              page-break-after: avoid; 
              break-after: avoid; 
            }
            
            /* Prevent paragraphs and lists from breaking across pages awkwardly */
            p, ul, li, blockquote, code { 
              page-break-inside: avoid; 
              break-inside: avoid; 
              /* Ensure at least 3 lines of text stay together at page breaks */
              orphans: 3;
              widows: 3;
            }
            
            /* Hide URL printing in standard browsers if possible */
            @media print {
              a[href]:after { content: none !important; }
            }
          </style>
        </head>
        <body>
          ${sourceElement.innerHTML}
        </body>
      </html>
    `);
    doc.close();
    
    // Give the iframe a moment to load the logo image, then trigger print
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      // Cleanup after print dialog closes
      setTimeout(() => {
        document.body.removeChild(iframe);
        setIsExporting(false);
      }, 1000);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#0B101E] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1A1C23]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{headerTitle}</h3>
                <p className="text-xs text-gray-400">{headerSub}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 text-gray-300 custom-scrollbar relative" id="whitepaper-scroll-container">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="max-w-4xl mx-auto relative z-10">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSlug]}
                components={{
                  h1: ({node, children, ...props}) => (
                    <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-8 mb-6 gap-4">
                      <h1 className="text-3xl md:text-5xl font-black text-white tracking-wider" {...props}>{children}</h1>
                      <button 
                        onClick={exportToPDF}
                        disabled={isExporting}
                        className="flex items-center gap-2 text-sm font-bold text-[#02040A] bg-gradient-to-r from-[#06B6D4] to-[#10B981] hover:from-[#10B981] hover:to-[#10B981] transition-all px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                      >
                        {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        {isExporting ? (isEn ? "Generating..." : "Generando...") : btnExport}
                      </button>
                    </div>
                  ),
                  h2: ({node, children, id, ...props}) => {
                    let customId = id;
                    const textStr = String(children);
                    if (textStr.includes("56.")) customId = "section-56";
                    if (textStr.includes("57.")) customId = "section-57";
                    if (textStr.includes("61.")) customId = textStr.toLowerCase().includes("conclusion") ? "61-conclusion-la-arquitectura-de-seedlab-control" : "61-conclusion-the-seedlab-control-architecture";
                    if (textStr.includes("62.")) customId = textStr.toLowerCase().includes("ambiental") ? "62-monitoreo-ambiental-iot-y-quality-gates-enterprise" : "62-environmental-iot-monitoring-quality-gates-enterprise";
                    if (textStr.includes("63.")) customId = textStr.toLowerCase().includes("compras") ? "63-compras-b2b-y-auto-reposicion-inteligente" : "63-b2b-acquisitions-smart-auto-replenishment";
                    return <h2 id={customId} className="text-2xl font-bold text-white flex items-center gap-3 mt-12 mb-6 border-b border-white/5 pb-2 text-[#06B6D4]" {...props}>{children}</h2>
                  },
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-[#10B981] mt-8 mb-4" {...props} />,
                  p: ({node, ...props}) => <p className="leading-relaxed text-gray-400 mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-6 text-gray-400" {...props} />,
                  li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                  em: ({node, ...props}) => <em className="text-[#06B6D4] not-italic font-bold" {...props} />,
                  code: ({node, inline, className, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline ? (
                      <code className="block bg-[#1A1C23] p-4 rounded-xl font-mono text-sm text-[#F59E0B] border border-white/5 shadow-inner overflow-x-auto whitespace-pre-wrap my-4" {...props} />
                    ) : (
                      <code className="text-[#06B6D4] bg-white/5 px-1.5 py-0.5 rounded text-sm border border-white/10 font-mono" {...props} />
                    )
                  },
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#10B981] bg-[#10B981]/10 p-4 text-sm text-gray-300 italic my-6 rounded-r-lg" {...props} />,
                  a: ({node, href, ...props}) => {
                    if (href?.startsWith('#')) {
                      return (
                        <a 
                          href={href} 
                          className="text-[#06B6D4] hover:text-[#10B981] transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            const targetId = href.slice(1);
                            const target = document.getElementById(targetId);
                            if (target) {
                              target.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          {...props} 
                        />
                      );
                    }
                    return <a href={href} className="text-[#06B6D4] hover:underline" target="_blank" rel="noopener noreferrer" {...props} />;
                  }
                }}
              >
                {markdownContent}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hidden Container for PDF Generation */}
      <div 
        id="pdf-export-container" 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: 0, 
          width: '800px', 
          backgroundColor: '#ffffff', 
          color: '#000000', 
          padding: '40px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        {/* Official Cover/Header */}
        <div style={{ textAlign: 'center', paddingBottom: '40px', marginBottom: '40px', borderBottom: '2px solid #10B981' }}>
          <img src="/logopdf.png" alt="SeedLab Logo" style={{ height: '80px', margin: '0 auto', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111827', margin: '0 0 10px 0' }}>SEEDLAB CONTROL</h1>
          <h2 style={{ fontSize: '18px', color: '#4B5563', margin: '0 0 20px 0', fontWeight: '500' }}>
            {isEn ? "Technical Architecture & End-to-End Biological Traceability" : "Arquitectura Técnica y Trazabilidad Biológica de Extremo a Extremo"}
          </h2>
          <div style={{ display: 'inline-block', backgroundColor: '#F3F4F6', padding: '10px 20px', borderRadius: '8px', fontSize: '12px', color: '#374151' }}>
            <strong>{isEn ? "Confidential & Proprietary" : "Confidencial y Propietario"}</strong> | {isEn ? "Document Version: 2.0" : "Versión del Documento: 2.0"} | {new Date().toLocaleDateString()}
          </div>
        </div>
        
        {/* PDF Markdown Render */}
        <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={{
              h1: ({node, ...props}) => <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px' }} {...props} />,
              h2: ({node, ...props}) => <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginTop: '30px', marginBottom: '15px' }} {...props} />,
              h3: ({node, ...props}) => <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginTop: '20px', marginBottom: '10px' }} {...props} />,
              p: ({node, ...props}) => <p style={{ marginBottom: '12px', color: '#4B5563' }} {...props} />,
              ul: ({node, ...props}) => <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginBottom: '15px', color: '#4B5563' }} {...props} />,
              li: ({node, ...props}) => <li style={{ marginBottom: '6px' }} {...props} />,
              strong: ({node, ...props}) => <strong style={{ fontWeight: 'bold', color: '#111827' }} {...props} />,
              em: ({node, ...props}) => <em style={{ fontStyle: 'italic', fontWeight: 'bold', color: '#111827' }} {...props} />,
              a: ({node, ...props}) => <span style={{ color: '#4B5563' }} {...props} />, // Remove links in PDF
              blockquote: ({node, ...props}) => <blockquote style={{ borderLeft: '4px solid #10B981', backgroundColor: '#F9FAFB', padding: '12px', fontStyle: 'italic', color: '#6B7280', margin: '15px 0' }} {...props} />,
              code: ({node, inline, ...props}) => (
                inline ? 
                <code style={{ backgroundColor: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#111827' }} {...props} /> :
                <code style={{ display: 'block', backgroundColor: '#F3F4F6', padding: '15px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', color: '#111827', margin: '15px 0', whiteSpace: 'pre-wrap' }} {...props} />
              )
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
        
        {/* Legal Footer */}
        <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #E5E7EB', fontSize: '10px', color: '#9CA3AF', textAlign: 'center' }}>
          SeedLab Control Software | {isEn ? "Official GxP Documentation" : "Documentación Oficial GxP"} | {isEn ? "Generated on" : "Generado el"} {new Date().toLocaleDateString()}
        </div>
      </div>
    </AnimatePresence>
  );
};

export default WhitepaperModal;
