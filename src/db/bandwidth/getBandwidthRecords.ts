import dbbClient from '../db/ddbClient.js'
import logger from '../../utils/logger.js'
import { BandwidthRecord, BandwidthQueryParams, BandwidthResponse } from '../../types/bandwidth.js'
import CustomError from '../../middlewares/error/customError.js'
import { bandwidthTable } from '../../config/constants.js'

export default async (params: BandwidthQueryParams): Promise<BandwidthResponse> => {
  try {
    const { client_id, start_date, end_date } = params

    const queryParams: any = {
      TableName: bandwidthTable,
      KeyConditionExpression: 'client_id = :client_id AND #date BETWEEN :start_date AND :end_date',
      ExpressionAttributeNames: {
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':client_id': client_id,
        ':start_date': start_date,
        ':end_date': end_date,
      },
      ScanIndexForward: false,
    }

    const result = await dbbClient.query(queryParams)

    const records = (result.Items as BandwidthRecord[]) || []
    const totalUsage = records.reduce((sum, record) => sum + (record.usage || 0), 0)
    const totalRequests = records.reduce((sum, record) => sum + (record.total_requests || 0), 0)
    const geoBreakdown = records.reduce(
      (acc, record) => {
        if (record.geoLocation) {
          Object.entries(record.geoLocation).forEach(([country, count]) => {
            acc[country] = (acc[country] || 0) + (count || 0)
          })
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      data: records,
      totalUsage,
      totalRequests,
      geoBreakdown,
    }
  } catch (error: any) {
    logger.error('Bandwidth Records Fetch Error: ' + error.message)
    throw new CustomError(500, 'Internal Server Error.')
  }
}
