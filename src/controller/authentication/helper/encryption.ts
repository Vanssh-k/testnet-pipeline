import axios from 'axios'
import { lighthouse_encryption_nodes } from '../../../config/constants.js'
import config from '../../../config/index.js'
import logger from '../../../utils/logger.js'

export const sendMessageToEnc = async (publicKey: string, message: string): Promise<(any | null)[]> => {
  const data = await Promise.all(
    lighthouse_encryption_nodes.map((url, index) =>
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
          logger.error('In sendMessageToEnc: ' + err.message)
          return null
        }),
    ),
  )
  return data
}
