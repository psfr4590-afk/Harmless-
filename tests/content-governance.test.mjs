import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('high-consequence static content avoids universal dosing, testing, and identity claims', () => {
  const source = read('src/data/drugDatabase.ts');
  const prohibited = [
    /guaranteed fatal/i,
    /irreversible, fatal/i,
    /vast majority.*purely methamphetamine/i,
    /one red line.*positive/i,
    /two red lines.*negative/i,
    /start low \(1-2g\)/i,
    /start with 5-10mg/i,
    /swallow half first/i,
    /wait fully 2\.5 hours/i,
    /15 minutes after dissolving/i
  ];
  for (const pattern of prohibited) assert.doesNotMatch(source, pattern);
  assert.doesNotMatch(source, /call 911/i);
  assert.doesNotMatch(source, /\b911\b/g);
});

test('content governance identifies authoritative evidence boundaries', () => {
  const governance = read('src/data/contentGovernance.ts');
  const ui = read('src/components/ROASafeUse.tsx');
  assert.match(governance, /CONTENT_AUDIT_DATE/);
  assert.match(governance, /CDC_OVERDOSE_PREVENTION/);
  assert.match(governance, /FDA_BUPRENORPHINE_DENTAL/);
  assert.match(governance, /FDA_BENZODIAZEPINE/);
  assert.match(governance, /FDA_POPPERS/);
  assert.match(governance, /CautionRequired|cautionRequired/);
  assert.match(ui, /CONTENT_EVIDENCE_POLICY/);
  assert.match(ui, /Content evidence boundary/);
});

test('static emergency guidance is jurisdiction-neutral', () => {
  const source = read('src/data/drugDatabase.ts');
  assert.doesNotMatch(source, /call 911|CALL 911|\\b911\\b/);
  assert.match(source, /local emergency service/);
});
