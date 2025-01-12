export type UserDetails = {
  publicKey: string
  message: number
  dataLimit: number
  dataUsed: number
  fileCount: number
  email: string
  network: string
  createdAt: number
  updatedAt: number
}

export type UserAuthDetails = {
  id: string
  keyName: string
  publicKey: string
  apiKey: string
  keyPrefix: string
  scope: string
  lastUpdate: number
}

export type Referral = {
  publicKey: string
  referredBy: string
}

export type UserMetrics = {
  datacapPurchased: number
  datacapSpent: number
  fileCount: number
  dataUsed: number
}
