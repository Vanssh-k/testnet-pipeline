export type PaymentPlan = {
  index: number
  planName: string
  amount: number
  storageInGB: number
  dedicatedGateway: number
  bandwidthInGB: number
  encryptionAccessControl: string
  totalNumOfDeduction: number
  imageResize: string
  payInCrypto: string
  filecoinDeals: string
  priceID?: string
}

export type Plan = {
  subscriptionId: number
  totalNumOfDeduction: number
  amount: number
  planName: string
  dataCap: number
  bandwidth: number
  dedicatedGateway: number
}
