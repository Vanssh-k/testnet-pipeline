export type FileSchema = {
  id: string
  cid: string
  encryption: boolean
  fileName: string
  fileSizeInBytes: number
  mimeType: string
  publicKey: string
  sentForDeal: string
  lastUpdate: number
  createdAt: number
}
