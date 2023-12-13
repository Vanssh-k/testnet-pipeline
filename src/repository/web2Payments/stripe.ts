import express, { Request, Response } from 'express'
import Stripe from 'stripe'
import config from '../../config'
import { CustomError } from '../../errors'
import {
  getPurchasablePlans,
  IDeductionDetails,
} from '../../controller/topup/helper/billing'
import { add } from 'winston'

const stripe = new Stripe(config.stripe_key)

async function upsertCustomer(
  walletAddress: string,
  email: string | undefined = undefined
) {
  // Search for customers with the given userId in metadata
  const existingCustomers = await stripe.customers.list({
    email: email ?? `${walletAddress}@lighthouse.storage`,
  })

  let customer

  if (existingCustomers.data.length > 0) {
    // Customer exists, update if necessary
    customer = existingCustomers.data[0]
    // Here you can add code to update the customer if needed
  } else {
    // No customer found, create a new one
    customer = await stripe.customers.create({
      email: email ?? `${walletAddress}@lighthouse.storage`,
      metadata: { walletAddress },
    })
  }

  return customer
}

async function createProductAndPrice(plan: IDeductionDetails) {
  let product

  try {
    // Try to retrieve the product by ID
    product = await stripe.products.retrieve(
      `${plan.detail.planName}-${plan.index}`
    )
  } catch (error: any) {
    // If the product does not exist, create it
    if (error.code === 'resource_missing') {
      product = await stripe.products.create({
        name: `Lighthouse ${plan.detail.planName} Subscription`,
        id: `${plan.detail.planName}-${plan.index}`,
        description: `Lighthouse Topup storage: ${plan.detail.storageInGB}GB \n Plus ${plan.detail.bandwidthInGB}GB bandwidth`,
      })
    } else {
      // Handle other errors
      console.log(error)
      throw error
    }
  }

  // Assuming the price needs to be unique per product
  let price

  // List all prices for this product and find if our price already exists
  const prices = await stripe.prices.list({ product: product.id })
  price = prices.data.find((p) => p.currency === 'usd')

  // If the price does not exist, create it
  if (!price) {
    price = await stripe.prices.create({
      unit_amount: plan.amount / 1e4, // Amount in cents
      currency: 'usd',
      recurring: {
        interval:
          plan.nextDeductionInNumOfBlocks === 14600000 ? 'year' : 'month',
      },
      product: product.id,
    })
  }

  return { product, price }
}

export const setup_card_stripe = async (address: string) => {
  const customer = await upsertCustomer(address)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'setup', // This mode is for setting up payment methods
    customer: customer.id,
    success_url: 'https://your-success-url.com', // Your success URL
    cancel_url: 'https://your-cancel-url.com', // Your cancel URL
  })

  return { url: session.url }
}

export const create_session_order = async (address: string, subID: number) => {
  const plans = (await getPurchasablePlans()).activePurchasablePlans
  const plan = plans.find((elem) => elem.index === subID)
  if (!plan) {
    throw new CustomError(
      'InvalidPlanID',
      406,
      `No active Plan matches id:${subID}`
    )
  }
  const customer = await upsertCustomer(address)

  if (plan.totalNumOfDeduction === 1) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      phone_number_collection: {
        enabled: true,
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Lighthouse Plan: ${plan.detail.planName}`,
              description: `Lighthouse Topup storage: ${plan.detail.storageInGB}GB \n Plus ${plan.detail.bandwidthInGB}GB bandwidth`,
              metadata: { planID: plan.index, ...plan.detail },
            },
            unit_amount: plan.amount / 1e4,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer: customer.id,
      success_url: `${config.payment_url}/checkout-success`,
      cancel_url: `${config.payment_url}/cart`,
    })
    return { url: session.url }
  } else {
    const { product, price } = await createProductAndPrice(plan)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      payment_method_collection: 'always',
      mode: 'subscription',
      customer: customer.id,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${config.payment_url}/checkout-success`,
      cancel_url: `${config.payment_url}/cart`,
    })
    return { url: session.url }
  }
}

export const processStripePayment = async (data: any, eventType: any) => {
  if (eventType === 'checkout.session.completed') {
    stripe.customers
      .retrieve(data.customer)
      .then(async (customer) => {
        try {
          //save and Create Login
          console.log(customer, data)
        } catch (err: any) {
          new CustomError(`${err.message}`, 406, err)
        }
      })
      .catch((err: any) => new CustomError(`${err.message}`, 406, err))
  }
  return 'success'
}
