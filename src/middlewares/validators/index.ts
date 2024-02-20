import {
  publicKeySchema,
  getUploadsSchema,
  createTagSchema,
  getTagSchema,
  messageSchema,
  emailSchema,
  verificationTokenSchema,
  verifyWeb3authSchema,
} from './user'
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
} from './lighthouse'
import {
  getFileEncryptionKeySchema,
  saveFileEncryptionKeySchema,
} from './encryption'
import { addProposalSchema } from './governance'
import {
  addSubdomainSchema,
  subdomainSchema,
  subscriptionIdSchema,
  recordTransactionSchema,
} from './topup'
import { verifySignerSchema, tweetRechargeSchema, apiKeyIdSchema } from './auth'
import { verifyPublishSchema, verifyRemoveSchema } from './ipns'

export default {
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
  verifyWeb3authSchema,
}
