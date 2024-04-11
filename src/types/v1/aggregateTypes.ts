export interface AggregateRecord {
  aggregateID: string
  payloadCid: string
  commpCID: string
  carFileSize: number
  pieceSize: number
  aggFileStatus: string
  cids: string[]
  lastUpdate: number
}
