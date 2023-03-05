import axios from 'axios'
import { v4 } from 'uuid'
import dotenv from 'dotenv'
dotenv.config()

import updateUserData from '../../../repository/user/updateUserData'
import saveFileMetaData from '../../../repository/file/saveFileMetaData'
import DatabaseError from '../../../errors/database-error'
import { ForbiddenError, BadRequestError } from '../../../errors'
import { clearCacheStartsWith } from '../../../repository/cacheClient'
import config from '../../../config'
import getCIDRecord from '../../../repository/filecoin/getCIDRecord'
import getBundleRecord from '../../../repository/filecoin/getBundleRecord'
import filecoinDeal from '../../../repository/filecoin/filecoinDeal'

export const cidDealStatus = async (cid: string) => {

    const cidRecord = await getCIDRecord(cid)

    // Get bundle record
    let bundleRecord = null
    if (cidRecord[0]['bundledIn'] !== 'none') {
        bundleRecord = await getBundleRecord(cidRecord[0]['bundledIn'])
    }
    // Check bundle status
    // If initiated then get miner details
    let deals: any[] = []
    if (bundleRecord && bundleRecord['bundleStatus'] === 'deal initiated') {
        deals = await filecoinDeal(bundleRecord['bundleId'])
    }

    for (let i = 0; i < deals.length; i++) {
        deals[i].dealId = parseInt(deals[i]['chainDealID'])
        deals[i].miner = deals[i]['storageProvider']
        deals[i].content = parseInt(cidRecord[0]['fileSize']) // only used in package
    }
    return deals
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

export const addCidToQueue = async (record: any, bodyData: any) => {
    const timestamp = Date.now()
    if (bodyData.size > record.dataLimit - record.dataUsed) {
        // Create record of file
        await saveFileMetaData({
            id: v4(),
            publicKey: record.publicKey,
            cid: bodyData.cid,
            fileName: bodyData.name,
            fileSizeInBytes: bodyData.size,
            encryption: bodyData.encryption.toString() === 'true',
            mimeType: bodyData.mimeType,
            status: 'payment pending',
            txHash: '',
            createdAt: timestamp,
            lastUpdate: timestamp,
        })

        throw new ForbiddenError()
    }

    // Create record of file
    const saveFileResponse = await saveFileMetaData({
        id: v4(),
        publicKey: record.publicKey,
        cid: bodyData.cid,
        fileName: bodyData.name,
        fileSizeInBytes: bodyData.size,
        encryption: bodyData.encryption.toString() === 'true',
        mimeType: bodyData.mimeType,
        status: 'queued',
        txHash: '',
        createdAt: timestamp,
        lastUpdate: timestamp,
    })

    // Update data usage
    const dataUsed = parseInt(record.dataUsed) + parseInt(bodyData.size)
    const _ = await updateUserData(record.publicKey, dataUsed)

    // Send CID to Estuary
    const addCidResponse = await addCid(bodyData.name, bodyData.cid)
    if (!addCidResponse) {
        throw new DatabaseError('Add CID Failed')
    }

    // Send CID to Lighthouse Deal Maker
    const __ = await axios.get(
        `http://34.131.213.156/api/deal/add_cid?cid=${bodyData.cid}`
    )

    // clear cache of first page - Note only first page is cached
    await clearCacheStartsWith(`getUpload-${record.publicKey}-page-1`)
    return 'Success'
}
