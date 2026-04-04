import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PaymentReturnPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) redirect("/");

  let destination = "/";

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      destination = `/welcome?session_id=${session_id}`;
    } else {
      destination = "/get-started?payment=failed";
    }
  } catch (err) {
    console.error("Payment return error:", err);
    destination = "/";
  }

  redirect(destination);
}
