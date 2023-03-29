import dbbClient from '../../ddbClient'
import { userAuthTable } from '../../../controller/libs/constants'
import DatabaseError from '../../../errors/database-error'

interface IUserAuthDetails {
  id: string
  keyName: string
  publicKey: string
  apiKey: string
  keyPrefix: string
  scope: string
  lastUpdate: number
}

export default async (authDetails: IUserAuthDetails) => {
  try {
    const params = {
      TableName: userAuthTable,
      Item: authDetails,
    }

    await dbbClient.put(params)
    return 'Put Successful'
  } catch (error) {
    console.log(error)
    throw new DatabaseError({})
  }
}
