import React, { useState, useMemo } from 'react';
import { ChevronRight, Activity, AlertTriangle, Scan, Beaker, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DRUG_DATA } from '../data/drugDatabase';

export default function ROASafeUse() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDrug, setActiveDrug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return DRUG_DATA;
    const lowerQuery = searchQuery.toLowerCase();
    
    return DRUG_DATA.map(category => {
      const filteredDrugs = category.drugs.filter(drug => 
        drug.name.toLowerCase().includes(lowerQuery)
      );
      // Include category if any drug matches or if category name matches
      if (filteredDrugs.length > 0 || category.category.toLowerCase().includes(lowerQuery)) {
        return {
          ...category,
          drugs: filteredDrugs.length > 0 ? filteredDrugs : category.drugs
        };
      }
      return null;
    }).filter(Boolean) as typeof DRUG_DATA;
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6 text-white text-left">
      
      <div className="bg-[#FF1493]/10 border border-[#FF1493]/30 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-[#FF1493]" />
          <h2 className="text-xl font-black uppercase text-[#FF69B4] tracking-widest">Harm Reduction Protocol</h2>
        </div>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">
          The safest way to use drugs is not to use them. If you do choose to use, these verified harm reduction protocols can minimize the risk of infection, overdose, and tissue damage. Knowledge protects lives.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-white/40" />
        </div>
        <input
          type="text"
          placeholder="Search for a substance..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value) {
              setActiveCategory(null);
            }
          }}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#FF1493] text-white placeholder-white/40 font-medium"
        />
      </div>

      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center p-8 border border-white/5 rounded-2xl bg-white/5 text-white/60">
            No substances found matching your search.
          </div>
        ) : (
          filteredData.map((cat) => (
            <div key={cat.category} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <button 
                onClick={() => {
                  setActiveCategory(activeCategory === cat.category ? null : cat.category);
                  setActiveDrug(null);
                }}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
              <span className="font-black uppercase tracking-wider text-lg">{cat.category}</span>
              <ChevronRight className={`w-6 h-6 transition-transform ${activeCategory === cat.category ? 'rotate-90 text-[#FF1493]' : 'text-white/40'}`} />
            </button>
            
            <AnimatePresence>
              {activeCategory === cat.category && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5"
                >
                  {cat.drugs.map((drug) => (
                    <div key={drug.name} className="border-b border-white/5 last:border-0">
                      <button 
                        onClick={() => setActiveDrug(activeDrug === drug.name ? null : drug.name)}
                        className="w-full p-4 pl-8 flex items-center justify-between hover:bg-white/5"
                      >
                        <span className="font-bold text-[#FF69B4]">{drug.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeDrug === drug.name ? 'rotate-90 text-white' : 'text-white/40'}`} />
                      </button>

                      <AnimatePresence>
                        {activeDrug === drug.name && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 pl-12 bg-black/20 space-y-6"
                          >
                            {drug.roas && drug.roas.map((roa, i) => (
                              <div key={i}>
                                <h4 className="font-bold uppercase text-xs tracking-widest text-[#FF1493] mb-3 flex items-center gap-2">
                                  <Activity className="w-4 h-4" />
                                  {roa.method}
                                </h4>
                                <ul className="space-y-2">
                                  {roa.safety.map((tip, idx) => (
                                    <li key={idx} className="text-sm text-white/70 flex gap-3 leading-relaxed">
                                      <span className="text-[#FF1493] mt-1">•</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}

                            {/* Overdose / Life Saving */}
                            {drug.overdose && (
                              <div className="pt-4 border-t border-white/10">
                                <h4 className="font-bold uppercase text-xs tracking-widest text-green-400 mb-3 flex items-center gap-2">
                                  <Activity className="w-4 h-4" />
                                  Overdose & Life Saving Steps
                                </h4>
                                <ul className="space-y-2">
                                  {drug.overdose.map((step, idx) => (
                                    <li key={idx} className="text-sm text-white/80 flex gap-3 leading-relaxed">
                                      <span className="text-green-500 mt-1 font-bold">{idx + 1}.</span>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Lethal Mixes */}
                            {drug.mixes && (
                              <div className="pt-4 border-t border-white/10">
                                <h4 className="font-bold uppercase text-xs tracking-widest text-red-500 mb-3 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Fatal Combinations
                                </h4>
                                <ul className="space-y-2">
                                  {drug.mixes.map((mix, idx) => (
                                    <li key={idx} className="text-sm font-bold text-red-200 flex gap-3 leading-relaxed">
                                      <span className="text-red-500 mt-1 font-black">X</span>
                                      {mix}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Identification */}
                            {drug.identification && (
                              <div className="pt-4 border-t border-white/10">
                                <h4 className="font-bold uppercase text-xs tracking-widest text-blue-400 mb-3 flex items-center gap-2">
                                  <Scan className="w-4 h-4" />
                                  Visual Identification
                                </h4>
                                <p className="text-sm text-white/80 leading-relaxed italic border-l-2 border-blue-500/50 pl-4">{drug.identification}</p>
                              </div>
                            )}

                            {/* Pill Identification Specifics */}
                            {drug.pillId && (
                              <div className="pt-4 border-t border-white/10">
                                <h4 className="font-bold uppercase text-xs tracking-widest text-orange-400 mb-3 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Fake Pill Warning
                                </h4>
                                <p className="text-sm font-bold text-orange-200 leading-relaxed bg-orange-500/10 p-4 rounded-xl border border-orange-500/30">
                                  {drug.pillId}
                                </p>
                              </div>
                            )}

                            {/* Test Strips */}
                            {drug.testStrips && (
                              <div className="pt-4 border-t border-white/10">
                                <h4 className="font-bold uppercase text-xs tracking-widest text-purple-400 mb-3 flex items-center gap-2">
                                  <Beaker className="w-4 h-4" />
                                  Fentanyl Test Strip Guide
                                </h4>
                                <ul className="space-y-2 bg-purple-500/10 p-4 rounded-xl border border-purple-500/30">
                                  {drug.testStrips.map((step, idx) => (
                                    <li key={idx} className="text-sm text-purple-100 flex gap-3 leading-relaxed">
                                      <span className="text-purple-400 mt-1">•</span>
                                      {step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      )}
    </div>
  </div>
);
}
