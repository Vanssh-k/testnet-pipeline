import express from 'express'
import {
  generate_key,
  publish_record,
  get_ipns_records
} from '../controller/ipns'
import authenticator from '../middlewares/authenticator'
import validate from '../middlewares/validate'
import validator from '../middlewares/validators'

const router = express.Router()

router.get(
  '/generate_key',
  authenticator(['verifyToken'], ['publicKeyOnly']),
  generate_key
)

router.get(
  '/get_ipns_records',
  authenticator(['verifyToken'], ['publicKeyOnly']),
  get_ipns_records
)

router.get(
    '/publish_record',
    validate(validator.verifyPublishSchema, { query: true }),
    authenticator(['verifyToken'], ['publicKeyOnly']),
    publish_record
)

export default router
