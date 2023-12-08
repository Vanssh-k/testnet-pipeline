import { CustomError } from '../../../errors'
import Stripe from 'stripe'
import config from '../../../config'
const stripe = new Stripe(config.stripe_key)

export const validateStripPayload = async (req: any) => {
  const webhookSecret = config.stripe_webhook
  if (webhookSecret) {
    let event
    const signature = req.headers['stripe-signature'] as string

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed:  ${err}`)
      throw new CustomError(`webhook error`, 400, err)
    }
    return { data: event.data.object, eventType: event.type }
  } else {
    // for testing only
    // data = req.body.data.object;
    // eventType = req.body.type;
  }
}
