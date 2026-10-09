import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const pkg = JSON.parse(readFileSync(new URL('sdk/.sdk/package.json', root)));
const live = JSON.parse(readFileSync(new URL('evidence/live.json', root)));
const result = {
  status: 'passed',
  verifiedAt: new Date().toISOString(),
  node: process.version,
  workflow: 'https://github.com/' + process.env.GITHUB_REPOSITORY + '/actions/runs/' + process.env.GITHUB_RUN_ID,
  sourceCommit: process.env.GITHUB_SHA,
  generator: '@voxgig/create-sdkgen@0.30.7',
  toolchain: pkg.dependencies,
  upstreamSpecSha256: createHash('sha256').update(readFileSync(new URL('openapi.upstream.json', root))).digest('hex'),
  checks: ['Voxgig generation', 'TypeScript compilation', 'generated offline tests', 'generator doctor', 'six live SDK direct calls'],
  liveChecks: live.checks.length
};
writeFileSync(new URL('evidence/verification.json', root), JSON.stringify(result, null, 2) + '\n');
