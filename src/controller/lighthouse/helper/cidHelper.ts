import filecoinDeal from '../../../db/filecoin/filecoinDeal.js'
import getCIDRecord from '../../../db/filecoin/legacy/getCIDRecord.js'
import getBundleRecord from '../../../db/filecoin/legacy/getBundleRecord.js'
import getCIDList from '../../../db/filecoin/getCIDList.js'
import podsiRecord from '../../../db/filecoin/podsiRecord.js'
import { legacyDealInfo } from './legacyDeals.js'

// Testnet
import getBundleRecordTestnet from '../../../db/filecoin/testnet/getBundleRecordTestnet.js'
import filecoinDealTestnet from '../../../db/filecoin/testnet/filecoinDealTestnet.js'
import getPodsiRecordTestnet from '../../../db/filecoin/testnet/getPodsiRecordTestnet.js'
import getRaasInfoTestnet from '../../../db/filecoin/testnet/getRaasInfoTestnet.js'
import getFileInfoTestnet from '../../../db/filecoin/testnet/getFileInfoTestnet.js'
import getDealInfoTestnet from '../../../db/filecoin/testnet/getDealInfoTestnet.js'
import getDealInfo from '../../../db/filecoin/mainnet/getDealInfo.js'
import CustomError from '../../../middlewares/error/customError.js'

import getDealInfoCG from '../../../db/filecoin/getDealInfoCG.js'
import getFFRecord from '../../../db/filecoin/getFFRecord.js'

const ffDeal = async (cid: string) => {
  try {
    const record = await getFFRecord(cid)
    if (!record) {
      return []
    }
    const dealData = []
    if (typeof record[0]?.pieceCID === 'string') {
      const deal = await getDealInfoCG(record[0]?.pieceCID)
      dealData.push(deal)
    } else {
      for (let i = 0; i < record[0]?.pieceCID.length; i++) {
        const deal = await getDealInfoCG(record[0]?.pieceCID[i])
        dealData.push(deal)
      }
    }
    return dealData
  } catch (err) {
    return []
  }
}

export const cidDealStatus = async (cid: string) => {
  try {
    const ffDeals = await ffDeal(cid)
    if (ffDeals.length === 0) {
      const legacyDeals = await legacyDealInfo(cid)
      return legacyDeals
    }
    return ffDeals
  } catch (error) {
    console.error('Error getting deal record', error)
    return []
  }
}

export const dealInfoTestnet = async (dealId: string) => {
  const dealRecord = await getDealInfoTestnet(dealId)
  const dealRecordInfo = dealRecord[0]
  return {
    dealId: dealRecordInfo.chainDealID,
    storageProvider: dealRecordInfo.storageProvider,
    startEpoch: dealRecordInfo.startEpoch,
    endEpoch: dealRecordInfo.endEpoch,
    publishCid: dealRecordInfo.publishCID,
  }
}

type DealInfo = {
  dealId: number
  storageProvider: string
  proof: any
  aggPieceCID: string
  aggPieceSize: number
  aggCarFileSize: number
}
type DealInfoTestnet = {
  dealId: number
  storageProvider: string
  proof: any
}
type dealResponse = {
  pieceCID: string
  dealInfo: DealInfo[]
}
type dealResponseTestnet = {
  pieceCID: string
  dealInfo: DealInfoTestnet[]
}

export const podsi = async (cid: string) => {
  const cidRecord = await getCIDRecord(cid)
  /* istanbul ignore next */

  const dealArray: DealInfo[] = []
  const pieceCid: string = cidRecord[0]['pieceCid']
  for (let i = 0; i < cidRecord.length; i++) {
    const cidProof = await podsiRecord(cidRecord[i]['pieceCid'])
    let proofOfAggregate: any = null
    if (cidRecord[i].aggregatedIn !== 'none') {
      const aggregatedIn: any = await getBundleRecord(cidRecord[i]['aggregatedIn'])
      if (aggregatedIn['aggFileStatus'] === 'deal initiated') {
        if (!cidProof[0]['aggregateID']) {
          proofOfAggregate = cidProof[0]
        } else {
          for (let i = 0; i < cidProof.length; i++) {
            if (cidProof[i]['aggregateID'] === aggregatedIn['aggregateID']) {
              proofOfAggregate = cidProof[i]
            }
          }
        }

        const deals = await filecoinDeal(aggregatedIn['aggregateID'])
        for (let i = 0; i < deals.length; i++) {
          dealArray.push({
            dealId: parseInt(deals[i]['chainDealID']),
            storageProvider: deals[i]['storageProvider'],
            proof: {
              inclusionProof: proofOfAggregate['fileProof']['inclusionProof'],
              verifierData: proofOfAggregate['fileProof']['verifierData'],
              indexRecord: proofOfAggregate['fileProof']['indexRecord'],
            },
            aggPieceCID: aggregatedIn.commpCID,
            aggPieceSize: parseInt(aggregatedIn.pieceSize),
            aggCarFileSize: parseInt(aggregatedIn.carFileSize),
          })
        }
      }
    }
  }
  const dealRes: dealResponse = {
    pieceCID: pieceCid,
    dealInfo: dealArray,
  }

  return dealRes
}

export const fileInfoTestnet = async (cid: string) => {
  const fileRecord = await getFileInfoTestnet(cid)
  if (!fileRecord) {
    return {}
  }
  return {
    cid: fileRecord.cid,
    cidV1: fileRecord.cidV1,
    fileSize: fileRecord.fileSize,
    pieceCid: fileRecord.pieceCid,
    pieceSize: fileRecord.pieceSize,
    carSize: fileRecord.carSize,
  }
}

export const raasInfoTestnet = async (cid: string) => {
  const raasInfo = await getRaasInfoTestnet(cid)
  if (!raasInfo) {
    return {}
  }
  return {
    cid: raasInfo.cid,
    dealIDs: raasInfo.dealIDs,
    miners: raasInfo.miners,
    currentReplications: raasInfo.currentReplications,
    replicationTarget: raasInfo.replicationTarget,
  }
}

export const podsiTestnet = async (cid: string) => {
  const cidInfo = await getPodsiRecordTestnet(cid)
  if (!cidInfo) {
    throw new CustomError(404, 'Record not found.')
  }
  const raasInfo = await getRaasInfoTestnet(cid)
  const deals = raasInfo?.dealIDs
  const storageProvider = raasInfo?.miners
  /* istanbul ignore next */
  const dealArray: DealInfoTestnet[] = []
  const pieceCid = cidInfo?.pieceCID
  for (let i = 0; i < deals.length; i++) {
    dealArray.push({
      dealId: deals[i],
      storageProvider: storageProvider[i],
      proof: cidInfo?.fileProofs[i],
    })
  }

  const dealRes: dealResponseTestnet = {
    pieceCID: pieceCid,
    dealInfo: dealArray,
  }

  return dealRes
}

export const aggregateInfo = async (aggregateID: string) => {
  const aggregatedIn: any = await getBundleRecordTestnet(aggregateID)

  /* istanbul ignore next */
  if (aggregatedIn) {
    const dealInfo = []
    if (aggregatedIn['fileStatus'] === 'deal initiated') {
      const deals = await filecoinDealTestnet(aggregatedIn['aggregateID'])
      for (let i = 0; i < deals.length; i++) {
        dealInfo.push({
          dealUUID: deals[i]['dealUUID'],
          dealId: parseInt(deals[i]['chainDealID']),
          storageProvider: deals[i]['storageProvider'],
        })
      }
    }

    const proofResponse = {
      pieceCID: aggregatedIn.commpCID,
      pieceSize: parseInt(aggregatedIn.pieceSize),
      carFileSize: parseInt(aggregatedIn.carFileSize),
      dealInfo: dealInfo,
    }

    return proofResponse
  }

  return {}
}

export const bundleDetails = async (bundleId: string) => {
  const bundleRecord: any = await getBundleRecord(bundleId)

  if (!bundleRecord) {
    return null
  }

  // Get List of CIDs
  const cidList = await getCIDList(bundleId)
  bundleRecord['cidList'] = cidList

  return bundleRecord
}
