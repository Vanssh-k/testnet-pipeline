export type MigrationRequestSchema = {
  id: string
  enterprise: string
  migrationStatus: string
  publicKey: string
  totalCID: string
  createdAt: number
  lastUpdate: number
}

export type MigrationCIDSchema = {
  id: string
  cid: string
  cidStatus: string
  deal: string | null
  fileName: string
  fileSizeInBytes: string
  requestID: string
  txHash: string | null
  userDataUpdated: boolean
  lastUpdate: number
}
