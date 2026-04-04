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
      .from("gp_grants")
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
      .from("gp_profiles")
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

const complexityColors: Record<string, string> = {
  Simple: "bg-primary/20 text-primary",
  Moderate: "bg-yellow-500/20 text-yellow-400",
  Complex: "bg-red-500/20 text-red-400",
};

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

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-20 sm:pb-16 px-4 sm:px-6 lg:px-8">
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
              {grant.funding_type}
            </span>
            <span className="inline-flex items-center rounded-full bg-alt/20 px-3 py-1 text-xs font-medium text-card-fg">
              {grant.focus_area}
            </span>
            {grant.estimated_complexity &&
              complexityColors[grant.estimated_complexity] && (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${complexityColors[grant.estimated_complexity]}`}
                >
                  {grant.estimated_complexity}
                </span>
              )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-[-0.07em]">
            {grant.grant_name}
          </h1>
          <p className="mt-2 text-base sm:text-lg text-card-fg/70">
            {grant.funding_organization}
          </p>

          {/* Key details */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border border-white/5 bg-card p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs text-card-fg/60 mb-1">
                <DollarSign size={12} />
                Funding Range
              </div>
              <p className="text-base sm:text-lg text-foreground">
                {grant.amount_min && grant.amount_max
                  ? `${formatCurrency(grant.amount_min)} - ${formatCurrency(grant.amount_max)}`
                  : "Contact funder"}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-card p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs text-card-fg/60 mb-1">
                <Calendar size={12} />
                Deadline
              </div>
              <p className="text-base sm:text-lg text-foreground">
                {grant.application_deadline || "Rolling / Open"}
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-card p-4 sm:p-5">
              <div className="flex items-center gap-2 text-xs text-card-fg/60 mb-1">
                <MapPin size={12} />
                Geography
              </div>
              <p className="text-base sm:text-lg text-foreground">
                {grant.geographic_eligibility}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 sm:mt-8">
            <h2 className="text-lg sm:text-xl text-foreground tracking-[-0.03em] mb-3">
              About this grant
            </h2>
            <p className="text-sm sm:text-base text-card-fg leading-relaxed">
              {grant.description}
            </p>
          </div>

          {/* Eligibility */}
          <div className="mt-6">
            <h2 className="text-lg sm:text-xl text-foreground tracking-[-0.03em] mb-3">
              Eligible Organizations
            </h2>
            <p className="text-sm sm:text-base text-card-fg">
              {grant.eligible_org_types}
            </p>
          </div>

          {/* Additional details */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {grant.grant_cycle && (
              <div className="rounded-xl border border-white/5 bg-card p-4">
                <p className="text-xs text-card-fg/60 mb-1">Grant Cycle</p>
                <p className="text-sm text-foreground">{grant.grant_cycle}</p>
              </div>
            )}
            {grant.requires_loi && (
              <div className="rounded-xl border border-white/5 bg-card p-4">
                <p className="text-xs text-card-fg/60 mb-1">
                  Requires Letter of Intent
                </p>
                <p className="text-sm text-foreground">{grant.requires_loi}</p>
              </div>
            )}
            {grant.org_budget_requirement && (
              <div className="rounded-xl border border-white/5 bg-card p-4">
                <p className="text-xs text-card-fg/60 mb-1">
                  Budget Requirement
                </p>
                <p className="text-sm text-foreground">
                  {grant.org_budget_requirement}
                </p>
              </div>
            )}
          </div>

          {/* Paid-only content */}
          {hasPaid ? (
            <>
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
              <div className="mt-10 sm:mt-12 rounded-xl border border-white/5 bg-card p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl text-foreground tracking-[-0.03em]">
                  Want us to write this grant for you?
                </h3>
                <p className="mt-2 text-sm text-card-fg/70 max-w-md mx-auto">
                  Our expert grant writers can craft a winning application.
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
              <div className="rounded-xl border border-white/5 bg-card p-6 sm:p-8 blur-sm">
                <h2 className="text-xl text-foreground mb-3">
                  Application Link & Details
                </h2>
                <p className="text-card-fg">
                  Direct link to the application page, additional requirements,
                  and tips for a successful application...
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-background/80 rounded-2xl p-6 sm:p-8 border border-primary/20 mx-4">
                  <Lock size={28} className="mx-auto text-card-fg/40 mb-3" />
                  <h3 className="text-base sm:text-lg text-foreground tracking-[-0.03em]">
                    Unlock full grant details
                  </h3>
                  <p className="mt-1 text-sm text-card-fg/70">
                    Get application links, requirements, and more.
                  </p>
                  <Link
                    href="/get-started"
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
