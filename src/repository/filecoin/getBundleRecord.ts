import dbbClient from '../ddbClient'
import DatabaseError from '../../errors/database-error'
import { carBundleRecords } from '../../controller/libs/constants'

export default async (id: string) => {
    try {
        const params = {
            TableName: carBundleRecords,
            Key: {
                bundleId: id,
            },
        }

        const record = await dbbClient.get(params)
        return record.Item
    } catch (error) {
        throw new DatabaseError()
    }
}
