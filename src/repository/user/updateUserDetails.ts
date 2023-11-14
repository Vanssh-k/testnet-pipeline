import { IUserDetails } from '../../types/user'
import DatabaseError from '../../errors/database-error'
import { userTable } from '../../controller/libs/constants'
import dbbClient from '../db/ddbClient'

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
    console.log(error)
    throw new DatabaseError({})
  }
}
