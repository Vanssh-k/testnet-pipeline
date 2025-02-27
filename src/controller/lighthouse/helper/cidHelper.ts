import { legacyDealInfo } from './legacyDeals.js'

import getDealInfoCG from '../../../db/filecoin/getDealInfoCG.js'
import getFFRecord from '../../../db/filecoin/getFFRecord.js'
import { FFCIDRecord } from '../../../types/filecoin.js'

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

export const cidDealStatus = async (cid: string): Promise<any[]> => {
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
