import React, { useState } from 'react';
import { Calculator, Dna, Info, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateVolumetricDose } from '../utils/safetyUtils';

export default function DoseCalculator() {
  const [massMg, setMassMg] = useState<string>('100');
  const [volMl, setVolMl] = useState<string>('10');
  const [targetDoseMg, setTargetDoseMg] = useState<string>('5');

  const { concentration, requiredVolume: requiredVol } = calculateVolumetricDose(massMg, volMl, targetDoseMg);

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6 text-white text-left">
      
      <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-8 h-8 text-[#00E5FF]" />
          <h2 className="text-xl font-black uppercase text-[#00E5FF] tracking-widest">Volumetric Dosing</h2>
        </div>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">
          This calculator performs a mathematical concentration-to-volume conversion for a solution whose concentration is already known. It does not determine a safe dose, drug purity, drug identity, or whether a solution is safe to consume. 
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
              <Dna className="w-4 h-4" /> Total Powder Mass (mg)
            </span>
            <input 
              type="number"
              value={massMg}
              onChange={(e) => setMassMg(e.target.value)}
              className="p-4 bg-[#121212] border border-white/10 rounded-xl focus:outline-none focus:border-[#00E5FF] font-mono text-lg"
              placeholder="e.g. 100"
            />
            <span className="text-[10px] uppercase text-white/40 font-bold ml-1">The stated total amount of compound dissolved</span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
              <Droplet className="w-4 h-4" /> Total Liquid Volume (mL)
            </span>
            <input 
              type="number"
              value={volMl}
              onChange={(e) => setVolMl(e.target.value)}
              className="p-4 bg-[#121212] border border-white/10 rounded-xl focus:outline-none focus:border-blue-400 font-mono text-lg"
              placeholder="e.g. 10"
            />
            <span className="text-[10px] uppercase text-white/40 font-bold ml-1">Total liquid volume used for the stated concentration</span>
          </label>
        </div>

        <div className="border-t border-white/10 pt-6">
          <label className="flex flex-col gap-2 max-w-sm mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF1493] text-center">
              Desired Dose (mg)
            </span>
            <input 
              type="number"
              value={targetDoseMg}
              onChange={(e) => setTargetDoseMg(e.target.value)}
              className="p-4 bg-[#121212] border border-[#FF1493]/50 rounded-xl focus:outline-none focus:border-[#FF1493] font-mono text-xl text-center text-[#FF69B4]"
              placeholder="e.g. 5"
            />
          </label>
        </div>
      </div>

      <motion.div 
        key={requiredVol}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a1a] border border-white/20 rounded-2xl p-6 text-center space-y-4"
      >
        <div className="flex justify-center items-center gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1">Concentration</p>
            <p className="text-xl font-mono text-white/80">{concentration > 0 ? concentration.toFixed(2) : '0'} mg/mL</p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs uppercase tracking-widest text-[#FF69B4] font-black mb-2">Calculated volume for the entered target amount</p>
          <div className="text-5xl font-black tracking-tighter text-white font-mono break-all">
            {requiredVol > 0 ? requiredVol.toFixed(3) : '0.000'} <span className="text-2xl text-[#00E5FF]">mL</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-3">This is a mathematical result, not a medical dosing recommendation. Verify the substance, concentration, units, and safety with a qualified professional.</p>
        </div>
      </motion.div>

      <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-xs text-orange-200/80 leading-relaxed font-bold">
          Important: This calculator assumes the entered mass and volume are accurate and the solution is homogeneous. It cannot detect contamination, mislabeling, potency variation, incomplete dissolution, or unsafe target amounts. Do not treat the calculated volume as evidence that a substance or dose is safe.
        </p>
      </div>

    </div>
  );
}
