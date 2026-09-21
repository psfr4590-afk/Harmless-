import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalPair, safeExternalUrl, dedupeById, buildOverpassQuery, calculateVolumetricDose } from '../src/utils/safetyUtils.mjs';
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
  assert.match(query, /\\bNA\\b/);
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
