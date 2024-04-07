import axios from 'axios'
import { v4 } from 'uuid'
import config from '../../../config'

import updateUserData from '../../../repository/user/updateUserData'
import filecoinDeal from '../../../repository/filecoin/filecoinDeal'
import getCIDRecord from '../../../repository/filecoin/getCIDRecord'
import saveFileMetaData from '../../../repository/file/saveFileMetaData'
import getBundleRecord from '../../../repository/filecoin/getBundleRecord'
import getCIDList from '../../../repository/filecoin/getCIDList'
import podsiRecord from '../../../repository/filecoin/podsiRecord'
import { BadRequestError } from '../../../errors'

// Testnet
import getCIDRecordTestnet from '../../../repository/filecoin/testnet/getCIDRecordTestnet'
import getBundleRecordTestnet from '../../../repository/filecoin/testnet/getBundleRecordTestnet'
import filecoinDealTestnet from '../../../repository/filecoin/testnet/filecoinDealTestnet'
import podsiRecordTestnet from '../../../repository/filecoin/testnet/podsiRecordTestnet'
import getPodsiRecordTestnet from '../../../repository/filecoin/testnet/getPodsiRecordTestnet'
import getRaasInfoTestnet from '../../../repository/filecoin/testnet/getRaasInfoTestnet'
import getFileInfoTestnet from '../../../repository/filecoin/testnet/getFileInfoTestnet'
import getDealInfoTestnet from '../../../repository/filecoin/testnet/getDealInfoTestnet'
import getDealInfo from '../../../repository/filecoin/mainnet/getDealInfo'
import getPodsiRecord from '../../../repository/filecoin/mainnet/getPodsiRecord'
import getRaasInfo from '../../../repository/filecoin/mainnet/getRaasInfo'
import getFileInfo from '../../../repository/filecoin/mainnet/getFileInfo'

export const cidDealStatus = async (cid: string) => {
  try {
    const raasInfo = await getRaasInfo(cid)
    if (!raasInfo) {
      throw new Error()
    }
    const fileInfo = await getFileInfo(cid)
    const deals: any = []
    for (let i = 0; i < raasInfo?.dealIDs.length; i++) {
      const dealRecord = await getDealInfo(raasInfo?.dealIDs[i])
      const dealRecordInfo = dealRecord[0]
      deals[i] = {}
      deals[i].pieceCID = raasInfo?.cid
      deals[i].payloadCid = fileInfo?.cidV1
      deals[i].pieceSize = parseInt(fileInfo?.pieceSize)
      deals[i].carFileSize = parseInt(fileInfo?.carSize)
      deals[i].dealId = parseInt(dealRecordInfo.chainDealID)
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
      if (cidRecord[0]['aggregateIn'] !== 'none') {
        aggregatedIn = await getBundleRecord(cidRecord[0]['aggregatedIn'])
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
        deals[i].content = parseInt(cidRecord[0]['fileSize']) // only used in package
      }

      return deals
    } catch (e) {
      return []
    }
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
    publishCid: dealRecordInfo.publishCid,
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
    if (cidRecord[i]['aggregateIn'] !== 'none') {
      const aggregatedIn: any = await getBundleRecord(
        cidRecord[i]['aggregatedIn']
      )
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

  return {
    cid: fileRecord?.cid,
    cidV1: fileRecord?.cidV1,
    fileSize: fileRecord?.fileSize,
    pieceCid: fileRecord?.pieceCid,
    pieceSize: fileRecord?.pieceSize,
    carSize: fileRecord?.carSize,
  }
}

export const raasInfoTestnet = async (cid: string) => {
  const raasInfo = await getRaasInfoTestnet(cid)
  return {
    cid: raasInfo?.cid,
    dealIDs: raasInfo?.dealIDs,
    miners: raasInfo?.miners,
    currentReplications: raasInfo?.currentReplications,
    replicationTarget: raasInfo?.replicationTarget,
  }
}

export const podsiTestnet = async (cid: string) => {
  const cidInfo = await getPodsiRecordTestnet(cid)
  // const cidInfo = cidRecord[0]
  const raasInfo = await getRaasInfoTestnet(cid)
  const deals = raasInfo?.dealIDs
  const storageProvider = raasInfo?.miners
  /* istanbul ignore next */
  const dealArray: DealInfoTestnet[] = []
  const pieceCid: string = cidInfo?.pieceCid
  // for (let i = 0; i < cidRecord.length; i++) {
  // const cidProof = await podsiRecord(cidInfo['pieceCid'])
  // let proofOfAggregate: any = null
  // if (cidInfo['aggregateIn'] !== 'none') {
  // const aggregatedIn: any = await getBundleRecord(cidInfo['aggregatedIn'])
  // if (aggregatedIn['aggFileStatus'] === 'deal initiated') {
  for (let i = 0; i < deals.length; i++) {
    dealArray.push({
      dealId: parseInt(deals[i]),
      storageProvider: storageProvider[i],
      proof: cidInfo?.fileProofs[i],
      // {
      //   inclusionProof: proofOfAggregate['fileProof']['inclusionProof'],
      //   verifierData: proofOfAggregate['fileProof']['verifierData'],
      //   indexRecord: proofOfAggregate['fileProof']['indexRecord'],
      // },
      // aggPieceCID: aggregatedIn.commpCID,
      // aggPieceSize: parseInt(aggregatedIn.pieceSize),
      // aggCarFileSize: parseInt(aggregatedIn.carFileSize),
    })
    // }
  }
  // }
  // }
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

const addCid = async (name: string, cid: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${config.est_api_key ?? ''}`,
      Accept: 'application/json',
    }

    const response = (
      await axios.post(
        'https://api.estuary.tech/content/add-ipfs',
        JSON.stringify({
          name: name,
          cid: cid,
        }),
        { headers }
      )
    ).data

    return response
  } catch (error) {
    return null
  }
}

export const addCidEstuary = async (name: string, cid: string) => {
  const addCidResponse = await addCid(name, cid)
  if (!addCidResponse) {
    throw new BadRequestError()
  }
  return addCidResponse
}
