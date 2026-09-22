import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalPair, safeExternalUrl, dedupeById, buildOverpassQuery, calculateVolumetricDose, extractOverpassElements } from '../src/utils/safetyUtils.mjs';
import { checkInteraction } from '../src/utils/interactionMatrix.mjs';

test('interaction lookup is order-independent', () => {
  assert.equal(checkInteraction('Opioids', 'Alcohol').severity, 'FATAL');
  assert.equal(checkInteraction('Alcohol', 'Opioids').severity, 'FATAL');
  assert.equal(canonicalPair('Opioids', 'Alcohol'), canonicalPair('Alcohol', 'Opioids'));
});

test('same-substance selection is not reported as low risk', () => {
  assert.equal(checkInteraction('Opioids', 'Opioids').severity, 'SAME_SUBSTANCE');
});

test('unknown interaction is explicitly not treated as safe', () => {
  const result = checkInteraction('Cocaine', 'SSRI Antidepressants');
  assert.equal(result.severity, 'UNKNOWN');
  assert.match(result.description, /not safe/i);
});

test('external URL validation permits http/https and rejects unsafe schemes', () => {
  assert.equal(safeExternalUrl('https://example.org/'), 'https://example.org/');
  assert.equal(safeExternalUrl('http://example.org/path'), 'http://example.org/path');
  assert.equal(safeExternalUrl('javascript:alert(1)'), null);
  assert.equal(safeExternalUrl('data:text/html,hello'), null);
});

test('OSM results are deduplicated by stable id', () => {
  const results = [{ id: 'osm-node-1' }, { id: 'osm-node-1' }, { id: 'osm-way-2' }];
  assert.deepEqual(dedupeById(results), [{ id: 'osm-node-1' }, { id: 'osm-way-2' }]);
});

test('Overpass query preserves regex backslashes and coordinates', () => {
  const query = buildOverpassQuery(['["name"~"\\bNA\\b|\\bAA\\b",i]'], 32.1, -96.2);
  assert.ok(query.includes('\\bNA\\b'));
  assert.match(query, /32\.1,-96\.2/);
});

test('volumetric calculation returns expected concentration and volume', () => {
  const result = calculateVolumetricDose(100, 10, 5);
  assert.equal(result.concentration, 10);
  assert.equal(result.requiredVolume, 0.5);
});

test('volumetric calculation rejects non-positive inputs', () => {
  assert.deepEqual(calculateVolumetricDose(0, 10, 5), { concentration: 0, requiredVolume: 0 });
  assert.deepEqual(calculateVolumetricDose(100, -10, 5), { concentration: 0, requiredVolume: 0 });
});

test('malformed Overpass responses are rejected by the parser', () => {
  assert.deepEqual(extractOverpassElements({ elements: [] }), []);
  assert.equal(extractOverpassElements({ elements: {} }), null);
  assert.equal(extractOverpassElements(null), null);
});

test('FDA interaction search terms escape only FDA query syntax characters', async () => {
  const originalFetch = globalThis.fetch;
  const queries = [];
  globalThis.fetch = async (url) => {
    const parsed = new URL(String(url));
    queries.push(parsed.searchParams.get('search'));
    return new Response(JSON.stringify({ results: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
  };

  try {
    const { getFdaInteractionEvidence } = await import('../src/utils/medicalApi.mjs?fda-escape-test=1');
    const result = await getFdaInteractionEvidence('fentanyl', 'alcohol');
    assert.equal(result.status, 'NO_DOCUMENTED_PAIR_IN_MATCHED_LABELS');
    assert.deepEqual(queries, [
      'drug_interactions:"fentanyl"',
      'drug_interactions:"alcohol"'
    ]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('live API adapters normalize RxNorm and FindTreatment response shapes', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).includes('/rxcui.json')) {
      return new Response(JSON.stringify({ idGroup: { rxnormId: ['12345'] } }), { status: 200, headers: { 'content-type': 'application/json' } });
    }
    if (String(url).includes('/rxcui/12345/allProperties.json')) {
      return new Response(JSON.stringify({ propConceptGroup: { propConcept: [{ propValue: 'Fentanyl' }] } }), { status: 200, headers: { 'content-type': 'application/json' } });
    }
    if (String(url).includes('findtreatment.gov/locator/exportsAsJson')) {
      assert.match(String(url), /sAddr=-96\.2%2C32\.9/);
      return new Response(JSON.stringify({ page: 1, totalPages: 1, recordCount: 1, rows: [{ name1: 'Example', name2: 'Treatment Center', street1: '1 Main St', city: 'Testville', state: 'TX', zip: '75000', phone: '555-0100', latitude: '32.91', longitude: '-96.21', type_facility: 'SA' }] }), { status: 200, headers: { 'content-type': 'application/json' } });
    }
    throw new Error('unexpected test URL');
  };

  try {
    const { resolveRxNormName, searchFindTreatment } = await import('../src/utils/medicalApi.mjs?test=1');
    const resolved = await resolveRxNormName('fentanyl');
    assert.equal(resolved.rxcui, '12345');
    assert.equal(resolved.name, 'Fentanyl');

    const facilities = await searchFindTreatment({ lat: 32.9, lng: -96.2, type: 'SA' });
    assert.equal(facilities.records.length, 1);
    assert.equal(facilities.records[0].name1, 'Example');
    assert.equal(facilities.source, 'SAMHSA FindTreatment.gov');
    assert.ok(calls.some(url => url.includes('sType=SA')));
  } finally {
    globalThis.fetch = originalFetch;
  }
});


test('MedlinePlus adapter parses authoritative topic records and preserves retrieval metadata', async () => {
  const originalFetch = globalThis.fetch;
  const originalDOMParser = globalThis.DOMParser;
  globalThis.fetch = async url => {
    assert.match(String(url), /wsearch\.nlm\.nih\.gov\/ws\/query/);
    return new Response('<?xml version="1.0"?><nlmSearchResult><list><document><content name="title">Naloxone</content><content name="url">https://medlineplus.gov/naloxone.html</content><content name="snippet">Naloxone information</content></document></list></nlmSearchResult>', { status: 200 });
  };
  globalThis.DOMParser = class {
    parseFromString() {
      return {
        querySelector: selector => selector === 'parsererror' ? null : null,
        querySelectorAll: selector => selector === 'document' ? [{
          querySelector: name => ({
            'content[name="title"]': { textContent: 'Naloxone' },
            'content[name="url"]': { textContent: 'https://medlineplus.gov/naloxone.html' },
            'content[name="snippet"]': { textContent: 'Naloxone information' }
          }[name] || null)
        }] : []
      };
    }
  };
  try {
    const { searchMedlinePlus } = await import('../src/utils/medicalApi.mjs?medlineplus-test=1');
    const result = await searchMedlinePlus('naloxone');
    assert.equal(result.records[0].title, 'Naloxone');
    assert.equal(result.records[0].source, 'NLM MedlinePlus');
    assert.match(result.records[0].url, /^https:\/\//);
    assert.ok(result.retrievedAt);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.DOMParser = originalDOMParser;
  }
});

test('FDA safety adapter separates labels, recalls, and shortages without turning missing data into reassurance', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async url => {
    const value = String(url);
    calls.push(value);
    if (value.includes('/drug/label.json')) {
      return new Response(JSON.stringify({ results: [{ openfda: { generic_name: ['fentanyl'], spl_set_id: ['set-1'] }, effective_time: '20260911', boxed_warning: ['Warning text'], drug_interactions: ['Do not combine with alcohol.'] }] }), { status: 200 });
    }
    if (value.includes('/drug/enforcement.json')) {
      return new Response(JSON.stringify({ results: [{ product_description: 'Fentanyl product', report_date: '20260912', reason_for_recall: 'Recall reason', status: 'Ongoing' }] }), { status: 200 });
    }
    if (value.includes('/drug/shortages.json')) {
      return new Response(JSON.stringify({ results: [{ generic_name: 'fentanyl', status: 'Current', update_date: '20260913' }] }), { status: 200 });
    }
    throw new Error('unexpected FDA test URL');
  };
  try {
    const { searchFdaDrugSafety } = await import('../src/utils/medicalApi.mjs?fda-safety-test=1');
    const result = await searchFdaDrugSafety('fentanyl');
    assert.equal(result.labels.length, 1);
    assert.equal(result.recalls.length, 1);
    assert.equal(result.shortages.length, 1);
    assert.equal(result.labels[0].effectiveDate, '20260911');
    assert.equal(result.recalls[0].reportDate, '20260912');
    assert.equal(result.shortages[0].updateDate, '20260913');
    assert.deepEqual(result.upstream, { labels: true, recalls: true, shortages: true });
    assert.equal(calls.length, 3);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('FDA safety adapter reports partial upstream failure instead of inventing a complete result', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async url => {
    const value = String(url);
    if (value.includes('/drug/label.json')) return new Response(JSON.stringify({ results: [] }), { status: 200 });
    if (value.includes('/drug/enforcement.json')) throw new Error('service unavailable');
    if (value.includes('/drug/shortages.json')) return new Response(JSON.stringify({ results: [] }), { status: 200 });
    throw new Error('unexpected FDA test URL');
  };
  try {
    const { searchFdaDrugSafety } = await import('../src/utils/medicalApi.mjs?fda-partial-test=1');
    const result = await searchFdaDrugSafety('fentanyl');
    assert.equal(result.upstream.recalls, false);
    assert.equal(result.upstream.labels, true);
    assert.equal(result.upstream.shortages, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});


test('FDA query escaping regression keeps punctuation semantics intact', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(String(url));
    return new Response(JSON.stringify({ results: [] }), { status: 200 });
  };
  try {
    const { searchFdaDrugSafety } = await import('../src/utils/medicalApi.mjs?escape-regression=1');
    await searchFdaDrugSafety('drug"\\name');
    const search = new URL(calls[0]).searchParams.get('search');
    assert.equal(search, 'openfda.generic_name:"drug\\"\\\\name" OR openfda.brand_name:"drug\\"\\\\name"');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
