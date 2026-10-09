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
6. **Mapping limits.** Nested response fields such as localized names are typed `any[]`. The generator also warns that `BasicStatisticFlow` is unreachable without an action selector. The default basic statistics flow needs an action selector. The usable statistics operations are now explicitly mapped to `load` and live-tested with both action selectors.

The local cloud environment's proxy refused connections to npm. This was an environment issue, not a generator defect. Generation and verification ran successfully in GitHub Actions. One intermediate smoke-script failure came from two aliases for the same exported SDK class; deduplicating them fixed the test harness.

The final review found two issues and fixed them at their source:

- The generated install example assumed a root-level `ts/` directory and prebuilt files. A documented customization of `ReadmeInstall_ts.ts` now points to `task-01/sdk/ts` and builds before installation. The drift gate allows only that exact component hash and rejects all other changes.
- The upstream specification describes statistics responses as arrays, but the live API returns one object. The normalized definition corrects the response schemas, and a project-owned guide maps statistics to `load`; the original upstream definition remains unchanged. Regeneration now copies the normalized definition into the generator's input on every run.

## Verification

[Successful Actions run](https://github.com/umairrrkhan/Voxgig/actions/runs/37926756490):

- TypeScript compilation passed.
- Generated suite: **270 passed, 0 failed, 16 skipped**. Skips concern optional features not selected for this SDK, including validation, timeout, retry, and network simulation.
- Customization/drift gate passed: one explicitly documented component customization, no unexpected drift. Raw `doctor` reports the customization; it is not silently ignored.
- **22 live checks passed:** ten direct SDK requests, ten corresponding entity operations, and two invalid-date error checks.
- All ten API routes passed, including date-specific holidays and both statistics endpoints.
- An additional fresh-checkout test passed dependency installation, compilation, local package installation, import, and a real country request.

[Verification metadata](evidence/verification.json) and [live results](evidence/live.json) preserve the run link and counts. The generated-code commit uses `umair64066@gmail.com`.

Non-JSON output, every filter combination, and optional resilience features were not live-tested. A local credential-pattern scan found no matching credentials; this is a limited check, not a security audit. No npm package was published. The SDK/project is MIT-licensed; upstream data and definition retain their own ODbL terms.

## Sources

[Voxgig generator](https://voxgig.com/sdk), [versioned guide](https://github.com/voxgig/create-sdkgen/blob/main/AGENTS.md), [catalogue](https://github.com/orgs/voxgig-sdk/repositories), [API definition](https://openholidaysapi.org/swagger/v1/swagger.json).

