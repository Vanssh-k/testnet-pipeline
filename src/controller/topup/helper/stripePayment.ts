import { v4 } from 'uuid'
import Stripe from 'stripe'
import config from '../../../config'
import { CustomError } from '../../../errors'
import { paymentPlans } from '../../libs/paymentPlans'
import { recordTransactions } from '../../../repository/topup/userTransactions'
import updateUserDataLimit from '../../../repository/user/updateUserDataLimit'
import getNetwork from '../../../middlewares/getNetwork'

const stripe = new Stripe(config.stripe_key)

async function upsertCustomer(
  walletAddress: string,
  email: string | undefined = undefined
) {
  // Search for customers with the given userId in metadata
  const existingCustomers = await stripe.customers.list({
    email: email,
  })

  let customer

  if (existingCustomers.data.length > 0) {
    // Customer exists, update if necessary
    customer = existingCustomers.data[0]
    // Here you can add code to update the customer if needed
  } else {
    // No customer found, create a new one
    customer = await stripe.customers.create({
      email: email,
      metadata: { walletAddress },
    })
  }

  return customer
}

// Currently not in use
export const setup_card_stripe = async (address: string) => {
  const customer = await upsertCustomer(address)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'setup', // This mode is for setting up payment methods
    customer: customer.id,
    success_url: `${config.payment_url}/success?transaction-id={CHECKOUT_SESSION_ID}}&mode=add-card`,
    cancel_url: `${config.payment_url}/cancel?transaction-id={CHECKOUT_SESSION_ID}}&mode=add-card`,
  })

  return { url: session.url }
}

export const create_session_order = async (
  address: string,
  subID: number,
  emailId: string | undefined
) => {
  if (emailId === undefined) {
    throw new CustomError('Forbidden', 403, 'Email not updated in profile')
  }
  const plan = paymentPlans.find((elem) => elem.index === subID)
  if (!plan) {
    throw new CustomError(
      'InvalidPlanID',
      406,
      `No active Plan matches id:${subID}`
    )
  }
  const customer = await upsertCustomer(address, emailId)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    phone_number_collection: {
      enabled: true,
    },
    invoice_creation: {
      enabled: true,
      invoice_data: {
        metadata: {
          planID: plan.index,
          storageInGB: plan.storageInGB,
          amount: plan.amount,
          walletAddress: address,
        },
      },
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Lighthouse Plan: ${plan.planName}`,
            description: `Lighthouse Topup storage: ${plan.storageInGB}GB`,
            metadata: {
              planID: plan.index,
              storageInGB: plan.storageInGB,
              amount: plan.amount,
            },
          },
          unit_amount: plan.amount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer: customer.id,
    success_url: `${config.payment_url}/success?transaction-id={CHECKOUT_SESSION_ID}&plan-id=${subID}`,
    cancel_url: `${config.payment_url}/cancel?transaction-id={CHECKOUT_SESSION_ID}&plan-id=${subID}`,
  })
  return { url: session.url }
}
