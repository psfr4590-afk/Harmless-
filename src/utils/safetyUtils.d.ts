export interface OverpassElement {
  type: string;
  id: string | number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export function canonicalPair(a: string, b: string): string | null;
export function safeExternalUrl(value: unknown): string | null;
export function dedupeById<T extends { id: string | number }>(items: T[]): T[];
export function buildOverpassQuery(selectors: string[], lat: number, lng: number, radius?: number): string;
export function calculateVolumetricDose(massMg: number, volumeMl: number, targetDoseMg: number): {
  concentration: number;
  requiredVolume: number;
};
export function extractOverpassElements(data: unknown): OverpassElement[] | null;
