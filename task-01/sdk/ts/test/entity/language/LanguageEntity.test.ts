

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


describe('LanguageEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when OPENHOLIDAYS_TEST_LIVE=TRUE.
  afterEach(liveDelay('OPENHOLIDAYS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = OpenholidaysSDK.test()
    const ent = testsdk.Language()
    assert(null != ent)
  })


  class FailHook extends BaseFeature {
    name = 'failhook'
    version = '0.0.1'
    active = true
    unexpected = 0
    init() { }
    PreSpec() { throw new Error('language hook failed') }
    PreUnexpected() { this.unexpected++ }
  }

  test('stream-error', async () => {
    const offline = { net: { offline: true } }
    await assert.rejects(async () => {
      for await (const _item of OpenholidaysSDK.test(offline).Language().stream('list')) { }
    }, /offline/)

    for await (const _item of OpenholidaysSDK.test(offline).Language()
      .stream('list', undefined, { ctrl: { throw: false } })) { }

    if (null != (config as any).feature?.rbac) {
      const denied = OpenholidaysSDK.test(undefined, { feature: { rbac: { active: true, deny: true } } })
      await assert.rejects(async () => {
        for await (const _item of denied.Language().stream('list')) { }
      }, (err: any) => 'rbac_denied' === err.code)
    }
  })

  test('stream-ctrl', async () => {
    const explain: any = {}
    const ctrl: any = { explain }
    for await (const _item of OpenholidaysSDK.test().Language().stream('list', undefined, { ctrl })) { }
    assert.deepStrictEqual(Object.keys(ctrl), ['explain'])
    assert(explain === ctrl.explain && 0 < Object.keys(explain).length)
  })

  test('unexpected', async () => {
    const hook = new FailHook()
    const client = new OpenholidaysSDK({ feature: { test: { active: true } }, extend: [hook] })
    await assert.rejects(client.Language().list(), /hook failed/)
    assert(0 < hook.unexpected)

    const fired = hook.unexpected
    assert.strictEqual(await client.Language().list(undefined, { throw: false }), undefined)
    assert(fired < hook.unexpected)
  })

  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = OpenholidaysSDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Language().list({"language_iso_code":1} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.OPENHOLIDAYS_TEST_LIVE
    for (const op of ['list']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'language.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"isoCode":{"a":true,"h":"Iso Code","n":"isoCode","r":true,"sh":"ISO-639-1 language code","t":"`$STRING`","key$":"isoCode","index$":0},"name":{"a":true,"h":"Name","n":"name","r":true,"sh":"Localized language names","t":"`$ARRAY`","key$":"name","index$":1}},"name":"language","op":{"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /Languages","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"DE","k":"query","n":"language_iso_code","or":"languageIsoCode","r":false,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/Languages","q":{},"r":{},"rs":{"alternatives":[{"kind":"json","media":"text/json"},{"kind":"raw","media":"text/csv"},{"kind":"raw","media":"text/plain"}],"kind":"json","media":"application/json"},"s":[{"lit":"Languages"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"list"}},"relations":{"ancestors":[]},"key$":"language","name__orig":"language","Name":"Language","name_":"language","name-":"language","NAME":"LANGUAGE","index$":2}, {"active":true,"entity":"language","key$":"BasicLanguageFlow","kind":"basic","name":"BasicLanguageFlow","param":{},"step":[{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"language_ref01"}}]}]}, 'Language', {"GET /Languages":{"protocol":"http","parameters":[{"name":"languageIsoCode","in":"query","description":"ISO-639-1 code of a language or empty","schema":{"type":"string"},"example":"DE","index$":0}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let language_ref01_data = Object.values(setup.data.existing.language)[0] as any

    // LIST
    const language_ref01_ent = client.Language()
    const language_ref01_match: any = {}

    const language_ref01_list = (await language_ref01_ent.list(language_ref01_match)).map((e: any) => e.data())


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
      '../../../../.sdk/test/entity/language/LanguageTestData.json')

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
    ['language01','language02','language03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'OPENHOLIDAYS_TEST_LANGUAGE_ENTID': idmap,
    'OPENHOLIDAYS_TEST_LIVE': 'FALSE',
    'OPENHOLIDAYS_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['OPENHOLIDAYS_TEST_LANGUAGE_ENTID']

  const live = 'TRUE' === env.OPENHOLIDAYS_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['OPENHOLIDAYS_TEST_LANGUAGE_ENTID']
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
  
