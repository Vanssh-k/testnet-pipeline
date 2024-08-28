import { jest } from '@jest/globals'
import { Request, Response, NextFunction } from 'express'

// Mock the rateLimiterMiddleware globally
jest.mock('./src/middlewares/rate-limiter.js', () => {
  return jest.fn((req: Request, res: Response, next: NextFunction) => {
    console.log('Mocking Rate Limiter')
    next()
  })
})
