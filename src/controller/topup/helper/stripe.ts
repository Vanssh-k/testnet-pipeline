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
      console.log({ webhookSecret, body: JSON.stringify(req.body) })
      event = await stripe.webhooks.constructEventAsync(
        JSON.stringify(req.body),
        req.headers['stripe-signature'] as any,
        webhookSecret,
        undefined
      )
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed:  ${err}`)
      throw new CustomError(`webhook error`, 400, err)
    }
  }
  return { data: event?.data?.object, eventType: event?.type }
}
