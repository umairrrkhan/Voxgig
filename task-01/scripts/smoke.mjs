import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const pkg = JSON.parse(readFileSync(new URL('../sdk/ts/package.json', import.meta.url)));
const sdkModule = await import(pathToFileURL(resolve('task-01/sdk/ts', pkg.main)));
const candidates = Object.entries(sdkModule).filter(([name, value]) => /SDK$/.test(name) && typeof value === 'function');
assert.equal(candidates.length, 1, 'Expected one generated SDK class export');
const client = new candidates[0][1]();
const checks = [
  ['/Countries', {}, rows => rows.some(row => row.isoCode === 'DE')],
  ['/Languages', {}, rows => rows.some(row => row.isoCode === 'EN')],
  ['/Subdivisions', { countryIsoCode: 'DE' }, rows => rows.length > 0],
  ['/Groups', { countryIsoCode: 'BE' }, rows => rows.length > 0],
  ['/PublicHolidays', { countryIsoCode: 'DE', validFrom: '2026-01-01', validTo: '2026-12-31', languageIsoCode: 'EN' }, rows => rows.some(row => row.startDate === '2026-01-01')],
  ['/SchoolHolidays', { countryIsoCode: 'DE', validFrom: '2026-01-01', validTo: '2026-12-31' }, rows => rows.length > 0],
];
const evidence = [];
for (const [path, query, validate] of checks) {
  const result = await client.direct({ path, method: 'GET', query, headers: { accept: 'application/json' } });
  if (result instanceof Error) throw result;
  assert.ok(Array.isArray(result.data), path + ' must return an array');
  assert.ok(validate(result.data), path + ' response failed semantic validation');
  evidence.push({ path, query, count: result.data.length, passed: true });
  console.log('PASS', path, result.data.length, 'records');
}
writeFileSync(new URL('../evidence/live.json', import.meta.url), JSON.stringify({ timestamp: new Date().toISOString(), sdkExport: candidates[0][0], checks: evidence }, null, 2) + '\n');
