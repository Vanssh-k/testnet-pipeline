import { getRaasInfo } from '../../databaseDataAccess/getRaasInfo.js'
import { RaasInfoResponse } from '../../types/dbTypes/raasTypes.js'

export const getRaasInfoService = async (cid: string, network: string): Promise<RaasInfoResponse | null> => {
  const raasInfo = await getRaasInfo(cid, network)

  if (!raasInfo) {
    return null
  }

  const response: RaasInfoResponse = {
    cid: raasInfo.cid,
    currentReplications: raasInfo.currentReplications,
    ongoingReplications: raasInfo.ongoingReplications,
    dealIDs: raasInfo.dealIDs,
    miners: raasInfo.miners,
    replicationTarget: raasInfo.replicationTarget,
    transactionId: raasInfo.transactionId,
  }

  return response
}
