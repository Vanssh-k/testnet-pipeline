import dbbClient from '../ddbClient'
import { fileTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (record: any) => {
    try {
        const params = {
            TableName: fileTable,
            Item: record,
        }

        await dbbClient.put(params).promise()
        return 'Put Successful'
    } catch (error) {
        throw new DatabaseError()
    }
}
