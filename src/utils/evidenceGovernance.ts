export type CoverageScope = 'GLOBAL' | 'COUNTRY' | 'STATE_OR_PROVINCE' | 'LOCAL' | 'SOURCE_DEPENDENT' | 'UNKNOWN';
export type EvidenceStatus = 'VERIFIED' | 'SOURCE_REPORTED' | 'DIRECTORY_DISCOVERY' | 'UPSTREAM_UNAVAILABLE' | 'INSUFFICIENT_EVIDENCE' | 'UNKNOWN';

export interface EvidenceMetadata {
  source: string;
  sourceUrl: string;
  retrievedAt?: string;
  reviewedOn?: string;
  coverage: CoverageScope;
  jurisdiction?: string;
  status: EvidenceStatus;
  notes?: string;
}

export const GLOBAL_COVERAGE: EvidenceMetadata = {
  source: 'Harm.Less coverage model',
  sourceUrl: 'https://github.com/psfr4590-afk/Harmless-',
  coverage: 'GLOBAL',
  status: 'SOURCE_REPORTED',
  notes: 'Global discovery does not imply complete or authoritative coverage in every jurisdiction.'
};

export function evidenceLabel(status: EvidenceStatus): string {
  switch (status) {
    case 'VERIFIED': return 'Verified source';
    case 'SOURCE_REPORTED': return 'Source-reported';
    case 'DIRECTORY_DISCOVERY': return 'Directory discovery';
    case 'UPSTREAM_UNAVAILABLE': return 'Source unavailable';
    case 'INSUFFICIENT_EVIDENCE': return 'Insufficient evidence';
    default: return 'Coverage unknown';
  }
}

export function coverageLabel(scope: CoverageScope): string {
  switch (scope) {
    case 'GLOBAL': return 'Global scope';
    case 'COUNTRY': return 'Country-specific';
    case 'STATE_OR_PROVINCE': return 'State/province-specific';
    case 'LOCAL': return 'Local';
    case 'SOURCE_DEPENDENT': return 'Source-dependent';
    default: return 'Coverage unknown';
  }
}

export function emergencyGuidance(countryName?: string): string {
  return countryName
    ? `Use the emergency service for ${countryName}. Harm.Less does not assume a universal emergency number.`
    : 'Use the emergency service for the country you are currently in. Harm.Less does not assume 911, 112, or another single number worldwide.';
}
