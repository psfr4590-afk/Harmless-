export function canonicalPair(a: string, b: string): string | null;
export function safeExternalUrl(value: string | null | undefined): string | null;
export function dedupeById<T extends { id: string }>(items: T[]): T[];
export function buildOverpassQuery(selectors: string[], lat: number, lng: number, radius?: number): string;
export function calculateVolumetricDose(massMg: string | number, volumeMl: string | number, targetDoseMg: string | number): {
  concentration: number;
  requiredVolume: number;
};

export function extractOverpassElements(data: unknown): unknown[] | null;
