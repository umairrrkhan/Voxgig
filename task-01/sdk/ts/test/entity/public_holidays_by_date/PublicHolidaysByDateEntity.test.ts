

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { OpenholidaysSDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('PublicHolidaysByDateEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when OPENHOLIDAYS_TEST_LIVE=TRUE.
  afterEach(liveDelay('OPENHOLIDAYS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = OpenholidaysSDK.test()
    const ent = testsdk.PublicHolidaysByDate()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('public_holidays_by_date hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of OpenholidaysSDK.test(offline).PublicHolidaysByDate().stream('list')) { }
    }, /offline/)

    for await (const _item of OpenholidaysSDK.test(offline).PublicHolidaysByDate()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = OpenholidaysSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.PublicHolidaysByDate().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of OpenholidaysSDK.test().PublicHolidaysByDate().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new OpenholidaysSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.PublicHolidaysByDate().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.PublicHolidaysByDate().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = OpenholidaysSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.PublicHolidaysByDate().list({"date":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.OPENHOLIDAYS_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'public_holidays_by_date.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"comment":{"a":true,"h":"Comment","n":"comment","r":false,"sh":"Additional localized comments","t":"`$ARRAY`","key$":"comment","index$":0},"country":{"a":true,"h":"Country","n":"country","r":true,"ro":true,"sh":"Representation of a country reference","t":"`$OBJECT`","key$":"country","index$":1},"groups":{"a":true,"h":"Groups","n":"groups","r":false,"sh":"List of group references","t":"`$ARRAY`","key$":"groups","index$":2},"id":{"a":true,"fo":"uuid","h":"Id","n":"id","r":true,"sh":"Unique holiday id","t":"`$STRING`","key$":"id","index$":3},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"Localized names of the holiday","t":"`$ARRAY`","key$":"name","index$":4},"nationwide":{"a":true,"h":"Nationwide","n":"nationwide","r":true,"sh":"Is the holiday nationwide?","t":"`$BOOLEAN`","key$":"nationwide","index$":5},"regionalScope":{"a":true,"h":"Regional Scope","n":"regionalScope","r":false,"ro":true,"sh":"Regional scope of a holdiay","t":"`$STRING`","key$":"regionalScope","index$":6},"subdivisions":{"a":true,"h":"Subdivisions","n":"subdivisions","r":false,"sh":"List of subdivision references","t":"`$ARRAY`","key$":"subdivisions","index$":7},"tags":{"a":true,"h":"Tags","n":"tags","r":false,"sh":"Additional holday tags","t":"`$ARRAY`","key$":"tags","index$":8},"temporalScope":{"a":true,"h":"Temporal Scope","n":"temporalScope","r":false,"ro":true,"sh":"Temporal scope of a holdiay","t":"`$STRING`","key$":"temporalScope","index$":9},"type":{"a":true,"h":"Type","n":"type","r":true,"ro":true,"sh":"Type of holiday","t":"`$STRING`","key$":"type","index$":10}},"id":{"field":"id","name":"id"},"name":"public_holidays_by_date","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /PublicHolidaysByDate","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"2023-12-25","k":"query","n":"date","or":"date","r":true,"t":"`$STRING`","index$":0},{"a":true,"ex":"DE","k":"query","n":"language_iso_code","or":"languageIsoCode","r":false,"t":"`$STRING`","index$":1}]},"k":"http","m":"GET","o":"/PublicHolidaysByDate","q":{"exist":["date"]},"r":{},"rs":{"alternatives":[{"kind":"json","media":"text/json"},{"kind":"raw","media":"text/csv"},{"kind":"raw","media":"text/plain"}],"kind":"json","media":"application/json"},"s":[{"lit":"PublicHolidaysByDate"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"public_holidays_by_date","name__orig":"public_holidays_by_date","Name":"PublicHolidaysByDate","name_":"public_holidays_by_date","name-":"public-holidays-by-date","NAME":"PUBLIC_HOLIDAYS_BY_DATE","index$":4}, {"active":true,"entity":"public_holidays_by_date","key$":"BasicPublicHolidaysByDateFlow","kind":"basic","name":"BasicPublicHolidaysByDateFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"public_holidays_by_date_ref01"}}]}]}, 'PublicHolidaysByDate', {"GET /PublicHolidaysByDate":{"protocol":"http","parameters":[{"name":"date","in":"query","description":"Date of interest","required":true,"schema":{"type":"string","format":"date"},"example":"2023-12-25","index$":0},{"name":"languageIsoCode","in":"query","description":"ISO-639-1 code of a language or empty","schema":{"type":"string"},"example":"DE","index$":1}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let public_holidays_by_date_ref01_data = Object.values(setup.data.existing.public_holidays_by_date)[0] as any

    // LIST
    const public_holidays_by_date_ref01_ent = client.PublicHolidaysByDate()
    const public_holidays_by_date_ref01_match: any = {}

    const public_holidays_by_date_ref01_list = (await public_holidays_by_date_ref01_ent.list(public_holidays_by_date_ref01_match)).map((e: any) => e.data())


  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/public_holidays_by_date/PublicHolidaysByDateTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = OpenholidaysSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['public_holidays_by_date01','public_holidays_by_date02','public_holidays_by_date03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'OPENHOLIDAYS_TEST_PUBLIC_HOLIDAYS_BY_DATE_ENTID': idmap,
    'OPENHOLIDAYS_TEST_LIVE': 'FALSE',
    'OPENHOLIDAYS_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['OPENHOLIDAYS_TEST_PUBLIC_HOLIDAYS_BY_DATE_ENTID']

  const live = 'TRUE' === env.OPENHOLIDAYS_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['OPENHOLIDAYS_TEST_PUBLIC_HOLIDAYS_BY_DATE_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new OpenholidaysSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.OPENHOLIDAYS_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
