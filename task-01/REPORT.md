# Developer-experience report

**Author:** Umair Khan  
**Date:** 9 October 2026  
**Task:** First mini task; AI-assisted  
**Result:** MIT-licensed TypeScript SDK generated with Voxgig and verified against the live OpenHolidays API.

## API and approach

I selected [OpenHolidays](https://www.openholidaysapi.org/en/), a public, read-only API with an official OpenAPI definition and no key requirement. On the assessment date, GitHub catalogue searches for `openholidays` and `"openholidaysapi.org"` returned no repositories. The catalogue's Public Holiday SDK uses Nager.Date, a different API. The client's free-trial SaaS suggestion was optional; this choice makes tests easy to reproduce.

The project uses `@voxgig/create-sdkgen@0.30.7`, the TypeScript target, and the offline test feature. It includes the generator, model, dependency lockfiles, original API-definition snapshot, normalized definition, generated SDK, and live smoke tests. Authorship, publisher, package identity, and repository URLs are declared in the project model, without hand-editing generated source.

The work was AI-assisted. Human hands-on time was not measured by the assistant and should not be inferred from CI timestamps. The author's review should stay within the client's 30-minute human-work allowance.

## Observations

1. **Clear pipeline.** The model/SDK split and regeneration commands made the process understandable. Generated documentation examples have their own tests, and `doctor` provides a useful drift check.
2. **Documentation mismatch.** The website agent runbook still uses `.aon` in places; the versioned build guide and current output use `.aontu`. Keeping the quickstart aligned would reduce confusion.
3. **Missing server URL.** The official definition omits `servers`. I retained the original and added the documented base URL to a separate normalized copy.
4. **Top-phase interaction.** Initially disabling root-file generation caused a generated quickstart test to fail with `ENOENT` for the SDK root README. Restoring that phase resolved it. The documented option could be paired with a test guard.
5. **Project identity.** Default output used Voxgig's author and catalogue repository. Model declarations correctly changed these to Umair Khan and this repository; package authorship now survives regeneration.
6. **Mapping limits.** Nested response fields such as localized names are typed `any[]`. The generator also warns that `BasicStatisticFlow` is unreachable without an action selector. Statistics workflows need additional attention before broader claims of coverage.

The local cloud environment's proxy refused connections to npm. This was an environment issue, not a generator defect. Generation and verification ran successfully in GitHub Actions. One intermediate smoke-script failure came from two aliases for the same exported SDK class; deduplicating them fixed the test harness.

## Verification

[Successful Actions run](https://github.com/umairrrkhan/Voxgig/actions/runs/37924189542):

- TypeScript compilation passed.
- Generated suite: **270 passed, 0 failed, 16 skipped**. Skips concern optional features not selected for this SDK, including validation, timeout, retry, and network simulation.
- `doctor`: scaffold matches, no drift.
- **12 live checks passed:** six direct SDK requests and six corresponding entity operations, with semantic assertions and matching counts.
- Endpoints: countries, languages, subdivisions, groups, public holidays, and school holidays.

[Verification metadata](evidence/verification.json) and [live results](evidence/live.json) preserve the run link and counts. The generated-code commit uses `umair64066@gmail.com`.

Statistics, date-specific endpoints, non-JSON output, every filter combination, and optional resilience features were not live-tested. No npm package was published. The SDK/project is MIT-licensed; upstream data and definition retain their own ODbL terms.

## Sources

[Voxgig generator](https://voxgig.com/sdk), [versioned guide](https://github.com/voxgig/create-sdkgen/blob/main/AGENTS.md), [catalogue](https://github.com/orgs/voxgig-sdk/repositories), [API definition](https://openholidaysapi.org/swagger/v1/swagger.json).
