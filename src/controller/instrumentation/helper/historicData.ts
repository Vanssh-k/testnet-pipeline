import { fetchData } from './utils.js'

export const getHistoricTVL = async (): Promise<number[]> => {
  try {
    const tvlData = await fetchData('tvl')
    return tvlData
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}

export const getHistoricVolume = async (): Promise<number[]> => {
  try {
    const volumeData = await fetchData('volume24h')
    return volumeData
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}

export const getHistoricFees = async (): Promise<number[]> => {
  try {
    const feesData = await fetchData('fees24h')
    return feesData
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}

export const getHistoricDepositors = async (): Promise<number[]> => {
  try {
    const depositorsData = await fetchData('depositorsCumulative')
    return depositorsData
  } catch (error: any) {
    console.error(error)
    throw new Error()
  }
}
