export type BandwidthRecord = {
  client_id: string
  date: string
  usage: number
  geoLocation: {
    us?: number
    ind?: number
    [key: string]: number | undefined
  }
  topCIDs: {
    [cid: string]: number
  }
  total_requests: number
  migrated_at?: number
}

export type BandwidthQueryParams = {
  client_id: string
  start_date: string
  end_date: string
}

export type BandwidthResponse = {
  data: BandwidthRecord[]
  totalUsage: number
  totalRequests: number
  geoBreakdown: Record<string, number>
}
