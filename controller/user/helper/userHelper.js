const getNetwork = require('../../../middlewares/getNetwork');
const userUploads = require('../../../repository/file/userUploads');
const migrationRequestInfo = require('../../../repository/migration/migrationRequestInfo');
const updateUserData = require('../../../repository/user/updateUserData');
const updateMigrationCIDRecord = require('../../../repository/migration/updateMigrationCIDRecord');

exports.getUploads = async (publicKey) => {
  const network = getNetwork(publicKey);
  if (network === 'evm') {
    publicKey = publicKey.toLowerCase();
  }
  const files = await userUploads(publicKey);
  return (files);
};

exports.updateDataUsage = async (record, requestId, enterprise) => {
  if (enterprise === 'lighthouse') {
    // Get all CID
    const cidList = await migrationRequestInfo(requestId);
    if (!cidList) {
      throw new NotFoundError();
    }

    // Sum usage for CID pinned but userDataUpdated is false
    let totalUsage = 0;
    for (let i = 0; i < cidList.length; i++) {
      if (!cidList[i].userDataUpdated
          && cidList[i].cidStatus === 'pinned'
          && cidList[i].fileSizeInBytes
      ) {
        totalUsage += parseInt(cidList[i].fileSizeInBytes);
        // userDataUpdated -> true
        const _ = await updateMigrationCIDRecord(cidList[i].id, true);
      }
    }

    const dataUsed = parseInt(record.dataUsed) + parseInt(totalUsage);
    const _ = await updateUserData(record.publicKey, dataUsed);
    return ('Success');
  }
  // TODO handle data usage update for other entreprise
  return ('Success');
};
