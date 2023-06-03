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
import { BadRequestError } from '../../../errors'

export const cidDealStatus = async (cid: string) => {
  const cidRecord = await getCIDRecord(cid)

  // Get bundle record
  let bundleRecord: any
  /* istanbul ignore next */
  if (cidRecord[0]['bundledIn'] !== 'none') {
    bundleRecord = await getBundleRecord(cidRecord[0]['bundledIn'])
  }

  // Check bundle status
  // If initiated then get miner details
  let deals: any = []
  /* istanbul ignore next */
  if (bundleRecord && bundleRecord['bundleStatus'] === 'deal initiated') {
    deals = await filecoinDeal(bundleRecord['bundleId'])
  }
  
  /* istanbul ignore next */
  for (let i = 0; i < deals.length; i++) {
    deals[i].pieceCID = bundleRecord.commpCID
    deals[i].payloadCid = bundleRecord.payloadCid
    deals[i].pieceSize = parseInt(bundleRecord.pieceSize)
    deals[i].carFileSize = parseInt(bundleRecord.carFileSize)
    deals[i].dealId = parseInt(deals[i]['chainDealID'])
    deals[i].miner = deals[i]['storageProvider']
    deals[i].content = parseInt(cidRecord[0]['fileSize']) // only used in package
  }

  return deals
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
