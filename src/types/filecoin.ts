export type FilecoinDealsMainnet = {
  dealUUID: string
  aggregateIn: string
  chainDealID: number
  dealStatus: string
  endEpoch: number
  lastUpdate: number
  prevDealID: number
  providerCollateral: string
  publishCID: string
  startEpoch: number
  storageProvider: string
}

export type FileRecordTestnet = {
  cid: string
  aggregatedIn: string[]
  carSize: number
  cidV1: string
  fileSize: number
  lastUpdate: number
  pieceCid: string
  pieceSize: number
}

export type RAASTesting = {
  cid: string
  cidStatus: string
  currentReplications: number
  dealIDs: number[]
  lastUpdate: number
  miners: string[]
  ongoingReplications: number
  replicationTarget: number
  transactionId: number
}

export type LegacyFileAggregateInfo = {
  id: string
  aggregatedIn: string
  carSize: number
  cid: string
  fileSize: number
  lastUpdate: number
  pieceCid: string
  pieceSize: number
}

export type LegacyAggregateRecords = {
  aggregateID: string
  aggFileStatus: string
  carFileSize: number
  commpCID: string
  lastUpdate: number
  minerCount: number
  payloadCid: string
  pieceSize: number
}

export type TestnetDealRecords = {
  dealUUID: string
  aggregateIn: string
  chainDealID: number
  dealStatus: string
  endEpoch: number
  lastUpdate: number
  providerCollateral: string
  prevDealID: number
  publishCID: string
  startEpoch: number
  storageProvider: string
}

export type TestnetPODSI = {
  cid: string
  aggregateIDs: string[]
  fileProofs: any
  lastUpdate: number
  pieceCID: string
}
