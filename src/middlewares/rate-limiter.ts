import { Redis } from 'ioredis'
import { RateLimiterAbstract, RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible'
import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger.js'
import config from '../config/index.js'
import { isDevelopment } from '../config/constants.js'

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
  points: 500, // Number of allowed requests per url
  duration: 10, // Per seconds by IP and URL
  blockDuration: 1, // Block for 1 minutes if points consumed
  keyPrefix: 'rlimit:ip:', // Unique key prefix for different rate limiters
}

const _rateLimiter: RateLimiterAbstract = new RateLimiterRedis(rateLimiterOpts)

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const unique_address = req.ip ? `${req.ip}:url:${req.url}` : `unknown:url:${req.url}`

  if (isDevelopment) {
    next()
    return
  }

  await _rateLimiter
    .consume(unique_address)
    .then((_: RateLimiterRes) => {
      next()
    })
    .catch((e: Error | RateLimiterRes) => {
      if (e instanceof Error) {
        // Handle Redis or other errors
        logger.error('Rate limiter error:', e)
        res.status(500).send('Internal Server Error')
      } else {
        // Handle rate limit exceeded
        const retrySecs = Math.ceil((e as RateLimiterRes).msBeforeNext / 1000) || 1
        logger.warn(`Rate limit exceeded for ${unique_address}, retry in ${retrySecs} seconds`)
        res.set('Retry-After', String(retrySecs)) // can be taken from header
        res.status(429).send('Too Many Requests')
      }
    })
}
