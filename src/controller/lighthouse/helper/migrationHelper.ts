import axios from 'axios'
import { v4 } from 'uuid'
import * as isIPFS from 'is-ipfs'
import { lighthouse_migration_node } from '../../../config/constants.js'
import { MigrationStatus } from '../../../types/status.js'
import processDealParam from './processDealParameters.js'
import testnetDealParams from '../../../db/filecoin/testnet/testnetDealParams.js'
import addMigrationCIDs from '../../../db/migration/addMigrationCIDs.js'
import createMigrationRequest from '../../../db/migration/createMigrationRequest.js'
import CustomError from '../../../middlewares/error/customError.js'
import updateRequestStatus from '../../../db/migration/updateRequestStatus.js'

const triggerMigration = async (requestID: string) => {
  const __ = await axios.post(
    'http://13.200.252.197/migration/',
    {
      requestId: requestID,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/10.0.0',
      },
    },
  )
}

export const pinCID = async (record: any, cid: string, fileName: string, raas: any) => {
  // Verify CID's
  if (!isIPFS.cid(cid)) {
    throw new CustomError(400, `Invalid CID`)
  }

  if (parseInt(record.dataLimit) - parseInt(record.dataUsed) < 0) {
    throw new CustomError(403, 'Data Cap exceed')
  }

  // Save Migration Request
  const timestamp = Date.now()
  const requestID = v4().toString()
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey: record.publicKey,
    totalCID: 1,
    migrationStatus: MigrationStatus.Queued,
    createdAt: timestamp,
    lastUpdate: timestamp,
  })

  const id = v4().toString()
  const saveCID = await addMigrationCIDs({
    id: id,
    cid: cid,
    requestID,
    fileName: fileName,
    fileSizeInBytes: 0,
    cidStatus: MigrationStatus.Queued,
    lastUpdate: timestamp,
  })
  await triggerMigration(requestID)
  return requestID
}

export const retryMigration = async (requestID: string) => {
  try {
    await updateRequestStatus(requestID, MigrationStatus.Queued)
    await triggerMigration(requestID)
    return 'success'
  } catch (error) {
    console.error('Error retrying migration', error)
    return 'failed'
  }
}

export const migrationRequest = async (record: any, bodyData: string) => {
  // Get CID, filename array
  const data = JSON.parse(bodyData)
  if (data.length === 0) {
    throw new CustomError(400, 'No CID included')
  }

  // Verify CID's
  for (let i = 0; i < data.length; i++) {
    if (!isIPFS.cid(data[i]['cid'])) {
      throw new CustomError(400, `Row ${i}is not a CID`)
    }
  }

  if (parseInt(record.dataLimit) - parseInt(record.dataUsed) < 0) {
    throw new CustomError(403, 'Data Cap exceed')
  }

  // Save Migration Request
  const timestamp = Date.now()
  const requestID = v4().toString()
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey: record.publicKey,
    totalCID: data.length as number,
    migrationStatus: MigrationStatus.Queued,
    createdAt: timestamp,
    lastUpdate: timestamp,
  })

  // Save all CIDs
  for (let i = 0; i < data.length; i++) {
    const saveCIDs = await addMigrationCIDs({
      id: v4().toString(),
      cid: data[i]['cid'],
      requestID,
      fileName: data[i]['fileName'] ? data[i]['fileName'] : 'migrated-file',
      fileSizeInBytes: 0,
      cidStatus: MigrationStatus.Queued,
      lastUpdate: timestamp,
    })
  }

  await triggerMigration(requestID)
  return requestID
}

export const migrationRequestEnt = async (publicKey: string, bodyData: string, enterprise: any) => {
  // Get CID, filename array
  const data = JSON.parse(bodyData)
  if (data.length === 0) {
    throw new CustomError(400, 'No CID included')
  }

  // Verify CID's
  for (let i = 0; i < data.length; i++) {
    if (!isIPFS.cid(data[i])) {
      throw new CustomError(400, `Row ${i}is not a CID`)
    }
  }

  // Save Migration Request
  const timestamp = Date.now()
  const requestID = v4().toString()
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey,
    totalCID: data.length as number,
    migrationStatus: MigrationStatus.Queued,
    createdAt: timestamp,
    lastUpdate: timestamp,
  })

  // Save all CIDs
  for (let i = 0; i < data.length; i++) {
    const saveCIDs = await addMigrationCIDs({
      id: v4().toString(),
      cid: data[i],
      requestID,
      fileName: data[i].fileName ? data[i].fileName : '',
      fileSizeInBytes: 0,
      cidStatus: MigrationStatus.Queued,
      lastUpdate: timestamp,
    })
  }

  await triggerMigration(requestID)
  return requestID
}
