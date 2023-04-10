import config from '../config'
import SHA256 from 'crypto-js/sha256'
import userDetails from '../repository/user/userDetails'
import getMigrationRequestInfo from '../repository/migration/getMigrationRequestInfo'
import verifySignature from '../utils/verifySignature'
import { messageString } from '../controller/libs/constants'
import {
  NotFoundError,
  AuthenticationError,
  RequestValidationError,
  ForbiddenError,
} from '../errors'
import { verifyJWT } from '../utils/verifyJWT'
import getNetwork from './getNetwork'
import checkApiKey from '../repository/user/auth/checkApiKey'
import { getCache } from '../repository/cacheClient'
import { NextFunction, Request, Response } from 'express'

export default (rules: string[] = [], clauses: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // edge case if there are no rules
    if (rules.length === 0 || !rules) {
      return next()
    }
    for (const rule of rules) {
      let record
      let network = null
      let cacheData = null
      switch (rule) {
        case 'verifysignature':
          let usersPublicKey = req.body.publicKey || req.query.publicKey
          network = getNetwork(usersPublicKey)
          network==='evm'?usersPublicKey=usersPublicKey.toLowerCase():null
          cacheData = await getCache(`user-${usersPublicKey}`)
          record = cacheData?cacheData:(await userDetails(usersPublicKey, network)) as any
          if (!record) {
            return next(new NotFoundError())
          }

          const authentic = verifySignature(
            usersPublicKey,
            messageString + record.message ?? '',
            req.body.signedMessage,
            record?.network
          )
          if (!authentic) {
            return next(new AuthenticationError())
          }

          req.body.user = record
          break

        case 'verifyToken':
          const accessToken = req.headers['authorization']?.split(' ')[1]
          if (!accessToken) {
            return next(new AuthenticationError())
          }

          let keyRecord: any = null
          if (accessToken.length < 45) {
            keyRecord = await checkApiKey(SHA256(accessToken).toString())
          } else {
            keyRecord = verifyJWT(
              accessToken,
              clauses.includes('useRefreshSecret')
                ? config.jwt_refresh_secret ?? ''
                : config.jwt_secret ?? ''
            )
          }

          if (!keyRecord) {
            return next(new AuthenticationError())
          }
          if (clauses.includes('publicKeyOnly')) {
            req.body.user = keyRecord
            break
          }

          network = getNetwork(keyRecord.publicKey)
          cacheData = await getCache(`user-${keyRecord.publicKey}`)
          record = cacheData?cacheData:(await userDetails(keyRecord.publicKey, network)) as any
          if (!record) {
            return next(new NotFoundError())
          }
          req.body.user = record
          break

        case 'verifypublickey':
          const publicKey = req.body.publicKey || req.query.publicKey
          network = getNetwork(publicKey)
          if (clauses.includes('useWeb3')) {
            if (!network) {
              return next(
                new RequestValidationError([{ msg: 'Invalid public key!!!' }])
              )
            }
          }
          record = (await userDetails(publicKey, network)) as any // Check if user already exist
          if (!clauses.includes('useNewUserBypass')) {
            if (!record) {
              return next(new NotFoundError())
            }
          }
          if (clauses.includes('protectedRoute')) {
            const routeAccessToken = req.headers['authorization']?.split(' ')[1]
            if (routeAccessToken !== config.route_access_token) {
              return next(new ForbiddenError())
            }
          }
          req.body.user = record
          req.body.network = network
          break

        case 'verifyMigrationRequest':
          const requestId = req.query.requestId
          const requestInfo = await getMigrationRequestInfo(requestId as string)
          if (!requestInfo) {
            return next(new NotFoundError())
          }
          network = getNetwork(requestInfo['publicKey'])
          record = (await userDetails(requestInfo['publicKey'], network)) as any
          if (!record) {
            return next(new NotFoundError())
          }
          req.body.info = requestInfo
          req.body.user = record
          break

        case 'enterpriseRoute':
          const routeAccessToken = req.headers['authorization']?.split(' ')[1]
          let verificationToken = null
          if (req.body.enterprise === 'ocean_protocol') {
            verificationToken = config.migration_ocean_access_token
          }
          if (req.body.enterprise === 'test_org') {
            verificationToken = config.migration_test_access_token
          }
          if (routeAccessToken !== verificationToken || !verificationToken) {
            return next(new NotFoundError())
          }
          req.body.network = getNetwork(req.body.publicKey)
          break

        case 'transactionProtectRoute':
          const transactionRouteAccessToken =
            req.headers['authorization']?.split(' ')[1]
          if (
            transactionRouteAccessToken !== config.transaction_route_token
          ) {
            return next(new NotFoundError())
          }
          network = getNetwork(req.body.depositor)
          record = (await userDetails(req.body.depositor, network)) as any
          req.body.user = record
          break

        default:
          continue
      }
    }
    return next()
  }
}
