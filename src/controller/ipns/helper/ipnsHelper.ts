import { v4 } from 'uuid'
import axios from 'axios'
import config from '../../../config/index.js'
import CustomError from '../../../middlewares/error/customError.js'
import addIPNSRecord from '../../../db/ipns/addIPNSRecord.js'
import getIPNSRecord from '../../../db/ipns/getIPNSRecord.js'
import updateIPNSRecord from '../../../db/ipns/updateIPNSRecord.js'
import removeIPNSRecord from '../../../db/ipns/removeIPNSRecord.js'
import getIPNSRecordById from '../../../db/ipns/getIPNSRecordById.js'
import { IPNSSchema } from '../../../types/ipns.js'

export const generateKey = async (publicKey: string): Promise<{ ipnsName: string; ipnsId: string }> => {
  // Check total keys of user
  const ipnsRecords: IPNSSchema[] = await getIPNSRecord(publicKey)
  /* istanbul ignore next */
  if (ipnsRecords.length > 500) {
    // Adding one client exception till IPNS plans are up
    if (
      publicKey !== '0x8b7254cca55d2ca12c03f3e368bd681e413dd455' &&
      publicKey !== '0x25d19abaebb32ca0081bac5b12dce361a89c2bd7'
    ) {
      throw new CustomError(403, 'IPNS name limit reached.')
    }
  }

  // Generate key
  const keyGen = v4().split('-').join('')
  const ipnsCID = await axios.post(
    `${config.lighthouse_ipns_node}/api/v0/key/gen?arg=${keyGen}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${config.route_access_token}`,
      },
    },
  )

  // Add record to database
  const record: IPNSSchema = {
    ipnsName: keyGen,
    ipnsId: ipnsCID.data.Id,
    publicKey: publicKey,
    cid: '',
    lastUpdate: Date.now(),
  }
  const saveRecord = await addIPNSRecord(record)

  return {
    ipnsName: keyGen,
    ipnsId: ipnsCID.data.Id,
  }
}

export const getUserIPNSRecords = async (publicKey: string): Promise<IPNSSchema[]> => {
  const ipnsRecords: IPNSSchema[] = await getIPNSRecord(publicKey)
  return ipnsRecords
}

export const publishRecord = async (cid: string, id: string, publicKey: string): Promise<any> => {
  const keyRecord: IPNSSchema = await getIPNSRecordById(id)
  if (keyRecord.publicKey !== publicKey) {
    throw new CustomError(403, 'Forbidden.')
  }

  const publishResponse = await axios.post(
    `${config.lighthouse_ipns_node}/api/v0/name/publish?arg=${cid}&key=${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${config.route_access_token}`,
      },
    },
  )

  // Update cid
  /* istanbul ignore next */
  if (!publishResponse.data.Value) {
    throw new CustomError(500, 'Internal Server Error.')
  }
  const updateCid = await updateIPNSRecord(id, cid)
  return publishResponse.data
}

export const removeKey = async (keyName: string, publicKey: string): Promise<any> => {
  const keyRecord: IPNSSchema = await getIPNSRecordById(keyName)
  if (keyRecord.publicKey !== publicKey) {
    throw new CustomError(403, 'Forbidden.')
  }

  const removeResponse = await axios.post(
    `${config.lighthouse_ipns_node}/api/v0/key/rm?arg=${keyName}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${config.route_access_token}`,
      },
    },
  )

  // remove record
  /* istanbul ignore next */
  if (!removeResponse.data.Keys[0]['Id']) {
    throw new CustomError(500, 'Internal Server Error.')
  }
  const removeRecord = await removeIPNSRecord(keyName)
  return removeResponse.data
}
