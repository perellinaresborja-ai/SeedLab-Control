import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Sprout, Scissors, Wind, TestTube, ChevronRight, CheckCircle2, Factory } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getNodes = (isEn) => [
  {
    id: 'origin',
    icon: Database,
    title: isEn ? 'Genetic Origin' : 'Origen Genético',
    subtitle: isEn ? 'Imported Elite Clone' : 'Clon Élite Importado',
    color: 'text-purple-400',
    border: 'border-purple-400/30',
    activeBorder: 'border-l-[4px] border-l-purple-400',
    bg: 'bg-purple-400/10',
    glow: 'shadow-[0_0_20px_rgba(192,132,252,0.1)]',
    description: isEn ? 'Legally document the entry of new genetic material into the facilities. Archive phytosanitary certificates and prove the initial lineage (B2B or In-house Selection) of the first leaf.' : 'Documenta legalmente la entrada de nuevo material genético en las instalaciones. Archiva los certificados fitosanitarios y prueba el linaje inicial (B2B o Selección propia) de la primera hoja.',
    details: [
      { label: isEn ? 'Origin' : 'Origen', value: isEn ? 'USA - B2B Purchase' : 'EEUU - Compra B2B' },
      { label: isEn ? 'Phytosanitary' : 'Fitosanitario', value: 'CERT-9082-US' },
      { label: isEn ? 'Entry' : 'Ingreso', value: '12/03/2025' }
    ]
  },
  {
    id: 'mother',
    icon: Sprout,
    title: isEn ? 'Mother Plant' : 'Planta Madre',
    subtitle: 'ID: PM-SHOG-04',
    color: 'text-[#10B981]',
    border: 'border-[#10B981]/30',
    activeBorder: 'border-l-[4px] border-l-[#10B981]',
    bg: 'bg-[#10B981]/10',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.1)]',
    description: isEn ? 'Generate an individual profile for each Mother Plant. The ERP monitors its age, vegetative state, and treatment history to ensure only the healthiest are cloned.' : 'Genera un perfil individual para cada Planta Madre. El ERP monitoriza su edad, su estado vegetativo y su historial de tratamientos para asegurar que solo se clonan las más sanas.',
    details: [
      { label: isEn ? 'Strain' : 'Variedad', value: 'Shaman OG' },
      { label: isEn ? 'Age' : 'Edad', value: isEn ? '14 Months' : '14 Meses' },
      { label: isEn ? 'Status' : 'Estado', value: isEn ? 'Optimal Vegetative' : 'Vegetativo Óptimo' }
    ]
  },
  {
    id: 'clones',
    icon: Scissors,
    title: isEn ? 'Clone Batch' : 'Lote de Esquejes',
    subtitle: isEn ? 'Batch: CL-89' : 'Lote: CL-89',
    color: 'text-blue-400',
    border: 'border-blue-400/30',
    activeBorder: 'border-l-[4px] border-l-blue-400',
    bg: 'bg-blue-400/10',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.1)]',
    description: isEn ? 'Traceability of mass cloning. The system groups cuttings into batches, calculating the rooting success ratio and assigning trays to specific veg rooms.' : 'Trazabilidad de la clonación masiva. El sistema agrupa los esquejes en lotes, calculando el ratio de éxito de enraizamiento y asignando las bandejas a salas de vegetación específicas.',
    details: [
      { label: isEn ? 'Cuttings' : 'Cortes', value: isEn ? '150 units' : '150 unid.' },
      { label: isEn ? 'Rooting' : 'Enraizamiento', value: '98.5%' },
      { label: isEn ? 'Room' : 'Sala', value: isEn ? 'Veg B' : 'Vegetación B' }
    ]
  },
  {
    id: 'pollen',
    icon: Wind,
    title: isEn ? 'Pollen Bank' : 'Banco de Polen',
    subtitle: isEn ? 'Donor: PK-Male' : 'Donante: PK-Macho',
    color: 'text-yellow-400',
    border: 'border-yellow-400/30',
    activeBorder: 'border-l-[4px] border-l-yellow-400',
    bg: 'bg-yellow-400/10',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.1)]',
    description: isEn ? 'Inventory control of frozen pollen. The ERP applies depreciation algorithms based on the extraction date and preservation method to estimate real viability without testing.' : 'Control de inventario de polen congelado. El ERP aplica algoritmos de depreciación según la fecha de extracción y el método de conservación para estimar su viabilidad real sin tests.',
    details: [
      { label: isEn ? 'Extraction' : 'Extracción', value: '05/01/2026' },
      { label: isEn ? 'Viability' : 'Viabilidad', value: isEn ? '89% (High)' : '89% (Alta)' },
      { label: isEn ? 'Stock' : 'Stock', value: isEn ? '45.2 grams' : '45.2 gramos' }
    ]
  },
  {
    id: 'harvest',
    icon: Factory,
    title: isEn ? 'Seed Batch' : 'Lote de Semillas',
    subtitle: isEn ? 'Batch: SHOG-260' : 'Lote: SHOG-260',
    color: 'text-[#06B6D4]',
    border: 'border-[#06B6D4]/30',
    activeBorder: 'border-l-[4px] border-l-[#06B6D4]',
    bg: 'bg-[#06B6D4]/10',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.1)]',
    description: isEn ? 'Closing the circle. The software mathematically links the pollen used and the recipient clones to generate the final Seed Batch, ready for quality control.' : 'El cierre del círculo. El software vincula matemáticamente el polen utilizado y los clones receptores para generar el Lote final de semillas, listo para su control de calidad.',
    details: [
      { label: isEn ? 'Cross' : 'Cruce', value: 'CL-89 ♀ × PK ♂' },
      { label: isEn ? 'Harvest' : 'Cosecha', value: '14/05/2026' },
      { label: isEn ? 'Total' : 'Total', value: isEn ? '45,000 units' : '45,000 uds' }
    ]
  }
];

export default function GeneticsSimulator() {
  const { i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage?.startsWith('en');
  const nodes = getNodes(isEn);
  const [activeNode, setActiveNode] = useState('origin');

  return (
    <div className="bg-[#0B101E] border border-white/10 border-l-[4px] border-l-[#10B981] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)] w-full relative z-10">
      {/* Header */}
      <div className="border-b border-white/10 p-5 bg-black/40 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <TestTube className="w-5 h-5 text-[#10B981]" />
          <span className="font-mono text-sm font-bold tracking-widest text-white">GENETIC-TRACE-ENGINE</span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/20">
          <CheckCircle2 className="w-3 h-3" /> {isEn ? 'End-to-End Traceability' : 'End-to-End Trazabilidad'}
        </span>
      </div>

      <div className="p-8 md:p-12">
        {/* Nodes Timeline */}
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4 mb-16">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0" />
          
          {nodes.map((node, index) => {
            const isActive = activeNode === node.id;
            const Icon = node.icon;
            
            return (
              <div key={node.id} className="relative z-10 flex flex-col items-center group cursor-pointer" onMouseEnter={() => setActiveNode(node.id)}>
                {/* Node Circle */}
                <motion.div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-[#0B101E]
                    ${isActive ? `${node.border} ${node.glow} scale-110` : 'border-white/10 hover:border-white/30 hover:scale-105'}`}
                  whileHover={{ y: -5 }}
                >
                  <Icon className={`w-7 h-7 transition-colors duration-300 ${isActive ? node.color : 'text-gray-500'}`} />
                </motion.div>
                
                {/* Connector for Mobile */}
                {index < nodes.length - 1 && (
                  <div className="md:hidden w-[2px] h-8 bg-white/10 my-2" />
                )}

                {/* Animated Flow Dot (Desktop) */}
                {index < nodes.length - 1 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 -right-1/2 w-1.5 h-1.5 rounded-full bg-[#10B981]"
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: '100%', opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5, ease: "linear" }}
                    style={{ transform: 'translateY(-50%)' }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Data Panel */}
        <div className="min-h-[200px]">
          <AnimatePresence mode="wait">
            {nodes.map((node) => node.id === activeNode && (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`bg-black/30 border border-white/5 ${node.activeBorder} rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8`}
              >
                <div className="flex flex-col gap-4 md:max-w-md">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-xl ${node.bg} ${node.border} border flex items-center justify-center flex-shrink-0`}>
                      <node.icon className={`w-8 h-8 ${node.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{node.title}</h3>
                      <p className={`text-sm font-mono ${node.color}`}>{node.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{node.description}</p>
                </div>
                
                <div className="flex-1 w-full grid gap-4 grid-cols-1 sm:grid-cols-3">
                  {node.details.map((detail, idx) => (
                    <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/5">
                      <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{detail.label}</span>
                      <span className="block text-sm text-white font-medium">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
