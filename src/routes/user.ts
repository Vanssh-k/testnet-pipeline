import express from 'express'
import {
  get_uploads,
  faucet_status,
  user_data_usage,
  files_uploaded,
  get_tag_details,
  create_tag,
  get_all_tags,
  remove_tag,
  send_email_verification_mail,
  verify_email_token,
} from '../controller/user'
import authenticator from '../middlewares/authenticator'
import validate from '../middlewares/validate'
import validator from '../middlewares/validators'

const router = express.Router()

router.get(
  '/get_uploads',
  validate(validator.getUploadsSchema, { query: true }),
  authenticator(['verifyToken'], ['publicKeyOnly']),
  get_uploads
)

router.get(
  '/files_uploaded',
  validate(validator.getUploadsSchema, { query: true }),
  authenticator(['verifyToken'], ['publicKeyOnly']),
  files_uploaded
)

router.get(
  '/user_data_usage',
  validate(validator.publicKeySchema, { query: true }),
  authenticator(['verifypublickey']),
  user_data_usage
)

router.get(
  '/send_verification_email',
  validate(validator.emailSchema, { query: true }),
  authenticator(['verifyToken'], ['publicKeyOnly']),
  send_email_verification_mail
)

router.get(
  '/verify_email',
  validate(validator.verificationTokenSchema, { query: true }),
  verify_email_token
)

router.get('/faucet_status', authenticator(['verifyToken']), faucet_status)

router.post(
  '/create_tag',
  validate(validator.createTagSchema, { body: true }),
  authenticator(['verifyToken'], ['publicKeyOnly']),
  create_tag
)

router.get(
  '/get_tag_details',
  validate(validator.getTagSchema, { query: true }),
  authenticator(['verifyToken'], ['publicKeyOnly']),
  get_tag_details
)

router.get(
  '/get_all_tags',
  authenticator(['verifyToken'], ['publicKeyOnly']),
  get_all_tags
)

router.delete(
  '/remove_tag',
  validate(validator.getTagSchema, { query: true }),
  authenticator(['verifyToken'], ['publicKeyOnly']),
  remove_tag
)

export default router
