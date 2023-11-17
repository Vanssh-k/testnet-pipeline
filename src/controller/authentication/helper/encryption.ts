import axios from 'axios'
import config from '../../../config'
import logger from '../../../utils/logger'

export const sendMessageToEnc = async (publicKey: string, message: string) => {
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
        .catch((err) => {
          const myLogger = logger('error', 'authentication')
          myLogger.error('In sendMessageToEnc: ' + err.message)
          return null
        })
    )
  )
  return data
}
