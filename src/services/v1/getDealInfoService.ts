import { getDealInfo } from '../../databaseDataAccess/getDealInfo.js'
import { DealInfoResponse } from '../../types/dbTypes/dealTypes.js'

export const getDealInfoService = async (dealId: string, network: string): Promise<DealInfoResponse | null> => {
  const dealInfo = await getDealInfo(dealId, network)

  if (!dealInfo) {
    return null
  }

  let prefix
  if (network === 'testnet') {
    prefix = 't0'
  } else {
    prefix = 'f0'
  }

  const response: DealInfoResponse = {
    dealId: dealInfo.dealUUID,
    storageProvider: prefix + dealInfo.storageProvider,
    dealStatus: dealInfo.dealStatus,
    prevDealID: dealInfo.prevDealID,
    startEpoch: dealInfo.startEpoch,
    endEpoch: dealInfo.endEpoch,
  }

  return response
}
