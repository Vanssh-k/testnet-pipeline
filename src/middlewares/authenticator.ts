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
import { verifyJWT } from '../helpers'
import getNetwork from './getNetwork'
import checkApiKey from '../repository/checkApiKey'
import { getCache } from '../repository/cacheClient'
import { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()

export default (rules: string[] = [], clauses: string[] = []) => {
    return async (req: any, res: Response, next: NextFunction) => {
        // edge case if there are no rules
        if (rules.length === 0 || !rules) {
            return next()
        }
        for (const rule of rules) {
            let record
            let network = null
            switch (rule) {
                case 'verifysignature':
                    const usersPublicKey =
                        req.body.publicKey || req.query.publicKey
                    network = getNetwork(usersPublicKey)
                    record = (await userDetails(usersPublicKey, network)) as any
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
                    record = (await userDetails(usersPublicKey, network)) as any
                    if (!record) {
                        return next(new NotFoundError())
                    }
                    req.user = record
                    break

                case 'verifyjwt':
                    if (clauses.includes('useSHA256WithApiKey')) {
                        const apiKey =
                            req.headers['authorization']?.split(' ')[1]
                        if (!apiKey) {
                            return next(new AuthenticationError())
                        }
                        const record = await checkApiKey(
                            SHA256(apiKey).toString()
                        )
                        if (!record) {
                            return next(new AuthenticationError())
                        }
                        req.user = record
                        break
                    }
                    const accessToken =
                        req.headers['authorization']?.split(' ')[1]
                    if (!accessToken) {
                        return next(new AuthenticationError())
                    }
                    const accessData: any = verifyJWT(
                        accessToken,
                        clauses.includes('useRefreshSecret')
                            ? process.env.JWT_REFRESH_SECRET ?? ''
                            : process.env.JWT_SECRET ?? ''
                    )
                    if (!accessData) {
                        return next(new AuthenticationError())
                    }
                    network = getNetwork(accessData.publicKey)
                    record = (await userDetails(
                        accessData.publicKey,
                        network
                    )) as any
                    if (!record) {
                        return next(new NotFoundError())
                    }
                    if (clauses.includes('useRefreshEquality')) {
                        if (
                            record.refreshToken !==
                            SHA256(accessToken).toString()
                        ) {
                            return next(new AuthenticationError())
                        }
                    }
                    req.user = record
                    break

                case 'verifypublickey':
                    const publicKey = req.body.publicKey || req.query.publicKey
                    network = getNetwork(publicKey)
                    if (clauses.includes('useWeb3')) {
                        if (!network) {
                            return next(
                                new RequestValidationError([
                                    { msg: 'Invalid public key!!!' },
                                ])
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
                        const routeAccessToken =
                            req.headers['authorization']?.split(' ')[1]
                        if (
                            routeAccessToken !== process.env.ROUTE_ACCESS_TOKEN
                        ) {
                            return next(new ForbiddenError())
                        }
                    }
                    req.user = record
                    req.network = network
                    break

                case 'verifyMigrationRequest':
                    const requestId = req.query.requestId
                    const requestInfo = await getMigrationRequestInfo(requestId)
                    if (!requestInfo) {
                        return next(new NotFoundError())
                    }
                    network = getNetwork(requestInfo['publicKey'])
                    record = (await userDetails(
                        requestInfo['publicKey'],
                        network
                    )) as any
                    if (!record) {
                        return next(new NotFoundError())
                    }
                    req.info = requestInfo
                    req.user = record
                    break

                case 'enterpriseRoute':
                    const routeAccessToken =
                        req.headers['authorization']?.split(' ')[1]
                    let verificationToken = null
                    if (req.body.enterprise === 'ocean_protocol') {
                        verificationToken =
                            process.env.MIGRATION_OCEAN_ACCESS_TOKEN
                    }
                    if (req.body.enterprise === 'test_org') {
                        verificationToken =
                            process.env.MIGRATION_TEST_ACCESS_TOKEN
                    }
                    if (
                        routeAccessToken !== verificationToken ||
                        !verificationToken
                    ) {
                        return next(new NotFoundError())
                    }
                    req.network = getNetwork(req.body.publicKey)
                    break

                case 'transactionProtectRoute':
                    const transactionRouteAccessToken =
                        req.headers['authorization']?.split(' ')[1]
                    if (
                        transactionRouteAccessToken !==
                            process.env.TRANSACTION_ROUTE_TOKEN ||
                        !transactionRouteAccessToken
                    ) {
                        return next(new NotFoundError())
                    }
                    network = getNetwork(req.body.depositor)
                    record = (await userDetails(
                        req.body.depositor,
                        network
                    )) as any
                    req.user = record
                    break

                default:
                    continue
            }
        }
        return next()
    }
}
