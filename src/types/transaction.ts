export interface UserTransaction {
  id: string
  amount: number
  createdAt: number
  network: string
  planID: number
  publicKey: string
  subscriptionID: string
  tokenAddress: string
  txHash: string
}
