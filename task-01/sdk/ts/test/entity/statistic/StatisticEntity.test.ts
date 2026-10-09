

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


describe('StatisticEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when OPENHOLIDAYS_TEST_LIVE=TRUE.
  afterEach(liveDelay('OPENHOLIDAYS_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = OpenholidaysSDK.test()
    const ent = testsdk.Statistic()
    assert(null != ent)
  })




  test('basic', async (t) => {

    const live = 'TRUE' === process.env.OPENHOLIDAYS_TEST_LIVE
    for (const op of []) {
      if (!live && maybeSkipControl(t, 'entityOp', 'statistic.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{},"name":"statistic","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /Statistics/PublicHolidays","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"DE","k":"query","n":"country_iso_code","or":"countryIsoCode","r":true,"t":"`$STRING`","index$":0},{"a":true,"ex":"DE-BE","k":"query","n":"subdivision_code","or":"subdivisionCode","r":false,"t":"`$STRING`","index$":1}]},"k":"http","m":"GET","o":"/Statistics/PublicHolidays","q":{"$action":"public_holiday","exist":["country_iso_code"]},"r":{},"rs":{"alternatives":[{"kind":"json","media":"text/json"},{"kind":"raw","media":"text/plain"}],"kind":"json","media":"application/json"},"s":[{"lit":"Statistics"},{"lit":"PublicHolidays"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0},{"a":true,"co":{"id":"GET /Statistics/SchoolHolidays","source":"openapi3","version":2},"g":{"query":[{"a":true,"ex":"DE","k":"query","n":"country_iso_code","or":"countryIsoCode","r":true,"t":"`$STRING`","index$":0},{"a":true,"k":"query","n":"group_code","or":"groupCode","r":false,"t":"`$STRING`","index$":1},{"a":true,"ex":"DE-BE","k":"query","n":"subdivision_code","or":"subdivisionCode","r":false,"t":"`$STRING`","index$":2}]},"k":"http","m":"GET","o":"/Statistics/SchoolHolidays","q":{"$action":"school_holiday","exist":["country_iso_code"]},"r":{},"rs":{"alternatives":[{"kind":"json","media":"text/json"},{"kind":"raw","media":"text/plain"}],"kind":"json","media":"application/json"},"s":[{"lit":"Statistics"},{"lit":"SchoolHolidays"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"load"}},"relations":{"ancestors":[]},"key$":"statistic","name__orig":"statistic","Name":"Statistic","name_":"statistic","name-":"statistic","NAME":"STATISTIC","index$":7}, {"active":true,"entity":"statistic","key$":"BasicStatisticFlow","kind":"basic","name":"BasicStatisticFlow","param":{},"step":[{"a":false,"d":{},"i":{"ref":"statistic_ref01","srcdatavar":"statistic_ref01_data","suffix":"_dt0"},"m":{},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-statistic_ref01"}}],"unreachable":true}]}, 'Statistic', {"GET /Statistics/PublicHolidays":{"protocol":"http","parameters":[{"name":"countryIsoCode","in":"query","description":"ISO 3166-1 code of the country","required":true,"schema":{"type":"string"},"example":"DE","index$":0},{"name":"subdivisionCode","in":"query","description":"Code of the subdivision or empty","schema":{"type":"string"},"example":"DE-BE","index$":1}]},"GET /Statistics/SchoolHolidays":{"protocol":"http","parameters":[{"name":"countryIsoCode","in":"query","description":"ISO 3166-1 code of the country","required":true,"schema":{"type":"string"},"example":"DE","index$":0},{"name":"subdivisionCode","in":"query","description":"Code of the subdivision or empty","schema":{"type":"string"},"example":"DE-BE","index$":1},{"name":"groupCode","in":"query","description":"Code of the holiday group or empty","schema":{"type":"string"},"index$":2}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let statistic_ref01_data = Object.values(setup.data.existing.statistic)[0] as any

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
      '../../../../.sdk/test/entity/statistic/StatisticTestData.json')

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
    ['statistic01','statistic02','statistic03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'OPENHOLIDAYS_TEST_STATISTIC_ENTID': idmap,
    'OPENHOLIDAYS_TEST_LIVE': 'FALSE',
    'OPENHOLIDAYS_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['OPENHOLIDAYS_TEST_STATISTIC_ENTID']

  const live = 'TRUE' === env.OPENHOLIDAYS_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['OPENHOLIDAYS_TEST_STATISTIC_ENTID']
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
  
