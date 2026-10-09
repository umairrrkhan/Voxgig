import { readFileSync, writeFileSync } from 'node:fs';
const spec = JSON.parse(readFileSync(new URL('../openapi.upstream.json', import.meta.url)));
spec.servers = [{ url: 'https://openholidaysapi.org' }];
for (const path of ['/Statistics/PublicHolidays', '/Statistics/SchoolHolidays']) {
  for (const response of Object.values(spec.paths[path].get.responses)) {
    for (const [media, content] of Object.entries(response.content || {})) {
      if (response === spec.paths[path].get.responses['200'] && content.schema?.type === 'array') {
        content.schema = content.schema.items;
      }
    }
  }
}
writeFileSync(new URL('../openapi.json', import.meta.url), JSON.stringify(spec, null, 2) + '\n');

