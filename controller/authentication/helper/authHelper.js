const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const SHA256 = require('crypto-js/sha256')
const updateAPIKey = require('../../../repository/user/updateAPIKey')
const updateUserDetails = require('../../../repository/user/updateUserDetails')
const updateRefreshToken = require('../../../repository/user/updateRefreshToken')
const removeRefreshToken = require('../../../repository/user/removeRefreshToken')
const { freeDataLimitInBytes, messageString } = require('../../libs/constants')
const { generateToken } = require('../../../utils/randomToken')

exports.getMessage = async (publicKey, network, record) => {
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
        faucet: record ? record.faucet : {},
        network: record ? record.network : network,
        createdAt: record ? record.createdAt : timestamp,
        updatedAt: timestamp,
    }

    const _ = await updateUserDetails(updatedDetails, network)
    return message
}

exports.verifySigner = async (record) => {
    // Change the message and return access token
    const payLoad = { publicKey: record.publicKey }
    const accessToken = jwt.sign(payLoad, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '12h',
    })
    const refreshToken = jwt.sign(payLoad, process.env.JWT_REFRESH_SECRET, {
        algorithm: 'HS256',
    })

    const _ = await updateRefreshToken(
        record.publicKey,
        SHA256(uuidv4()).toString(),
        SHA256(refreshToken).toString()
    )
    return { accessToken, refreshToken }
}

exports.refreshAccessToken = (record) => {
    const payLoad = { publicKey: record.publicKey }
    const accessToken = jwt.sign(payLoad, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '12h',
    })

    return { accessToken }
}

exports.removeRefreshToken = async (record) => {
    const _ = await removeRefreshToken(
        record.publicKey,
        SHA256(uuidv4()).toString()
    )
    return 'Refresh token removed'
}

exports.getApiKey = async (record) => {
    const apiKey = uuidv4().toString()
    const _ = await updateAPIKey(
        record.publicKey,
        SHA256(uuidv4()).toString(),
        SHA256(apiKey).toString()
    )
    return apiKey
}
