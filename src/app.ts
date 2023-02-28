import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import errorHandler from './middlewares/error-handler'
import AuthRouter from './routes/auth'
import UserRouter from './routes/user'
import TopUpRouter from './routes/topup'
import GovernanceRouter from './routes/governance'
import LighthouseRouter from './routes/lighthouse'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).send('OK')
})

app.use('/api/auth', AuthRouter)
app.use('/api/user', UserRouter)
app.use('/api/topup', TopUpRouter)
app.use('/api/governance', GovernanceRouter)
app.use('/api/lighthouse', LighthouseRouter)

app.use(errorHandler)

export default app
