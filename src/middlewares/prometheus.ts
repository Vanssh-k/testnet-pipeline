import { Request, Response, NextFunction } from 'express'
import * as promClient from 'prom-client'
import cron from 'node-cron'

export const httpActiveRequests = new promClient.Gauge({
  name: 'active_http_requests',
  help: 'Number of active HTTP requests',
})

export const dailyUserCounter = new promClient.Counter({
  name: 'daily_users',
  help: 'Number of daily users',
  labelNames: ['userId'],
})

export const monthlyUserCounter = new promClient.Counter({
  name: 'monthly_users',
  help: 'Number of monthly users',
  labelNames: ['userId'],
})

export const requestDurationHistogram = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.0005, 0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 5, 10, 20, 30, 40, 50, 60],
})

export const responseSizeHistogram = new promClient.Histogram({
  name: 'http_response_size_bytes',
  help: 'Size of HTTP responses in bytes',
  labelNames: ['method', 'path', 'status'],
  buckets: [1, 500, 1000, 5000, 10000, 50000, 100000, 500000],
})

export const middleware = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.body.publicKey || req.query.publicKey
  const endTimer = requestDurationHistogram
    .labels(req.method, req.path, '0') // Initialize with '0' as the status
    .startTimer()

  const stopTimer = () => {
    endTimer({ status: res.statusCode?.toString() || '500' })
  }
  httpActiveRequests.inc()
  res.on('finish', () => {
    const responseSize = parseInt(res.get('Content-Length') || '0', 10)
    responseSizeHistogram.labels(req.method, req.path, res.statusCode?.toString() || '500').observe(responseSize)
    if (userId) {
      dailyUserCounter.labels(userId).inc()
      monthlyUserCounter.labels(userId).inc()
    }
    stopTimer()
    httpActiveRequests.dec()
  })
  res.on('error', () => {
    stopTimer()
    httpActiveRequests.dec()
  })

  next()
}

export const setupPrometheusCrons = (): void => {
  // Reset the daily user counter every day at midnight
  cron.schedule('0 0 * * *', () => {
    dailyUserCounter.reset()
    console.log('Daily counter reset.')
  })

  // Reset the monthly user counter on the first day of every month at midnight
  cron.schedule('0 0 1 * *', () => {
    monthlyUserCounter.reset()
    console.log('Monthly counter reset.')
  })
}

export { promClient }
