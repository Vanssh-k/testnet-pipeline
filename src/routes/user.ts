import express from 'express'
import UserController from '../controller/user'
import authenticator from '../middlewares/authenticator'
import validate from '../middlewares/validate'
import validator from '../middlewares/validators'

const router = express.Router()

router.get(
    '/get_uploads',
    validate(validator.userUploadsSchema, { query: true }),
    UserController.get_uploads
)

router.get(
    '/user_data_usage',
    validate(validator.publicKeySchema, { query: true }),
    authenticator(['verifypublickey']),
    UserController.user_data_usage
)

router.get(
    '/faucet_status',
    authenticator(['verifyjwt']),
    UserController.faucet_status
)

router.get(
    '/update_data_usage',
    validate(validator.migrationRequestIdSchema, { query: true }),
    authenticator(['verifyMigrationRequest'], ['protectedRoute']),
    UserController.update_data_usage
)

export default router
