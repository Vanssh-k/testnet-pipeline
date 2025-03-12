import { Redis } from 'ioredis'
import config from '../../config/index.js'
import logger from '../../utils/logger.js'

const client: Redis = new Redis(config.redis_url!)

client.on('error', (err: any) => {
  if (err.code === 'ECONNREFUSED') {
    logger.error('Redis connection refused.')
    client.quit()
  } else {
    logger.error('Redis error:', err)
  }
})

export const setCache = async (key: string, value: any): Promise<string | null> => {
  return await client.set(key, JSON.stringify(value))
}

export const setExCache = async (key: string, seconds: number, value: any): Promise<string | null> => {
  return await client.setex(key, seconds, JSON.stringify(value))
}

export const getCache = async (key: string): Promise<any | null> => {
  if (client.status === 'ready') {
    return await client
      .get(key)
      .then((result: string | null) => {
        return result ? JSON.parse(result) : null
      })
      .catch((err) => {
        return null
      })
  }
  return null
}

export const removeCache = async (key: string): Promise<any | null> => {
  if (client.status === 'ready') {
    return await client
      .del(key)
      .then((result: any) => {
        return result
      })
      .catch(() => {
        return null
      })
  }
  return null
}

export const cacheFunction = async (fn: () => Promise<any>, key: string, seconds: number): Promise<any> => {
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
