const getNetwork = require("../../middlewares/getNetwork");
const fileDetails = require("../../repository/fileDetails");
const migrationRequestInfo = require("../../repository/migrationRequestInfo");
const updateUserDetails = require("../../repository/updateUserDetails");
const updateMigrationCIDRecord = require("../../repository/updateMigrationCIDRecord");

exports.get_uploads = async (req, res, next) => {
  try {
    let publicKey = req.query.publicKey.trim();
    const network = getNetwork(publicKey);
    if(network==="evm"){
      publicKey = publicKey.toLowerCase();
    }
    const files = await fileDetails();
    res.status(200).send(files);
  } catch (error) {
    next(error);
  }
};

exports.user_data_usage = async (req, res, next) => {
  try {
    const record = req.user;
    res.status(200).json({
      dataLimit: record.dataLimit,
      dataUsed: record.dataUsed,
    });
  } catch (error) {
    next(error);
  }
};

exports.faucet_status = async (req, res, next) => {
  try {
    const record = req.user;
    res.status(200).json(record["faucet"]);
  } catch (error) {
    next(error);
  }
};

exports.update_data_usage = async (req, res, next) => {
  try {
    const requestId = req.query.requestId;
    const record = req.user;

    if(req.info.enterprise === "lighthouse"){
      // Get all CID
      const cidList = await migrationRequestInfo(requestId);
      if (!cidList) {
        throw new NotFoundError();
      }

      // Sum usage for CID pinned but userDataUpdated is false
      let totalUsage = 0;
      for(let i=0; i<cidList.length; i++){
        if(!cidList[i]["userDataUpdated"] &&
            cidList[i]["cidStatus"]==="pinned" &&
            cidList[i]["fileSizeInBytes"]
          ){
          totalUsage = totalUsage + parseInt(cidList[i]["fileSizeInBytes"]);
          // userDataUpdated -> true
          const _ = await updateMigrationCIDRecord(cidList[i]["id"], true);
        }
      }

      // Update data usage
      const updatedDetails = {
        publicKey: record.publicKey,
        message: record.message,
        dataLimit: record.dataLimit,
        dataUsed: parseInt(record.dataUsed) + parseInt(totalUsage),
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

      res.status(200).json("Success");
    } else{
      // TODO handle data usage update for other entreprise
      res.status(200).json("Success");
    }
  } catch (error) {
    console.log(error)
    next(error);
  }
};
