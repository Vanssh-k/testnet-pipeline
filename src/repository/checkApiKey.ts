import dbbClient from './ddbClient'
import { userTable } from '../controller/libs/constants'

export default async (apiKey: string) => {
    try {
        const params = {
            TableName: userTable,
            IndexName: 'apiKey-index',
            KeyConditionExpression: 'apiKey = :a',
            ExpressionAttributeValues: {
                ':a': apiKey,
            },
        }

        const record = await dbbClient.query(params).promise()
        const Items = record.Items ?? []
        return Items[0]
    } catch (error: any) {
        console.log('Check Api Key Error: ' + error.message)
        return false
    }
}
