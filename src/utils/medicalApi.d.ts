export interface RxNormResolution {
  rxcui: string;
  name: string;
  source: string;
  sourceUrl: string;
}

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
  status: string;
  records: InteractionEvidence[];
}>;
export function searchFindTreatment(options: {
  lat: number;
  lng: number;
  radiusMeters?: number;
  codes?: string[];
  signal?: AbortSignal;
}): Promise<{
  records: unknown[];
  source: string;
  sourceUrl: string;
  retrievedAt: string;
}>;
