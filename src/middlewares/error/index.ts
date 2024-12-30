import { type NextFunction, type Request, type Response } from 'express'
import CustomError from './customError.js'

export default (err: any, req: Request, res: Response, next: NextFunction): Response => {
  if (err instanceof CustomError) {
    const errorCode = err?.error?.code
    return res.status(errorCode).json({ error: err.error })
  }
  return res.status(400).json({
    error: [{ message: 'Something went wrong.' }],
  })
}
