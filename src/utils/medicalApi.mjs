const RXNORM_BASE = 'https://rxnav.nlm.nih.gov/REST';
const OPENFDA_BASE = 'https://api.fda.gov/drug/label.json';
const FINDTREATMENT_BASE = 'https://findtreatment.gov/locator/exportsAsJson/v2';
const MEDLINEPLUS_BASE = 'https://wsearch.nlm.nih.gov/ws/query';
const FDA_ENFORCEMENT_BASE = 'https://api.fda.gov/drug/enforcement.json';
const FDA_SHORTAGES_BASE = 'https://api.fda.gov/drug/shortages.json';

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

function escapeFdaSearchTerm(term) {
  return String(term).replace(/[\\"]/g, '\\$&');
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

  const queries = [[a, b], [b, a]];
  const allMatches = [];
  let successfulQueries = 0;
  for (const [sourceDrug, targetDrug] of queries) {
    const url = new URL(OPENFDA_BASE);
    url.searchParams.set('search', `drug_interactions:"${escapeFdaSearchTerm(sourceDrug)}"`);
    url.searchParams.set('limit', '25');
    try {
      const data = await fetchJson(url.toString(), signal);
      successfulQueries += 1;
      const records = Array.isArray(data.results) ? data.results : [];
      allMatches.push(...records.filter(record => {
        const interactionText = Array.isArray(record.drug_interactions) ? record.drug_interactions.join(' ') : record.drug_interactions;
        return containsTerm(interactionText, targetDrug);
      }).map(record => ({
        source: 'FDA openFDA Drug Labeling',
        sourceUrl: 'https://open.fda.gov/apis/drug/label/',
        evidence: Array.isArray(record.drug_interactions) ? record.drug_interactions.join(' ') : record.drug_interactions,
        drugName: record.openfda?.generic_name?.[0] || record.openfda?.brand_name?.[0] || sourceDrug,
        updatedAt: record.effective_time?.[0] || record.effective_time || null,
        setId: record.openfda?.spl_set_id?.[0] || null
      })));
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('HTTP 404'))) {
        if (signal?.aborted) throw error;
      }
    }
  }
  const unique = Array.from(new Map(allMatches.map(item => [item.setId || item.drugName + item.evidence, item])).values()).slice(0, 5);
  if (unique.length) return { status: 'DOCUMENTED_INTERACTION', records: unique };
  if (successfulQueries === 0) return { status: 'UPSTREAM_UNAVAILABLE', records: [] };
  return { status: 'NO_DOCUMENTED_PAIR_IN_MATCHED_LABELS', records: [] };
}
export async function searchMedlinePlus(query, signal) {
  const term = String(query || '').trim();
  if (!term) return { records: [], source: 'NLM MedlinePlus', sourceUrl: 'https://medlineplus.gov/', retrievedAt: new Date().toISOString() };
  const url = new URL(MEDLINEPLUS_BASE);
  url.searchParams.set('db', 'healthTopics');
  url.searchParams.set('term', term);
  url.searchParams.set('retmax', '10');
  url.searchParams.set('rettype', 'brief');
  url.searchParams.set('tool', 'harm-less');
  const response = await fetch(url.toString(), { signal, headers: { Accept: 'application/xml, text/xml' } });
  if (!response.ok) throw new Error(`MedlinePlus returned HTTP ${response.status}`);
  const xml = await response.text();
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('MedlinePlus returned malformed XML.');
  const records = Array.from(doc.querySelectorAll('document')).map(document => ({
    title: document.querySelector('content[name="title"]')?.textContent?.trim() || 'MedlinePlus health topic',
    url: document.querySelector('content[name="url"]')?.textContent?.trim() || null,
    snippet: document.querySelector('content[name="snippet"]')?.textContent?.trim() || '',
    source: 'NLM MedlinePlus'
  })).filter(record => record.url);
  return { records, source: 'NLM MedlinePlus', sourceUrl: 'https://medlineplus.gov/', retrievedAt: new Date().toISOString() };
}
async function searchFdaEndpoint(base, search, signal) {
  const url = new URL(base);
  url.searchParams.set('search', search);
  url.searchParams.set('limit', '10');
  return fetchJson(url.toString(), signal);
}
export async function searchFdaDrugSafety(query, signal) {
  const term = String(query || '').trim();
  if (!term) return { labels: [], recalls: [], shortages: [], source: 'FDA openFDA', sourceUrl: 'https://open.fda.gov/', retrievedAt: new Date().toISOString(), upstream: { labels: true, recalls: true, shortages: true } };
  const escaped = escapeFdaSearchTerm(term);
  const [labelsResult, recallsResult, shortagesResult] = await Promise.allSettled([
    searchFdaEndpoint(OPENFDA_BASE, `openfda.generic_name:"${escaped}" OR openfda.brand_name:"${escaped}"`, signal),
    searchFdaEndpoint(FDA_ENFORCEMENT_BASE, `product_description:"${escaped}"`, signal),
    searchFdaEndpoint(FDA_SHORTAGES_BASE, `generic_name:"${escaped}"`, signal)
  ]);
  const normalize = result => result.status === 'fulfilled' && Array.isArray(result.value.results) ? result.value.results : [];
  const labels = normalize(labelsResult).map(record => ({
    source: 'FDA openFDA Drug Labeling', sourceUrl: 'https://open.fda.gov/apis/drug/label/',
    title: record.openfda?.brand_name?.[0] || record.openfda?.generic_name?.[0] || term,
    effectiveDate: record.effective_time || null, setId: record.openfda?.spl_set_id?.[0] || null,
    warnings: Array.isArray(record.boxed_warning) ? record.boxed_warning.join(' ') : record.boxed_warning || '',
    interactions: Array.isArray(record.drug_interactions) ? record.drug_interactions.join(' ') : record.drug_interactions || ''
  }));
  const recalls = normalize(recallsResult).map(record => ({
    source: 'FDA Drug Enforcement Reports', sourceUrl: 'https://open.fda.gov/apis/drug/enforcement/',
    product: record.product_description || term, reportDate: record.report_date || null,
    reason: record.reason_for_recall || '', status: record.status || ''
  }));
  const shortages = normalize(shortagesResult).map(record => ({
    source: 'FDA Drug Shortages', sourceUrl: 'https://open.fda.gov/apis/drug/drugshortages/',
    product: record.product_name || record.generic_name || term,
    status: record.status || record.update_type || '', updateDate: record.update_date || record.report_date || null
  }));
  return {
    labels: labels.slice(0, 10), recalls: recalls.slice(0, 10), shortages: shortages.slice(0, 10),
    source: 'FDA openFDA', sourceUrl: 'https://open.fda.gov/', retrievedAt: new Date().toISOString(),
    upstream: { labels: labelsResult.status === 'fulfilled', recalls: recallsResult.status === 'fulfilled', shortages: shortagesResult.status === 'fulfilled' }
  };
}
export async function searchFindTreatment({ lat, lng, radiusMeters = 50000, codes = [], type, signal }) {
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng))) {
    throw new Error('A valid latitude and longitude are required.');
  }

  const url = new URL(FINDTREATMENT_BASE);
  url.searchParams.set('sAddr', `${Number(lng)},${Number(lat)}`);
  url.searchParams.set('limitType', '2');
  url.searchParams.set('limitValue', String(Math.min(Math.max(Number(radiusMeters), 1000), 160934)));
  url.searchParams.set('pageSize', '100');
  url.searchParams.set('page', '1');
  url.searchParams.set('sort', '0');
  if (codes.length) url.searchParams.set('sCodes', codes.join(','));
  if (type) url.searchParams.set('sType', type);

  const data = await fetchJson(url.toString(), signal);
  const rows = Array.isArray(data.rows) ? data.rows : Array.isArray(data.data) ? data.data : Array.isArray(data.results) ? data.results : [];
  if (!Array.isArray(rows)) throw new Error('FindTreatment.gov returned an unexpected response shape.');
  return {
    records: rows,
    source: 'SAMHSA FindTreatment.gov',
    sourceUrl: 'https://findtreatment.gov/',
    retrievedAt: new Date().toISOString()
  };
}
