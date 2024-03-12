import dotenv from 'dotenv'
import Joi from 'joi'

dotenv.config()
const env = process.env.NODE_ENV || 'development'

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  serviceName: 'lighthouse-backend',
  logPath: 'logs',
  loki_host: process.env.LOKI_HOST ?? 'http://loki:3100',
  service: 'backend',
  lighthouse_ipfs_node: 'https://node.lighthouse.storage',
  lighthouse_auth_enc_node: 'https://encryption.lighthouse.storage',
  lighthouse_encryption_nodes: [
    'https://encryption.lighthouse.storage/api/auth-message/1',
    'https://encryption.lighthouse.storage/api/auth-message/2',
    'https://encryption.lighthouse.storage/api/auth-message/3',
    'https://encryption.lighthouse.storage/api/auth-message/4',
    'https://encryption.lighthouse.storage/api/auth-message/5',
  ],
  lighthouse_encryption_auth_keys: JSON.parse(
    process.env.LIGHTHOUSE_ENC_MESSAGE_TOKENS ?? '[]'
  ),
  lighthouse_ipns_node: process.env.LIGHTHOUSE_IPNS_NODE ?? 'http://10.0.9.53',
  est_api_key: process.env.EST_API_KEY ?? '',
  covalent_api_key: process.env.COVALENT_API_KEY ?? '',
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID ?? '',
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  log_storage_bucket: 'lighthouse-logs-store',
  cloudflare_key: process.env.CLOUDFLARE_KEY ?? '',
  data_dog_key: process.env.DATADOG_KEY ?? '',
  data_dog_host: process.env.DATADOG_HOST ?? '',
  transaction_route_token: process.env.TRANSACTION_ROUTE_TOKEN ?? '',
  polygon_rpc: process.env.POLYGON_RPC ?? '',
  filecoin_rpc:
    process.env.FILECOIN_RPC ?? 'https://api.calibration.node.glif.io/rpc/v1',
  migration_test_access_token: process.env.MIGRATION_TEST_ACCESS_TOKEN ?? '',
  route_access_token: process.env.ROUTE_ACCESS_TOKEN ?? '',
  lighthouse_public_node_token:
    process.env.LIGHTHOUSE_PUBLIC_NODE_TOKEN ?? 'vsvsvsvs',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET ?? '',
  jwt_secret: process.env.JWT_SECRET ?? '',
  twitter_api_key: process.env.TWITTER_API_KEY ?? '',
  test_wallet1_private_key:
    process.env.TEST_WALLET1_PRIVATE_KEY ??
    '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de81',
  test_wallet2_private_key:
    process.env.TEST_WALLET2_PRIVATE_KEY ??
    '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de82',
  test_wallet3_private_key:
    process.env.TEST_WALLET3_PRIVATE_KEY ??
    '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de83',
  test_wallet4_private_key:
    process.env.TEST_WALLET4_PRIVATE_KEY ??
    '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de84',
  test_wallet5_private_key:
    process.env.TEST_WALLET5_PRIVATE_KEY ??
    '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de85',
  test_wallet6_private_key:
    process.env.TEST_WALLET6_PRIVATE_KEY ??
    '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de86',
  stripe_key: process.env.STRIPE_KEY ?? '',
  stripe_webhook: process.env.STRIPE_WEBHOOK ?? '',
  payment_url: process.env.PAYMENT_URL ?? '',
  test_wallet7_api_key: process.env.TEST_WALLET7_API_KEY ?? '0x02', // Wallet in use: 0x5129b1153f4f9f321f41cba831899336cb4134c7
  lighthouse_billing_address: process.env.LIGHTHOUSE_BILLING_ADDRESS ?? '0x02',
  lighthouse_fundReceive_address:
    process.env.LIGHTHOUSE_FUNDRECEIVE_ADDRESS ??
    '0x6c73096F924D60af951A2CA345b435958387BC3f',
  lighthouse_endowment_address:
    process.env.LIGHTHOUSE_ENDOWMENT_ADDRESS ??
    '0xfaf011f515e558ad29aE4D2b13A0b2fBBD7c9C54',
  lighthouse_glifYield_address:
    process.env.LIGHTHOUSE_GLIFYIELD_ADDRESS ??
    '0xa45cEA9F88eA50310744483b989E759b3d091ea8',

  migration_ocean_access_token:
    process.env.MIGRATION_OCEAN_ACCESS_TOKEN ?? '6576576565',
  port: process.env.PORT ?? 8000,
  no_reply_email_password: process.env.NO_REPLY_EMAIL_PASSWORD,
  no_reply_email: process.env.NO_REPLY_EMAIL_ID,
}

const envVarsSchema = Joi.object({
  port: Joi.number().default(3000),
  aws_access_key_id: Joi.string().required().messages({
    'any.required': `'AWS_ACCESS_KEY_ID IS MISSING'`,
  }),
  aws_secret_access_key: Joi.string().required().messages({
    'any.required': `'AWS_SECRET_ACCESS_KEY IS MISSING'`,
  }),
  cloudflare_key: Joi.string().required().messages({
    'any.required': `'CLOUDFLARE_KEY IS MISSING'`,
  }),
  lighthouse_encryption_auth_keys: Joi.array()
    .required()
    .items(Joi.string())
    .max(baseConfig.lighthouse_encryption_nodes.length)
    .min(baseConfig.lighthouse_encryption_nodes.length),
  transaction_route_token: Joi.string().required().messages({
    'any.required': `'TRANSACTION_ROUTE_TOKEN IS MISSING'`,
  }),
  polygon_rpc: Joi.string().required().messages({
    'any.required': `'POLYGON_RPC IS MISSING'`,
  }),
  migration_test_access_token: Joi.string().required().messages({
    'any.required': `'MIGRATION_TEST_ACCESS_TOKEN IS MISSING'`,
  }),
  route_access_token: Joi.string().required().messages({
    'any.required': `'ROUTE_ACCESS_TOKEN IS MISSING'`,
  }),
  jwt_refresh_secret: Joi.string().required().messages({
    'any.required': `'JWT_REFRESH_SECRET IS MISSING'`,
  }),
  jwt_secret: Joi.string().required().messages({
    'any.required': `'JWT_SECRET IS MISSING'`,
  }),
  twitter_api_key: Joi.string().required().messages({
    'any.required': `'TWITTER_API_KEY IS MISSING'`,
  }),

  lighthouse_public_node_token: Joi.string(),
  migration_ocean_access_token: Joi.string(),
  lighthouse_billing_address: Joi.string(),
  test_wallet1_private_key: Joi.string(),
  test_wallet2_private_key: Joi.string(),
  test_wallet3_private_key: Joi.string(),
  test_wallet4_private_key: Joi.string(),
  test_wallet5_private_key: Joi.string(),
  test_wallet6_private_key: Joi.string(),
  test_wallet7_api_key: Joi.string(),
  no_reply_email_password: Joi.string().required().messages({
    'any.required': `'MAIL_REPLY_PASSWORD IS MISSING'`,
  }),
  no_reply_email: Joi.string().required().messages({
    'any.required': `'MAIL_EMAIL IS MISSING'`,
  }),
}).unknown()

const { value: envVars, error } = envVarsSchema.validate(baseConfig)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default baseConfig
