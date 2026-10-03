export interface ProviderPrivacyBoundary {
  id: string;
  provider: string;
  dataSent: string;
  purpose: string;
  persistenceByApp: string;
  userActionRequired: boolean;
  scope: string;
}

export const PROVIDER_PRIVACY_BOUNDARIES: readonly ProviderPrivacyBoundary[] = [
  {
    id: 'NLM_RXNORM',
    provider: 'NLM RxNorm',
    dataSent: 'The substance names entered for normalization.',
    purpose: 'Medication-name normalization before live interaction evidence lookup.',
    persistenceByApp: 'Not stored by Harm.Less.',
    userActionRequired: true,
    scope: 'NLM public service'
  },
  {
    id: 'FDA_OPENFDA',
    provider: 'FDA openFDA',
    dataSent: 'Normalized substance names used in the evidence query.',
    purpose: 'Public drug-label and safety evidence lookup.',
    persistenceByApp: 'Not stored by Harm.Less.',
    userActionRequired: true,
    scope: 'U.S. public regulatory data'
  },
  {
    id: 'NOMINATIM_OVERPASS',
    provider: 'OpenStreetMap Nominatim / Overpass',
    dataSent: 'Coordinates or a manually entered location and selected resource-search terms.',
    purpose: 'Geographic resource discovery.',
    persistenceByApp: 'Not stored by Harm.Less.',
    userActionRequired: true,
    scope: 'Worldwide public geographic directory data'
  },
  {
    id: 'SAMHSA_FIND_TREATMENT',
    provider: 'SAMHSA FindTreatment.gov',
    dataSent: 'U.S. search coordinates and treatment-search parameters.',
    purpose: 'U.S.-specific treatment-resource discovery.',
    persistenceByApp: 'Not stored by Harm.Less.',
    userActionRequired: true,
    scope: 'United States only'
  },
  {
    id: 'PILL_IMPRINT',
    provider: 'External imprint directory opened by the user',
    dataSent: 'Imprint/color/shape query parameters only when the user explicitly selects the lookup action. The selected image is not uploaded by Harm.Less.',
    purpose: 'External imprint-reference lookup.',
    persistenceByApp: 'Not stored by Harm.Less.',
    userActionRequired: true,
    scope: 'External directory; coverage varies'
  }
];

export const PRIVACY_BOUNDARY_POLICY = {
  noSilentLocation: 'Location is requested only after an explicit location-dependent action.',
  noSilentImageUpload: 'Pill images remain local to the current workflow unless a user deliberately uses an external service outside the image workflow.',
  noSecrets: 'Secrets, credentials, or unnecessary personal information must never be included in public-service queries.',
  noApplicationProfile: 'Harm.Less does not maintain an application-managed cloud profile or account.'
} as const;
