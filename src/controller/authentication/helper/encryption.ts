import axios from 'axios'
import config from '../../../config'

export const getEncJWT = async (publicKey: string, signedMessage: string) => {
    try {
        const { token: encryptionToken, refreshToken: encryptionRefreshToken } = await axios
            .post(
                `${config.lighthouse_auth_enc_node}/api/message/get-jwt`,
                { address: publicKey, signature: signedMessage },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then((res) => res.data)
            .catch((err) => err?.message)
        return { encryptionToken, encryptionRefreshToken }
    } catch (e: any) {
        return { error: e?.message, encryptionToken: null, encryptionRefreshToken: null }
    }
}

export const sendMessageToEnc = async (publicKey: string, message: string) => {
    try {
        const data = await Promise.all(
            config.lighthouse_encryption_nodes.map((url, index) =>
                axios({
                    url,
                    method: 'POST',
                    data: JSON.stringify({
                        address: publicKey,
                        message,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${config.lighthouse_encryption_auth_keys[index]}`,
                    },
                })
                    .then((res) => res.data)
                    .catch((err) => { console.log(err.message); return null })
            )
        )
        return data
    } catch (e: any) {
        console.log(e.message)
        return null
    }
}


export const useEncRefreshToken = async (publicKey: string, refreshToken: string) => {
    try {
        const { token: encryptionToken, refreshToken: encryptionRefreshToken } = await axios
            .put(
                `${config.lighthouse_auth_enc_node}/api/message/get-jwt`,
                { address: publicKey, refreshToken: refreshToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then((res) => res.data)
            .catch((err) => err?.message)
        return { encryptionToken, encryptionRefreshToken }
    } catch (e: any) {
        console.log(e.message)
        return null
    }
}
>>>>>>> 098023c ([Added]: Encryption helper)
