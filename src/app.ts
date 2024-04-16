import express, { Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import expressWinston from 'express-winston'

import logger from './utils/logger.js'
import errorHandler from './middlewares/error/index.js'
import * as prometheusMetrics from './middlewares/prometheus.js'

import AuthRouter from './routes/auth.js'
import UserRouter from './routes/user.js'
import IPNSRouter from './routes/ipns.js'
import TopUpRouter from './routes/topup.js'
import GovernanceRouter from './routes/governance.js'
import LighthouseRouter from './routes/lighthouse.js'
import WebhookRouter from './routes/stripeWebhook.js'
import InstrumentationRouter from './routes/instrumentation.js'
import LighthouseV1Router from './routes/v1/lighthouse.js'

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
  expressWinston.errorLogger({
    winstonInstance: logger,
  }),
)

app.use(morgan('dev'))
app.use(cors())

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
app.use('/api/instrumentation', InstrumentationRouter)
app.use('/api/v1/lighthouse', LighthouseV1Router)

app.use(errorHandler)

export default app
