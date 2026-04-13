"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { track } from "@/lib/track";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeEmbeddedCheckout } from "@stripe/stripe-js";
import {
  Check,
  Shield,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Database,
  RefreshCw,
  Link2,
  BarChart3,
  Zap,
} from "lucide-react";

const INCLUDED = [
  { icon: Database, text: "1,000+ curated grant opportunities" },
  { icon: BarChart3, text: "Complexity ratings & eligibility details" },
  { icon: Link2, text: "Direct links to every application" },
  { icon: RefreshCw, text: "Monthly updates — new grants every month" },
  { icon: Zap, text: "Instant access after purchase" },
];

export default function GetStartedPage() {
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "loading" | "open"
  >("idle");
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null);
  const checkoutContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      checkoutRef.current?.destroy();
    };
  }, []);

  const openCheckout = async () => {
    setCheckoutState("loading");
    try {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      if (!stripe) throw new Error("Stripe failed to load");

      // Pull email from session if they came through assessment
      let email: string | undefined;
      try {
        const assessment = sessionStorage.getItem("assessment");
        if (assessment) {
          const parsed = JSON.parse(assessment);
          email = parsed.email;
        }
        if (!email) {
          email = sessionStorage.getItem("lead_email") || undefined;
        }
      } catch {
        // ignore
      }

      const checkout = await stripe.initEmbeddedCheckout({
        fetchClientSecret: async () => {
          const res = await fetch("/api/checkout-embedded", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          return data.clientSecret;
        },
      });

      checkoutRef.current = checkout;
      setCheckoutState("open");

      setTimeout(() => {
        if (checkoutContainerRef.current) {
          checkout.mount(checkoutContainerRef.current);
        }
      }, 50);
    } catch (err) {
      console.error(err);
      setCheckoutState("idle");
    }
  };

  const closeCheckout = () => {
    checkoutRef.current?.destroy();
    checkoutRef.current = null;
    setCheckoutState("idle");
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-20 sm:pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="mx-auto max-w-4xl">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-card-fg/50 hover:text-foreground transition-colors mb-8 sm:mb-10"
          >
            <ArrowLeft size={14} />
            Back to homepage
          </Link>

          {checkoutState === "idle" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left — messaging */}
              <div>
                <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs text-primary gap-1.5 mb-5">
                  <Sparkles size={12} />
                  Launch Pricing
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-[-0.07em]">
                  Start finding grants
                  <br />
                  <span className="text-primary">today.</span>
                </h1>

                <p className="mt-4 text-base sm:text-lg text-card-fg/60 leading-relaxed">
                  You&apos;re one step away from accessing 1,000+ grant
                  opportunities. The average grant in our database is worth{" "}
                  <span className="text-foreground font-medium">$50,000</span>.
                  Your investment? Just $199. Once.
                </p>

                {/* What's included */}
                <div className="mt-8 space-y-3.5">
                  {INCLUDED.map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon size={16} className="text-primary" />
                      </div>
                      <p className="text-sm text-card-fg/70">{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Trust signals */}
                <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-card-fg/40">
                  <span className="flex items-center gap-1.5">
                    <Shield size={12} />
                    Secure checkout
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check size={12} />
                    7-day money-back guarantee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check size={12} />
                    No subscription
                  </span>
                </div>
              </div>

              {/* Right — checkout card */}
              <div className="lg:mt-8">
                <div className="rounded-2xl border border-white/5 bg-card p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <p className="text-sm text-card-fg/50 mb-1">
                      Fundsprout Grant Database
                    </p>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl text-foreground tracking-[-0.07em] font-medium">
                        $199
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-card-fg/40">
                      One-time payment · Lifetime access
                    </p>
                  </div>

                  <div className="h-px bg-white/5 mb-6" />

                  <ul className="space-y-3 mb-8">
                    {[
                      "1,000+ live grants across all sectors",
                      "Filter by focus area, geography & complexity",
                      "Direct application links",
                      "Monthly updates included forever",
                      "Full eligibility details for every grant",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-card-fg/70"
                      >
                        <Check
                          size={14}
                          className="text-primary mt-0.5 flex-shrink-0"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      track("cta_click", { button: "checkout_get_access" });
                      if (typeof window !== "undefined" && (window as any).fbq) {
                        (window as any).fbq("track", "InitiateCheckout", {
                          value: 199.0,
                          currency: "USD",
                          content_name: "Fundsprout Grant Database",
                          content_category: "Lifetime Access",
                        });
                      }
                      openCheckout();
                    }}
                    className="w-full rounded-full bg-primary px-8 py-4 text-base font-medium text-background hover:bg-secondary transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    Get Lifetime Access
                    <ArrowRight size={16} />
                  </button>

                  <p className="mt-4 text-center text-xs text-card-fg/30 flex items-center justify-center gap-1.5">
                    <Shield size={11} />
                    Powered by Stripe · 256-bit SSL encryption
                  </p>
                </div>

                {/* Comparison footnote */}
                <div className="mt-4 rounded-xl border border-white/5 bg-card/50 p-4 text-center">
                  <p className="text-xs text-card-fg/40">
                    Instrumentl charges ~$500/mo. GrantWatch charges $199/yr.
                    <br />
                    <span className="text-primary font-medium">
                      You pay $199 once. That&apos;s it.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {checkoutState === "loading" && (
            <div className="flex items-center justify-center py-32 gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-base text-card-fg/50">
                Loading secure checkout...
              </span>
            </div>
          )}

          {checkoutState === "open" && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={closeCheckout}
                  className="flex items-center gap-1.5 text-sm text-card-fg/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              </div>
              <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-white/5 text-center">
                  <p className="text-lg text-foreground tracking-[-0.03em]">
                    Complete your purchase
                  </p>
                  <p className="text-sm text-card-fg/40">
                    Fundsprout Grant Database — $199 lifetime access
                  </p>
                </div>
                <div
                  ref={checkoutContainerRef}
                  className="min-h-[450px]"
                />
              </div>
              <p className="mt-4 text-center text-xs text-card-fg/30">
                <Shield size={11} className="inline mr-1" />
                Your payment is secured by Stripe. 7-day money-back guarantee.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
