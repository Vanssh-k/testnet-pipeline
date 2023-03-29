import dbbClient from '../ddbClient'
import { userTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

interface IUserDetails {
  publicKey: string
  message: number
  dataLimit: number
  dataUsed: number
  fileCount: number
  faucet: any
  network: string
  createdAt: number
  updatedAt: number
}

export default async (updatedDetails: IUserDetails, network: string) => {
  try {
    if (network === 'evm') {
      updatedDetails.publicKey = updatedDetails.publicKey.trim().toLowerCase()
    }

    const params = {
      TableName: userTable,
      Item: updatedDetails,
    }

    await dbbClient.put(params)
    return 'Put Successful'
  } catch (error) {
    throw new DatabaseError({})
  }
}
