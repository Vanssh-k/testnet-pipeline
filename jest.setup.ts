import { jest } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import config from './src/config/index.js'

// Manage Jest global setup in a single file. This file is automatically loaded by Jest before running any test.

type RedisStore = {
  [key: string]: { value: string; expiresAt?: number }
}

const store: RedisStore = {}

class Redis {
  status = 'ready'

  constructor() {
    this.status = 'ready'
  }

  set(key: string, value: string) {
    store[key] = { value }
    return Promise.resolve('OK')
  }

  setex(key: string, seconds: number, value: string) {
    const expiresAt = Date.now() + seconds * 1000
    store[key] = { value, expiresAt }
    return Promise.resolve('OK')
  }

  get(key: string) {
    const entry = store[key]
    if (!entry) return Promise.resolve(null)
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      delete store[key]
      return Promise.resolve(null)
    }
    return Promise.resolve(entry.value)
  }

  del(...keys: string[]) {
    let deletedCount = 0
    keys.forEach((key) => {
      if (store[key]) {
        delete store[key]
        deletedCount++
      }
    })
    return Promise.resolve(deletedCount)
  }

  mget(...keys: string[]) {
    return Promise.resolve(keys.map((key) => (store[key] ? store[key].value : null)))
  }

  mset(...args: string[]) {
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i]
      const value = args[i + 1]
      store[key] = { value }
    }
    return Promise.resolve('OK')
  }

  incr(key: string) {
    if (!store[key]) {
      store[key] = { value: '1' }
    } else {
      const value = parseInt(store[key].value, 10) + 1
      store[key].value = value.toString()
    }
    return Promise.resolve(parseInt(store[key].value, 10))
  }

  quit() {
    this.status = 'end'
    return Promise.resolve('OK')
  }

  on(event: string, callback: (err: any) => void) {
    // Simulate Redis events, e.g., "error"
    if (event === 'error') {
      callback(new Error('Mock Redis error'))
    }
  }
}

beforeAll(() => {
  jest.setMock('ioredis', { Redis })
})

// Mock the rateLimiterMiddleware globally
jest.mock('./src/middlewares/rate-limiter.js', () => {
  return jest.fn((req: Request, res: Response, next: NextFunction) => {
    next()
  })
})
