import { writeFileSync } from 'node:fs';
writeFileSync(new URL('../sdk/.sdk/model/project.aontu', import.meta.url), `
# This SDK is part of a task folder, not a standalone catalogue repo.
main: kit: phase: top: active: false
`);
