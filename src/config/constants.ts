const service = 'core-api'
const emailSender = 'lighthouse.storage'

const jwtAlgo = 'HS256'
const jwtExpire = '12h'

const filesPageSize = 1000
const freeDataLimitInBytes = 1073741824
const messageString = 'Please prove you are the owner of this wallet by signing this message, nonce='

const userTable = 'user-record'
const referralTable = 'referral'
const fileTable = 'files'
const userAuthTable = 'user-auth'
const cidTagTable = 'cid-tag-table'
const gatewayTable = 'dedicatedGatewayRecords'
const migrationCIDs = 'migrationCIDs'
const migrationRequestTable = 'migrationRequestTable'
const ProposalTable = 'ProposalTable'
const userTransactions = 'userTransactions'
const subscriptionPlans = 'subscriptionPlans'

const filecoinDealRecords = 'filecoin-deals'
const ipnsTable = 'user-ipns-records'
const fileTableEncryption = 'file-table-encryption'
const filePODSI = 'file-podsi'
const endowmentTable = 'endownment-transactions'

const V1TestnetTableName = {
  PODSI_TABLE: 'inclusion-proof',
  RAAS_TABLE: 'raas-testing',
  AGGREGATE_TABLE: 'aggregate-file-records',
  FILE_RECORD_TABLE: 'file-records',
  DEAL_RECORD_TABLE: 'deal-records',
}

const V1MainnetTableName = {
  PODSI_TABLE: 'de-inclusion-proof',
  RAAS_TABLE: 'de-raas',
  AGGREGATE_TABLE: 'de-aggregate-info',
  FILE_RECORD_TABLE: 'de-file-info',
  DEAL_RECORD_TABLE: 'de-filecoin-deals',
}

const V1CacheTime = 300 // 5 minutes

const FilecoinLegacyTables = {
  FILE_Bundle_Records: 'file-aggregate-info',
  CAR_BUNDLE_RECORDS: 'aggregate-records',
}

const FilecoinTestnetTableName = {
  PODSI_TABLE: 'inclusion-proof',
  RAAS_TABLE: 'raas-testing',
  AGGREGATE_TABLE: 'aggregate-file-records',
  FILE_RECORD_TABLE: 'file-records',
  DEAL_RECORD_TABLE: 'deal-records',
}

const FilecoinMainnetTableName = {
  PODSI_TABLE: 'de-inclusion-proof',
  RAAS_TABLE: 'de-raas',
  AGGREGATE_TABLE: 'de-aggregate-info',
  FILE_RECORD_TABLE: 'de-file-info',
  DEAL_RECORD_TABLE: 'de-filecoin-deals',
}

export {
  service,
  emailSender,
  jwtAlgo,
  jwtExpire,
  userTable,
  referralTable,
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
  FilecoinLegacyTables,
  fileTableEncryption,
  ipnsTable,
  filePODSI,
  FilecoinTestnetTableName,
  FilecoinMainnetTableName,
  endowmentTable,
  filesPageSize,
  V1TestnetTableName,
  V1MainnetTableName,
  V1CacheTime,
}
