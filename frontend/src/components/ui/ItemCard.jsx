import React from 'react';
import { motion } from 'framer-motion';

export function ItemCard({ id, title, borderColor, badgeText, badgeColor, fields, icon: Icon, actions = null }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-panel p-6 hover:border-white/20 transition-all border-l-4 ${borderColor} relative overflow-hidden group shadow-lg flex flex-col`}>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className={`p-2 bg-background/50 rounded-lg border border-border/50 ${badgeColor.replace('bg-', 'text-').replace('/10', '')}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white leading-tight">{title}</h4>
            <p className="text-xs font-mono text-text-muted mt-1">{id}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded bg-background/80 border ${badgeColor}`}>{badgeText}</span>
      </div>
      
      <div className="space-y-3 mt-5 relative z-10 flex-1">
        {fields.map((field, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm border-b border-border/30 pb-2 last:border-0 last:pb-0">
            <span className="text-text-muted font-medium uppercase tracking-wider text-[10px]">{field.label}</span>
            <span className="text-white font-medium text-right">{field.value}</span>
          </div>
        ))}
      </div>

      {actions && (
        <div className="mt-4 pt-4 border-t border-border/50 flex justify-end space-x-2 relative z-10">
          {actions}
        </div>
      )}

      <div className={`absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500 ${badgeColor.replace('bg-', 'text-').replace('/10', '')}`}>
         <Icon className="w-32 h-32" />
      </div>
    </motion.div>
  );
}
