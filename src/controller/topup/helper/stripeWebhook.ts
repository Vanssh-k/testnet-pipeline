import { Request } from 'express'
import { v4 } from 'uuid'
import Stripe from 'stripe'

import { CustomError } from '../../../errors'
import config from '../../../config'
import { recordTransactions } from '../../../repository/topup/userTransactions'
import updateUserDataLimit from '../../../repository/user/updateUserDataLimit'
import getNetwork from '../../../middlewares/getNetwork'

const stripe = new Stripe(config.stripe_key)

const validateStripePayload = async (req: Request) => {
  const webhookSecret = config.stripe_webhook
  let event: any
  if (!webhookSecret) {
    throw new Error('Stripe webhook secret is not configured.')
  }
  try {
    event = await stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'] as any,
      webhookSecret,
      undefined
    )
    return { data: event.data.object, eventType: event.type }
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed:  ${err}`)
    throw new CustomError(`webhook error`, 400, err)
  }
}

const processStripePayment = async (data: any, eventType: any) => {
  switch (eventType) {
    case 'checkout.session.completed':
      try {
        const invoiceMetadata = data.invoice_creation.invoice_data.metadata

        // Check type of wallet
        const network = getNetwork(invoiceMetadata.walletAddress)
        if (network === 'evm') {
          invoiceMetadata.walletAddress =
            invoiceMetadata.walletAddress.toLowerCase()
        }

        // Add transaction to DB
        await recordTransactions({
          id: v4().toString(),
          txHash: data.id,
          publicKey: invoiceMetadata.walletAddress,
          tokenAddress: 'Fiat Payment',
          subscriptionID: invoiceMetadata.planID.toString(),
          amount: invoiceMetadata.amount,
          network: 'stripe',
          createdAt: Date.now(),
        })

        //Add paid data cap to DB
        const dataCapPurchased =
          parseInt(`${invoiceMetadata.storageInGB ?? 0}`, 10) * 1073741824 //GB converted to bytes
        if (dataCapPurchased) {
          await updateUserDataLimit(
            invoiceMetadata.walletAddress,
            dataCapPurchased
          )
          console.log('plan updated')
        }
      } catch (err: any) {
        throw new CustomError(`${err.message}`, 406, err)
      }
      break

    // Handle other cases

    default:
      console.log(`Unhandled event type ${eventType}`)
  }
}

export const handleStripeWebhook = async (req: Request) => {
  const { data: stripeData, eventType } = await validateStripePayload(req)
  await processStripePayment(stripeData, eventType)
}
