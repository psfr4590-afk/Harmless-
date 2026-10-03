import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('static safety content carries formal provenance and avoids universal high-consequence instructions', () => {
  const content = read('src/data/contentGovernance.ts');
  const drugData = read('src/data/drugDatabase.ts');
  const ui = read('src/components/ROASafeUse.tsx');

  assert.match(content, /ContentClaimProvenance/);
  assert.match(content, /publicationOrUpdateDate/);
  assert.match(content, /jurisdiction/);
  assert.match(content, /reviewStatus/);
  assert.match(ui, /Claim provenance/);

  for (const pattern of [
    /ONE line = POSITIVE/i,
    /TWO lines = NEGATIVE/i,
    /YOU MUST test all/i,
    /start with 5-10mg/i,
    /start low \(1-2g\)/i,
    /guaranteed fatal/i,
    /irreversible, fatal/i,
    /call 911/i,
    /\b911\b/i,
    /swallow half first/i,
    /NEVER MIX WITH:/i,
    /YOU MUST use/i
  ]) {
    assert.doesNotMatch(drugData, pattern);
  }
});

test('interaction UI separates evidence state from local educational severity', () => {
  const source = read('src/components/InteractionChecker.tsx');
  assert.match(source, /DOCUMENTED INTERACTION/);
  assert.match(source, /NO PAIR FOUND/);
  assert.match(source, /UPSTREAM UNAVAILABLE/);
  assert.match(source, /LOCAL EDUCATIONAL WARNING/);
  assert.match(source, /not a clinically verified interaction severity result/);
});

test('external request boundary exists and resource/crisis lookups use it', () => {
  const client = read('src/utils/httpClient.ts');
  const resource = read('src/components/ResourceSearch.tsx');
  const hotline = read('src/components/HotlineSearch.tsx');

  assert.match(client, /timeoutMs/);
  assert.match(client, /retries/);
  assert.match(client, /RATE_LIMIT/);
  assert.match(client, /ExternalServiceError/);
  assert.match(resource, /requestJson/);
  assert.match(hotline, /requestJson/);
});

test('privacy boundary registry documents outbound data classes', () => {
  const source = read('src/data/providerGovernance.ts');
  assert.match(source, /dataSent/);
  assert.match(source, /persistenceByApp/);
  assert.match(source, /userActionRequired/);
  assert.match(source, /NLM RxNorm/);
  assert.match(source, /OpenStreetMap Nominatim \/ Overpass/);
  assert.match(source, /The selected image is not uploaded/);
});

test('pill workflow remains local until explicit external imprint lookup', () => {
  const source = read('src/components/PillIdentifier.tsx');
  assert.doesNotMatch(source, /fetch\(/);
  assert.match(source, /URL\.createObjectURL/);
  assert.match(source, /window\.open/);
  assert.match(source, /Visual match is not proof of identity or safety/);
});

test('dependency monitoring and release evidence are present', () => {
  const dependabot = read('.github/dependabot.yml');
  const release = read('.github/workflows/release.yml');
  const script = read('scripts/write-release-evidence.mjs');
  const packageJson = JSON.parse(read('package.json'));

  assert.match(dependabot, /package-ecosystem: npm/);
  assert.match(dependabot, /package-ecosystem: github-actions/);
  assert.match(release, /release-evidence\.json/);
  assert.match(script, /commitSha/);
  assert.match(script, /testCount/);
  assert.match(script, /knownLimitations/);
  assert.equal(packageJson.scripts['release:evidence'], 'node scripts/write-release-evidence.mjs');
});

test('deployment validation matrix records the remaining real-world evidence boundary', () => {
  const doc = read('DEPLOYMENT-VALIDATION.md');
  for (const item of [
    'Android Chrome',
    'Desktop Chrome',
    'Desktop Firefox',
    'GPS allowed',
    'GPS denied',
    'Manual location',
    'Camera permission',
    'Local image upload',
    'API failure / timeout',
    'Empty resource results',
    'U.S. location',
    'Non-U.S. location',
    'PWA installation',
    '/Harmless-/',
    'Offline / poor network',
    'Provider outage / rate limit'
  ]) assert.ok(doc.includes(item), `missing deployment check: ${item}`);
});
