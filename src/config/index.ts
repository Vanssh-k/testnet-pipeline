import dotenv from 'dotenv'
dotenv.config()

const baseConfig = {
  environment: process.env.ENVIRONMENT || 'development',
  port: process.env.PORT ?? 8000,
  redis_url: process.env.REDIS_URL,

  devLogPath: './combined.log',
  logger_loki_host: process.env.LOKI_HOST,
  logger_loki_username: process.env.LOKI_USERNAME,
  logger_loki_password: process.env.LOKI_PASSWORD,

  smtp_email_host: process.env.SMTP_EMAIL_HOST,
  smtp_email_id: process.env.SMTP_EMAIL_ID,
  smtp_emai_password: process.env.SMTP_EMAIL_PASSWORD,

  lighthouse_encryption_auth_keys: JSON.parse(process.env.LIGHTHOUSE_ENC_MESSAGE_TOKENS ?? '[]'),
  lighthouse_ipns_node: process.env.LIGHTHOUSE_IPNS_NODE ?? 'http://10.0.9.53',

  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID ?? '',
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  aws_region: process.env.AWS_REGION ?? 'ap-south-1',

  polygon_rpc: process.env.POLYGON_RPC ?? '',
  filecoin_rpc: process.env.FILECOIN_RPC ?? 'https://api.calibration.node.glif.io/rpc/v1',

  transaction_route_token: process.env.TRANSACTION_ROUTE_TOKEN ?? '',
  route_access_token: process.env.ROUTE_ACCESS_TOKEN ?? '',
  lighthouse_public_node_token: process.env.LIGHTHOUSE_PUBLIC_NODE_TOKEN ?? 'vsvsvsvs',

  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET ?? '',
  jwt_secret: process.env.JWT_SECRET ?? '',

  test_wallet1_private_key:
    process.env.TEST_WALLET1_PRIVATE_KEY ?? '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de81',
  test_wallet2_private_key:
    process.env.TEST_WALLET2_PRIVATE_KEY ?? '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de82',
  test_wallet3_private_key:
    process.env.TEST_WALLET3_PRIVATE_KEY ?? '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de83',
  test_wallet4_private_key:
    process.env.TEST_WALLET4_PRIVATE_KEY ?? '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de84',
  test_wallet5_private_key:
    process.env.TEST_WALLET5_PRIVATE_KEY ?? '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de85',
  test_wallet6_private_key:
    process.env.TEST_WALLET6_PRIVATE_KEY ?? '8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de86',

  test_wallet6_api_key: process.env.TEST_WALLET6_API_KEY, // Wallet in use: 0x75a22ede971080c8448c46de6ae5df3f64c67475
  test_wallet7_api_key: process.env.TEST_WALLET7_API_KEY ?? '0x02', // Wallet in use: 0x5129b1153f4f9f321f41cba831899336cb4134c7
  test_wallet7_api_key_development: process.env.TEST_WALLET7_API_KEY_DEVELOPMENT ?? '0x02',

  stripe_key: process.env.STRIPE_KEY ?? '',
  stripe_webhook: process.env.STRIPE_WEBHOOK ?? '',
  payment_url: process.env.PAYMENT_URL ?? '',

  lighthouse_billing_address: process.env.LIGHTHOUSE_BILLING_ADDRESS ?? '0x02',

  lighthouse_endowment_address:
    process.env.LIGHTHOUSE_ENDOWMENT_ADDRESS ?? '0x520A3eb4Ce7e2827dD1C313683AEC11eD74C3322',
  lighthouse_glifYield_address:
    process.env.LIGHTHOUSE_GLIFYIELD_ADDRESS ?? '0x21C491Ea745D26aFC82E695849fEc27e95eD717D',
  filecoin_usdc: process.env.FILECOIN_USDC ?? '0xA471B7936906fF810865e52AF86C12B9865C850A',

  coreum_api_url: 'https://full-node.mainnet-1.coreum.dev:1317/cosmos/tx/v1beta1/txs',
  lighthouse_coreum_address: process.env.LIGHTHOUSE_COREUM_ADDRESS ?? 'core145f5j80zfr730kndlx7ek55pt6ya0kcnr6d9ha',

  radix_api_url: 'https://mainnet.radixdlt.com/transaction/committed-details',
  lighthouse_radix_address:
    process.env.LIGHTHOUSE_RADIX_ADDRESS ?? 'account_rdx12y9lphtr6yjy0pskv287v8kkcyjwfqssn3sgzlwmjhr7rlqx2kr5np',
  radixApplicationName: 'filesdapp',
  radixDappDefination:
    process.env.RADIX_DAPP_DEFINATION ?? 'account_rdx12y9lphtr6yjy0pskv287v8kkcyjwfqssn3sgzlwmjhr7rlqx2kr5np',
  radixNetworkId: 1,
  radixExpectedOrigin: process.env.RADIX_EXPECTED_ORIGIN ?? 'https://files.lighthouse.storage',
}

export default baseConfig
