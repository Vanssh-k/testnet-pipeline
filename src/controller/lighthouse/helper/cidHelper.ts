import { legacyDealInfo } from './legacyDeals.js'

import getDealInfoCG from '../../../db/filecoin/getDealInfoCG.js'
import getFFRecord from '../../../db/filecoin/getFFRecord.js'
import { FFCIDRecord } from '../../../types/filecoin.js'
import getDeals from '../../../db/filecoin/getDeals.js'
import axios from 'axios'
import { getCache, setExCache } from '../../../db/db/cacheClient.js'

const ffDeal = async (cid: string): Promise<any> => {
  try {
    const record: FFCIDRecord[] = await getFFRecord(cid)
    if (!record) {
      return []
    }
    const dealData = []
    for (const rec of record) {
      if (typeof rec?.pieceCID === 'string') {
        const deal = await getDealInfoCG(rec.pieceCID)
        dealData.push(deal)
      } else {
        for (let i = 0; i < (rec?.pieceCID as any).length; i++) {
          const deal = await getDealInfoCG(rec.pieceCID[i])
          dealData.push(deal)
        }
      }
    }
    return dealData
  } catch (err) {
    return []
  }
}

const directDeal = async (cid: string) => {
  try {
    const cacheDeal = await getCache(`deal-${cid}`)
    if (cacheDeal) {
      return cacheDeal
    }
    const response = await axios.get(`https://filecoin-first.lighthouse.storage/api/deal_status?cid=${cid}`, {
      timeout: 5000, // 2 seconds timeout
    })
    if (response.data.result.file.details.state === 'offloaded') {
      setExCache(`deal-${cid}`, 3000, response.data.result.file.details)
      return response.data.result.file.details
    }
    return false
  } catch {
    return false
  }
}

export const cidDealStatus = async (cid: string): Promise<any[]> => {
  try {
    const response = await directDeal(cid)
    if (response) {
      return [
        {
          pieceCID: response.groups[0].pieceCid,
          deal: response.groups[0].deals,
        },
      ]
    }
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
