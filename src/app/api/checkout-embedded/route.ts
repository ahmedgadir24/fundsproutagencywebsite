import { NextResponse } from "next/server";
import { getStripe, PRICE_AMOUNT, PRODUCT_NAME } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email: string | undefined = body.email || undefined;

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      payment_method_types: ["card"],
      ...(email ? { customer_email: email } : {}),
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: PRODUCT_NAME,
              description:
                "Lifetime access to the Fundsprout Grant Database with monthly updates.",
            },
            unit_amount: PRICE_AMOUNT,
          },
          quantity: 1,
        },
      ],
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Embedded checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
