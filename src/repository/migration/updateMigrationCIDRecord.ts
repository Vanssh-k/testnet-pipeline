import dbbClient from '../ddbClient'
import { migrationCIDs } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (id: string, data: any) => {
    try {
        const params = {
            TableName: migrationCIDs,
            Key: {
                id,
            },
            UpdateExpression: 'set userDataUpdated = :u',
            ExpressionAttributeValues: {
                ':u': data,
            },
        }

        await dbbClient.update(params)
        return 'Update Successful'
    } catch (error) {
        throw new DatabaseError()
    }
}
