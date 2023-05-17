import dbbClient from '../db/ddbClient'
import { cidTagTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

interface ITagDetails {
  tag: string
  cid: string
  publicKey: string
  lastUpdate: number
}

export default async (tagDetails: ITagDetails) => {
  try {
    const params = {
      TableName: cidTagTable,
      Item: tagDetails,
    }

    await dbbClient.put(params)
    return 'Put Successful'
  } catch (error) {
    console.log(error)
    throw new DatabaseError({})
  }
}
