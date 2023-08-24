import axios from 'axios'
import { v4 } from 'uuid'
import config from '../../../config'

import updateUserData from '../../../repository/user/updateUserData'
import filecoinDeal from '../../../repository/filecoin/filecoinDeal'
import getCIDRecord from '../../../repository/filecoin/getCIDRecord'
import { clearCacheStartsWith } from '../../../repository/db/cacheClient'
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

export const cidDealStatus = async (cid: string) => {
  try{
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
  } catch(e) {
    return []
  }
}

export const podsi = async (cid: string) => {
  const cidRecord = await getCIDRecord(cid)
  // Get bundle record
  let aggregatedIn: any
  /* istanbul ignore next */
  if (cidRecord[0]['aggregateIn'] !== 'none') {
    aggregatedIn = await getBundleRecord(cidRecord[0]['aggregatedIn'])
  }

  /* istanbul ignore next */
  if (aggregatedIn) {
    const dealInfo = []
    if(aggregatedIn['aggFileStatus'] === 'deal initiated') {
      const deals = await filecoinDeal(aggregatedIn['aggregateID'])
      for (let i = 0; i < deals.length; i++) {
        dealInfo.push({
          dealId: parseInt(deals[i]['chainDealID']),
          storageProvider: deals[i]['storageProvider']
        })
      }
    }

    // Fetch info from PODSI table
    const records = await podsiRecord(cidRecord[0]['pieceCid'])

    const proofResponse = {
      pieceCID: aggregatedIn.commpCID,
      pieceSize: parseInt(aggregatedIn.pieceSize),
      carFileSize: parseInt(aggregatedIn.carFileSize),
      proof: records[0],
      dealInfo: dealInfo
    }

    return proofResponse
  }

  return {}
}

export const podsiTestnet = async (cid: string) => {
  const cidRecord = await getCIDRecordTestnet(cid)
  // Get bundle record
  let aggregatedIn: any
  /* istanbul ignore next */
  if (cidRecord[0]['aggregateIn'] !== 'none') {
    aggregatedIn = await getBundleRecordTestnet(cidRecord[0]['aggregatedIn'])
  }
  
  /* istanbul ignore next */
  if (aggregatedIn) {
    const dealInfo = []
    if(aggregatedIn['fileStatus'] === 'deal initiated'){
      const deals = await filecoinDealTestnet(aggregatedIn['aggregateID'])
      for (let i = 0; i < deals.length; i++) {
        dealInfo.push({
          dealUUID: deals[i]['dealUUID'],
          dealId: parseInt(deals[i]['chainDealID']),
          storageProvider: deals[i]['storageProvider']
        })
      }
    }

    // Fetch info from PODSI table
    const records = await podsiRecordTestnet(cidRecord[0]['pieceCid'])
    console.log(records)

    const proofResponse = {
      pieceCID: aggregatedIn.commpCID,
      pieceSize: parseInt(aggregatedIn.pieceSize),
      carFileSize: parseInt(aggregatedIn.carFileSize),
      proof: records[0],
      dealInfo: dealInfo
    }

    return proofResponse
  }

  return {}
}

export const bundleDetails = async (bundleId: string) => {
  const bundleRecord:any = await getBundleRecord(bundleId)

  if(!bundleRecord) {
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
