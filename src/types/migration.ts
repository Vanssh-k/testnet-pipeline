export type MigrationRequestSchema = {
  id: string
  migrationStatus: string
  publicKey: string
  totalCID: number
  createdAt: number
  lastUpdate: number
}

export type MigrationCIDSchema = {
  id: string
  cid: string
  cidStatus: string
  fileName: string
  fileSizeInBytes: number
  requestID: string
  lastUpdate: number
}
