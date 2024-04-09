import { setExCache, getCache, cacheFunction, removeCache } from '../db/cacheClient'
import { v4 } from 'uuid'

const message = {
  status: '12343',
  data: v4(),
}
const random = v4()

function mockApiRequest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: 12345 })
    }, 500)
  })
}

describe('cache', () => {
  test('set value', async () => {
    expect(await setExCache('key', 60, message)).toBe('OK')
  })
  test('get value', async () => {
    const data = await getCache('key')
    expect(data).toStrictEqual(message)
  })
  test("get key that doesn't Exist", async () => {
    const data = await getCache('invalid')
    expect(data).toStrictEqual(null)
  })
  test('cache a function call', async () => {
    const data = await cacheFunction(mockApiRequest, `test-data${random}`, 60)
    expect(data).toStrictEqual({ data: 12345 })
  })
  test('with cache call', async () => {
    const data = await cacheFunction(mockApiRequest, `test-data${random}`, 60)
    expect(data).toStrictEqual({ data: 12345 })
  })
})
