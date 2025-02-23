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

export type FileRecord = {
  cid: string
  aggregatedIn: string[]
  carSize: number
  cidV1: string
  fileSize: number
  lastUpdate: number
  pieceCid: string
  pieceSize: number
}

export type RAAS = {
  cid: string
  cidStatus: string
  currentReplications: number
  dealIDs: any
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

export type TestnetAggregateRecord = {
  aggregateID: string
  carFileSize: number
  commpCID: string
  copies: number
  fileStatus: string
  lastUpdate: number
  minerCount: number
  miners: string[]
  payloadCid: string
  pieceSize: number
  renew: boolean
  repair: boolean
}

export type TestnetFileAggregateInfo = {
  id: string
  aggregatedIn: string
  carSize: number
  cid: string
  emittedId: string
  fileSize: number
  lastUpdate: number
  pieceCid: string
  pieceSize: number
}

export type TestnetFilePodsi = {
  id: string
  fileProof: any
  lastUpdate: number
  pieceCID: string
}

export type PODSI = {
  cid: string
  aggregateIDs: string[]
  fileProofs: any
  lastUpdate: number
  pieceCID: string
}

export type FilecoinLegacyPOSDIRecord = {
  id: string
  aggregateID: string
  fileProof: any
  lastUpdate: number
  pieceCID: string
}

export type HistoricRecord = {
  recordType: string
  recordDate: string
  depositorsCumulative: number
  fees24h: number
  tvl: number
  volume24h: number
}

export type HistoricDataKey = 'depositorsCumulative' | 'fees24h' | 'tvl' | 'volume24h'

export type FFTransaction = {
  id: string
  amount: number
  chainId: number
  createdAt: number
  from: string
  purchase: string
  to: string
  tokenAddress: string
  txHash: string
}

export type CIDListItem = {
  id: string
  aggregatedIn: string
  carSize: number
  cid: string
  fileSize: number
  lastUpdate: number
  pieceCid: string
  pieceSize: number
}

export type DealParameters = {
  fileId: string
  add_mock_data?: number | null
  deal_duration?: number
  miner?: string[]
  network?: string
  num_copies?: number | null
  renew_threshold?: number | null
  repair_threshold?: number | null
}

export type ProcessedDealParameters = {
  fileId: string
  miner: string[]
  num_copies: number | null
  repair_threshold: number | null
  renew_threshold: number | null
  add_mock_data: number | null
  deal_duration: number
  network: string
}

export type FFDeal = {
  pieceCID: string
  deal: any
}

export type FFCIDRecord = {
  id: string
  cid: string
  cidStatus: string
  createdAt: number
  filePath: string
  fileSize: number
  mtype: string
  pieceCID: string
  pinningAttempt: number
  publicKey: string
  updatedAt: number
}
