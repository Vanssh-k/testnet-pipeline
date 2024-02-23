const userTable = 'user-record'
const fileTable = 'files'
const userAuthTable = 'user-auth'
const cidTagTable = 'cid-tag-table'
const gatewayTable = 'dedicatedGatewayRecords'
const migrationCIDs = 'migrationCIDs'
const migrationRequestTable = 'migrationRequestTable'
const ProposalTable = 'ProposalTable'
const userTransactions = 'userTransactions'
const subscriptionPlans = 'subscriptionPlans'
const messageString =
  'Please prove you are the owner of this wallet by signing this message, nonce='
const freeDataLimitInBytes = 1073741824
const filecoinDealRecords = 'filecoin-deals'
const carBundleRecords = 'aggregate-records'
const fileBundleRecords = 'file-aggregate-info'
const ipnsTable = 'user-ipns-records'
const fileTableEncryption = 'file-table-encryption'
const filePODSI = 'file-podsi'
const cacheClearTime = {
  day: 86400,
  week: 604800,
  month: 2628000,
}

const TestnetTableName = {
  PODSI_TABLE: 'inclusion-proof',
  RAAS_TABLE: 'raas-testing',
  AGGREGATE_TABLE: 'aggregate-file-records',
  FILE_RECORD_TABLE: 'file-records',
  DEAL_RECORD_TABLE: 'deal-records',
}

export {
  userTable,
  userAuthTable,
  fileTable,
  cidTagTable,
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
  filePODSI,
  cacheClearTime,
  TestnetTableName,
}
