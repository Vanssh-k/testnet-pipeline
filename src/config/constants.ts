import config from './index.js'

const isDevelopment = config.environment === 'development'

const service = 'core-api'
const emailSender = 'lighthouse.storage'

const jwtAlgo = 'HS256'
const jwtExpire = '12h'

const cacheTime = 300 // 5 minutes
const filesPageSize = isDevelopment ? 100 : 1000
const freeDataLimitInBytes = 1073741824
const messageString = 'Please prove you are the owner of this wallet by signing this message, nonce='

const userTable = isDevelopment ? 'tn-user-record' : 'user-record'
const userAuthTable = isDevelopment ? 'tn-user-auth' : 'user-auth'
const fileTable = isDevelopment ? 'tn-files' : 'files'
const referralTable = isDevelopment ? 'tn-referral' : 'referral'
const cidTagTable = isDevelopment ? 'tn-cid-tag-table' : 'cid-tag-table'
const gatewayTable = isDevelopment ? 'tn-dedicated-gateway' : 'dedicatedGatewayRecords'
const migrationCIDs = isDevelopment ? 'tn-migration-cids' : 'migrationCIDs'
const migrationRequestTable = isDevelopment ? 'tn-migration-request' : 'migrationRequestTable'
const userTransactions = isDevelopment ? 'tn-user-transactions' : 'userTransactions'

const ffUserRecord = isDevelopment ? 'tn-ff-user-record' : 'ff-user-record'
const ffTransactions = isDevelopment ? 'tn-ff-transactions' : 'ff-transactions'
const historicRecords = isDevelopment ? 'tn-historic-records' : 'historic-records'

const ipnsTable = isDevelopment ? 'tn-user-ipns-records' : 'user-ipns-records'

const fileTableEncryption = isDevelopment ? 'tn-file-table-encryption' : 'file-table-encryption'

const FilecoinLegacyTables = {
  FILE_Bundle_Records: 'file-aggregate-info',
  CAR_BUNDLE_RECORDS: 'aggregate-records',
  FILECOIN_DEAL_RECORDS: 'filecoin-deals',
  FILE_POSDI: 'file-podsi',
}

// const FilecoinTestnetTableName = {
//   PODSI_TABLE: 'inclusion-proof',
//   RAAS_TABLE: 'raas-testing',
//   AGGREGATE_TABLE: 'aggregate-file-records',
//   FILE_RECORD_TABLE: 'file-records',
//   DEAL_RECORD_TABLE: 'deal-records',
// }

const FilecoinTestnetTableName = {
  PODSI_TABLE: 'tn-inclusion-proof',
  RAAS_TABLE: 'tn-raas',
  AGGREGATE_TABLE: 'tn-aggregate-info',
  FILE_RECORD_TABLE: 'tn-file-info',
  DEAL_RECORD_TABLE: 'tn-filecoin-deals',
}

const FilecoinMainnetTableName = {
  PODSI_TABLE: 'de-inclusion-proof',
  RAAS_TABLE: 'de-raas',
  AGGREGATE_TABLE: 'de-aggregate-info',
  FILE_RECORD_TABLE: 'de-file-info',
  DEAL_RECORD_TABLE: 'de-filecoin-deals',
}

const lighthouse_migration_node = 'http://35.154.135.28'
const lighthouse_ipfs_node = isDevelopment ? 'https://node-test.lighthouse.storage' : 'https://node.lighthouse.storage'
const lighthouse_auth_enc_node = isDevelopment
  ? 'https://enc-test.lighthouse.storage'
  : 'https://encryption.lighthouse.storage'
const lighthouse_encryption_nodes = isDevelopment
  ? [
      'https://enc-test.lighthouse.storage/api/auth-message/1',
      'https://enc-test.lighthouse.storage/api/auth-message/2',
      'https://enc-test.lighthouse.storage/api/auth-message/3',
      'https://enc-test.lighthouse.storage/api/auth-message/4',
      'https://enc-test.lighthouse.storage/api/auth-message/5',
    ]
  : [
      'https://encryption.lighthouse.storage/api/auth-message/1',
      'https://encryption.lighthouse.storage/api/auth-message/2',
      'https://encryption.lighthouse.storage/api/auth-message/3',
      'https://encryption.lighthouse.storage/api/auth-message/4',
      'https://encryption.lighthouse.storage/api/auth-message/5',
    ]

export {
  isDevelopment,
  ffUserRecord,
  ffTransactions,
  historicRecords,
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
  messageString,
  FilecoinLegacyTables,
  fileTableEncryption,
  ipnsTable,
  FilecoinTestnetTableName,
  FilecoinMainnetTableName,
  filesPageSize,
  cacheTime,
  lighthouse_migration_node,
  lighthouse_ipfs_node,
  lighthouse_auth_enc_node,
  lighthouse_encryption_nodes,
}
