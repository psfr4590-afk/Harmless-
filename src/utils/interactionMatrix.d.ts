export const DRUG_CLASSES: string[];
export const INTERACTIONS: Record<string, { severity: Severity; description: string; source?: string; sourceUrl?: string }>;
export type Severity = 'FATAL' | 'UNSAFE' | 'CAUTION' | 'LOW RISK' | 'UNKNOWN' | 'SAME_SUBSTANCE';
export function checkInteraction(drugA: string, drugB: string): {
  severity: Severity;
  description: string;
  source?: string;
  sourceUrl?: string;
};
