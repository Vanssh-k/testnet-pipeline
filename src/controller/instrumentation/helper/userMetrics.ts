import docClient from '../../../db/db/ddbClient.js'
import { ffUserRecord } from '../../../config/constants.js'

const getUserMetrics = async (userAddress: string) => {
  try {
    const params = {
      TableName: ffUserRecord,
      Key: {
        publicKey: userAddress.toLowerCase(),
      },
    }

    const data = await docClient.get(params)
    if (data.Item) {
      const { datacapPurchased, datacapSpent, fileCount, dataUsed } = data.Item
      return {
        datacapPurchased,
        datacapSpent,
        fileCount,
        dataUsed,
      }
    } else {
      return {
        datacap_purchased: 0,
        datacap_spent: 0,
        filecount: 0,
        dataused: 0,
      }
    }
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}

export { getUserMetrics }
