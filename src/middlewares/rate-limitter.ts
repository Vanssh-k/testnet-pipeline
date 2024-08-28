import { Redis } from 'ioredis'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger.js'
import config from '../config/index.js'

const _redisClient = new Redis(config.redis_url!, {
  enableOfflineQueue: false,
  retryStrategy(times: number): number | null {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

_redisClient.on('error', (err: Error) => {
  logger.error('Redis error:', err)
})

const rateLimiterOpts = {
  storeClient: _redisClient,
  points: 300, // Number of allowed requests
  duration: 60, // Per seconds by IP
  blockDuration: 1, // Block for 1 minutes if points consumed
  keyPrefix: 'rlimit:ip:', // Unique key prefix for different rate limiters
}

const _rateLimiter = new RateLimiterRedis(rateLimiterOpts)

export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const unique_address = req.ip ?? 'unknown'
  _rateLimiter
    .consume(unique_address)
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(429).send('Too Many Requests')
    })
}
