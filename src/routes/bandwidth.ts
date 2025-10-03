import express from 'express'
import { get_bandwidth_records } from '../controller/bandwidth/index.js'
import authenticator from '../middlewares/authenticator.js'
import validate from '../middlewares/validate.js'
import validator from '../middlewares/validators/index.js'

const router = express.Router()

router.get(
  '/records',
  validate(validator.bandwidthQuerySchema, { query: true }),
  authenticator('verifyToken'),
  get_bandwidth_records,
)

export default router
