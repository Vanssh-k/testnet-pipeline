import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import errorHandler from './middlewares/error-handler'
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

app.use('/api/auth', require('./routes/auth'))
app.use('/api/user', require('./routes/user'))
app.use('/api/topup', require('./routes/topup'))
app.use('/api/governance', require('./routes/governance'))
app.use('/api/lighthouse', require('./routes/lighthouse'))

app.use(errorHandler)

export default app
