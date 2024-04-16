import express from 'express'
import { generate_key, publish_record, get_ipns_records, remove_key } from '../controller/ipns/index.js'
import authenticator from '../middlewares/authenticator.js'
import validate from '../middlewares/validate.js'
import validator from '../middlewares/validators/index.js'

const router = express.Router()

router.get('/generate_key', authenticator('verifyToken', ['publicKeyOnly']), generate_key)

router.get('/get_ipns_records', authenticator('verifyToken', ['publicKeyOnly']), get_ipns_records)

router.get(
  '/publish_record',
  validate(validator.verifyPublishSchema, { query: true }),
  authenticator('verifyToken', ['publicKeyOnly']),
  publish_record,
)

router.delete(
  '/remove_key',
  validate(validator.verifyRemoveSchema, { query: true }),
  authenticator('verifyToken', ['publicKeyOnly']),
  remove_key,
)

export default router
