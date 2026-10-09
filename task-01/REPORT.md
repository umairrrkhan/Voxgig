# Developer-experience report

**Author:** Umair Khan  
**Task:** First mini task, Voxgig SDK assessment  
**Date:** 9 October 2026  
**API:** OpenHolidays API  
**License:** MIT for authored SDK work

## Scope and time box

AI assisted with research, setup, scripts, and documentation. No claim is made about the author's personal hands-on time: the assessment asks for a maximum of 30 minutes of human work, which the author should record separately. This submission covers task one only. It does not include an invoice for either task.

I selected a public, read-only API with an official OpenAPI definition and no API key requirement. Catalogue searches for the provider name and host returned no SDK. The similarly named Public Holiday catalogue SDK targets Nager.Date, not OpenHolidays.

## Observations established during setup

The Voxgig website explains a useful pipeline: OpenAPI becomes a semantic model, which generates the SDK and its offline tests. Its agent guide gives concrete scaffold, generate, and verify commands. The GitHub guide specifies Node 24+ and current `.aontu` model files, while the website runbook still shows `.aon` in places. Following the versioned guide prevents that mismatch.

The upstream definition omits a top-level server URL. I preserved the original snapshot and added the documented API base URL in a normalized copy. The project overlay retains the generated SDK root README because the generated quickstart test requires it. These choices are made outside generated SDK source.

The coding environment reported ready but its proxy refused connections, including to npm. That is an environment problem, not evidence of a generator bug. I moved generation and verification to GitHub Actions so the actual generator, compiler, test suite, doctor, and live SDK transport can run with reviewable logs.

## Verification and remaining limits

The first Actions run generated and compiled the SDK, then reported 269 passing tests, 16 skipped tests, and one failed quickstart test: disabling the top generation phase removed the SDK root README that the test unconditionally reads. Restoring that phase fixes the setup mismatch; final verification remains pending. A successful run writes `evidence/verification.json`, links its Actions log, and commits generated source using `umair64066@gmail.com`. It also records six live response checks in `evidence/live.json`. Those files, rather than this draft's wording, establish final execution status.

Generated offline tests check the SDK and its examples. The live smoke test checks the generated direct-call transport against six real endpoints, including query parameters and expected response facts. Entity mapping beyond the generated tests, every date/filter combination, non-JSON output, and production resilience settings are outside this mini-task's scope.

If generation or doctor fails, preserve the workflow failure and report the exact output; do not claim the SDK passed and do not silently patch generated output.

## Feedback for Voxgig

Keep the website runbook's model extensions aligned with the current release. Make missing server URLs and their override mechanism prominent in the quickstart. The separation between model edits and generated code is helpful, and a drift command provides a clear review gate.

The generator warns that BasicStatisticFlow is unreachable because its inferred call does not select an action. That mapping and the skipped tests need review before claiming full endpoint coverage. A generated quickstart test could gracefully handle the documented top-phase-off configuration.

## References

- [Voxgig SDK generator](https://voxgig.com/sdk)
- [Versioned build guide](https://github.com/voxgig/create-sdkgen/blob/main/AGENTS.md)
- [Voxgig catalogue](https://github.com/orgs/voxgig-sdk/repositories)
- [OpenHolidays documentation](https://www.openholidaysapi.org/en/)
- [Official API definition](https://openholidaysapi.org/swagger/v1/swagger.json)
