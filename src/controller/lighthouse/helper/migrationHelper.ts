import axios from 'axios'
import { v4 } from 'uuid'
import verifyCID from '../../../utils/verifyCID'
import { DatabaseError, BadRequestError } from '../../../errors'
import addMigrationCIDs from '../../../repository/migration/addMigrationCIDs'
import createMigrationRequest from '../../../repository/migration/createMigrationRequest'

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
