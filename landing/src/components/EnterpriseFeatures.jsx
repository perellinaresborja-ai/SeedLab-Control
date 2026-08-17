import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Database, FileText, Lock, AlertTriangle, Shield, CheckCircle, Package, Receipt, Network, Activity, Cpu, Box, DatabaseBackup, Search, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ComplianceVault = () => {
  const { i18n, t } = useTranslation();
  const isEn = i18n.resolvedLanguage?.startsWith('en');

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">
          {isEn ? "Enterprise Compliance" : "Cumplimiento Corporativo"}
        </h2>
        <h3 className="text-3xl md:text-5xl font-black text-white mb-6">
          {isEn ? "Genealogy 360° & QMS" : "Genealogía 360° & QMS"}
        </h3>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {isEn ? "SeedLab Control is not just a ledger; it is an audit-ready compliance vault designed for the highest pharmaceutical and agricultural standards." : "SeedLab Control no es solo un registro; es una bóveda de cumplimiento diseñada para superar las auditorías más estrictas (AEMPS, OMS)."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: isEn ? "Segregation of Duties" : "Segregación de Funciones",
            desc: isEn ? "Dual approval logic built-in. The technician who executes a lab test cannot be the QA Director who signs off on it." : "Lógica de doble aprobación nativa. El técnico que realiza la prueba no puede ser el Director de QA que la autoriza.",
            color: "#06B6D4"
          },
          {
            icon: Lock,
            title: isEn ? "21 CFR Part 11 Immutable Log" : "Audit Trail Inmutable",
            desc: isEn ? "Every status change, stock adjustment, or quarantine is cryptographically signed and stored in a read-only ledger." : "Cada cambio de estado, ajuste de stock o cuarentena se firma criptográficamente y se almacena en un libro mayor inborrable.",
            color: "#10B981"
          },
          {
            icon: DatabaseBackup,
            title: isEn ? "Hard Blocking Architecture" : "Bloqueos por Software",
            desc: isEn ? "Impossible to generate B2B invoices for batches lacking explicit 'Apto' status from the lab. Software prevents human error." : "Imposible generar facturas B2B para lotes que no tengan el estado explícito de 'Apto' del laboratorio. El software impide el error humano.",
            color: "#F59E0B"
          },
          {
            icon: Truck,
            title: isEn ? "Cold Chain Logistics Gates" : "Logística de Cadena de Frío",
            desc: isEn ? "Strict Quality Gates require IoT data logger IDs and tamper-evident seals before shipping labels can be generated." : "Puertas de Calidad (Quality Gates) que exigen sensores IoT (Data Loggers) y precintos antes de despachar mercancía.",
            color: "#6366F1"
          },
          {
            icon: Activity,
            title: isEn ? "Facilities IoT Monitoring" : "Monitoreo Ambiental IoT",
            desc: isEn ? "Real-time temperature and humidity tracking for vaults. Prove cold-chain integrity from seed to dispatch." : "Seguimiento en tiempo real de temperatura y humedad en bóvedas. Demuestra la integridad de la cadena de frío interna.",
            color: "#EC4899"
          },
          {
            icon: FileText,
            title: isEn ? "Automated COA Generation" : "Generación de COA (Certificados)",
            desc: isEn ? "Generate B2B Certificates of Analysis automatically from lab results, completely replacing error-prone Excel spreadsheets." : "Genera Certificados de Análisis B2B en PDF automáticamente, reemplazando las hojas de cálculo propensas a errores humanos.",
            color: "#ffffff"
          }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-xl bg-[#1A1C23] border border-white/5 border-l-[4px] hover:bg-white/5 transition-all duration-300 group cursor-default"
            style={{ borderLeftColor: feature.color }}
          >
            <feature.icon className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" style={{ color: feature.color }} />
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-sm text-text-muted">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const ImmuneSystemSimulator = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage?.startsWith('en');
  const [triggered, setTriggered] = useState(false);

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 relative z-10 border-t border-white/5">
      <div className="text-center mb-16">
        <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">
          {isEn ? "Quality Response Engine" : "Motor de Respuesta de Calidad"}
        </h2>
        <h3 className="text-3xl md:text-5xl font-black text-white mb-6">
          {isEn ? "Automated Immune System" : "Sistema Inmune Automatizado"}
        </h3>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {isEn ? "Experience our Cross-Module Integrity Engine. Trigger a QA failure and watch the system automatically defend your business." : "Prueba nuestro Motor de Integridad Multi-Módulo. Simula un fallo de calidad y mira cómo el software defiende tu empresa en tiempo real."}
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#1A1C23] rounded-2xl border border-white/5 border-l-[4px] border-l-red-500 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        
        <div className="p-8 relative z-10">
          {!triggered ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-primary-cyan mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {isEn ? "System Standing By" : "Sistema a la Espera"}
              </h3>
              <p className="text-text-muted mb-8 max-w-md mx-auto">
                {isEn ? "A new batch of seeds (Lot #SHG-250) has just finished lab testing. The germination rate is critically low (42%)." : "Un nuevo lote de semillas (Lot #SHG-250) acaba de finalizar sus pruebas. La tasa de germinación es críticamente baja (42%)."}
              </p>
              <button 
                onClick={() => setTriggered(true)}
                className="px-8 py-4 bg-red-500/10 text-red-500 border border-red-500/50 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
              >
                {isEn ? "Sign Off Test (Trigger Failure)" : "Firmar Test como Fallido (OOS)"}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/5 border border-red-500/30 rounded-xl p-8 text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-500">Automated Immune Response Triggered</h3>
                  <p className="text-text-muted text-sm">{isEn ? "Cascading Quarantine Protocol Executed" : "Protocolo de Cuarentena en Cascada Ejecutado"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#111318] border border-white/5 border-l-[4px] border-l-red-500 rounded-xl p-6">
                  <p className="text-xs text-text-muted mb-1">{isEn ? "Affected Assets Quarantined" : "Activos Afectados en Cuarentena"}</p>
                  <p className="text-xl font-bold text-white font-mono">14 {isEn ? "Batches" : "Lotes"}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-[#111318] border border-white/5 border-l-[4px] border-l-[#10B981] rounded-xl p-6">
                  <p className="text-xs text-text-muted mb-1">{isEn ? "Financial Risk Prevented (COGS)" : "Riesgo Financiero Prevenido"}</p>
                  <p className="text-xl font-bold text-[#10B981] font-mono">€18,450.00</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-[#111318] border border-white/5 border-l-[4px] border-l-[#06B6D4] rounded-xl p-6 col-span-1 md:col-span-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-muted mb-1">{isEn ? "E-Commerce API Status" : "Estado API E-Commerce"}</p>
                    <p className="text-sm font-medium text-white flex items-center">
                      <Cpu className="w-4 h-4 mr-2 text-primary-cyan"/> Webhook Fired: <code className="ml-2 bg-white/10 px-2 py-0.5 rounded text-xs text-primary-cyan">POST /update_stock (Qty: 0)</code>
                    </p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-primary-cyan" />
                </motion.div>
              </div>

              <div className="flex justify-end">
                <button onClick={() => setTriggered(false)} className="text-sm text-text-muted hover:text-white transition-colors">
                  {isEn ? "Reset Simulator" : "Reiniciar Simulador"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export const LicensingTiers = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage?.startsWith('en');

  const tiers = [
    {
      name: "Lite",
      subtitle: isEn ? "Retail & Distribution" : "Distribución y Retail",
      desc: isEn ? "For seed banks focusing exclusively on sales and distribution without cultivation." : "Para bancos de semillas enfocados exclusivamente en ventas y distribución sin cultivo propio.",
      features: [
        { name: isEn ? "Inventory Management" : "Gestión de Inventario", icon: Package },
        { name: isEn ? "B2B Logistics & Invoicing" : "Logística y Facturación B2B", icon: Truck },
        { name: isEn ? "Basic Traceability" : "Trazabilidad Básica", icon: Search },
      ],
      disabledFeatures: [
        isEn ? "Lab Germination Tests" : "Tests de Laboratorio",
        isEn ? "API & Integrations" : "API e Integraciones"
      ],
      color: "border-white/5 border-l-[4px] border-l-white hover:border-white/30"
    },
    {
      name: "Producer",
      subtitle: isEn ? "Seed Farmers" : "Productores de Semillas",
      desc: isEn ? "For agricultural producers scaling seed propagation from acquired clones." : "Para productores agrícolas escalando propagación de semillas desde clones adquiridos.",
      features: [
        { name: isEn ? "Everything in Lite" : "Todo lo incluido en Lite", icon: CheckCircle },
        { name: isEn ? "Cultivation Logs" : "Cuaderno de Cultivo", icon: FileText },
        { name: isEn ? "Lab Germination Tests" : "Tests de Laboratorio", icon: Activity },
      ],
      disabledFeatures: [
        isEn ? "Advanced Breeding" : "Breeding Avanzado",
        isEn ? "API & E-Commerce" : "API y E-Commerce"
      ],
      color: "border-white/5 border-l-[4px] border-l-[#10B981] hover:border-[#10B981]/30",
      badge: isEn ? "Most Popular" : "Más Popular"
    },
    {
      name: "Enterprise",
      subtitle: isEn ? "Breeder Pro (GACP)" : "Breeder Pro (GACP)",
      desc: isEn ? "Full ecosystem for institutional breeders with strict compliance and API needs." : "Ecosistema completo para breeders corporativos con auditorías estrictas y necesidades API.",
      features: [
        { name: isEn ? "Everything in Producer" : "Todo lo incluido en Producer", icon: CheckCircle },
        { name: isEn ? "Full Genetics Engine" : "Motor Genético Completo", icon: Network },
        { name: isEn ? "API Webhooks & Shopify" : "API Webhooks y Shopify", icon: Cpu },
        { name: isEn ? "Universal Traceability 360" : "Trazabilidad Universal 360", icon: Search },
      ],
      disabledFeatures: [],
      color: "border-white/5 border-l-[4px] border-l-[#06B6D4] hover:border-[#06B6D4]/30"
    }
  ];

  return (
    <section className="py-24 border-y border-white/5 bg-[#060913]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-[#10B981] uppercase mb-3">
            {isEn ? "SaaS Architecture" : "Arquitectura SaaS"}
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-6">
            {isEn ? "Feature Flags & Licensing" : "Módulos Dinámicos y Licencias"}
          </h3>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {isEn ? "Switch between subscription tiers to see how the software adapts dynamically. Unused modules are completely hidden." : "SeedLab es un SaaS modular. Adapta la plataforma dinámicamente; las funciones que no usas quedan completamente ocultas."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 rounded-xl bg-[#1A1C23] border transition-all duration-300 ${tier.color} flex flex-col relative overflow-hidden shadow-2xl group`}
            >
              {tier.badge && (
                <div className="absolute top-0 right-8 bg-gradient-to-r from-primary-cyan to-primary-green text-black px-4 py-1 rounded-b-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                  {tier.badge}
                </div>
              )}
              
              <div className="mb-8 relative z-10">
                <h3 className="text-3xl font-black text-white mb-2 group-hover:scale-[1.02] transition-transform origin-left">{tier.name}</h3>
                <p className="text-[#06B6D4] text-sm font-bold uppercase tracking-wider mb-4">{tier.subtitle}</p>
                <p className="text-sm text-gray-400 h-12 leading-relaxed">{tier.desc}</p>
              </div>

              <div className="space-y-4 flex-1 relative z-10">
                {tier.features.map((feat, j) => (
                  <div key={j} className="flex items-center text-white text-sm">
                    <feat.icon className="w-5 h-5 mr-3 text-primary-cyan" />
                    {feat.name}
                  </div>
                ))}
                {tier.disabledFeatures.map((feat, j) => (
                  <div key={`d-${j}`} className="flex items-center text-text-muted/40 text-sm">
                    <div className="w-5 h-5 mr-3 rounded-full border border-text-muted/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-text-muted/20" />
                    </div>
                    {feat}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
