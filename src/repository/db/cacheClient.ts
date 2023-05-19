import redis from 'ioredis'

const client = redis.createClient()

client.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.error('Redis connection refused')
    client.quit()
    // handle the error as needed
  } else {
    console.error('Redis error:', err)
  }
})

export const setCache = async (key: string, value: any) => {
  return client.set(key, JSON.stringify(value))
}

export const setExCache = async (key: string, seconds: number, value: any) => {
  return client.setex(key, seconds, JSON.stringify(value))
}

export const getCache = async (key: string) => {
  if (client.status === 'ready') {
    return client
      .get(key)
      .then((result: any) => {
        return JSON.parse(result)
      })
      .catch((err) => {
        console.error(err)
        return null
      })
  }
  return null
}

export const removeCache = async (key: any) => {
  if (client.status === 'ready') {
    return client
      .del(key)
      .then((result: any) => {
        return JSON.parse(result)
      })
      .catch(() => {
        return null
      })
  }
  return null
}

export const cacheFunction = async (fn: any, key: string, seconds: number) => {
  if (client.status === 'ready') {
    const data = await getCache(key)
    if (data) {
      return data
    }
  }
  const data = await fn()
  if (client.status === 'ready') {
    await setExCache(key, seconds, data)
  }
  return data
}

export const clearCacheStartsWith = async (keyword: string) => {
  if (client.status === 'ready') {
    let cursor = '0'
    do {
      // eslint-disable-next-line no-await-in-loop
      const [nextCursor, keys] = await client.scan(
        cursor,
        'MATCH',
        `${keyword}*`
      )
      cursor = nextCursor
      if (keys.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await client.del(keys)
      }
    } while (cursor !== '0')
  }
  return null
}
