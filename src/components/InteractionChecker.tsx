import React, { useState } from 'react';
import { AlertOctagon, Info, AlertTriangle, ShieldAlert, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';
import { DRUG_CLASSES, checkInteraction } from '../utils/interactionMatrix';

type Severity = 'FATAL' | 'UNSAFE' | 'CAUTION' | 'LOW RISK' | 'UNKNOWN' | 'SAME_SUBSTANCE';

export default function InteractionChecker() {
  const [drug1, setDrug1] = useState('Select...');
  const [drug2, setDrug2] = useState('Select...');
  const result = checkInteraction(drug1, drug2);

  const getStyle = (severity: Severity) => {
    switch (severity) {
      case 'FATAL': return 'bg-red-500/10 border-red-500/50 text-red-500';
      case 'UNSAFE': return 'bg-orange-500/10 border-orange-500/50 text-orange-400';
      case 'CAUTION': return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400';
      case 'LOW RISK': return 'bg-green-500/10 border-green-500/50 text-green-400';
      case 'SAME_SUBSTANCE': return 'bg-blue-500/10 border-blue-500/30 text-blue-300';
      default: return 'bg-white/5 border-white/20 text-white/70';
    }
  };

  const getIcon = (severity: Severity) => {
    switch (severity) {
      case 'FATAL': return <ShieldAlert className="w-8 h-8 animate-pulse text-red-500" />;
      case 'UNSAFE': return <AlertOctagon className="w-8 h-8 text-orange-400" />;
      case 'CAUTION': return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case 'LOW RISK': return <Info className="w-8 h-8 text-green-400" />;
      case 'SAME_SUBSTANCE': return <Info className="w-8 h-8 text-blue-300" />;
      default: return <FlaskConical className="w-8 h-8 text-white/50" />;
    }
  };

  const heading = result.severity === 'UNKNOWN' && drug1 !== 'Select...' && drug2 !== 'Select...'
    ? 'UNKNOWN / UNLISTED'
    : result.severity;

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6 text-white text-left">
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-purple-400" />
          <h2 className="text-xl font-black uppercase text-purple-300 tracking-widest">Interaction Database</h2>
        </div>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">
          This is a rapid-check matrix for selected substance classes. It is not a complete interaction database.
          An unlisted combination is unknown, not safe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[drug1, drug2].map((value, index) => (
          <label key={index} className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF69B4]">Substance {index === 0 ? 'A' : 'B'}</span>
            <select
              value={value}
              onChange={(e) => index === 0 ? setDrug1(e.target.value) : setDrug2(e.target.value)}
              className="p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF1493] appearance-none"
            >
              <option>Select...</option>
              {DRUG_CLASSES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        ))}
      </div>

      <motion.div
        key={result.severity + drug1 + drug2}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 p-6 rounded-2xl border ${getStyle(result.severity as Severity)}`}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-1">{getIcon(result.severity as Severity)}</div>
          <div>
            <h3 className="font-black uppercase tracking-widest text-lg mb-2">{heading}</h3>
            <p className="opacity-90 leading-relaxed text-sm">{result.description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
