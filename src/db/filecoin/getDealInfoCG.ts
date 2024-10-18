import dbbClient from '../db/ddbClient.js'

export default async (pieceCID: string) => {
  try {
    const params = {
      TableName: 'ff-deals',
      Key: {
        pieceCID: pieceCID,
      },
    }

    const record = await dbbClient.get(params)
    return record.Item
  } catch (e) {
    console.log('here')
    console.log(e)
  }
}
