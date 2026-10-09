#!/usr/bin/env bash
set -euo pipefail
review_tmp=$(mktemp -d)
trap 'rm -rf "$review_tmp"' EXIT
git archive HEAD | tar -x -C "$review_tmp"
npm ci --prefix "$review_tmp/task-01/sdk/ts"
npm run build --prefix "$review_tmp/task-01/sdk/ts"
mkdir "$review_tmp/consumer"
(cd "$review_tmp/consumer" && npm init -y >/dev/null && npm install ../task-01/sdk/ts)
(cd "$review_tmp/consumer" && node - <<'JS'
const assert = require('node:assert/strict');
const { OpenholidaysSDK } = require('@umairrrkhan/openholidays-sdk');
(async () => {
  const rows = await new OpenholidaysSDK().Country().list();
  assert.ok(rows.some(row => row.data().isoCode === 'DE'));
  console.log('PASS fresh checkout, local installation, package import, live entity call');
})().catch(error => { console.error(error); process.exitCode = 1; });
JS
)
