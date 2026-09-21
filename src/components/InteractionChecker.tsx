import React, { useState } from 'react';
import { AlertOctagon, Info, AlertTriangle, ShieldAlert, FlaskConical, Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { checkInteraction, DRUG_CLASSES } from '../utils/interactionMatrix';
import { getFdaInteractionEvidence, resolveRxNormName } from '../utils/medicalApi';

type Severity = 'FATAL' | 'UNSAFE' | 'CAUTION' | 'LOW RISK' | 'UNKNOWN' | 'SAME_SUBSTANCE';

export default function InteractionChecker() {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [result, setResult] = useState<{ severity: Severity; description: string; evidence?: any[] }>({
    severity: 'UNKNOWN',
    description: 'Enter two substances and run a live evidence check.'
  });
  const [loading, setLoading] = useState(false);

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

  const runCheck = async () => {
    const a = drug1.trim();
    const b = drug2.trim();
    if (!a || !b) {
      setResult({ severity: 'UNKNOWN', description: 'Enter two substances to check.' });
      return;
    }

    setLoading(true);
    try {
      const [resolvedA, resolvedB] = await Promise.all([
        resolveRxNormName(a),
        resolveRxNormName(b)
      ]);

      const canonicalA = resolvedA?.name || a;
      const canonicalB = resolvedB?.name || b;

      if (canonicalA.toLowerCase() === canonicalB.toLowerCase()) {
        setResult({
          severity: 'SAME_SUBSTANCE',
          description: 'Both entries resolve to the same medication concept. This check covers combinations, not single-substance dose risk.'
        });
        return;
      }

      const live = await getFdaInteractionEvidence(canonicalA, canonicalB);
      if (live.status === 'DOCUMENTED_INTERACTION') {
        setResult({
          severity: 'UNSAFE',
          description: 'FDA drug labeling contains interaction information connecting these substances. Review the source evidence below. This is not a personalized medical safety determination.',
          evidence: live.records
        });
        return;
      }

      const fallback = checkInteraction(a, b);
      if (fallback.severity !== 'UNKNOWN') {
        setResult({
          severity: fallback.severity,
          description: fallback.description + ' Live FDA labeling did not identify this exact pair in the queried label set.',
          evidence: []
        });
      } else {
        setResult({
          severity: 'UNKNOWN',
          description: resolvedA && resolvedB
            ? 'Both substances were recognized by NLM RxNorm, but the live FDA label search did not identify a documented pair. This is insufficient evidence to call the combination safe.'
            : 'One or both substances could not be normalized by NLM RxNorm, and the live FDA label search did not identify a documented pair. This is insufficient evidence to call the combination safe.',
          evidence: []
        });
      }
    } catch (error) {
      const fallback = checkInteraction(a, b);
      setResult({
        severity: fallback.severity,
        description: fallback.severity === 'UNKNOWN'
          ? 'Live medical data could not be reached. The local rapid-check matrix also has no explicit entry. Do not interpret this as safe.'
          : fallback.description + ' Live medical data was unavailable, so this result is from the local rapid-check matrix.',
        evidence: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-y-auto w-full max-w-4xl mx-auto p-6 space-y-6 text-white text-left">
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-purple-400" />
          <h2 className="text-xl font-black uppercase text-purple-300 tracking-widest">Live Interaction Check</h2>
        </div>
        <p className="mt-3 text-white/80 text-sm leading-relaxed">
          Substance names are normalized through NLM RxNorm when possible, then checked against current FDA drug-label interaction text. The local rapid-check matrix remains a fallback for common harm-reduction combinations. An unverified result is not a safety clearance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[drug1, drug2].map((value, index) => (
          <label key={index} className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF69B4]">Substance {index === 0 ? 'A' : 'B'}</span>
            <input
              value={value}
              onChange={e => index === 0 ? setDrug1(e.target.value) : setDrug2(e.target.value)}
              list="common-substances"
              placeholder="e.g. fentanyl, cocaine, alcohol"
              className="p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#FF1493] text-white"
            />
          </label>
        ))}
      </div>
      <datalist id="common-substances">
        {DRUG_CLASSES.map(d => <option key={d} value={d} />)}
        {['fentanyl', 'oxycodone', 'heroin', 'alprazolam', 'diazepam', 'cocaine', 'methamphetamine', 'MDMA', 'ketamine', 'alcohol'].map(d => <option key={d} value={d} />)}
      </datalist>

      <button
        onClick={runCheck}
        disabled={loading || !drug1.trim() || !drug2.trim()}
        className="w-full p-4 rounded-xl bg-[#FF1493] text-white font-black uppercase tracking-widest disabled:opacity-40 flex items-center justify-center gap-3"
      >
        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Checking live sources...</> : 'Check live interaction evidence'}
      </button>

      <motion.div
        key={result.severity + drug1 + drug2 + String(result.evidence?.length || 0)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 p-6 rounded-2xl border ${getStyle(result.severity)}`}
      >
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-1">{getIcon(result.severity)}</div>
          <div className="min-w-0">
            <h3 className="font-black uppercase tracking-widest text-lg mb-2">
              {result.severity === 'UNKNOWN' ? 'INSUFFICIENT / UNVERIFIED' : result.severity}
            </h3>
            <p className="opacity-90 leading-relaxed text-sm">{result.description}</p>
            {result.evidence?.map((item, index) => (
              <div key={index} className="mt-4 p-4 bg-black/20 rounded-xl text-xs text-white/70">
                <div className="font-bold text-white">Source: {item.source}</div>
                {item.updatedAt && <div className="mt-1">Label effective/published date: {item.updatedAt}</div>}
                <p className="mt-2 leading-relaxed">{item.evidence}</p>
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-blue-300">
                  Open source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
