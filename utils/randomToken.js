const jwt = require('jsonwebtoken')

module.exports.generateToken = () => {
    return jwt.sign(
        { token: SHA256(uuidv4().toString()).toString(), publicKey },
        SHA256(uuidv4().toString()).toString() // private key is set to a random string because this jwt will never be reversed
        // hence no private key is required
    )
}
