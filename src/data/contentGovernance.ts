export const CONTENT_AUDIT_DATE = '2026-10-02';

export const CONTENT_EVIDENCE_SOURCES = [
  {
    id: 'CDC_OVERDOSE_PREVENTION',
    name: 'CDC Overdose Prevention',
    url: 'https://www.cdc.gov/overdose-prevention/'
  },
  {
    id: 'CDC_FENTANYL',
    name: 'CDC Fentanyl',
    url: 'https://www.cdc.gov/overdose-prevention/about/fentanyl.html'
  },
  {
    id: 'SAMHSA_OVERDOSE',
    name: 'SAMHSA Opioid Overdose Prevention and Reversal',
    url: 'https://www.samhsa.gov/substance-use/treatment/overdose-prevention'
  },
  {
    id: 'FDA_BUPRENORPHINE_DENTAL',
    name: 'FDA Buprenorphine Dental Safety Communication',
    url: 'https://www.fda.gov/safety/medical-product-safety-information/buprenorphine-drug-safety-communication-fda-warns-about-dental-problems-buprenorphine-medicines'
  },
  {
    id: 'FDA_BENZODIAZEPINE',
    name: 'FDA Benzodiazepine Drug Safety Communication',
    url: 'https://www.fda.gov/drugs/drug-safety-and-availability/fda-requiring-boxed-warning-updated-improve-safe-use-benzodiazepine-drug-class'
  },
  {
    id: 'FDA_POPPERS',
    name: 'FDA Nitrite Poppers Safety Information',
    url: 'https://www.fda.gov/consumers/consumer-updates/ingesting-or-inhaling-nitrite-poppers-can-cause-severe-injury-or-death'
  },
  {
    id: 'CDC_CANNABIS',
    name: 'CDC Cannabis Frequently Asked Questions',
    url: 'https://www.cdc.gov/cannabis/faq/index.html'
  }
] as const;

export type ContentEvidenceLevel = 'SOURCE_BACKED' | 'CAUTION_REQUIRED' | 'UPSTREAM_DEPENDENT';

export const CONTENT_EVIDENCE_POLICY = {
  sourceBacked: 'Claims should be traceable to an identified authoritative source before being presented as verified safety guidance.',
  cautionRequired: 'Claims involving dosing, product identification, interaction severity, or substance-testing procedures require product-, patient-, or jurisdiction-specific context and must not be presented as universal rules.',
  upstreamDependent: 'Live medical evidence can change. Retrieval failures must remain visible and must never become an implicit safety clearance.',
  globalBoundary: 'Emergency instructions and jurisdictional claims must not assume a U.S.-specific service number or law applies worldwide.'
} as const;
