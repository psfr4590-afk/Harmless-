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
