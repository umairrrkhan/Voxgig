import { readFileSync, writeFileSync } from 'node:fs';
const spec = JSON.parse(readFileSync(new URL('../openapi.upstream.json', import.meta.url)));
spec.servers = [{ url: 'https://openholidaysapi.org' }];
writeFileSync(new URL('../openapi.json', import.meta.url), JSON.stringify(spec, null, 2) + '\n');
