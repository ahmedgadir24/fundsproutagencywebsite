import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const { email, password, session_id } = await request.json();

    if (!email || !password || !session_id) {
      return NextResponse.json(
        { error: "Email, password, and session_id are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // 1. Verify the Stripe session is actually paid
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not confirmed. Please try again." },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // 2. Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existing = existingUsers?.users?.find((u) => u.email === email);

    if (existing) {
      // User exists — just mark as paid and let them login
      await supabase
        .from("gp_profiles")
        .update({
          has_paid: true,
          stripe_customer_id: (session.customer as string) || null,
          stripe_session_id: session_id,
          payment_status: "paid",
          amount_paid: session.amount_total || 19900,
        })
        .eq("id", existing.id);

      // Update their password so they can sign in
      await supabase.auth.admin.updateUserById(existing.id, { password });

      return NextResponse.json({ success: true, user_id: existing.id });
    }

    // 3. Create new user
    const { data: created, error: createErr } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email verification
      });

    if (createErr || !created?.user) {
      console.error("Failed to create user:", createErr);
      return NextResponse.json(
        { error: createErr?.message || "Failed to create account." },
        { status: 500 }
      );
    }

    // 4. Create/update their profile and mark as paid
    await supabase.from("gp_profiles").upsert({
      id: created.user.id,
      email,
      has_paid: true,
      stripe_customer_id: (session.customer as string) || null,
      stripe_session_id: session_id,
      payment_status: "paid",
      amount_paid: session.amount_total || 19900,
    });

    return NextResponse.json({ success: true, user_id: created.user.id });
  } catch (error) {
    console.error("Create account error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
