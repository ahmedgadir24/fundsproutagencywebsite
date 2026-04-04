import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id;
    const email = session.customer_details?.email;
    const supabase = getAdminClient();

    if (userId) {
      // Existing auth flow — user was already logged in
      const { error } = await supabase
        .from("gp_profiles")
        .update({
          has_paid: true,
          stripe_customer_id: session.customer as string,
        })
        .eq("id", userId);

      if (error) {
        console.error("Failed to update profile (auth flow):", error);
        return NextResponse.json(
          { error: "Failed to update user profile" },
          { status: 500 }
        );
      }
    } else if (email) {
      // Auth-less flow — find or create user by email, then mark as paid
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existing = existingUsers?.users?.find((u) => u.email === email);

      if (existing) {
        await supabase
          .from("gp_profiles")
          .update({
            has_paid: true,
            stripe_customer_id: session.customer as string,
          })
          .eq("id", existing.id);
      } else {
        // Create account — user will receive a magic link to set their password
        const { data: created, error: createErr } =
          await supabase.auth.admin.createUser({
            email,
            email_confirm: true,
          });

        if (createErr || !created?.user) {
          console.error("Failed to create user:", createErr);
          return NextResponse.json(
            { error: "Failed to provision user account" },
            { status: 500 }
          );
        }

        // Upsert profile — trigger may not have fired yet
        await supabase.from("gp_profiles").upsert({
          id: created.user.id,
          email,
          has_paid: true,
          stripe_customer_id: session.customer as string,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
