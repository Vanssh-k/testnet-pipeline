import config from '../config/index.js'
import cjs from 'crypto-js'
import userDetails from '../db/user/userDetails.js'
import getMigrationRequestInfo from '../db/migration/getMigrationRequestInfo.js'
import verifySignature from '../utils/verifySignature.js'
import { messageString } from '../config/constants.js'
import CustomError from './error/customError.js'
import { verifyJWT } from '../utils/verifyJWT.js'
import getNetwork from './getNetwork.js'
import checkApiKey from '../db/user/auth/checkApiKey.js'

import { getCache, removeCache } from '../db/db/cacheClient.js'
import { NextFunction, Request, Response } from 'express'

const verifyAccessToken = async (accessToken: string) => {}

const verifySig = async (accessToken: string) => {}

/*
  req.body.publicKey: only to pass public key
  req.body.user to pass full user object
*/

export default (rule: string, clauses: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      switch (rule) {
        case 'verifysignature':
          let usersPublicKey = req.body.publicKey || req.query.publicKey
          const network = getNetwork(usersPublicKey)
          network === 'evm' ? (usersPublicKey = usersPublicKey.toLowerCase()) : null
          console.log(usersPublicKey)
          const message = await getCache(`message-${usersPublicKey}`)
          console.log(message)
          const authentic = verifySignature(usersPublicKey, messageString + message, req.body.signedMessage, network)
          if (!authentic) {
            throw new CustomError(401, 'Authentication Failed.')
          }
          removeCache(`message-${usersPublicKey}`)
          req.body.publicKey = usersPublicKey
          break

        case 'verifyToken':
          const accessToken = req.headers['authorization']?.split(' ')[1]
          if (!accessToken) {
            throw new CustomError(401, 'Authentication Failed.')
          }

          let keyRecord: any = null
          if (accessToken.split('.').length === 3) {
            keyRecord = verifyJWT(
              accessToken,
              clauses.includes('useRefreshSecret') ? config.jwt_refresh_secret : config.jwt_secret,
            )
          } else {
            keyRecord = await checkApiKey(cjs.SHA256(accessToken).toString())
          }

          if (!keyRecord) {
            throw new CustomError(401, 'Authentication Failed.')
          }
          if (clauses.includes('publicKeyOnly')) {
            req.body.publicKey = keyRecord.publicKey
            break
          }

          const networkTokenBlock = getNetwork(keyRecord.publicKey)
          // cacheData = await getCache(`user-${keyRecord.publicKey}`)
          const userRecordTokenBlock = await userDetails(keyRecord.publicKey, networkTokenBlock)
          if (!userRecordTokenBlock) {
            throw new CustomError(404, 'User Not Found.')
          }
          req.body.user = userRecordTokenBlock
          break

        case 'verifyMigrationRequest':
          const requestId = req.query.requestId
          const requestInfo = await getMigrationRequestInfo(requestId as string)
          if (!requestInfo) {
            throw new CustomError(404, 'User Not Found.')
          }
          const networkMigrationBlock = getNetwork(requestInfo.publicKey)
          const recordMigrationBlock = await userDetails(requestInfo.publicKey, networkMigrationBlock)
          if (!recordMigrationBlock) {
            throw new CustomError(404, 'User Not Found.')
          }
          req.body.info = requestInfo
          req.body.user = recordMigrationBlock
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
            throw new CustomError(404, 'User Not Found.')
          }
          req.body.network = getNetwork(req.body.publicKey)
          break

        case 'transactionProtectRoute':
          const transactionRouteAccessToken = req.headers['authorization']?.split(' ')[1]
          if (transactionRouteAccessToken !== config.transaction_route_token) {
            throw new CustomError(404, 'User Not Found.')
          }
          const networkTxBlock = getNetwork(req.body.depositor)
          const recordTxBlock = await userDetails(req.body.depositor, networkTxBlock)
          req.body.user = recordTxBlock
          break

        default:
          break
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
