export interface RAASJobs {
  cid: string
  cidStatus: string
  currentReplications: number
  ongoingReplications: number
  dealIDs: number[]
  miners: string[]
  replicationTarget: number
  transactionId: number
  lastUpdate: number
}

export interface RaasInfoResponse {
  cid: string
  currentReplications: number
  ongoingReplications: number
  dealIDs: number[]
  miners: string[]
  replicationTarget: number
  transactionId: number
}
