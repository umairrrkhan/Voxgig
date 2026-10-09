import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root = new URL('../', import.meta.url);
const expected = JSON.parse(readFileSync(new URL('doctor-customizations.json', root)));
for (const [file, hash] of Object.entries(expected)) {
  const bytes = readFileSync(new URL('sdk/.sdk/' + file, root));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, 'Unexpected customization: ' + file);
}
const result = spawnSync('npx', ['--no-install', 'voxgig-sdkgen', 'doctor'], { cwd: new URL('sdk/.sdk/', root), encoding: 'utf8' });
const output = (result.stdout + result.stderr).replace(/\x1b\[[0-9;]*m/g, '');
process.stdout.write(output);
assert.equal(result.status, 1, 'Doctor must report the single documented customization');
const findings = output.split('\n').filter(line => line.includes('doctor-finding') && /FORKED|EDITED|STALE|MISSING|SUPERSEDED|ORPHAN MODEL|OUTDATED/.test(line));
assert.equal(findings.length, 1, 'Unexpected generator drift');
assert.ok(findings[0].includes('src/cmp/ts/ReadmeInstall_ts.ts') && findings[0].includes('FORKED'), 'Unexpected component drift');
assert.ok(output.includes('1 forked, 0 edited, 0 stale, 0 missing, 0 outdated'), 'Unexpected doctor summary');
writeFileSync(new URL('evidence/doctor.json', root), JSON.stringify({ passed: true, rawDoctorExit: result.status, intentionalCustomizations: Object.keys(expected), unexpectedDrift: 0 }, null, 2) + '\n');
