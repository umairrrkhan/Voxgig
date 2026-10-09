# Task 01: OpenHolidays SDK

An unofficial OpenHolidays API TypeScript SDK generated with [Voxgig SDK Generator](https://voxgig.com/sdk). Author: Umair Khan. MIT license; see [../LICENSE](../LICENSE).

## Submission

- [Developer-experience report](REPORT.md)
- [Generation and verification workflow](../.github/workflows/task-01.yml)
- [Generated SDK](sdk/ts/): created and committed by the workflow after all checks pass.
- [Reproducible generator/model](sdk/.sdk/).
- Machine-readable results: `evidence/verification.json` and `evidence/live.json`.

**Status:** Generation, TypeScript build, generated offline tests, the customization/drift gate, all ten live endpoint checks, invalid-input handling, and fresh-checkout installation passed. See [verification evidence](evidence/verification.json) and its linked Actions log.

## Reproduce

Requires Node.js 24+, npm, curl, and Internet access. No API key or paid account is needed.

```sh
git clone https://github.com/umairrrkhan/Voxgig.git
cd Voxgig
bash task-01/scripts/generate.sh
cd task-01/sdk/ts
npm ci
npm run build
npm test
cd ../.sdk
cd ../../..
node task-01/scripts/doctor.mjs
node task-01/scripts/smoke.mjs
bash task-01/scripts/install-check.sh
```

The first run snapshots the official OpenAPI definition, adds its missing server URL and corrects the statistics object response schemas in a separate normalized copy, and invokes `@voxgig/create-sdkgen@0.30.7`. Subsequent runs use the committed definition and dependency lockfiles. Project choices live in the model; generated TypeScript is not hand-edited.

The live smoke test compares generated entity operations with the SDK's documented `direct` transport across all ten routes, including date-specific holidays and statistics. Statistics return one object and are exposed as `Statistic().load({ country_iso_code: 'DE', $action: 'public_holiday' })`. It also verifies invalid-date errors. Generated entity examples and operation tests live in the generated target's own README and test suite. Offline tests and live tests serve different purposes; passing mocks alone does not establish API compatibility.

## Quick example

After building, save this as `task-01/example.cjs` and run `node task-01/example.cjs`:

```js
const { OpenholidaysSDK } = require('./sdk/ts/dist/OpenholidaysSDK.js');

async function main() {
  const client = new OpenholidaysSDK();
  const holidays = await client.PublicHoliday().list({
    country_iso_code: 'DE',
    language_iso_code: 'EN',
    valid_from: '2026-01-01',
    valid_to: '2026-12-31',
  });
  for (const holiday of holidays) console.log(holiday.data());
}

main().catch(error => { console.error(error); process.exitCode = 1; });
```

## Documented generator customization

The vendored `ReadmeInstall_ts.ts` component is deliberately customized to produce correct installation commands for this nested project. Raw `voxgig-sdkgen doctor` reports that one fork and exits 1. `node task-01/scripts/doctor.mjs` checks its SHA-256 against [the allowlist](doctor-customizations.json), requires exactly that finding, and rejects any other drift. This does not claim an untouched scaffold. Resyncing the target can overwrite the component; restore the documented customization before regeneration.

## API choice and catalogue check

[OpenHolidays](https://www.openholidaysapi.org/en/) provides public and school holiday data. On 9 October 2026, GitHub repository searches scoped to `voxgig-sdk` for `openholidays` and `"openholidaysapi.org"` returned no repositories. A broader holiday search found Nager.Date's `public-holiday-sdk`, which is a different API.

The client's SaaS/free-trial suggestion was optional. This API avoids account provisioning and makes assessment testing reproducible. It is read-only; the SDK does not invent create/update/delete operations.

## Licensing and attribution

The authored SDK project and report are MIT-licensed under Umair Khan's copyright. Preserve [Voxgig's third-party notices](THIRD_PARTY_NOTICES.md) with distributions of generated code. OpenHolidays data and its upstream API definition carry their own ODbL notice; see the [upstream FAQ](https://www.openholidaysapi.org/en/faq/) and the unmodified definition's license field. This repository does not relicense holiday data under MIT. Live evidence records counts, not a copied holiday dataset.

No npm package has been published. Clone and build the source to use it.

