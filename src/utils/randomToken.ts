import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import SHA256 from 'crypto-js/sha256'

export const generateToken = () => {
    return jwt.sign(
        { token: SHA256(v4().toString()).toString() },
        SHA256(v4().toString()).toString() // private key is set to a random string because this jwt will never be reversed
        // hence no private key is required
    )
}
