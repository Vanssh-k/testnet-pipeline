import { publicKeySchema, getUploadsSchema } from './user'
import {
    symbolSchema,
    cidSchema,
    addCIDToQueueSchema,
    addCidSchema,
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
import {
    verifySignerSchema,
    tweetRechargeSchema,
    apiKeyIdSchema
} from './auth'
import {
    verifyPublishSchema
} from './ipns'

export default {
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
    addCIDToQueueSchema,
    addCidSchema,
    migrationRequestEntSchema,
    migrationRequestIdSchema,
    migrationRequestSchema,
    verifyPublishSchema
}
