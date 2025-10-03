import { NextFunction, Response, Request } from 'express'
import getBandwidthRecords from '../../db/bandwidth/getBandwidthRecords.js'
import { BandwidthQueryParams } from '../../types/bandwidth.js'

export const get_bandwidth_records = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { client_id, start_date, end_date } = req.query

    const queryParams: BandwidthQueryParams = {
      client_id: client_id as string,
      start_date: start_date as string,
      end_date: end_date as string,
    }

    const result = await getBandwidthRecords(queryParams)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}
