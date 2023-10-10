import axios from 'axios'
import { v4 } from 'uuid'
import verifyCID from '../../../utils/verifyCID'
import { DatabaseError, BadRequestError } from '../../../errors'
import processDealParam from './processDealParameters'
import testnetDealParams from '../../../repository/filecoin/testnet/testnetDealParams'
import addMigrationCIDs from '../../../repository/migration/addMigrationCIDs'
import createMigrationRequest from '../../../repository/migration/createMigrationRequest'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const addCIDToRAASTestnet = async(cid: string, fileID: string) =>{
  await delay(30000) // after 5 min
  const __ = await axios.get(
    `https://calibration.lighthouse.storage/api/deal/add_cid?cid=${cid}&fileId=${fileID}`,
  );
}

export const pinCID = async (record: any, cid: string, fileName: string, raas: any) => {
  // Verify CID's
  if (!verifyCID(cid)) {
    throw new BadRequestError(`Invalid CID`)
  }

  // Save Migration Request
  const timestamp = Date.now()
  const requestID = v4().toString()
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey: record.publicKey,
    totalCID: 1,
    migrationStatus: 'queued',
    enterprise: 'lighthouse',
    createdAt: timestamp,
    lastUpdate: timestamp,
  })

  const id = v4().toString()
  const saveCID = await addMigrationCIDs({
    id: id,
    cid: cid,
    requestID,
    fileName: fileName,
    fileSizeInBytes: '',
    userDataUpdated: false,
    txHash: '',
    cidStatus: 'queued',
    deal: '',
    lastUpdate: timestamp,
  })

  if(raas && raas["network"] === "calibration") {
    // handle deal parameters
    const dealParam = processDealParam(raas, id)
    if(dealParam) {
      await testnetDealParams(dealParam)
    }
    const addCIDToTestnet = addCIDToRAASTestnet(cid, id)
  }

  const startMigration = axios.get(
    `http://43.205.115.104/api?requestId=${requestID}`
  )
  
  return requestID
}

export const migrationRequest = async (record: any, bodyData: string) => {
  // Get CID, filename array
  const data = JSON.parse(bodyData)
  if (data.length === 0) {
    throw new DatabaseError('No CID included')
  }

  // Verify CID's
  for (let i = 0; i < data.length; i++) {
    if (!verifyCID(data[i]["cid"])) {
      throw new BadRequestError(`Row ${i}is not a CID`)
    }
  }

  // Save Migration Request
  const timestamp = Date.now()
  const requestID = v4().toString()
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey: record.publicKey,
    totalCID: data.length,
    migrationStatus: 'queued',
    enterprise: 'lighthouse',
    createdAt: timestamp,
    lastUpdate: timestamp,
  })

  // Save all CIDs
  for (let i = 0; i < data.length; i++) {
    const saveCIDs = await addMigrationCIDs({
      id: v4().toString(),
      cid: data[i]["cid"],
      requestID,
      fileName: data[i]["fileName"]?data[i]["fileName"]:'migrated-file',
      fileSizeInBytes: '',
      userDataUpdated: false,
      txHash: '',
      cidStatus: 'queued',
      deal: '',
      lastUpdate: timestamp,
    })
  }

  const startMigration = axios.get(
    `http://43.205.115.104/api?requestId=${requestID}`
  )
  console.log(requestID)
  return requestID
}

export const migrationRequestEnt = async (
  publicKey: string,
  bodyData: string,
  enterprise: any
) => {
  // Get CID, filename array
  const data = JSON.parse(bodyData)
  if (data.length === 0) {
    throw new DatabaseError('No CID included')
  }

  // Verify CID's
  for (let i = 0; i < data.length; i++) {
    if (!verifyCID(data[i])) {
      throw new BadRequestError(`Row ${i}is not a CID`)
    }
  }

  // Save Migration Request
  const timestamp = Date.now()
  const requestID = v4().toString()
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey,
    totalCID: data.length,
    migrationStatus: 'queued',
    enterprise,
    createdAt: timestamp,
    lastUpdate: timestamp,
  })

  // Save all CIDs
  for (let i = 0; i < data.length; i++) {
    const saveCIDs = await addMigrationCIDs({
      id: v4().toString(),
      cid: data[i],
      requestID,
      fileName: data[i].fileName?data[i].fileName:'',
      fileSizeInBytes: '',
      userDataUpdated: false,
      txHash: '',
      cidStatus: 'queued',
      deal: '',
      lastUpdate: timestamp,
    })
  }

  const startMigration = axios.get(
    `http://43.205.115.104/api?requestId=${requestID}`
  )
  return requestID
}
