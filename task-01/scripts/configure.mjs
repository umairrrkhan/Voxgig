import { writeFileSync } from 'node:fs';
writeFileSync(new URL('../sdk/.sdk/model/project.aontu', import.meta.url), `
# Preserve the SDK README required by generated quickstart tests.
main: kit: phase: top: active: true
`);
