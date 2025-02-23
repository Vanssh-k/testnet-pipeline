import docClient from '../../../db/db/ddbClient.js'
import { ffUserRecord } from '../../../config/constants.js'
import { UserMetrics } from '../../../types/user.js'

const getUserMetrics = async (userAddress: string): Promise<UserMetrics> => {
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
        datacapPurchased: 0,
        datacapSpent: 0,
        fileCount: 0,
        dataUsed: 0,
      }
    }
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}

export { getUserMetrics }
