#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p evidence
if [[ ! -f openapi.upstream.json ]]; then
  curl --fail --silent --show-error --retry 2 --max-time 60 \
    https://openholidaysapi.org/swagger/v1/swagger.json -o openapi.upstream.json
fi
node scripts/normalize.mjs
if [[ ! -f sdk/.sdk/package.json ]]; then
  npx --yes @voxgig/create-sdkgen@0.30.7 openholidays \
    -d "$PWD/openapi.json" -o "$PWD/sdk" -t ts -f test
else
  (cd sdk/.sdk && npm ci)
fi
node scripts/configure.mjs
(cd sdk/.sdk && npm run generate)
(cd sdk/ts && npm install --package-lock-only)
