import dbbClient from '../ddbClient'
import { ipnsTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (record: any) => {
    try {
        const params = {
            TableName: ipnsTable,
            Item: record,
        }

        await dbbClient.put(params)
        return 'Put Successful'
    } catch (error) {
        throw new DatabaseError()
    }
}
