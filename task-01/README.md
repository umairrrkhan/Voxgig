# Task 01: OpenHolidays SDK

An unofficial OpenHolidays API TypeScript SDK generated with [Voxgig SDK Generator](https://voxgig.com/sdk). Author: Umair Khan. MIT license; see [../LICENSE](../LICENSE).

## Submission

- [Developer-experience report](REPORT.md)
- [Generation and verification workflow](../.github/workflows/task-01.yml)
- Generated SDK: `sdk/ts/` (created and committed by the workflow after all checks pass).
- Reproducible generator/model: `sdk/.sdk/`.
- Machine-readable results: `evidence/verification.json` and `evidence/live.json`.

**Status:** The initial setup is awaiting a successful workflow. The presence of `evidence/verification.json` with `status: passed` is the success gate. Do not treat setup files alone as a completed SDK.

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
npx voxgig-sdkgen doctor
cd ../../../..
node task-01/scripts/smoke.mjs
```

The first run snapshots the official OpenAPI definition, adds its missing server URL in a separate normalized copy, and invokes `@voxgig/create-sdkgen@0.30.7`. Subsequent runs use the committed definition and dependency lockfiles. Project choices live in the model; generated TypeScript is not hand-edited.

The live smoke test uses the generated SDK's documented `direct` transport across countries, languages, subdivisions, groups, public holidays, and school holidays. Generated entity examples and operation tests live in the generated target's own README and test suite. Offline tests and live tests serve different purposes; passing mocks alone does not establish API compatibility.

## API choice and catalogue check

[OpenHolidays](https://www.openholidaysapi.org/en/) provides public and school holiday data. On 9 October 2026, GitHub repository searches scoped to `voxgig-sdk` for `openholidays` and `"openholidaysapi.org"` returned no repositories. A broader holiday search found Nager.Date's `public-holiday-sdk`, which is a different API.

The client's SaaS/free-trial suggestion was optional. This API avoids account provisioning and makes assessment testing reproducible. It is read-only; the SDK does not invent create/update/delete operations.

## Licensing and attribution

The authored SDK project and report are MIT-licensed under Umair Khan's copyright. Preserve notices from Voxgig's generated templates. OpenHolidays data and its upstream API definition carry their own ODbL notice; see the [upstream FAQ](https://www.openholidaysapi.org/en/faq/) and the unmodified definition's license field. This repository does not relicense holiday data under MIT. Live evidence records counts, not a copied holiday dataset.

No npm package has been published. Clone and build the source to use it.
