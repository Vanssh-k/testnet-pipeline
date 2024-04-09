import {
  publicKeySchema,
  getUploadsSchema,
  createTagSchema,
  getTagSchema,
  messageSchema,
  emailSchema,
  verificationTokenSchema,
  web3authEmailVerificationSchema,
} from './user.js'
import {
  symbolSchema,
  cidSchema,
  bundleSchema,
  addCIDToQueueSchema,
  addCidSchema,
  pinningSchema,
  migrationRequestEntSchema,
  migrationRequestIdSchema,
  migrationRequestSchema,
} from './lighthouse.js'
import { getFileEncryptionKeySchema, saveFileEncryptionKeySchema } from './encryption.js'
import { addProposalSchema } from './governance.js'
import {
  addSubdomainSchema,
  subdomainSchema,
  subscriptionIdSchema,
  recordTransactionSchema,
  tokenAddressSchema,
} from './topup.js'
import { apiKeyName, verifySignerSchema, tweetRechargeSchema, apiKeyIdSchema } from './auth.js'
import { verifyPublishSchema, verifyRemoveSchema } from './ipns.js'

export default {
  apiKeyName,
  getTagSchema,
  messageSchema,
  createTagSchema,
  verifySignerSchema,
  tweetRechargeSchema,
  apiKeyIdSchema,
  addSubdomainSchema,
  subdomainSchema,
  subscriptionIdSchema,
  recordTransactionSchema,
  addProposalSchema,
  getFileEncryptionKeySchema,
  saveFileEncryptionKeySchema,
  publicKeySchema,
  getUploadsSchema,
  symbolSchema,
  cidSchema,
  pinningSchema,
  bundleSchema,
  addCIDToQueueSchema,
  addCidSchema,
  migrationRequestEntSchema,
  migrationRequestIdSchema,
  migrationRequestSchema,
  verifyPublishSchema,
  verifyRemoveSchema,
  emailSchema,
  verificationTokenSchema,
  web3authEmailVerificationSchema,
  tokenAddressSchema,
}
