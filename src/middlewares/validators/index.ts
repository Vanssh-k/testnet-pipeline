import { publicKeySchema, userUploadsSchema } from './user'
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
    saveEncryptionPublicKeySchema,
} from './auth'

export default {
    verifySignerSchema,
    tweetRechargeSchema,
    saveEncryptionPublicKeySchema,
    addSubdomainSchema,
    subdomainSchema,
    subscriptionIdSchema,
    recordTransactionSchema,
    addProposalSchema,
    getFileEncryptionKeySchema,
    saveFileEncryptionKeySchema,
    publicKeySchema,
    userUploadsSchema,
    symbolSchema,
    cidSchema,
    addCIDToQueueSchema,
    addCidSchema,
    migrationRequestEntSchema,
    migrationRequestIdSchema,
    migrationRequestSchema,
}
