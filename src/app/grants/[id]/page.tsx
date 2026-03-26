import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dummyGrants } from "@/lib/dummy-grants";
import { Grant } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  Lock,
  ArrowRight,
} from "lucide-react";

async function getGrant(id: string): Promise<Grant | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("grants")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) return data as Grant;
  } catch {
    // Fall back to dummy data
  }

  const dummy = dummyGrants.find((g) => g.id === id);
  if (!dummy) return null;
  return {
    ...dummy,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as Grant;
}

async function checkPaymentStatus(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from("profiles")
      .select("has_paid")
      .eq("id", user.id)
      .single();

    return profile?.has_paid ?? false;
  } catch {
    return false;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function GrantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [grant, hasPaid] = await Promise.all([
    getGrant(id),
    checkPaymentStatus(),
  ]);

  if (!grant) notFound();

  const competitivenessColors = {
    low: "bg-primary/20 text-primary",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-red-500/20 text-red-400",
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/grants"
            className="inline-flex items-center gap-2 text-sm text-card-fg/60 hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to grants
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {grant.grant_type}
            </span>
            <span className="inline-flex items-center rounded-full bg-alt/20 px-3 py-1 text-xs font-medium text-card-fg">
              {grant.focus_area}
            </span>
            {grant.competitiveness && (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${competitivenessColors[grant.competitiveness]}`}
              >
                {grant.competitiveness} competition
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl text-foreground tracking-[-0.07em]">
            {grant.title}
          </h1>
          <p className="mt-2 text-lg text-card-fg/70">{grant.funder}</p>

          {/* Key details */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/5 bg-card p-5">
              <div className="flex items-center gap-2 text-xs text-card-fg/60 mb-1">
                <DollarSign size={12} />
                Funding Range
              </div>
              <p className="text-lg text-foreground">
                {grant.amount_min && grant.amount_max
                  ? `${formatCurrency(grant.amount_min)} - ${formatCurrency(grant.amount_max)}`
                  : grant.typical_award || "Contact funder"}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-card p-5">
              <div className="flex items-center gap-2 text-xs text-card-fg/60 mb-1">
                <Calendar size={12} />
                Deadline
              </div>
              <p className="text-lg text-foreground">
                {grant.deadline
                  ? new Date(grant.deadline).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Rolling / Open"}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-card p-5">
              <div className="flex items-center gap-2 text-xs text-card-fg/60 mb-1">
                <MapPin size={12} />
                Geography
              </div>
              <p className="text-lg text-foreground">{grant.geography}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl text-foreground tracking-[-0.03em] mb-3">
              About this grant
            </h2>
            <p className="text-card-fg leading-relaxed">{grant.description}</p>
          </div>

          {/* Eligibility */}
          <div className="mt-6">
            <h2 className="text-xl text-foreground tracking-[-0.03em] mb-3">
              Eligibility
            </h2>
            <p className="text-card-fg">{grant.eligibility}</p>
          </div>

          {/* Paid-only content */}
          {hasPaid ? (
            <>
              {grant.advice && (
                <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6">
                  <h2 className="text-xl text-foreground tracking-[-0.03em] mb-3">
                    Application Tips
                  </h2>
                  <p className="text-card-fg leading-relaxed">{grant.advice}</p>
                </div>
              )}

              {grant.key_requirements && (
                <div className="mt-6">
                  <h2 className="text-xl text-foreground tracking-[-0.03em] mb-3">
                    Key Requirements
                  </h2>
                  <p className="text-card-fg">{grant.key_requirements}</p>
                </div>
              )}

              {grant.typical_award && (
                <div className="mt-6">
                  <h2 className="text-xl text-foreground tracking-[-0.03em] mb-3">
                    Typical Award
                  </h2>
                  <p className="text-card-fg">{grant.typical_award}</p>
                </div>
              )}

              {grant.application_url && (
                <a
                  href={grant.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-medium text-background hover:bg-secondary transition-colors"
                >
                  Apply Now
                  <ExternalLink size={16} />
                </a>
              )}

              {/* Upsell to grant writing */}
              <div className="mt-12 rounded-xl border border-white/5 bg-card p-8 text-center">
                <h3 className="text-xl text-foreground tracking-[-0.03em]">
                  Want us to write this grant for you?
                </h3>
                <p className="mt-2 text-sm text-card-fg/70 max-w-md mx-auto">
                  Our expert grant writers can craft a winning application for
                  this grant. Save time and increase your chances.
                </p>
                <a
                  href="https://www.fundsprout.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  Get Grant Writing Help
                  <ArrowRight size={14} />
                </a>
              </div>
            </>
          ) : (
            <div className="mt-8 relative">
              <div className="rounded-xl border border-white/5 bg-card p-8 blur-sm">
                <h2 className="text-xl text-foreground mb-3">
                  Application Tips
                </h2>
                <p className="text-card-fg">
                  Detailed advice on how to approach this grant application,
                  what reviewers look for, and tips for success...
                </p>
                <h2 className="text-xl text-foreground mb-3 mt-6">
                  Key Requirements
                </h2>
                <p className="text-card-fg">
                  Specific requirements you must meet, documents you need to
                  prepare, and eligibility criteria...
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-background/80 rounded-2xl p-8 border border-primary/20">
                  <Lock size={32} className="mx-auto text-card-fg/40 mb-3" />
                  <h3 className="text-lg text-foreground tracking-[-0.03em]">
                    Unlock full grant details
                  </h3>
                  <p className="mt-1 text-sm text-card-fg/70">
                    Get application tips, key requirements, and more.
                  </p>
                  <Link
                    href="/auth/signup"
                    className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-background hover:bg-secondary transition-colors"
                  >
                    Get Full Access — $199
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
