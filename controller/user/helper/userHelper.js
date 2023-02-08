const getNetwork = require('../../../middlewares/getNetwork')
const userUploads = require('../../../repository/file/userUploads')
const migrationRequestInfo = require('../../../repository/migration/migrationRequestInfo')
const updateUserData = require('../../../repository/user/updateUserData')
const updateMigrationCIDRecord = require('../../../repository/migration/updateMigrationCIDRecord')
const NotFoundError = require('../../../errors/not-found-error')

exports.getUploads = async (publicKey, pageNo) => {
    const network = getNetwork(publicKey)
    if (network === 'evm') {
        publicKey = publicKey.toLowerCase()
    }
    const files = await userUploads(publicKey, pageNo)
    return files
}

// Scope for optimization here
exports.updateDataUsage = async (record, requestId, enterprise) => {
    if (enterprise === 'lighthouse') {
        // Get all CID
        const cidList = await migrationRequestInfo(requestId)
        if (!cidList) {
            /* istanbul ignore next */
            throw new NotFoundError()
        }

        // Sum usage for CID pinned but userDataUpdated is false
        let totalUsage = 0

        const requests = cidList
            .filter(
                (cid) =>
                    !cid.userDataUpdated &&
                    cid.cidStatus === 'pinned' &&
                    cid.fileSizeInBytes
            )
            .map(async (cid) => {
                totalUsage += parseInt(cid.fileSizeInBytes, 10)
                await updateMigrationCIDRecord(cid.id, true)
            })

        await Promise.all(requests)
        const dataUsed =
            parseInt(record.dataUsed, 10) + parseInt(totalUsage, 10)
        await updateUserData(record.publicKey, dataUsed)
        return 'Success'
    }
    // TODO handle data usage update for other entreprise
    return 'Success'
}
