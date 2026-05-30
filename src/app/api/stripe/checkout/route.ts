import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe, PLAN_PRICE_MAP } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      {
        message:
          "Stripe is not configured. Add STRIPE_SECRET_KEY and price IDs to .env.local.",
      },
      { status: 503 }
    );
  }

  const { planId, interval } = await request.json();
  const priceKey = `${planId}_${interval ?? "monthly"}`;
  const priceId = PLAN_PRICE_MAP[priceKey];

  if (!priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  let customerEmail: string | undefined;
  try {
    const { userId, sessionClaims } = await auth();
    if (userId) {
      customerEmail = sessionClaims?.email as string | undefined;
    }
  } catch {
    /* demo checkout without auth */
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/pricing?checkout=cancelled`,
    customer_email: customerEmail,
    metadata: { planId },
  });

  return NextResponse.json({ url: session.url });
}
