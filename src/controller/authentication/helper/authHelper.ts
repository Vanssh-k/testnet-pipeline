import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import SHA256 from 'crypto-js/sha256'
import updateAPIKey from '../../../repository/user/updateAPIKey'
import updateUserDetails from '../../../repository/user/updateUserDetails'
import updateRefreshToken from '../../../repository/user/updateRefreshToken'
import _removeRefreshToken from '../../../repository/user/removeRefreshToken'
import { freeDataLimitInBytes, messageString } from '../../libs/constants'
import { generateToken } from '../../../utils/randomToken'
import config from '../../../config'

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

export const getApiKey = async (record: any) => {
    const apiKey = generateToken()
    await updateAPIKey(
        record.publicKey,
        SHA256(v4()).toString(),
        SHA256(apiKey).toString()
    )
    return apiKey
}
