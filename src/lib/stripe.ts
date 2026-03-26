import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return _stripe;
}

export const PRICE_AMOUNT = 19900; // $199.00 in cents
export const PRODUCT_NAME = "Fundsprout Grant Database - Lifetime Access";
