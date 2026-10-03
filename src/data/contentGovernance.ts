export const CONTENT_AUDIT_DATE = '2026-10-02';

export type ContentEvidenceLevel =
  | 'SOURCE_BACKED'
  | 'CAUTION_REQUIRED'
  | 'UPSTREAM_DEPENDENT';

export type ContentReviewStatus =
  | 'REVIEWED'
  | 'REVIEW_REQUIRED'
  | 'UPSTREAM_CURRENT'
  | 'NOT_APPLICABLE';

export interface ContentEvidenceSource {
  id: string;
  name: string;
  url: string;
  jurisdiction: string;
  publicationOrUpdateDate: string;
  evidenceType: 'PUBLIC_HEALTH_GUIDANCE' | 'REGULATORY_SAFETY_COMMUNICATION' | 'RESEARCH_REFERENCE' | 'LIVE_DIRECTORY';
}

export interface ContentClaimProvenance {
  sourceIds: readonly string[];
  jurisdiction: string;
  publicationOrUpdateDate: string;
  evidenceType: ContentEvidenceSource['evidenceType'];
  reviewStatus: ContentReviewStatus;
  notes: string;
}

export const CONTENT_EVIDENCE_SOURCES: readonly ContentEvidenceSource[] = [
  {
    id: 'CDC_OVERDOSE_PREVENTION',
    name: 'CDC Overdose Prevention',
    url: 'https://www.cdc.gov/overdose-prevention/',
    jurisdiction: 'United States; public-health evidence is not automatically universal',
    publicationOrUpdateDate: 'Page date varies; reviewed 2026-10-02',
    evidenceType: 'PUBLIC_HEALTH_GUIDANCE'
  },
  {
    id: 'CDC_FENTANYL',
    name: 'CDC Fentanyl',
    url: 'https://www.cdc.gov/overdose-prevention/about/fentanyl.html',
    jurisdiction: 'United States; public-health evidence is not automatically universal',
    publicationOrUpdateDate: 'Page date varies; reviewed 2026-10-02',
    evidenceType: 'PUBLIC_HEALTH_GUIDANCE'
  },
  {
    id: 'SAMHSA_OVERDOSE',
    name: 'SAMHSA Opioid Overdose Prevention and Reversal',
    url: 'https://www.samhsa.gov/substance-use/treatment/overdose-prevention',
    jurisdiction: 'United States',
    publicationOrUpdateDate: 'Page date varies; reviewed 2026-10-02',
    evidenceType: 'PUBLIC_HEALTH_GUIDANCE'
  },
  {
    id: 'FDA_BUPRENORPHINE_DENTAL',
    name: 'FDA Buprenorphine Dental Safety Communication',
    url: 'https://www.fda.gov/safety/medical-product-safety-information/buprenorphine-drug-safety-communication-fda-warns-about-dental-problems-buprenorphine-medicines',
    jurisdiction: 'United States',
    publicationOrUpdateDate: 'FDA communication; reviewed 2026-10-02',
    evidenceType: 'REGULATORY_SAFETY_COMMUNICATION'
  },
  {
    id: 'FDA_BENZODIAZEPINE',
    name: 'FDA Benzodiazepine Drug Safety Communication',
    url: 'https://www.fda.gov/drugs/drug-safety-and-availability/fda-requiring-boxed-warning-updated-improve-safe-use-benzodiazepine-drug-class',
    jurisdiction: 'United States',
    publicationOrUpdateDate: 'FDA communication; reviewed 2026-10-02',
    evidenceType: 'REGULATORY_SAFETY_COMMUNICATION'
  },
  {
    id: 'FDA_POPPERS',
    name: 'FDA Nitrite Poppers Safety Information',
    url: 'https://www.fda.gov/consumers/consumer-updates/ingesting-or-inhaling-nitrite-poppers-can-cause-severe-injury-or-death',
    jurisdiction: 'United States',
    publicationOrUpdateDate: 'FDA consumer update; reviewed 2026-10-02',
    evidenceType: 'REGULATORY_SAFETY_COMMUNICATION'
  },
  {
    id: 'CDC_CANNABIS',
    name: 'CDC Cannabis Frequently Asked Questions',
    url: 'https://www.cdc.gov/cannabis/faq/index.html',
    jurisdiction: 'United States',
    publicationOrUpdateDate: 'Page date varies; reviewed 2026-10-02',
    evidenceType: 'PUBLIC_HEALTH_GUIDANCE'
  },
  {
    id: 'NIDA_SUBSTANCE_RESEARCH',
    name: 'NIDA Research Topics by Substance',
    url: 'https://nida.nih.gov/drugabuse.html',
    jurisdiction: 'United States; research reference',
    publicationOrUpdateDate: 'Page date varies; reviewed 2026-10-02',
    evidenceType: 'RESEARCH_REFERENCE'
  }
] as const;

export const CONTENT_CLAIM_PROVENANCE: Record<string, ContentClaimProvenance> = {
  opioids: {
    sourceIds: ['CDC_OVERDOSE_PREVENTION', 'CDC_FENTANYL', 'SAMHSA_OVERDOSE'],
    jurisdiction: 'United States; not a universal clinical protocol',
    publicationOrUpdateDate: 'Source pages reviewed 2026-10-02',
    evidenceType: 'PUBLIC_HEALTH_GUIDANCE',
    reviewStatus: 'REVIEWED',
    notes: 'Static opioid claims are educational harm-reduction content. Product-specific naloxone and test-strip instructions must defer to the current product instructions.'
  },
  buprenorphine: {
    sourceIds: ['FDA_BUPRENORPHINE_DENTAL'],
    jurisdiction: 'United States',
    publicationOrUpdateDate: 'FDA communication reviewed 2026-10-02',
    evidenceType: 'REGULATORY_SAFETY_COMMUNICATION',
    reviewStatus: 'REVIEWED',
    notes: 'Dental-care wording is tied to FDA guidance. Other buprenorphine claims remain educational and are not individualized treatment direction.'
  },
  depressants: {
    sourceIds: ['FDA_BENZODIAZEPINE', 'CDC_OVERDOSE_PREVENTION'],
    jurisdiction: 'United States; not a universal clinical protocol',
    publicationOrUpdateDate: 'Source pages reviewed 2026-10-02',
    evidenceType: 'REGULATORY_SAFETY_COMMUNICATION',
    reviewStatus: 'REVIEWED',
    notes: 'Combination-risk and withdrawal warnings require patient- and product-specific clinical context.'
  },
  poppers: {
    sourceIds: ['FDA_POPPERS'],
    jurisdiction: 'United States',
    publicationOrUpdateDate: 'FDA consumer update reviewed 2026-10-02',
    evidenceType: 'REGULATORY_SAFETY_COMMUNICATION',
    reviewStatus: 'REVIEWED',
    notes: 'No universal dosing or product-identification instruction is presented.'
  },
  cannabis: {
    sourceIds: ['CDC_CANNABIS'],
    jurisdiction: 'United States; public-health evidence is not automatically universal',
    publicationOrUpdateDate: 'CDC page reviewed 2026-10-02',
    evidenceType: 'PUBLIC_HEALTH_GUIDANCE',
    reviewStatus: 'REVIEWED',
    notes: 'Product potency and individual response vary; fixed dose claims are intentionally excluded.'
  },
  general: {
    sourceIds: ['NIDA_SUBSTANCE_RESEARCH'],
    jurisdiction: 'United States; research reference',
    publicationOrUpdateDate: 'NIDA reference reviewed 2026-10-02',
    evidenceType: 'RESEARCH_REFERENCE',
    reviewStatus: 'REVIEW_REQUIRED',
    notes: 'Category-level research references do not individually validate every static claim. Claims without a mapped authoritative source remain educational and require review before being labeled verified.'
  }
} as const;

export const CONTENT_EVIDENCE_POLICY = {
  sourceBacked: 'Claims presented as verified safety guidance must be traceable to an identified authoritative source.',
  cautionRequired: 'Claims involving dosing, product identification, interaction severity, withdrawal, or substance-testing procedures require product-, patient-, or jurisdiction-specific context and must not be presented as universal rules.',
  upstreamDependent: 'Live medical evidence can change. Retrieval failures remain visible and never become an implicit safety clearance.',
  globalBoundary: 'Emergency instructions and jurisdictional claims must not assume a U.S.-specific service number or law applies worldwide.',
  provenanceBoundary: 'A category source list is not proof that every sentence is clinically validated. The UI labels static material as educational unless a claim has explicit reviewed provenance.'
} as const;

export function evidenceLabel(status: ContentReviewStatus | ContentEvidenceLevel): string {
  switch (status) {
    case 'REVIEWED':
    case 'SOURCE_BACKED':
      return 'Reviewed source-backed content';
    case 'UPSTREAM_CURRENT':
    case 'UPSTREAM_DEPENDENT':
      return 'Live/upstream evidence';
    case 'REVIEW_REQUIRED':
    case 'CAUTION_REQUIRED':
      return 'Educational guidance · review required';
    default:
      return 'Evidence status unknown';
  }
}

export function claimProvenanceForDrug(drugName: string, category: string): ContentClaimProvenance {
  const lower = drugName.toLowerCase();
  if (lower.includes('buprenorphine')) return CONTENT_CLAIM_PROVENANCE.buprenorphine;
  if (lower.includes('benzodiazepine') || lower.includes('ghb') || lower.includes('z-drug')) return CONTENT_CLAIM_PROVENANCE.depressants;
  if (lower.includes('poppers')) return CONTENT_CLAIM_PROVENANCE.poppers;
  if (lower.includes('cannabis') || lower.includes('marijuana')) return CONTENT_CLAIM_PROVENANCE.cannabis;
  if (category === 'Opioids') return CONTENT_CLAIM_PROVENANCE.opioids;
  return CONTENT_CLAIM_PROVENANCE.general;
}

export const GLOBAL_COVERAGE = {
  jurisdiction: 'Worldwide',
  notes: 'Global discovery does not imply complete or authoritative coverage in every jurisdiction.'
} as const;
