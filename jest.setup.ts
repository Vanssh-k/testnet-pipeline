import { jest } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'
import config from './src/config/index.js'

// Manage Jest global setup in a single file. This file is automatically loaded by Jest before running any test.

console.log(config.environment)

// Mock the rateLimiterMiddleware globally
jest.mock('./src/middlewares/rate-limiter.js', () => {
  return jest.fn((req: Request, res: Response, next: NextFunction) => {
    next()
  })
})

// TODO: Mock redis and rate-limiter-flexible
