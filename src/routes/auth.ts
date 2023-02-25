import express from 'express'
import {
    verify_access_token,
    verify_api_key,
    verify_signer,
    refresh_access_token,
    remove_refresh_token,
    get_message,
    get_api_key,
    tweet_recharge,
} from '../controller/authentication'
import {
    verifySignerSchema,
    publicKeySchema,
    tweetRechargeSchema,
} from '../middlewares/validators'
import validate from '../middlewares/validate'
import authenticator from '../middlewares/authenticator'

const router = express.Router()

router.post(
    '/verify_signer',
    validate(verifySignerSchema, { body: true }),
    authenticator(['verifysignature']),
    verify_signer
)

router.get(
    '/verify_access_token',
    authenticator(['verifyjwt']),
    verify_access_token
)

router.get(
    '/refresh_access_token',
    authenticator(['verifyjwt'], ['useRefreshSecret', 'useRefreshEquality']),
    refresh_access_token
)

router.delete(
    '/remove_refresh_token',
    authenticator(['verifyjwt'], ['useRefreshSecret', 'useRefreshEquality']),
    remove_refresh_token
)

router.get(
    '/get_message',
    validate(publicKeySchema, { query: true }),
    authenticator(['verifypublickey'], ['useWeb3', 'useNewUserBypass']),
    get_message
)

router.post(
    '/get_api_key',
    validate(verifySignerSchema, { body: true }),
    authenticator(['verifysignature']),
    get_api_key
)

router.get(
    '/tweet_recharge',
    validate(tweetRechargeSchema, { query: true }),
    authenticator(['verifyjwt']),
    tweet_recharge
)

router.get(
    '/verify_api_key',
    authenticator(['verifyjwt'], ['useSHA256WithApiKey']),
    verify_api_key
)

export default router
