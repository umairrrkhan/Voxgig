
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { OpenholidaysSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = OpenholidaysSDK.test()
    equal(testsdk instanceof OpenholidaysSDK, true,
      'OpenholidaysSDK.test() must return a client synchronously')
  })

})
