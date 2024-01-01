import { CustomError } from '../../../errors'
import Stripe from 'stripe'
import config from '../../../config'
import { Request } from 'express'
const stripe = new Stripe(config.stripe_key)

export const validateStripPayload = async (req: Request) => {
  const webhookSecret = config.stripe_webhook
  let event: any
  if (webhookSecret) {
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
  return { data: null, eventType: null }
}
