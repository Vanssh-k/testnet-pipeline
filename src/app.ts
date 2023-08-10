import fs from 'fs'
import cors from 'cors'
import morgan from 'morgan'
import cron from 'node-cron'
import config from './config'
import logger from './utils/logger'
import bodyParser from 'body-parser'
import AuthRouter from './routes/auth'
import UserRouter from './routes/user'
import IPNSRouter from './routes/ipns'
import TopUpRouter from './routes/topup'
import expressWinston from 'express-winston'
import { exportAndClearLogs } from './controller/log'
import GovernanceRouter from './routes/governance'
import LighthouseRouter from './routes/lighthouse'
import express, { Request, Response } from 'express'
import errorHandler from './middlewares/error-handler'
import { requestFilter, responseFilter } from './utils/loggerFilters'

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    requestFilter: requestFilter,
    responseFilter: responseFilter,
    statusLevels: true,
  })
)

app.use(morgan('dev'))
app.use(cors())

app.get('/', (req: Request, res: Response) => {
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

cron.schedule('0 0 * * *', () => {
  console.log('Log CRON Started')
  exportAndClearLogs()
})

export default app
