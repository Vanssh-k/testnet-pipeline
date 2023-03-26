import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'
import config from '../../../config'
import SHA256 from 'crypto-js/sha256'
import { generateToken } from '../../../utils/randomToken'
import removeApiKey from '../../../repository/user/auth/removeApiKey'
import userKeysRecord from '../../../repository/user/auth/userKeysRecord'
import { freeDataLimitInBytes, messageString } from '../../libs/constants'
import updateUserDetails from '../../../repository/user/updateUserDetails'
import updateRefreshToken from '../../../repository/user/updateRefreshToken'
import _removeRefreshToken from '../../../repository/user/removeRefreshToken'
import getApiRecordById from '../../../repository/user/auth/getApiRecordById'
import createApiKeyRecord from '../../../repository/user/auth/createApiKeyRecord'
import { ForbiddenError } from '../../../errors'

export const getMessage = async (
    publicKey: string,
    network: string,
    record: any
) => {
    const timestamp = Date.now()
    const message = messageString + timestamp

    const updatedDetails = {
        publicKey,
        message: timestamp,
        dataLimit: record ? record.dataLimit : freeDataLimitInBytes,
        dataUsed: record ? record.dataUsed : 0,
        apiKey: record
            ? record.apiKey === ''
                ? generateToken()
                : record.apiKey
            : generateToken(),
        refreshToken: record ? record.refreshToken : generateToken(),
        faucet: record?.faucet ? record.faucet : {},
        network: record ? record.network : network,
        createdAt: record ? record.createdAt : timestamp,
        updatedAt: timestamp,
    }

    const _ = await updateUserDetails(updatedDetails, network)
    return message
}

export const verifySigner = async (record: any) => {
    // Change the message and return access token
    const payLoad = { publicKey: record.publicKey }
    const accessToken = jwt.sign(payLoad, config.jwt_secret ?? 'FALLBACK', {
        algorithm: 'HS256',
        expiresIn: '12h',
    })
    const refreshToken = jwt.sign(
        payLoad,
        config.jwt_refresh_secret ?? 'FALLBACK',
        {
            algorithm: 'HS256',
        }
    )

    await updateRefreshToken(
        record.publicKey,
        SHA256(v4()).toString(),
        SHA256(refreshToken).toString()
    )
    return { accessToken, refreshToken }
}

export const refreshAccessToken = (record: any) => {
    const payLoad = { publicKey: record.publicKey }
    const accessToken = jwt.sign(payLoad, config.jwt_secret ?? 'FALLBACK', {
        algorithm: 'HS256',
        expiresIn: '12h',
    })

    return { accessToken }
}

export const removeRefreshToken = async (record: any) => {
    await _removeRefreshToken(record.publicKey, generateToken())
    return 'Refresh token removed'
}

export const createApiKey = async (record: any, keyName: string) => {
    const prefix = v4().split('-')[0]
    const apiKey = prefix + '.' + v4().split('-').join('')
    const authDetails = {
        id: v4(),
        keyName: keyName,
        publicKey: record.publicKey,
        apiKey: SHA256(apiKey).toString(),
        keyPrefix: prefix,
        scope: 'admin',
        lastUpdate: Date.now()
    }
    const createRecord = await createApiKeyRecord(authDetails)
    return apiKey
}

export const revokeApiKey = async (id: string, publicKey: string) => {
    const apiRecord: any = await getApiRecordById(id)
    if(apiRecord.publicKey!==publicKey){
        throw new ForbiddenError()
    }
    const status = await removeApiKey(id)
    return status
}

export const getUserKeys = async (publicKey: string) => {
    const data = await userKeysRecord(publicKey)
    return data
}
