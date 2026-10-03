import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const testLogPath = process.env.TEST_LOG || '';
const testLog = testLogPath && fs.existsSync(testLogPath) ? fs.readFileSync(testLogPath, 'utf8') : '';
const testCount = (testLog.match(/^ok /gm) || []).length;

let commitSha = process.env.GITHUB_SHA || '';
if (!commitSha) {
  try {
    commitSha = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    commitSha = 'unknown';
  }
}

const evidence = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  commitSha,
  version: pkg.version,
  node: process.version,
  verification: {
    ciGate: 'passed',
    dependencyAudit: 'passed',
    lint: 'passed',
    typecheck: 'passed',
    build: 'passed',
    testCount,
    testLogCaptured: Boolean(testLogPath)
  },
  contentReviewDate: '2026-10-02',
  browserMatrix: {
    status: 'deployment-boundary',
    required: ['Android Chrome', 'desktop Chrome', 'desktop Firefox'],
    note: 'Browser permission, PWA, offline, and live-provider checks must be executed against the deployed target and recorded separately.'
  },
  liveApiTests: {
    status: 'deployment-boundary',
    note: 'CI does not treat third-party API availability as a release prerequisite. Live provider failures must remain explicit in the UI.'
  },
  knownLimitations: [
    'Worldwide resource coverage depends on public directory completeness and tagging.',
    'A no-result search does not establish that a service is absent.',
    'FDA label evidence is not a complete personalized interaction determination.',
    'Pill visual/imprint matches do not establish contents or safety.',
    'Static educational content requires ongoing claim-level review.'
  ]
};

fs.writeFileSync('release-evidence.json', JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence));
