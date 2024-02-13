import fs from 'fs'
import express, { Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import cron from 'node-cron'
import bodyParser from 'body-parser'
import expressWinston from 'express-winston'

import config from './config'
import logger from './utils/logger'
import swaggerDocs from './docs/swagger'
import { requestFilter, responseFilter } from './utils/loggerFilters'
import { exportAndClearLogs } from './controller/log'
import errorHandler from './middlewares/error-handler'
import * as prometheusMetrics from './middlewares/prometheus'

import AuthRouter from './routes/auth'
import UserRouter from './routes/user'
import IPNSRouter from './routes/ipns'
import TopUpRouter from './routes/topup'
import GovernanceRouter from './routes/governance'
import LighthouseRouter from './routes/lighthouse'
import WebhookRouter from './routes/stripeWebhook'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api/webhook', WebhookRouter)
app.get('/metrics', async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', prometheusMetrics.promClient.register.contentType)
    res.end(await prometheusMetrics.promClient.register.metrics())
  } catch (ex) {
    res.status(500).end(ex)
  }
})

app.use(bodyParser.json())

app.use(
  expressWinston.logger({
    winstonInstance: logger('info', 'combined'),
    requestFilter: requestFilter,
    responseFilter: responseFilter,
  })
)

app.use(morgan('dev'))
app.use(cors())

swaggerDocs(app)

app.use(prometheusMetrics.middleware)

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK')
})

app.use('/api/auth', AuthRouter)
app.use('/api/user', UserRouter)
app.use('/api/ipns', IPNSRouter)
app.use('/api/topup', TopUpRouter)
app.use('/api/governance', GovernanceRouter)
app.use('/api/lighthouse', LighthouseRouter)

app.use(errorHandler)

if (!fs.existsSync(config.logPath)) {
  fs.mkdirSync(config.logPath)
}

// cron.schedule('0 0 * * *', () => {
//   console.log('Log CRON Started')
//   exportAndClearLogs()
// })

export default app
