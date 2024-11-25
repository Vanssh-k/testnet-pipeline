import { CID } from 'multiformats/cid'
import filecoinDeal from '../../../db/filecoin/filecoinDeal.js'
import getCIDRecord from '../../../db/filecoin/legacy/getCIDRecord.js'
import getBundleRecord from '../../../db/filecoin/legacy/getBundleRecord.js'

// Testnet
import getDealInfo from '../../../db/filecoin/mainnet/getDealInfo.js'
import getRaasInfo from '../../../db/filecoin/mainnet/getRaasInfo.js'
import getFileInfo from '../../../db/filecoin/mainnet/getFileInfo.js'
import CustomError from '../../../middlewares/error/customError.js'

export const legacyDealInfo = async (cid: string) => {
  try {
    let raasInfo = await getRaasInfo(cid)
    let cidV1 = ''
    if (!raasInfo && CID.parse(cid).version === 0) {
      cidV1 = CID.parse(cid).toV1().toString()
      raasInfo = await getRaasInfo(cidV1)
    }
    if (!raasInfo) {
      throw new CustomError(404, 'Record not found.')
    }
    const fileInfo = await getFileInfo(cidV1)
    const deals: any = []
    for (let i = 0; i < raasInfo?.dealIDs.length; i++) {
      const dealRecord = await getDealInfo(raasInfo?.dealIDs[i])
      const dealRecordInfo = dealRecord[0]
      deals[i] = {}
      deals[i].pieceCID = raasInfo?.cid
      deals[i].payloadCid = fileInfo?.cidV1
      deals[i].pieceSize = parseInt(fileInfo?.pieceSize)
      deals[i].carFileSize = parseInt(fileInfo?.carSize)
      deals[i].dealId = dealRecordInfo.chainDealID
      deals[i].miner = 'f0' + raasInfo?.miners[i]
      deals[i].content = parseInt(fileInfo?.fileSize)
      deals[i].dealStatus = dealRecordInfo.dealStatus
      deals[i].startEpoch = dealRecordInfo.startEpoch
      deals[i].endEpoch = dealRecordInfo.endEpoch
      deals[i].publishCid = dealRecordInfo.publishCID
      deals[i].dealUUID = dealRecordInfo.dealUUID
      deals[i].providerCollateral = dealRecordInfo.providerCollateral
      deals[i].chainDealID = dealRecordInfo.chainDealID
    }
    return deals
  } catch (e) {
    try {
      const cidRecord = await getCIDRecord(cid)

      // Get bundle record
      let aggregatedIn: any
      /* istanbul ignore next */
      if (cidRecord[0].aggregatedIn !== 'none') {
        aggregatedIn = await getBundleRecord(cidRecord[0].aggregatedIn)
      }

      // Check bundle status
      // If initiated then get miner details
      let deals: any = []
      /* istanbul ignore next */
      if (aggregatedIn && aggregatedIn['aggFileStatus'] === 'deal initiated') {
        deals = await filecoinDeal(aggregatedIn['aggregateID'])
      }

      /* istanbul ignore next */
      for (let i = 0; i < deals.length; i++) {
        deals[i].pieceCID = aggregatedIn.commpCID
        deals[i].payloadCid = aggregatedIn.payloadCid
        deals[i].pieceSize = parseInt(aggregatedIn.pieceSize)
        deals[i].carFileSize = parseInt(aggregatedIn.carFileSize)
        deals[i].dealId = parseInt(deals[i]['chainDealID'])
        deals[i].miner = deals[i]['storageProvider']
        deals[i].content = cidRecord[0].fileSize
      }

      return deals
    } catch (e) {
      return []
    }
  }
}
