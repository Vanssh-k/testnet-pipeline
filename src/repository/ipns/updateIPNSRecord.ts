import dbbClient from '../ddbClient'
import { ipnsTable } from '../../controller/libs/constants'
import DatabaseError from '../../errors/database-error'

export default async (id: string, cid: string) => {
    try {
        const params = {
            TableName: ipnsTable,
            Key: {
                ipnsName: id,
            },
            UpdateExpression: 'set cid = :c, lastUpdate = :u',
            ExpressionAttributeValues: {
                ':c': cid,
                ':u': Date.now()
            },
        }

        await dbbClient.update(params)
        return 'Update Successful'
    } catch (error) {
        console.log(error)
        throw new DatabaseError()
    }
}
