import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('interaction UI exposes an explicit unverified state and evidence source rendering', () => {
  const source = read('src/components/InteractionChecker.tsx');
  assert.match(source, /INSUFFICIENT \/ UNVERIFIED/);
  assert.match(source, /Source: \{item\.source\}/);
  assert.match(source, /Live medical data was unavailable/);
});

test('resource UI maps the documented FindTreatment.gov row schema', () => {
  const source = read('src/components/ResourceSearch.tsx');
  assert.match(source, /row\.name1/);
  assert.match(source, /row\.street1/);
  assert.match(source, /treatment\.records\.map/);
  assert.match(source, /SAMHSA FindTreatment\.gov/);
});

test('legal UI routes users to current jurisdictional source data instead of generic immunity claims', () => {
  const source = read('src/components/GoodSamaritanLaws.tsx');
  assert.match(source, /current NCSL legislative database/);
  assert.match(source, /does not invent or generalize state protections/);
});

test('harm-reduction data exposes category-level source provenance', () => {
  const source = read('src/data/drugDatabase.ts');
  assert.match(source, /const CATEGORY_SOURCES/);
  assert.match(source, /sources: CATEGORY_SOURCES/);
});


test('current trusted evidence UI exposes NLM and FDA source boundaries', () => {
  const source = read('src/components/ROASafeUse.tsx');
  assert.match(source, /Current Trusted Evidence/);
  assert.match(source, /searchMedlinePlus/);
  assert.match(source, /searchFdaDrugSafety/);
  assert.match(source, /not a safety clearance/);
  assert.match(source, /FDA recall/);
  assert.match(source, /FDA shortage/);
});
