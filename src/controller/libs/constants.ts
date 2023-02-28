const userTable = 'Users'
const fileTable = 'files'
const gatewayTable = 'dedicatedGatewayRecords'
const migrationCIDs = 'migrationCIDs'
const migrationRequestTable = 'migrationRequestTable'
const ProposalTable = 'ProposalTable'
const userTransactions = 'userTransactions'
const subscriptionPlans = 'subscriptionPlans'
const messageString =
    'Please prove you are the owner of this wallet by signing this message, nonce='
const freeDataLimitInBytes = 1073741824
const filecoinDealRecords = 'filecoin-deal-records'
const carBundleRecords = 'car-bundle-records'
const fileBundleRecords = 'file-bundle-records'
const fileTableEncryption = 'file-table-encryption'
const subscriptionPlanDetails = [
    {
        index: 0,
        planName: 'Spark',
        totalNumOfDeduction: 1,
        nextDeductionInNumOfBlocks: 1200000,
        amount: 10000000,
        totalFilesPinned: 10000,
        ipfsGBStorage: 30,
        filecoinPermanentStorage: 'on demand',
        dedicatedGateway: 1,
        bandwidthInGB: 60,
        requests: 100000,
        encryptionAccessControl: 'mainnet',
        imageResize: 'yes',
        techSupportCall: 'no',
        payInCrypto: 'yes',
        filecoinDeals: 'yes',
    },
    {
        index: 1,
        planName: 'Blaze',
        totalNumOfDeduction: 1,
        nextDeductionInNumOfBlocks: 1200000,
        amount: 50000000,
        totalFilesPinned: 50000,
        ipfsGBStorage: 150,
        filecoinPermanentStorage: 'on demand',
        dedicatedGateway: 3,
        bandwidthInGB: 450,
        requests: 1000000,
        encryptionAccessControl: 'mainnet',
        imageResize: 'yes',
        techSupportCall: 'yes',
        payInCrypto: 'yes',
        filecoinDeals: 'yes',
    },
]

export {
    userTable,
    fileTable,
    freeDataLimitInBytes,
    gatewayTable,
    migrationCIDs,
    migrationRequestTable,
    userTransactions,
    ProposalTable,
    subscriptionPlans,
    messageString,
    subscriptionPlanDetails,
    filecoinDealRecords,
    carBundleRecords,
    fileBundleRecords,
    fileTableEncryption,
}
