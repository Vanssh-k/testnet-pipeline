export interface DealRecordInterface {
  dealUUID: string
  aggregateIn: string
  storageProvider: string
  startEpoch: number
  endEpoch: number
  providerCollateral: string
  publishCID: string
  chainDealID: number
  dealStatus: string
  prevDealID: number
  lastUpdate: number
}

export interface DealList {
  dealID: number
  cids: string[]
  expirationEpoch: number
  lastUpdate: number
}

export interface DealInfoResponse {
  dealId: string
  storageProvider: string
  dealStatus: string
  prevDealID: number
  startEpoch: number
  endEpoch: number
}
