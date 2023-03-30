const userTable = 'user-record'
const fileTable = 'files'
const userAuthTable = 'user-auth'
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
const ipnsTable = 'user-ipns-records'
const fileTableEncryption = 'file-table-encryption'
const cacheClearTime = {
  day: 86400,
  week: 604800,
  month: 2628000,
}

export {
  userTable,
  userAuthTable,
  fileTable,
  freeDataLimitInBytes,
  gatewayTable,
  migrationCIDs,
  migrationRequestTable,
  userTransactions,
  ProposalTable,
  subscriptionPlans,
  messageString,
  filecoinDealRecords,
  carBundleRecords,
  fileBundleRecords,
  fileTableEncryption,
  ipnsTable,
  cacheClearTime,
}
