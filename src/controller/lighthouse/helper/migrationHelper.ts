import axios from 'axios'
import { v4 } from 'uuid'
import * as isIPFS from 'is-ipfs'
import { MigrationStatus } from '../../../types/status.js'
import processDealParam from './processDealParameters.js'
import testnetDealParams from '../../../db/filecoin/testnet/testnetDealParams.js'
import addMigrationCIDs from '../../../db/migration/addMigrationCIDs.js'
import createMigrationRequest from '../../../db/migration/createMigrationRequest.js'
import CustomError from '../../../middlewares/error/customError.js'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const addCIDToRAASTestnet = async (cid: string, fileID: string) => {
  await delay(30000) // after 5 min
  const __ = await axios.get(`https://calibration.lighthouse.storage/api/deal/add_cid?cid=${cid}&fileId=${fileID}`)
}

export const pinCID = async (publicKey: any, cid: string, fileName: string, raas: any) => {
  // Verify CID's
  if (!isIPFS.cid(cid)) {
    throw new CustomError(400, `Invalid CID`)
  }

  // Save Migration Request
  const timestamp = Date.now()
  const requestID = v4().toString()
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey: publicKey,
    totalCID: 1,
    migrationStatus: MigrationStatus.Queued,
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
    cidStatus: MigrationStatus.Queued,
    deal: '',
    lastUpdate: timestamp,
  })

  if (raas && raas['network'] === 'calibration') {
    // handle deal parameters
    const dealParam = processDealParam(raas, id)
    if (dealParam) {
      await testnetDealParams(dealParam)
    }
    const addCIDToTestnet = addCIDToRAASTestnet(cid, id)
  }

  const startMigration = axios.get(`http://3.111.219.80/api?requestId=${requestID}`)

  return requestID
}

export const migrationRequest = async (publicKey: any, bodyData: string) => {
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

  // Save Migration Request
  const timestamp = Date.now()
  const requestID = v4().toString()
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey: publicKey,
    totalCID: data.length,
    migrationStatus: MigrationStatus.Queued,
    enterprise: 'lighthouse',
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
      fileSizeInBytes: '',
      userDataUpdated: false,
      txHash: '',
      cidStatus: MigrationStatus.Queued,
      deal: '',
      lastUpdate: timestamp,
    })
  }

  const startMigration = axios.get(`http://3.111.219.80/api?requestId=${requestID}`)
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
    totalCID: data.length,
    migrationStatus: MigrationStatus.Queued,
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
      fileName: data[i].fileName ? data[i].fileName : '',
      fileSizeInBytes: '',
      userDataUpdated: false,
      txHash: '',
      cidStatus: MigrationStatus.Queued,
      deal: '',
      lastUpdate: timestamp,
    })
  }

  const startMigration = axios.get(`http://3.111.219.80/api?requestId=${requestID}`)
  return requestID
}
