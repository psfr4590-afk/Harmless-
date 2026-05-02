import React, { useState } from 'react';
import { AlertOctagon, Info, AlertTriangle, ShieldAlert, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';

const DRUG_CLASSES = [
  'Opioids',
  'Benzodiazepines',
  'Alcohol',
  'GHB / GBL',
  'Cocaine',
  'Amphetamines (Meth/Speed)',
  'MDMA / Ecstasy',
  'Ketamine',
  'MAOI Antidepressants',
  'SSRI Antidepressants'
];

type Severity = 'FATAL' | 'UNSAFE' | 'CAUTION' | 'LOW RISK' | 'UNKNOWN';

interface InteractionResult {
  severity: Severity;
  description: string;
}

const checkInteraction = (drugA: string, drugB: string): InteractionResult => {
  if (!drugA || !drugB || drugA === 'Select...' || drugB === 'Select...') return { severity: 'UNKNOWN', description: 'Please select two different substances to check their interaction.' };
  if (drugA === drugB) return { severity: 'LOW RISK', description: 'Selected the same substance.' };

  const pair = [drugA, drugB].sort().join(' + ');

  const interactions: Record<string, { severity: Severity; description: string }> = {
    // Opioid Combos
    'Alcohol + Opioids': { severity: 'FATAL', description: 'Extremely dangerous. Both suppress the central nervous system and breathing. High risk of fatal respiratory depression and choking on vomit.' },
    'Benzodiazepines + Opioids': { severity: 'FATAL', description: 'The absolute highest cause of fatal overdoses. Extreme respiratory depression, deep blackout, and coma. Narcan only reverses the opioid, leaving the benzo active.' },
    'GHB / GBL + Opioids': { severity: 'FATAL', description: 'Severe risk of sudden respiratory arrest and unarousable coma.' },
    'Cocaine + Opioids': { severity: 'CAUTION', description: 'Known as a "Speedball". The stimulant masks the depressant. When the cocaine wears off, the opioid hits with full force, causing delayed fatal overdose.' },
    'Amphetamines (Meth/Speed) + Opioids': { severity: 'CAUTION', description: 'Same mechanism as a speedball. The stimulant masks the respiratory depression until it wears off.' },
    'Ketamine + Opioids': { severity: 'UNSAFE', description: 'Both cause intense sedation. High risk of vomiting and choking while completely incapacitated or anesthetized.' },
    
    // Benzo Combos
    'Alcohol + Benzodiazepines': { severity: 'FATAL', description: 'Massive risk of blackout, choking on vomit, and respiratory depression. Extremely unpredictable and highly lethal.' },
    'Benzodiazepines + GHB / GBL': { severity: 'FATAL', description: 'Massive risk of coma and respiratory arrest. Do not combine.' },
    'Benzodiazepines + Ketamine': { severity: 'UNSAFE', description: 'Benzos can blunt the psychological effects of Ketamine but drastically increase the risk of blackout and unconscious vomiting.' },

    // Alcohol Combos
    'Alcohol + GHB / GBL': { severity: 'FATAL', description: 'One of the most dangerous combinations. Even a single beer combined with GHB can lead to an unarousable coma and sudden death from suppressed breathing.' },
    'Alcohol + Cocaine': { severity: 'UNSAFE', description: 'Combines in the liver to form Cocaethylene, which is significantly more toxic to the heart than cocaine alone and increases sudden cardiac death risk.' },
    'Alcohol + Ketamine': { severity: 'FATAL', description: 'Strong synergy that causes intense nausea, spinning, blackout, and choking on vomit while anesthetized. Highly dangerous.' },
    'Alcohol + MDMA / Ecstasy': { severity: 'UNSAFE', description: 'Alcohol severely dehydrates the body, exacerbating MDMA neurotoxicity and heatstroke risk. Blunts the euphoric effects.' },

    // MDMA Combos
    'MAOI Antidepressants + MDMA / Ecstasy': { severity: 'FATAL', description: 'Will cause Serotonin Syndrome. Hyperthermia, seizures, brain damage, and death. Must wait 14+ days after stopping MAOIs before taking MDMA.' },
    'MDMA / Ecstasy + SSRI Antidepressants': { severity: 'UNSAFE', description: 'SSRIs will completely block or severely blunt the positive effects of MDMA, while still causing physical strain.' },
    'Amphetamines (Meth/Speed) + MDMA / Ecstasy': { severity: 'UNSAFE', description: 'Massively increases neurotoxicity, heart strain, and risk of fatal hyperthermia (overheating).' },

    // Stimulant Combos
    'Amphetamines (Meth/Speed) + Cocaine': { severity: 'UNSAFE', description: 'Extreme strain on the cardiovascular system. Risk of heart attack, stroke, and extreme anxiety/paranoia.' },
    'Amphetamines (Meth/Speed) + MAOI Antidepressants': { severity: 'FATAL', description: 'Hypertensive crisis. Can cause sudden strokes or fatal heart attacks.' },
    'Cocaine + MAOI Antidepressants': { severity: 'FATAL', description: 'Hypertensive crisis and risk of Serotonin Syndrome.' },
  };

  return interactions[pair] || { severity: 'UNKNOWN', description: 'Interaction not explicitly listed in this rapid-check matrix, but caution is highly advised. Mixing chemicals inherently carries unpredictable risks.' };
};

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
      default: return 'bg-white/5 border-white/20 text-white/70';
    }
  };

  const getIcon = (severity: Severity) => {
    switch (severity) {
      case 'FATAL': return <ShieldAlert className="w-8 h-8 animate-pulse text-red-500" />;
      case 'UNSAFE': return <AlertOctagon className="w-8 h-8 text-orange-400" />;
      case 'CAUTION': return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
      case 'LOW RISK': return <Info className="w-8 h-8 text-green-400" />;
      default: return <FlaskConical className="w-8 h-8 text-white/50" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6 text-white text-left">
      
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-purple-400" />
          <h2 className="text-xl font-black uppercase text-purple-300 tracking-widest">Interaction Database</h2>
        </div>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">
          Select two substance classes below to view known pharmacological cross-reactions. This tool evaluates major systemic risks, especially regarding respiratory suppression and cardiac strain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF69B4]">Substance A</span>
          <select 
            value={drug1} 
            onChange={(e) => setDrug1(e.target.value)}
            className="p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF1493] appearance-none"
          >
            <option>Select...</option>
            {DRUG_CLASSES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF69B4]">Substance B</span>
          <select 
            value={drug2} 
            onChange={(e) => setDrug2(e.target.value)}
            className="p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF1493] appearance-none"
          >
            <option>Select...</option>
            {DRUG_CLASSES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
      </div>

      <motion.div 
        key={result.severity + drug1 + drug2}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 p-6 rounded-2xl border ${getStyle(result.severity)}`}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-1">
            {getIcon(result.severity)}
          </div>
          <div>
            <h3 className="font-black uppercase tracking-widest text-lg mb-2">
              {result.severity === 'UNKNOWN' && drug1 !== 'Select...' && drug2 !== 'Select...' ? 'UNKNOWN / UNLISTED' : result.severity}
            </h3>
            <p className="opacity-90 leading-relaxed text-sm">
              {result.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
