/* istanbul ignore file */
import { Request } from 'express'
import { v4 } from 'uuid'
import Stripe from 'stripe'

import CustomError from '../../../middlewares/error/customError.js'
import config from '../../../config/index.js'
import { recordTransactions } from '../../../db/topup/userTransactions.js'
import updateUserDataLimit from '../../../db/user/updateUserDataLimit.js'
import getNetwork from '../../../middlewares/getNetwork.js'
import getReferral from '../../../db/user/referral/getReferral.js'
import { referralBonusPercentage } from '../../../config/constants.js'

const stripe = new Stripe(config.stripe_key)

const validateStripePayload = async (req: Request): Promise<{ data: any; eventType: string }> => {
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
      undefined,
    )
    return { data: event.data.object, eventType: event.type }
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed:  ${err}`)
    throw new CustomError(400, `webhook error`)
  }
}

// const createAdditionalSubscription = async (customerId: string) => {
//   const subscriptionParams = {
//     customer: customerId,
//     items: [
//       {
//         price: 'price_1PTJiJRt62OgkTYOuoKsvFA9', // Replace with overage plan price ID
//       },
//     ],
//   }
//   try {
//     const subscription = await stripe.subscriptions.create(subscriptionParams)
//     return subscription
//   } catch (error) {
//     console.error('Error creating additional subscription:', error)
//     throw error
//   }
// }

const processStripePayment = async (data: any, eventType: string): Promise<void> => {
  switch (eventType) {
    case 'checkout.session.completed':
      try {
        let invoiceMetadata
        let subscriptionId
        if (data.mode === 'subscription') {
          const session = await stripe.checkout.sessions.retrieve(data.id)
          invoiceMetadata = session.metadata
          subscriptionId = session.subscription as string
        } else {
          invoiceMetadata = data.invoice_creation.invoice_data.metadata
        }

        // if (invoiceMetadata.planID == 5 || invoiceMetadata.planID == 6) {
        //   await createAdditionalSubscription(data.customer)
        // }

        // check if wallet address is present means lighthouse webhook otherwise nft.storage webhook
        if (invoiceMetadata.walletAddress && invoiceMetadata.storageInGB) {
          // Check type of wallet
          const network = getNetwork(invoiceMetadata.walletAddress)
          if (network === 'evm') {
            invoiceMetadata.walletAddress = invoiceMetadata.walletAddress.toLowerCase()
          }

          // Add transaction to DB
          await recordTransactions({
            id: v4().toString(),
            txHash: data.id,
            publicKey: invoiceMetadata.walletAddress,
            tokenAddress: 'Fiat Payment',
            planID: invoiceMetadata.planID.toString(),
            subscriptionID: subscriptionId,
            amount: invoiceMetadata.amount,
            network: 'stripe',
            createdAt: Date.now(),
          })

          //Add paid data cap to DB
          const dataCapPurchased = parseInt(`${invoiceMetadata.storageInGB ?? 0}`, 10) * 1073741824 //GB converted to bytes
          if (dataCapPurchased) {
            await updateUserDataLimit(invoiceMetadata.walletAddress, dataCapPurchased)
            console.log('plan updated')

            // Fetch referred_by from the database
            const referral = await getReferral(invoiceMetadata.walletAddress)
            if (referral && referral.referredBy) {
              const bonusDataCap = dataCapPurchased * referralBonusPercentage
              await updateUserDataLimit(referral.referredBy, bonusDataCap)
              console.log('referral bonus updated')
            }
          }
        }
      } catch (err: any) {
        throw new CustomError(406, err)
      }
      break

    default:
      console.log(`Unhandled event type ${eventType}`)
  }
}

export const handleStripeWebhook = async (req: Request): Promise<void> => {
  const { data: stripeData, eventType } = await validateStripePayload(req)
  await processStripePayment(stripeData, eventType)
}
