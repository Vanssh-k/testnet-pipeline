import dbbClient from '../../ddbClient'
import { userAuthTable } from '../../../controller/libs/constants'

export default async (publicKey: string) => {
    try {
        const params = {
            TableName: userAuthTable,
            IndexName: 'publicKey-index',
            KeyConditionExpression: 'publicKey = :p',
            ExpressionAttributeValues: {
                ':p': publicKey,
            },
        }

        const record = await dbbClient.query(params)
        const Items = record.Items ?? []
        return Items
    } catch (error: any) {
        console.log('Check Api Key Error: ' + error.message)
        return false
    }
}
