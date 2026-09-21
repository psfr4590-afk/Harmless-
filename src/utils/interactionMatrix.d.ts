export const DRUG_CLASSES: string[];
export const INTERACTIONS: Record<string, { severity: string; description: string }>;
export function checkInteraction(drugA: string, drugB: string): {
  severity: string;
  description: string;
};
