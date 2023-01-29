const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const verifyCID = require('../../../utils/verifyCID');
const addMigrationCIDs = require('../../../repository/migration/addMigrationCIDs');
const createMigrationRequest = require('../../../repository/migration/createMigrationRequest');

exports.migrationRequest = async (record, bodyData) => {
  // Get CID, filename array
  const data = JSON.parse(bodyData);
  if (data.length === 0) {
    throw new DatabaseError('No CID included');
  }

  // Verify CID's
  for (let i = 0; i < data.length; i++) {
    if (!verifyCID(data[i])) {
      throw new BadRequestError(`Row ${i}is not a CID`);
    }
  }

  // Save Migration Request
  const timestamp = Date.now();
  const requestID = uuidv4().toString();
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey: record.publicKey,
    totalCID: data.length,
    migrationStatus: 'queued',
    enterprise: 'lighthouse',
    createdAt: timestamp,
    lastUpdate: timestamp,
  });

  // Save all CIDs
  for (let i = 0; i < data.length; i++) {
    const saveCIDs = await addMigrationCIDs({
      id: uuidv4().toString(),
      cid: data[i],
      requestID,
      fileName: '',
      fileSizeInBytes: '',
      userDataUpdated: false,
      txHash: '',
      cidStatus: 'queued',
      deal: '',
      lastUpdate: timestamp,
    });
  }

  const startMigration = axios.get(`http://43.205.115.104/api?requestId=${requestID}`);
  return (requestID);
};

exports.migrationRequestEnt = async (publicKey, bodyData, enterprise) => {
  // Get CID, filename array
  const data = JSON.parse(bodyData);
  if (data.length === 0) {
    throw new DatabaseError('No CID included');
  }

  // Verify CID's
  for (let i = 0; i < data.length; i++) {
    if (!verifyCID(data[i])) {
      throw new BadRequestError(`Row ${i}is not a CID`);
    }
  }

  // Save Migration Request
  const timestamp = Date.now();
  const requestID = uuidv4().toString();
  const saveRequest = await createMigrationRequest({
    id: requestID,
    publicKey,
    totalCID: data.length,
    migrationStatus: 'queued',
    enterprise,
    createdAt: timestamp,
    lastUpdate: timestamp,
  });

  // Save all CIDs
  for (let i = 0; i < data.length; i++) {
    const saveCIDs = await addMigrationCIDs({
      id: uuidv4().toString(),
      cid: data[i],
      requestID,
      fileName: '',
      fileSizeInBytes: '',
      userDataUpdated: false,
      txHash: '',
      cidStatus: 'queued',
      deal: '',
      lastUpdate: timestamp,
    });
  }

  const startMigration = axios.get(`http://43.205.115.104/api?requestId=${requestID}`);
  return (requestID);
};
