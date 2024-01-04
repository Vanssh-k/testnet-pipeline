export interface IUserDetails {
  publicKey: string
  message: number
  dataLimit: number
  dataUsed: number
  fileCount: number
  faucet: any
  profile: any
  network: string
  createdAt: number
  updatedAt: number
}

export interface IUserAuthDetails {
  id: string
  keyName: string
  publicKey: string
  apiKey: string
  keyPrefix: string
  scope: string
  lastUpdate: number
}
