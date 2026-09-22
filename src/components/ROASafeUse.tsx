import React, { useState, useMemo } from 'react';
import { ChevronRight, Activity, AlertTriangle, Scan, Beaker, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DRUG_DATA, DATA_SOURCES, DATA_REVIEW_DATE } from '../data/drugDatabase';
import { searchMedlinePlus, searchFdaDrugSafety } from '../utils/medicalApi';
import { safeExternalUrl } from '../utils/safetyUtils';

export default function ROASafeUse() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDrug, setActiveDrug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [evidenceQuery, setEvidenceQuery] = useState('');
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<{ medline: Awaited<ReturnType<typeof searchMedlinePlus>> | null; fda: Awaited<ReturnType<typeof searchFdaDrugSafety>> | null }>({ medline: null, fda: null });

  const runEvidenceSearch = async () => {
    const query = evidenceQuery.trim();
    if (!query) return;
    setEvidenceLoading(true);
    setEvidenceError(null);
    setEvidence({ medline: null, fda: null });
    const controller = new AbortController();
    try {
      const [medlineResult, fdaResult] = await Promise.allSettled([
        searchMedlinePlus(query, controller.signal),
        searchFdaDrugSafety(query, controller.signal)
      ]);
      if (medlineResult.status === 'rejected' && fdaResult.status === 'rejected') throw new Error('Trusted evidence services were unavailable. No safety conclusion was inferred from the failure.');
      setEvidence({
        medline: medlineResult.status === 'fulfilled' ? medlineResult.value : null,
        fda: fdaResult.status === 'fulfilled' ? fdaResult.value : null
      });
      if (medlineResult.status === 'rejected' || fdaResult.status === 'rejected') setEvidenceError('One trusted evidence source was unavailable. Results shown below are incomplete.');
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setEvidenceError(error instanceof Error ? error.message : 'Trusted evidence search failed.');
    } finally {
      setEvidenceLoading(false);
    }
  };

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
          The safest way to use drugs is not to use them. If you do choose to use, these source-linked harm reduction notes are intended to help minimize the risk of infection, overdose, and tissue damage. This content is educational and should not replace emergency care or professional medical advice.
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5">
        <h3 className="font-black uppercase tracking-widest text-blue-300 text-sm">Information Sources</h3>
        <p className="mt-2 text-sm text-white/70">The current reference set is linked to public health and research sources. Reviewed for source traceability: {DATA_REVIEW_DATE}.</p>
        <ul className="mt-3 space-y-2">
          {DATA_SOURCES.map(source => (
            <li key={source.name}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-300 hover:text-blue-200 underline">{source.name}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
        <h3 className="font-black uppercase tracking-widest text-emerald-300 text-sm">Current Trusted Evidence</h3>
        <p className="mt-2 text-sm text-white/70">Search NLM MedlinePlus and FDA public data for current source material. These results are evidence and source links, not personalized medical advice or a safety clearance.</p>
        <form onSubmit={(event) => { event.preventDefault(); void runEvidenceSearch(); }} className="mt-4 flex flex-col sm:flex-row gap-2">
          <input aria-label="Search trusted health evidence" value={evidenceQuery} onChange={(event) => setEvidenceQuery(event.target.value)} placeholder="e.g. fentanyl, naloxone, methadone" className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400/60" />
          <button type="submit" disabled={evidenceLoading || !evidenceQuery.trim()} className="px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 font-bold uppercase tracking-wider text-xs disabled:opacity-40">{evidenceLoading ? 'Searching...' : 'Search evidence'}</button>
        </form>
        {evidenceError && <p role="status" className="mt-3 text-sm text-amber-300">{evidenceError}</p>}
        {(evidence.medline || evidence.fda) && (
          <div className="mt-4 space-y-3">
            {evidence.medline?.records.map((item) => (
              <a key={item.url} href={safeExternalUrl(item.url) || '#'} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl bg-black/20 border border-white/10 hover:bg-white/5">
                <div className="font-bold text-white">{item.title}</div>
                {item.snippet && <div className="mt-1 text-xs text-white/60">{item.snippet}</div>}
                <div className="mt-2 text-[11px] uppercase tracking-wider text-emerald-300">NLM MedlinePlus · Retrieved {evidence.medline?.retrievedAt}</div>
              </a>
            ))}
            {evidence.fda?.labels.slice(0, 3).map((item) => (
              <div key={item.setId || item.title} className="p-3 rounded-xl bg-black/20 border border-white/10">
                <div className="font-bold text-white">FDA label: {item.title}</div>
                {item.effectiveDate && <div className="mt-1 text-xs text-white/60">Effective date: {item.effectiveDate}</div>}
                {item.warnings && <div className="mt-2 text-xs text-amber-200"><span className="font-bold">Warnings:</span> {item.warnings}</div>}
                {item.interactions && <div className="mt-2 text-xs text-white/70"><span className="font-bold">Interactions:</span> {item.interactions}</div>}
                <a href={safeExternalUrl(item.sourceUrl) || '#'} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-[11px] uppercase tracking-wider text-blue-300">FDA source</a>
              </div>
            ))}
            {evidence.fda?.recalls.slice(0, 3).map((item) => (
              <div key={item.product + String(item.reportDate)} className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="font-bold text-red-200">FDA recall: {item.product}</div>
                {item.reportDate && <div className="mt-1 text-xs text-white/60">Report date: {item.reportDate}</div>}
                {item.reason && <div className="mt-2 text-xs text-white/70">{item.reason}</div>}
                <a href={safeExternalUrl(item.sourceUrl) || '#'} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-[11px] uppercase tracking-wider text-blue-300">FDA enforcement source</a>
              </div>
            ))}
            {evidence.fda?.shortages.slice(0, 3).map((item) => (
              <div key={item.product + String(item.updateDate)} className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                <div className="font-bold text-orange-200">FDA shortage: {item.product}</div>
                {item.updateDate && <div className="mt-1 text-xs text-white/60">Updated: {item.updateDate}</div>}
                {item.status && <div className="mt-2 text-xs text-white/70">{item.status}</div>}
                <a href={safeExternalUrl(item.sourceUrl) || '#'} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-[11px] uppercase tracking-wider text-blue-300">FDA shortage source</a>
              </div>
            ))}
          </div>
        )}
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
                  <div className="px-8 pt-4 text-xs text-white/50">
                    <span className="font-bold uppercase tracking-widest">Sources for this category: </span>
                    {cat.sources?.map((source: { name: string; url: string }, i: number) => (
                      <React.Fragment key={source.name}>
                        {i > 0 && ' · '}
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">{source.name}</a>
                      </React.Fragment>
                    ))}
                  </div>
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
