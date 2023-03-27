import { v4 } from 'uuid'
import axios from 'axios'
import config from '../../../config'
import { ForbiddenError } from '../../../errors'
import addIPNSRecord from '../../../repository/ipns/addIPNSRecord'
import getIPNSRecord from '../../../repository/ipns/getIPNSRecord'
import updateIPNSRecord from '../../../repository/ipns/updateIPNSRecord'
import getIPNSRecordById from '../../../repository/ipns/getIPNSRecordById'

export const generateKey = async(publicKey: string) => {
  // Check total keys of user
  const ipnsRecords = await getIPNSRecord(publicKey)
  if(ipnsRecords.length>5) {
    throw new ForbiddenError()
  }

  // Generate key
  const keyGen = v4()
  const ipnsCID = await axios.post(
    `${config.lighthouse_ipfs_node}/api/v0/key/gen?arg=${keyGen}`, {},
    {
      headers: {
        'Authorization': `Bearer ${config.route_access_token}`
      }
    }
  )

  // Add record to database
  const record = {
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

export const getUserIPNSRecords = async(publicKey: string) =>{
  const ipnsRecords = await getIPNSRecord(publicKey)
  return ipnsRecords
}

export const publishRecord = async(cid: string, id: string, publicKey: string) =>{
  const keyRecord:any = await getIPNSRecordById(id)
  if(keyRecord.publicKey!==publicKey){
    throw new ForbiddenError()
  }

  const publishResponse = await axios.post(
    `${config.lighthouse_ipfs_node}/api/v0/name/publish?arg=${cid}&key=${id}`, {},
    {
      headers: {
        'Authorization': `Bearer ${config.route_access_token}`
      }
    }
  )
  
  // Update cid
  if(!publishResponse.data.Value){
    throw new Error()
  }
  const updateCid = await updateIPNSRecord(id, cid)
  return 'Published' 
}
