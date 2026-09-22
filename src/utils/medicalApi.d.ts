export interface RxNormResolution {
  rxcui: string;
  name: string;
  source: string;
  sourceUrl: string;
}

export interface FindTreatmentRecord { [key: string]: string | number | null | undefined; }

export interface InteractionEvidence {
  source: string;
  sourceUrl: string;
  evidence: string;
  drugName: string;
  updatedAt: string | null;
  setId: string | null;
}

export function getRxNormVersion(signal?: AbortSignal): Promise<Record<string, unknown>>;
export function resolveRxNormName(name: string, signal?: AbortSignal): Promise<RxNormResolution | null>;
export function getFdaInteractionEvidence(
  drugA: string,
  drugB: string,
  signal?: AbortSignal
): Promise<{
  status: 'DOCUMENTED_INTERACTION' | 'NO_DOCUMENTED_PAIR_IN_MATCHED_LABELS' | 'UPSTREAM_UNAVAILABLE' | 'INSUFFICIENT_EVIDENCE';
  records: InteractionEvidence[];
}>;
export interface MedlinePlusRecord {
  title: string;
  url: string;
  snippet: string;
  source: string;
}
export interface FdaLabelRecord {
  source: string; sourceUrl: string; title: string; effectiveDate: string | null; setId: string | null; warnings: string; interactions: string;
}
export interface FdaRecallRecord {
  source: string; sourceUrl: string; product: string; reportDate: string | null; reason: string; status: string;
}
export interface FdaShortageRecord {
  source: string; sourceUrl: string; product: string; status: string; updateDate: string | null;
}
export function searchMedlinePlus(query: string, signal?: AbortSignal): Promise<{
  records: MedlinePlusRecord[]; source: string; sourceUrl: string; retrievedAt: string;
}>;
export function searchFdaDrugSafety(query: string, signal?: AbortSignal): Promise<{
  labels: FdaLabelRecord[]; recalls: FdaRecallRecord[]; shortages: FdaShortageRecord[];
  source: string; sourceUrl: string; retrievedAt: string;
  upstream: { labels: boolean; recalls: boolean; shortages: boolean };
}>;
export function searchFindTreatment(options: {
  lat: number;
  lng: number;
  radiusMeters?: number;
  codes?: string[];
  type?: 'SA' | 'MH' | 'both';
  signal?: AbortSignal;
}): Promise<{
  records: FindTreatmentRecord[];
  source: string;
  sourceUrl: string;
  retrievedAt: string;
}>;
