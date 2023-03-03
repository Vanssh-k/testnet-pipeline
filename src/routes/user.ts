import express from 'express'
import {
    get_uploads,
    faucet_status,
    user_data_usage,
    update_data_usage,
} from '../controller/user'
import authenticator from '../middlewares/authenticator'
import validate from '../middlewares/validate'
import validator from '../middlewares/validators'

const router = express.Router()

router.get(
    '/get_uploads',
    validate(validator.getUploadsSchema, { query: true }),
    get_uploads
)

router.get(
    '/user_data_usage',
    validate(validator.publicKeySchema, { query: true }),
    authenticator(['verifypublickey']),
    user_data_usage
)

router.get('/faucet_status', authenticator(['verifyjwt']), faucet_status)

router.get(
    '/update_data_usage',
    validate(validator.migrationRequestIdSchema, { query: true }),
    authenticator(['verifyMigrationRequest'], ['protectedRoute']),
    update_data_usage
)

export default router
