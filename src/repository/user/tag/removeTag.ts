import dbbClient from '../../db/ddbClient'
import { cidTagTable } from '../../../controller/libs/constants'

export default async (id: string) => {
  const params = {
    TableName: cidTagTable,
    Key: {
      id: id,
    },
  }

  const status = await dbbClient.delete(params)
  return status
}
