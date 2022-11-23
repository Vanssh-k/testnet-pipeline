const getNetwork = require('../../middlewares/getNetwork');
const listMigrationRequests = require('../../repository/migration/listMigrationRequests');
const migrationRequestInfo = require('../../repository/migration/migrationRequestInfo');
const fileDetailsByCid = require('../../repository/fileDetailsByCid');

const { getTicker } = require('./helper/tickerHelper');
const { cidDealStatus, addCidEstuary, addCidToQueue } = require('./helper/cidHelper');
const { migrationRequest, migrationRequestEnt } = require('./helper/migrationHelper');

// get ticker of a token by its symbol as input
exports.get_ticker = async (req, res, next) => {
  try {
    const tokenPricesUSD = await getTicker(req.query.symbol);
    res.status(200).json(tokenPricesUSD);
  } catch (error) {
    next(error);
  }
};

// get status of a CID, returns filecoin miner details
exports.deal_status = async (req, res, next) => {
  try {
    const status = await cidDealStatus(req.query.cid);
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

// create db record for all CID and trigger migration
exports.migration_request = async (req, res, next) => {
  try {
    const requestID = await migrationRequest(req.user, req.body.data);
    res.status(200).json({ requestID });
  } catch (error) {
    next(error);
  }
};

exports.migration_request_ent = async (req, res, next) => {
  try {
    let publicKey = req.body.publicKey.trim();
    if (req.network === 'evm') {
      publicKey = publicKey.toLowerCase();
    }
    const requestID = await migrationRequestEnt(publicKey, req.body.data, req.body.enterprise);

    res.status(200).json({ requestID });
  } catch (error) {
    next(error);
  }
};

exports.list_migration_requests = async (req, res, next) => {
  try {
    let publicKey = req.query.publicKey.trim();
    const network = getNetwork(publicKey);
    if (network === 'evm') {
      publicKey = publicKey.toLowerCase();
    }

    const record = await listMigrationRequests(publicKey);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

exports.migration_request_info = async (req, res, next) => {
  try {
    const record = await migrationRequestInfo(req.query.requestId);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

// add cid for filecoin deal
exports.add_cid = async (req, res, next) => {
  try {
    const _ = await addCidEstuary(req.body.name, req.body.cid);
    res.status(200).json('Added To Queue');
  } catch (error) {
    next(error);
  }
};

// Get details of a file
exports.file_info = async (req, res, next) => {
  try {
    const record = await fileDetailsByCid(req.query.cid);

    res.status(200).json({
      fileSizeInBytes: record.fileSizeInBytes,
      cid: record.cid,
      encryption: record.encryption,
      fileName: record.fileName,
      mimeType: record.mimeType,
      txHash: record.txHash,
      cidStatus: record.cidStatus,
    });
  } catch (error) {
    next(error);
  }
};

// Add file to queue for bundled transaction
exports.add_cid_to_queue = async (req, res, next) => {
  try {
    const response = await addCidToQueue(req.user, req.body);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
