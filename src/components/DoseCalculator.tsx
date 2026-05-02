import React, { useState } from 'react';
import { Calculator, Dna, Info, Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DoseCalculator() {
  const [massMg, setMassMg] = useState<string>('100');
  const [volMl, setVolMl] = useState<string>('10');
  const [targetDoseMg, setTargetDoseMg] = useState<string>('5');

  const mass = parseFloat(massMg) || 0;
  const vol = parseFloat(volMl) || 0;
  const target = parseFloat(targetDoseMg) || 0;

  let concentration = 0;
  let requiredVol = 0;

  if (mass > 0 && vol > 0) {
    concentration = mass / vol;
    if (target > 0) {
      requiredVol = target / concentration;
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6 text-white text-left">
      
      <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-8 h-8 text-[#00E5FF]" />
          <h2 className="text-xl font-black uppercase text-[#00E5FF] tracking-widest">Volumetric Dosing</h2>
        </div>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">
          Volumetric liquid dosing is the process of dissolving a known quantity of a compound in a liquid solvent to measure doses by liquid volume. This allows for extreme accuracy (down to milligrams and micrograms) without relying on inaccurate, cheap milligram scales. 
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
            <span className="text-[10px] uppercase text-white/40 font-bold ml-1">The total amount of drug dissolved</span>
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
            <span className="text-[10px] uppercase text-white/40 font-bold ml-1">Amount of sterile water or PG solvent</span>
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
          <p className="text-xs uppercase tracking-widest text-[#FF69B4] font-black mb-2">You need to consume</p>
          <div className="text-5xl font-black tracking-tighter text-white font-mono break-all">
            {requiredVol > 0 ? requiredVol.toFixed(3) : '0.000'} <span className="text-2xl text-[#00E5FF]">mL</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-3">Measure exactly using an oral syringe.</p>
        </div>
      </motion.div>

      <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <p className="text-xs text-orange-200/80 leading-relaxed font-bold">
          Note: This calculator assumes pure, evenly dissolved solutions. Ensure the compound is entirely dissolved in the solvent with no sediment remaining before extracting the dose. Failure to do so can result in fatal hotspots.
        </p>
      </div>

    </div>
  );
}
