import { getFileInfo } from '../../../db/filecoin/v1/getFileInfo.js'
import { FileInfoResponse } from '../../../types/v1/fileInfoTypes.js'

export const getFileInfoService = async (cid: string, network: string): Promise<FileInfoResponse | null> => {
  const fileInfo = await getFileInfo(cid, network)

  if (!fileInfo) {
    return null
  }

  const response: FileInfoResponse = {
    cid: fileInfo.cid,
    cidV1: fileInfo.cidV1,
    pieceCid: fileInfo.pieceCid,
    fileSize: fileInfo.fileSize,
    carSize: fileInfo.carSize,
  }

  return response
}
