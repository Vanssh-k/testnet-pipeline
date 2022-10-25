const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const verifyCID = require("../../utils/verifyCID");
const addMigrationCIDs = require("../../repository/addMigrationCIDs");
const createMigrationRequest = require("../../repository/createMigrationRequest");
const listMigrationRequests = require("../../repository/listMigrationRequests");
const migrationRequestInfo = require("../../repository/migrationRequestInfo");
const fileDetailsByCid = require("../../repository/fileDetailsByCid");
const saveFileMetaData = require("../../repository/saveFileMetaData");
const updateUserDetails = require("../../repository/updateUserDetails");

const ForbiddenError = require("../../errors/forbidden");
const DatabaseError = require("../../errors/database-error");
const NotFoundError = require("../../errors/not-found-error");
const BadRequestError = require("../../errors/bad-request");

// get ticker of a token by its symbol as input
exports.get_ticker = async (req, res, next) => {
  try {
    const token_prices = (
      await axios.get(
        `https://data.messari.io/api/v1/assets/${req.query.symbol}/metrics/market-data`
      )
    ).data;

    const token_price_usd = token_prices.data.market_data.price_usd;
    res.status(200).json(token_price_usd);
  } catch (error) {
    next(error);
  }
};

// get status of a CID, returns filecoin miner details
exports.cid_status = async (req, res, next) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = (
      await axios.get(
        `https://api.estuary.tech/content/by-cid/${req.query.cid}`,
        { headers: headers }
      )
    ).data;

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const addCid = async (name, cid) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = (
      await axios.post(
        `https://api.estuary.tech/content/add-ipfs`,
        {
          name: name,
          root: cid,
        },
        { headers: headers }
      )
    ).data;

    return response;
  } catch (error) {
    return null;
  }
};

// create db record for all CID and trigger migration
exports.migration_request = async (req, res, next) => {
  try {
    const record = req.user;

    // Get CID, filename array
    const data = JSON.parse(req.body.data);
    if(data.length === 0) {
      throw new DatabaseError("No CID included");
    }

    // Verify CID's
    for (let i = 0; i < data.length; i++) {
      if(!verifyCID(data[i])){
        throw new BadRequestError("Row " + i + "is not a CID");
      }
    }

    // Save Migration Request
    const timestamp = Date.now();
    const requestID = uuidv4().toString();
    const saveRequest = await createMigrationRequest({
      id: requestID,
      publicKey: record.publicKey,
      totalCID: data.length,
      migrationStatus: "queued",
      enterprise: "lighthouse",
      createdAt: timestamp,
      lastUpdate: timestamp,
    });
    if (!saveRequest) {
      throw new DatabaseError();
    }

    // Save all CIDs
    for (let i = 0; i < data.length; i++) {
      const saveCIDs = await addMigrationCIDs({
        id: uuidv4().toString(),
        cid: data[i],
        requestID: requestID,
        fileName: "",
        fileSizeInBytes: "",
        userDataUpdated: false,
        txHash: "",
        cidStatus: "queued",
        deal: "",
        lastUpdate: timestamp
      });
    }

    const startMigration = axios.get("http://13.235.13.61/api?requestId" + requestID);
    res.status(200).json({ requestID: requestID });
  } catch (error) {
    next(error);
  }
};

exports.migration_request_ent = async (req, res, next) => {
  try {
    let publicKey = req.body.publicKey.trim();
    if(req.network==="evm"){
      publicKey = publicKey.toLowerCase();
    }

    // Get CID, filename array
    const data = JSON.parse(req.body.data);
    if(data.length === 0) {
      throw new DatabaseError("No CID included");
    }

    // Verify CID's
    for (let i = 0; i < data.length; i++) {
      if(!verifyCID(data[i])){
        throw new BadRequestError("Row " + i + "is not a CID");
      }
    }
    
    // Save Migration Request
    const timestamp = Date.now();
    const requestID = uuidv4().toString();
    const saveRequest = await createMigrationRequest({
      id: requestID,
      publicKey: publicKey,
      totalCID: data.length,
      migrationStatus: "queued",
      enterprise: req.body.enterprise,
      createdAt: timestamp,
      lastUpdate: timestamp,
    });
    if (!saveRequest) {
      throw new DatabaseError();
    }
    
    // Save all CIDs
    for (let i = 0; i < data.length; i++) {
      const saveCIDs = await addMigrationCIDs({
        id: uuidv4().toString(),
        cid: data[i],
        requestID: requestID,
        fileName: "",
        fileSizeInBytes: "",
        userDataUpdated: false,
        txHash: "",
        cidStatus: "queued",
        deal: "",
        lastUpdate: timestamp
      });
    }
    
    const startMigration = axios.get("http://13.235.13.61/api?requestId" + requestID);
    res.status(200).json({ requestID: requestID });
  } catch (error) {
    next(error);
  }
};

exports.list_migration_requests = async (req, res, next) => {
  try {
    const record = await listMigrationRequests(req.query.publicKey.toLowerCase());
    if (!record) {
      throw new NotFoundError();
    }

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

exports.migration_request_info = async (req, res, next) => {
  try {
    const record = await migrationRequestInfo(req.query.requestId);
    if (!record) {
      throw new NotFoundError();
    }

    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
};

// add cid for filecoin deal
exports.add_cid = async (req, res, next) => {
  try {
    const addCidResponse = await addCid(req.body.name, req.body.cid);
    if (!addCidResponse) {
      throw new BadRequestError();
    }

    res.status(200).json("Added To Queue");
  } catch (error) {
    next(error);
  }
};

// Get details of a file
exports.file_info = async (req, res, next) => {
  try {
    const record = await fileDetailsByCid(req.query.cid);
    if (!record) {
      throw new NotFoundError();
    }

    res.status(200).json({
      id: record.id,
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
    const publicKey = req.body.publicKey.toLowerCase();
    const record = req.user;

    const timestamp = Date.now();
    if (req.body.size > record.dataLimit - record.dataUsed) {
      // Create record of file
      await saveFileMetaData({
        id: uuidv4(),
        publicKey: publicKey,
        cid: req.body.cid,
        fileName: req.body.name,
        fileSizeInBytes: req.body.size,
        encryption:
          req.body.encryption.toString() === "true"? true : false,
        mimeType: req.body.mimeType,
        status: "payment pending",
        txHash: "",
        createdAt: timestamp,
        lastUpdate: timestamp,
      });

      throw new ForbiddenError();
    }

    // Create record of file
    const saveFileResponse = await saveFileMetaData({
      id: uuidv4(),
      publicKey: publicKey,
      cid: req.body.cid,
      fileName: req.body.name,
      fileSizeInBytes: req.body.size,
      encryption:
       req.body.encryption.toString() === "true"? true: false,
      mimeType: req.body.mimeType,
      status: "queued",
      txHash: "",
      createdAt: timestamp,
      lastUpdate: timestamp,
    });

    if (!saveFileResponse) {
      throw new DatabaseError("Save File failed");
    }

    // Update data usage
    const updatedDetails = {
      publicKey: publicKey,
      message: record.message,
      dataLimit: record.dataLimit,
      dataUsed: parseInt(record.dataUsed) + parseInt(req.body.size),
      apiKey: record.apiKey,
      accessToken: record.accessToken,
      faucet: record.faucet,
      network: record.network,
      createdAt: record.createdAt,
      updatedAt: Date.now()
    };

    const updateResponse = await updateUserDetails(updatedDetails);
    if (!updateResponse) {
      throw new DatabaseError("Put item failed");
    }

    // Send CID to Estuary
    const addCidResponse = await addCid(req.body.name, req.body.cid);

    if (!addCidResponse) {
      throw new DatabaseError("Add CID Failed");
    }

    res.status(200).json("Success");
  } catch (error) {
    next(error);
  }
};
