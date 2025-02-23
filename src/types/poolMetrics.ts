export interface PoolMetrics {
  tvl: string
  volume: string
  fee: number
  stakedAmount: string
  liquidAmount: number
  depositors: number
  composition: {
    FIL: [string, string, string]
    USDC: [string, string, string]
  }
}
