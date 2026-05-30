import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const PLAN_PRICE_MAP: Record<string, string | undefined> = {
  scout_monthly: process.env.STRIPE_PRICE_SCOUT_MONTHLY,
  scout_yearly: process.env.STRIPE_PRICE_SCOUT_YEARLY,
  recruiter_monthly: process.env.STRIPE_PRICE_PROMOTER_MONTHLY,
  recruiter_yearly: process.env.STRIPE_PRICE_PROMOTER_YEARLY,
  promoter_monthly: process.env.STRIPE_PRICE_PROMOTER_MONTHLY,
  promoter_yearly: process.env.STRIPE_PRICE_PROMOTER_YEARLY,
  enterprise_monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY,
  enterprise_yearly: process.env.STRIPE_PRICE_ELITE_YEARLY,
  elite_monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY,
  elite_yearly: process.env.STRIPE_PRICE_ELITE_YEARLY,
};
