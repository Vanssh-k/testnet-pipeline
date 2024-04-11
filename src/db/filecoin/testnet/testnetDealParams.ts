import dbbClient from '../../db/ddbClient.js'

export default async (dealParams: any) => {
  const params = {
    TableName: 'deal-parameters',
    Item: dealParams,
  }

  await dbbClient.put(params)
  return 'Put Successful'
}
