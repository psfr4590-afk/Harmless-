import React from 'react';
import { Globe2, ShieldCheck } from 'lucide-react';
import { coverageLabel, evidenceLabel, type CoverageScope, type EvidenceStatus } from '../utils/evidenceGovernance';

interface Props {
  coverage?: CoverageScope;
  status?: EvidenceStatus;
  text: string;
}

export default function CoverageNotice({ coverage = 'GLOBAL', status = 'SOURCE_REPORTED', text }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/60">
      <div className="flex flex-wrap items-center gap-2 font-bold uppercase tracking-wider text-white/75">
        <Globe2 className="h-4 w-4 text-[#FF69B4]" />
        <span>{coverageLabel(coverage)}</span>
        <span className="text-white/20">•</span>
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>{evidenceLabel(status)}</span>
      </div>
      <p className="mt-2 leading-relaxed">{text}</p>
    </div>
  );
}
