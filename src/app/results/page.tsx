"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dummyGrants } from "@/lib/dummy-grants";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeEmbeddedCheckout } from "@stripe/stripe-js";
import {
  Check,
  Lock,
  Shield,
  Sparkles,
  Calendar,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

// ─── Grant preview card ───────────────────────────────────────────────────────

function formatAmount(min: number | null, max: number | null): string {
  if (!min && !max) return "Amount varies";
  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
        ? `$${(n / 1_000).toFixed(0)}K`
        : `$${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (max) return `Up to ${fmt(max)}`;
  return `From ${fmt(min!)}`;
}

const complexityColor: Record<string, string> = {
  Simple: "text-emerald-400",
  Moderate: "text-amber-400",
  Complex: "text-rose-400",
};

type PreviewGrant = (typeof dummyGrants)[0];

function GrantPreviewCard({ grant }: { grant: PreviewGrant }) {
  return (
    <div className="relative rounded-xl border border-white/5 bg-card overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-medium uppercase tracking-widest text-card-fg/40 border border-white/10 rounded-full px-2 py-0.5">
            {grant.funding_type}
          </span>
          {grant.estimated_complexity && (
            <span
              className={`text-[10px] font-medium ${complexityColor[grant.estimated_complexity] || "text-card-fg/40"}`}
            >
              {grant.estimated_complexity}
            </span>
          )}
        </div>
        <p className="text-[11px] text-card-fg/50 mb-1 truncate">
          {grant.funding_organization}
        </p>
        <h3 className="text-sm text-foreground leading-snug mb-3 line-clamp-2">
          {grant.grant_name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-base text-primary font-medium">
            {formatAmount(grant.amount_min, grant.amount_max)}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-card-fg/40">
            <Calendar size={11} />
            {grant.application_deadline || "Rolling"}
          </span>
        </div>
      </div>

      {/* Blurred body */}
      <div className="relative px-4 sm:px-5 pb-4 sm:pb-5">
        <div className="blur-sm select-none pointer-events-none space-y-1.5">
          <div className="h-3 rounded bg-white/5 w-full" />
          <div className="h-3 rounded bg-white/5 w-5/6" />
          <div className="h-3 rounded bg-white/5 w-4/6" />
          <div className="mt-3 h-3 rounded bg-white/5 w-full" />
          <div className="h-3 rounded bg-white/5 w-3/4" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <div className="rounded-full bg-background/80 p-2">
            <Lock size={14} className="text-primary" />
          </div>
          <p className="text-[10px] text-card-fg/40">Unlock to view</p>
        </div>
      </div>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FEATURES = [
  "All matched grants with full details",
  "Complexity ratings & eligibility info",
  "Direct links to every application",
  "Monthly updates with new grants",
  "Lifetime access — no subscription",
];

const focusLabel: Record<string, string> = {
  education: "Education & Youth Development",
  health: "Health & Human Services",
  environment: "Environment & Conservation",
  arts: "Arts, Culture & Humanities",
  community: "Community Development",
  technology: "Technology & Innovation",
  workforce: "Workforce & Economic Development",
  faith: "Faith & Religious Programs",
  other: "your focus area",
};

const orgLabel: Record<string, string> = {
  nonprofit_501c3: "501(c)(3) nonprofits",
  faith_based: "faith-based organizations",
  school: "educational institutions",
  government: "government agencies",
  small_business: "small businesses",
  other: "organizations like yours",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const [answers, setAnswers] = useState<Record<string, string> | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "loading" | "open"
  >("idle");
  const checkoutRef = useRef<StripeEmbeddedCheckout | null>(null);
  const checkoutContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("assessment");
    if (!stored) {
      router.push("/assessment");
      return;
    }
    setAnswers(JSON.parse(stored));
    const t = setTimeout(() => setShowResults(true), 2000);
    return () => clearTimeout(t);
  }, [router]);

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

      const email = answers?.email as string | undefined;

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

  if (!answers) return null;

  const previewGrants = dummyGrants.slice(0, 3);
  const totalMatched = dummyGrants.length;
  const focus = focusLabel[answers.focus_area || ""] || "your focus area";
  const org = orgLabel[answers.org_type || ""] || "organizations like yours";

  // ── Loading state ──
  if (!showResults) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 pt-16 sm:pt-20 min-h-screen pb-20 sm:pb-0">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5 sm:mb-6 animate-pulse">
              <Sparkles size={24} className="text-primary" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-foreground tracking-[-0.07em]">
              Searching our database...
            </h1>
            <p className="mt-2 text-sm text-card-fg/50">
              Matching grants to your organization&apos;s profile.
            </p>
            <div className="mt-6 flex justify-center flex-wrap gap-3">
              {["Federal", "State", "Foundation", "Corporate"].map(
                (type, i) => (
                  <span
                    key={type}
                    className="text-xs text-card-fg/30 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    {type} grants...
                  </span>
                )
              )}
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── Results ──
  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-20 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10 sm:space-y-14">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 sm:px-4 py-1.5 text-xs text-primary tracking-wide">
              Assessment complete
            </span>
            <h1 className="mt-4 sm:mt-5 text-3xl sm:text-5xl lg:text-6xl text-foreground tracking-[-0.07em]">
              We found{" "}
              <span className="text-primary">{totalMatched} grants</span>
            </h1>
            <p className="mt-2 sm:mt-3 text-base sm:text-xl text-card-fg/50 tracking-[-0.03em]">
              for {org} in {focus}
            </p>
          </div>

          {/* Grant previews */}
          <div>
            <p className="text-[11px] uppercase tracking-widest text-card-fg/30 mb-4">
              Preview — 3 of {totalMatched} grants
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {previewGrants.map((grant) => (
                <GrantPreviewCard key={grant.id} grant={grant} />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-center gap-1.5 text-sm text-card-fg/40">
              <span>+{totalMatched - 3} more grants locked</span>
              <ChevronRight size={14} />
            </div>
          </div>

          {/* Checkout section */}
          <div className="rounded-2xl border border-white/8 bg-card overflow-hidden">
            {checkoutState === "idle" && (
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left — pricing */}
                <div className="p-6 sm:p-8 lg:p-10">
                  <h2 className="text-xl sm:text-2xl text-foreground tracking-[-0.05em]">
                    Unlock your {totalMatched} matches
                  </h2>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl text-foreground tracking-[-0.07em]">
                      $199
                    </span>
                    <span className="text-sm text-card-fg/40">one-time</span>
                  </div>
                  <p className="mt-1 text-xs text-card-fg/40">
                    Lifetime access. No subscription ever.
                  </p>
                  <ul className="mt-5 sm:mt-7 space-y-2.5 sm:space-y-3">
                    {FEATURES.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-card-fg/70"
                      >
                        <Check
                          size={14}
                          className="text-primary mt-0.5 flex-shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right — CTA */}
                <div className="p-6 sm:p-8 lg:p-10 border-t border-white/5 lg:border-t-0 lg:border-l flex flex-col justify-center gap-5 sm:gap-6">
                  <div>
                    <button
                      onClick={openCheckout}
                      className="w-full rounded-full bg-primary px-8 py-3.5 sm:py-4 text-base font-medium text-background hover:bg-secondary transition-colors cursor-pointer"
                    >
                      Get Lifetime Access — $199
                    </button>
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-card-fg/40">
                      <Shield size={11} />
                      Secure payment via Stripe
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-5 sm:pt-6">
                    <p className="text-[11px] uppercase tracking-widest text-card-fg/30 mb-3">
                      vs. the alternatives
                    </p>
                    <div className="space-y-2 text-sm">
                      {[
                        { name: "Instrumentl", price: "$179–$899/mo" },
                        { name: "GrantWatch", price: "$199/yr" },
                        { name: "GrantStation", price: "$699/yr" },
                      ].map((c) => (
                        <div
                          key={c.name}
                          className="flex justify-between text-card-fg/40"
                        >
                          <span>{c.name}</span>
                          <span>{c.price}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-primary font-medium border-t border-white/5 pt-2 mt-2">
                        <span>Fundsprout</span>
                        <span>$199 forever</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {checkoutState === "loading" && (
              <div className="flex items-center justify-center py-20 sm:py-24 gap-3">
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <span className="text-sm text-card-fg/50">
                  Loading payment form...
                </span>
              </div>
            )}

            {checkoutState === "open" && (
              <div>
                <div className="flex items-center gap-3 px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-white/5">
                  <button
                    onClick={closeCheckout}
                    className="flex items-center gap-1.5 text-xs text-card-fg/40 hover:text-card-fg/70 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={12} />
                    Back
                  </button>
                  <span className="text-sm text-foreground">
                    Complete your purchase
                  </span>
                </div>
                <div ref={checkoutContainerRef} className="min-h-[400px]" />
              </div>
            )}
          </div>

          {/* Grant writing upsell */}
          <div className="text-center border-t border-white/5 pt-6 sm:pt-8">
            <p className="text-sm text-card-fg/40">
              Need someone to write the application?{" "}
              <a
                href="https://www.fundsprout.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors"
              >
                Our grant writers can help →
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
