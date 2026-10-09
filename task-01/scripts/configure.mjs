import { copyFileSync } from 'node:fs';
copyFileSync(new URL('../project.aontu', import.meta.url), new URL('../sdk/.sdk/model/project.aontu', import.meta.url));

copyFileSync(new URL('../guide.aontu', import.meta.url), new URL('../sdk/.sdk/model/guide/guide.aontu', import.meta.url));
