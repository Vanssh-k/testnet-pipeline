import dotenv from 'dotenv'
import Joi from 'joi'

dotenv.config()
const env = process.env.NODE_ENV || 'development'

const baseConfig = {
  env,
  isDev: env === 'development',
  isTest: env === 'testing',
  logPath: 'logs',
  lighthouse_ipfs_node: 'https://node.lighthouse.storage',
  lighthouse_ipns_node: 'http://10.0.9.53',
  est_api_key: process.env.EST_API_KEY ?? '',
  covalent_api_key: process.env.COVALENT_API_KEY ?? '',
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID ?? '',
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  log_storage_bucket: 'lighthouse-logs-store',
  cloudflare_key: process.env.CLOUDFLARE_KEY ?? '',
  transaction_route_token: process.env.TRANSACTION_ROUTE_TOKEN ?? '',
  polygon_rpc: process.env.POLYGON_RPC ?? '',
  migration_test_access_token: process.env.MIGRATION_TEST_ACCESS_TOKEN ?? '',
  route_access_token: process.env.ROUTE_ACCESS_TOKEN ?? '',
  lighthouse_public_node_token:
    process.env.LIGHTHOUSE_PUBLIC_NODE_TOKEN ?? 'vsvsvsvs',
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET ?? '',
  jwt_secret: process.env.JWT_SECRET ?? '',
  twitter_api_key: process.env.TWITTER_API_KEY ?? '',
  test_wallet1_private_key: process.env.TEST_WALLET1_PRIVATE_KEY ?? '0x02',
  test_wallet2_private_key: process.env.TEST_WALLET2_PRIVATE_KEY ?? '0x02',
  test_wallet3_private_key: process.env.TEST_WALLET3_PRIVATE_KEY ?? '0x02',
  test_wallet4_private_key: process.env.TEST_WALLET4_PRIVATE_KEY ?? '0x02',
  test_wallet5_private_key: process.env.TEST_WALLET5_PRIVATE_KEY ?? '0x02',
  test_wallet6_private_key: process.env.TEST_WALLET6_PRIVATE_KEY ?? '0x02',
  test_wallet7_api_key: process.env.TEST_WALLET7_API_KEY ?? '0x02',
  lighthouse_billing_address: process.env.LIGHTHOUSE_BILLING_ADDRESS ?? '0x02',
  migration_ocean_access_token:
    process.env.MIGRATION_OCEAN_ACCESS_TOKEN ?? '6576576565',
  port: process.env.PORT ?? 8000,
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
}).unknown()

const { value: envVars, error } = envVarsSchema.validate(baseConfig)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default baseConfig
