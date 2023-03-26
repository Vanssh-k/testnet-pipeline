import express from 'express'
import {
    verify_access_token,
    verify_api_key,
    verify_signer,
    refresh_access_token,
    remove_refresh_token,
    get_message,
    tweet_recharge,
    remove_api_key,
    create_api_key,
    get_user_keys
} from '../controller/authentication'
import validator from '../middlewares/validators'
import validate from '../middlewares/validate'
import authenticator from '../middlewares/authenticator'

const router = express.Router()

router.post(
    '/verify_signer',
    validate(validator.verifySignerSchema, { body: true }),
    authenticator(['verifysignature']),
    verify_signer
)

router.get(
    '/verify_access_token',
    authenticator(['verifyToken']),
    verify_access_token
)

router.get(
    '/refresh_access_token',
    authenticator(['verifyToken'], ['useRefreshSecret', 'useRefreshEquality']),
    refresh_access_token
)

router.delete(
    '/remove_refresh_token',
    authenticator(['verifyToken'], ['useRefreshSecret', 'useRefreshEquality']),
    remove_refresh_token
)

router.get(
    '/get_message',
    validate(validator.publicKeySchema, { query: true }),
    authenticator(['verifypublickey'], ['useWeb3', 'useNewUserBypass']),
    get_message
)

router.post(
    '/get_api_key',
    validate(validator.verifySignerSchema, { body: true }),
    authenticator(['verifysignature']),
    create_api_key
)

router.post(
    '/create_api_key',
    validate(validator.verifySignerSchema, { body: true }),
    authenticator(['verifysignature']),
    create_api_key
)

router.get(
    '/verify_api_key',
    authenticator(['verifyToken']),
    verify_api_key
)

router.get(
    '/get_user_keys',
    authenticator(['verifyToken'], ['publicKeyOnly']),
    get_user_keys
)

router.delete(
    '/remove_api_key',
    validate(validator.apiKeyIdSchema, { query: true }),
    authenticator(['verifyToken'], ['publicKeyOnly']),
    remove_api_key
)

router.get(
    '/tweet_recharge',
    validate(validator.tweetRechargeSchema, { query: true }),
    authenticator(['verifyToken']),
    tweet_recharge
)

export default router
