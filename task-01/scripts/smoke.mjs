import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../sdk/ts/package.json', import.meta.url)));
const sdkModule = await import(new URL('../sdk/ts/' + pkg.main, import.meta.url));
const candidates = [...new Map(Object.entries(sdkModule).filter(([name, value]) => /SDK$/.test(name) && typeof value === 'function').map(entry => [entry[1], entry])).values()];
assert.equal(candidates.length, 1, 'Expected one generated SDK class export');
const client = new candidates[0][1]();
const checks = [
  ['/Countries', {}, rows => rows.some(row => row.isoCode === 'DE')],
  ['/Languages', {}, rows => rows.some(row => row.isoCode === 'EN')],
  ['/Subdivisions', { countryIsoCode: 'DE' }, rows => rows.length > 0],
  ['/Groups', { countryIsoCode: 'BE' }, rows => rows.length > 0],
  ['/PublicHolidays', { countryIsoCode: 'DE', validFrom: '2026-01-01', validTo: '2026-12-31', languageIsoCode: 'EN' }, rows => rows.some(row => row.startDate === '2026-01-01')],
  ['/SchoolHolidays', { countryIsoCode: 'DE', validFrom: '2026-01-01', validTo: '2026-12-31' }, rows => rows.length > 0],
  ['/PublicHolidaysByDate', { date: '2026-01-01', languageIsoCode: 'EN' }, rows => rows.length > 0],
  ['/SchoolHolidaysByDate', { date: '2026-01-05', languageIsoCode: 'EN' }, rows => rows.length > 0],
  ['/Statistics/PublicHolidays', { countryIsoCode: 'DE' }, rows => rows.some(row => typeof row.oldestStartDate === 'string')],
  ['/Statistics/SchoolHolidays', { countryIsoCode: 'DE' }, rows => rows.some(row => typeof row.youngestStartDate === 'string')],
];
const evidence = [];
const entityNames = ['Country', 'Language', 'Subdivision', 'Group', 'PublicHoliday', 'SchoolHoliday', 'PublicHolidaysByDate', 'SchoolHolidaysByDate', 'Statistic', 'Statistic'];
for (const [path, query, validate] of checks) {
  const result = await client.direct({ path, method: 'GET', query, headers: { accept: 'application/json' } });
  if (result instanceof Error) throw result;
  assert.equal(result.ok, true, path + ' request must succeed');
  assert.equal(result.status, 200, path + ' must return HTTP 200');
  const statistics = path.startsWith('/Statistics/');
  if (statistics) assert.ok(result.data && !Array.isArray(result.data), path + ' must return an object');
  else assert.ok(Array.isArray(result.data), path + ' must return an array');
  const directRows = statistics ? [result.data] : result.data;
  assert.ok(validate(directRows), path + ' response failed semantic validation');
  const entityName = entityNames[evidence.length];
  const match = Object.fromEntries(Object.entries(query).map(([key, value]) => [key.replace(/[A-Z]/g, letter => '_' + letter.toLowerCase()), value]));
  if (path.startsWith('/Statistics/')) match.$action = path.endsWith('/PublicHolidays') ? 'public_holiday' : 'school_holiday';
  const operation = statistics ? 'load' : 'list';
  const response = await client[entityName]()[operation](match);
  if (!statistics) assert.ok(Array.isArray(response), entityName + ' list must return an array');
  const entities = statistics ? [response] : response;
  const rows = entities.map(entity => entity.data());
  assert.ok(validate(rows), entityName + ' entity response failed semantic validation');
  assert.equal(rows.length, directRows.length, entityName + ' must agree with the direct call');
  evidence.push({ path, query, entity: entityName, operation, count: rows.length, directPassed: true, entityPassed: true, passed: true });
  console.log('PASS', path, directRows.length, 'records');
}
const badQuery = { countryIsoCode: 'DE', validFrom: 'invalid', validTo: '2026-12-31' };
const badResult = await client.direct({ path: '/PublicHolidays', method: 'GET', query: badQuery });
assert.equal(badResult.ok, false);
assert.equal(badResult.status, 400);
await assert.rejects(() => client.PublicHoliday().list({ country_iso_code: 'DE', valid_from: 'invalid', valid_to: '2026-12-31' }));
console.log('PASS invalid date: direct HTTP 400 and entity rejection');
writeFileSync(new URL('../evidence/live.json', import.meta.url), JSON.stringify({ timestamp: new Date().toISOString(), sdkExport: candidates[0][0], checks: evidence, negativeChecks: 2 }, null, 2) + '\n');

