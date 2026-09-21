const RXNORM_BASE = 'https://rxnav.nlm.nih.gov/REST';
const OPENFDA_BASE = 'https://api.fda.gov/drug/label.json';
const FINDTREATMENT_BASE = 'https://findtreatment.gov/locator/exportsAsJson/v2';

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Upstream service returned HTTP ${response.status}`);
  const data = await response.json();
  if (!data || typeof data !== 'object') throw new Error('Upstream service returned an unexpected response.');
  return data;
}

export async function getRxNormVersion(signal) {
  return fetchJson(`${RXNORM_BASE}/version.json`, signal);
}

export async function resolveRxNormName(name, signal) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return null;

  const url = new URL(`${RXNORM_BASE}/rxcui.json`);
  url.searchParams.set('name', trimmed);
  url.searchParams.set('search', '2');
  const data = await fetchJson(url.toString(), signal);
  const ids = data.idGroup?.rxnormId;
  if (!Array.isArray(ids) || ids.length === 0) return null;

  const rxcui = ids[0];
  const detail = await fetchJson(`${RXNORM_BASE}/rxcui/${encodeURIComponent(rxcui)}/allProperties.json?prop=names&tty=IN,MIN,SBD,SCD,BN`, signal);
  return {
    rxcui,
    name: detail.propConceptGroup?.propConcept?.[0]?.propValue || trimmed,
    source: 'NLM RxNorm',
    sourceUrl: 'https://rxnav.nlm.nih.gov/'
  };
}

function normalizeEvidenceText(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function containsTerm(text, term) {
  const haystack = normalizeEvidenceText(text);
  const needle = normalizeEvidenceText(term);
  if (!haystack || !needle) return false;
  return haystack.includes(needle);
}

export async function getFdaInteractionEvidence(drugA, drugB, signal) {
  const a = String(drugA || '').trim();
  const b = String(drugB || '').trim();
  if (!a || !b) return { status: 'INSUFFICIENT_EVIDENCE', records: [] };

  const url = new URL(OPENFDA_BASE);
  url.searchParams.set('search', `drug_interactions:(${a})`);
  url.searchParams.set('limit', '25');

  let data;
  try {
    data = await fetchJson(url.toString(), signal);
  } catch (error) {
    if (error instanceof Error && error.message.includes('HTTP 404')) {
      return { status: 'NO_MATCHING_LABEL', records: [] };
    }
    throw error;
  }

  const records = Array.isArray(data.results) ? data.results : [];
  const matches = records.filter(record => {
    const interactionText = Array.isArray(record.drug_interactions)
      ? record.drug_interactions.join(' ')
      : record.drug_interactions;
    return containsTerm(interactionText, b);
  }).slice(0, 5).map(record => ({
    source: 'FDA openFDA Drug Labeling',
    sourceUrl: 'https://open.fda.gov/apis/drug/label/',
    evidence: Array.isArray(record.drug_interactions) ? record.drug_interactions.join(' ') : record.drug_interactions,
    drugName: record.openfda?.generic_name?.[0] || record.openfda?.brand_name?.[0] || a,
    updatedAt: record.effective_time?.[0] || record.effective_time || null,
    setId: record.openfda?.spl_set_id?.[0] || null
  }));

  return {
    status: matches.length ? 'DOCUMENTED_INTERACTION' : 'NO_DOCUMENTED_PAIR_IN_MATCHED_LABELS',
    records: matches
  };
}

export async function searchFindTreatment({ lat, lng, radiusMeters = 50000, codes = [], type, signal }) {
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
    throw new Error('A valid latitude and longitude are required.');
  }

  const url = new URL(FINDTREATMENT_BASE);
  url.searchParams.set('sAddr', `${Number(lat)},${Number(lng)}`);
  url.searchParams.set('limitType', '2');
  url.searchParams.set('limitValue', String(Math.min(Math.max(Number(radiusMeters), 1000), 160934)));
  url.searchParams.set('pageSize', '100');
  url.searchParams.set('page', '1');
  url.searchParams.set('sort', '0');
  if (codes.length) url.searchParams.set('sCodes', codes.join(','));
  if (type) url.searchParams.set('sType', type);

  const data = await fetchJson(url.toString(), signal);
  const rows = Array.isArray(data.data) ? data.data : Array.isArray(data.results) ? data.results : [];
  return {
    records: rows,
    source: 'SAMHSA FindTreatment.gov',
    sourceUrl: 'https://findtreatment.gov/',
    retrievedAt: new Date().toISOString()
  };
}
