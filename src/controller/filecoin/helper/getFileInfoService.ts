import { getFileInfo } from '../../../db/filecoin/v1/getFileInfo.js'
import { getRaasInfo } from '../../../db/filecoin/v1/getRaasInfo.js'
import { getDealInfoService } from './getDealInfoService.js'
import { FileInfoResponse } from '../../../types/v1/fileInfoTypes.js'
import { DealInfoResponse } from '../../../types/v1/dealTypes.js'

export const getFileInfoService = async (cid: string, network: string): Promise<FileInfoResponse | null> => {
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

  const response: FileInfoResponse = {
    cid: fileInfo.cid,
    cidV1: fileInfo.cidV1,
    pieceCid: fileInfo.pieceCid,
    fileSize: fileInfo.fileSize,
    carSize: fileInfo.carSize,
    deals: deals,
  }

  return response
}
