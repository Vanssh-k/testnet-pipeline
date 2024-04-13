import { getFileInfo } from '../../../db/filecoin/v1/getFileInfo.js'
import { getRaasInfo } from '../../../db/filecoin/v1/getRaasInfo.js'
import { getDealInfoService } from './getDealInfoService.js'
import { FileDetailsResponse } from '../../../types/v1/fileInfoTypes.js'
import { DealInfoResponse } from '../../../types/v1/dealTypes.js'

export const getFileDetailsService = async (cid: string, network: string): Promise<FileDetailsResponse | null> => {
  const fileInfo = await getFileInfo(cid, network)
  const raasInfo = await getRaasInfo(cid, network)

  if (!fileInfo) {
    return null
  }

  let deals: DealInfoResponse[] = []
  if (raasInfo?.dealIDs) {
    deals = await Promise.all(
      raasInfo.dealIDs.map((dealId) => getDealInfoService(dealId.toString(), network) as Promise<DealInfoResponse>),
    )
  }

  const response: FileDetailsResponse = {
    cid: fileInfo.cid,
    cidV1: fileInfo.cidV1,
    pieceCid: fileInfo.pieceCid,
    fileSize: fileInfo.fileSize,
    carSize: fileInfo.carSize,
    deals: deals,
  }

  return response
}
