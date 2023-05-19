import dbbClient from '../../db/ddbClient'
import { cidTagTable } from '../../../controller/libs/constants'

interface ITagDetails {
  id: string,
  tag: string
  cid: string
  publicKey: string
  lastUpdate: number
}

export default async (tagDetails: ITagDetails) => {
  const params = {
    TableName: cidTagTable,
    Item: tagDetails,
  }

  await dbbClient.put(params)
  return 'Put Successful'
}
