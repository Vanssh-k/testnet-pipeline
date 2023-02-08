const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const SHA256 = require('crypto-js/sha256')

module.exports.generateToken = () => {
    return jwt.sign(
        { token: SHA256(uuidv4().toString()).toString() },
        SHA256(uuidv4().toString()).toString() // private key is set to a random string because this jwt will never be reversed
        // hence no private key is required
    )
}
