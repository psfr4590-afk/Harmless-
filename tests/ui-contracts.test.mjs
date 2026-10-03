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

test('resource search broadens food discovery beyond one OSM tag', () => {
  const source = read('src/components/ResourceSearch.tsx');
  assert.match(source, /amenity"="food_bank/);
  assert.match(source, /community food/);
  assert.match(source, /OpenStreetMap Nominatim/);
  assert.match(source, /No records from connected geographic sources/);
});

test('food search exposes worldwide fallback paths instead of implying absence', () => {
  const source = read('src/components/ResourceSearch.tsx');
  assert.match(source, /OpenStreetMap worldwide search/);
  assert.match(source, /findahelpline\.com/);
  assert.doesNotMatch(source, /211texas|feedingtexas/i);
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
  assert.match(source, /not personalized medical advice or a safety clearance/);
  assert.match(source, /FDA recall/);
  assert.match(source, /FDA shortage/);
});

test('resource search has multi-source discovery terms for every user-facing category', () => {
  const source = read('src/components/ResourceSearch.tsx');
  for (const term of [
    'naloxone', 'syringe service', 'emergency shelter', 'food pantry',
    'mental health', 'utility assistance', 'community health clinic',
    'substance use treatment', 'legal aid', 'workforce center',
    'domestic violence', 'youth services'
  ]) {
    assert.match(source, new RegExp(term.replace(/[.*+?^{}()|[\]\\]/g, '\\$&')));
  }
  assert.match(source, /results\.length < 3/);
  assert.match(source, /OpenStreetMap Nominatim/);
});


test('resource discovery is explicitly worldwide and does not hard-code Texas as the only fallback', () => {
  const source = read('src/components/ResourceSearch.tsx');
  assert.match(source, /intended for people anywhere in the world/);
  assert.match(source, /OpenStreetMap worldwide search/);
  assert.match(source, /findahelpline\.com/);
  assert.doesNotMatch(source, /211texas|feedingtexas/i);
});

test('global crisis UI does not present U.S. emergency numbers as universal', () => {
  const source = read('src/components/HotlineSearch.tsx');
  assert.match(source, /does not assume 911, 112, or another single number worldwide/);
  assert.match(source, /findahelpline\.com/);
  assert.doesNotMatch(source, /number: '911'|number: '988'|SAMHSA National Helpline/);
});

test('U.S.-specific legal data is explicitly scoped', () => {
  const source = read('src/components/GoodSamaritanLaws.tsx');
  assert.match(source, /U\.S\. Good Samaritan Law Sources/);
  assert.match(source, /United States state-by-state/);
});


test('coverage governance is surfaced and location access is user initiated', () => {
  const resource = read('src/components/ResourceSearch.tsx');
  const hotline = read('src/components/HotlineSearch.tsx');
  const app = read('src/App.tsx');
  assert.match(app, /CoverageNotice/);
  assert.match(resource, /source-dependent/);
  assert.match(hotline, /does not assume 911, 112/);
  assert.doesNotMatch(resource, /useEffect\(\(\) => \{ requestLocation\(\); \}, \[\]\)/);
  assert.doesNotMatch(hotline, /useEffect\(\(\) => \{ requestLocation\(\); \}, \[\]\)/);
});

test('PWA metadata is relative for project-subpath deployment and version is synchronized', () => {
  const manifest = JSON.parse(read('public/manifest.json'));
  const metadata = JSON.parse(read('metadata.json'));
  const pkg = JSON.parse(read('package.json'));
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  assert.equal(manifest.icons[0].src, './icon.svg');
  assert.equal(metadata.version, pkg.version);
});

test('interaction evidence and availability are distinct UI states', () => {
  const source = read('src/components/InteractionChecker.tsx');
  assert.match(source, /DOCUMENTED INTERACTION/);
  assert.match(source, /UPSTREAM UNAVAILABLE/);
  assert.match(source, /not a universal severity rating/);
});

test('tool labels do not imply capabilities the implementation does not provide', () => {
  const pill = read('src/components/PillIdentifier.tsx');
  const dose = read('src/components/DoseCalculator.tsx');
  assert.match(pill, /Imprint Lookup/);
  assert.match(pill, /Visual match is not proof of identity or safety|Pill identification cannot confirm contents/);
  assert.match(dose, /does not determine or recommend/);
});
