import dbbClient from '../../ddbClient'
import { userAuthTable } from '../../../controller/libs/constants'

export default async (id: string) => {
    try {
        const params = {
            TableName: userAuthTable,
            Key: {
              id: id
            }
        }

        const status = await dbbClient.delete(params)
        return status
    } catch (error: any) {
        console.log('Delete Api Key Error: ' + error.message)
        return false
    }
}
