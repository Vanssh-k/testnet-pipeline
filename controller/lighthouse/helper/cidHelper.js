const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const updateUserData = require("../../../repository/user/updateUserData");
const saveFileMetaData = require("../../../repository/file/saveFileMetaData");
const DatabaseError = require("../../../errors/database-error");
const ForbiddenError = require("../../../errors/forbidden");
const { clearCacheStartsWith } = require("../../../repository/cacheClient");

exports.cidDealStatus = async (cid) => {
  const headers = {
    Authorization: `Bearer ${process.env.EST_API_KEY}`,
    Accept: "application/json",
  };

  const { data } = await axios.get(
    `https://api.estuary.tech/content/by-cid/${cid}`,
    { headers }
  );

  let deals = [];
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].deals.length > 0) {
      deals = data[i].deals;
      break;
    }
  }
  return deals;
};

const addCid = async (name, cid) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.EST_API_KEY}`,
      Accept: "application/json",
    };

    const response = (
      await axios.post(
        'https://api.estuary.tech/content/add-ipfs',
        JSON.stringify({
          name: name,
          cid: cid,
        }),
        { headers },
      )
    ).data;

    return response;
  } catch (error) {
    return null;
  }
};

exports.addCidEstuary = async (name, cid) => {
  const addCidResponse = await addCid(name, cid);
  if (!addCidResponse) {
    throw new BadRequestError();
  }
  return addCidResponse;
};

exports.addCidToQueue = async (record, bodyData) => {
  const timestamp = Date.now();
  if (bodyData.size > record.dataLimit - record.dataUsed) {
    // Create record of file
    await saveFileMetaData({
      id: uuidv4(),
      publicKey: record.publicKey,
      cid: bodyData.cid,
      fileName: bodyData.name,
      fileSizeInBytes: bodyData.size,
      encryption: bodyData.encryption.toString() === "true",
      mimeType: bodyData.mimeType,
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
    publicKey: record.publicKey,
    cid: bodyData.cid,
    fileName: bodyData.name,
    fileSizeInBytes: bodyData.size,
    encryption: bodyData.encryption.toString() === "true",
    mimeType: bodyData.mimeType,
    status: "queued",
    txHash: "",
    createdAt: timestamp,
    lastUpdate: timestamp,
  });

  // Update data usage
  const dataUsed = parseInt(record.dataUsed) + parseInt(bodyData.size);
  const _ = await updateUserData(record.publicKey, dataUsed);

  // Send CID to Estuary
  const addCidResponse = await addCid(bodyData.name, bodyData.cid);
  if (!addCidResponse) {
    throw new DatabaseError("Add CID Failed");
  }

  // Send CID to Lighthouse Deal Maker
  const __ = await axios.get(
    `http://34.131.213.156/api/deal/add_cid?cid=${bodyData.cid}`
  );

  await clearCacheStartsWith(`getUpload-${record.publicKey}`);
  return "Success";
};
