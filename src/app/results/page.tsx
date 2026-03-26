"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dummyGrants } from "@/lib/dummy-grants";
import {
  ArrowRight,
  Check,
  Shield,
  Sparkles,
  Database,
  CalendarCheck,
  Lightbulb,
} from "lucide-react";

export default function ResultsPage() {
  const [answers, setAnswers] = useState<Record<string, string | string[]> | null>(null);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("assessment");
    if (!stored) {
      router.push("/assessment");
      return;
    }
    setAnswers(JSON.parse(stored));
    const timer = setTimeout(() => setShowResults(true), 2000);
    return () => clearTimeout(timer);
  }, [router]);

  if (!answers) return null;

  const totalMatched = dummyGrants.length;

  const focusLabel: Record<string, string> = {
    education: "Education",
    health: "Health & Human Services",
    environment: "Environment & Sustainability",
    arts: "Arts & Culture",
    community: "Community Development",
    technology: "Technology & Innovation",
    economic: "Economic Development",
    workforce: "Workforce Development",
    civic: "Civic Engagement",
    other: "your focus area",
  };

  const orgLabel: Record<string, string> = {
    nonprofit_501c3: "501(c)(3) nonprofits",
    nonprofit_other: "nonprofit organizations",
    small_business: "small businesses",
    tribal: "tribal organizations",
    government: "local governments",
    individual: "individuals and researchers",
  };

  const focus = focusLabel[(answers.focus_area as string) || "other"] || "your focus area";
  const org = orgLabel[(answers.org_type as string) || ""] || "organizations like yours";

  // Loading state
  if (!showResults) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 pt-20">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
              <Sparkles size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl text-foreground tracking-[-0.07em]">
              Searching our database...
            </h1>
            <p className="mt-2 text-card-fg/70">
              Matching grants to your organization&apos;s profile.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {["Federal grants", "State grants", "Foundation grants", "Corporate grants"].map((type, i) => (
                <span
                  key={type}
                  className="text-xs text-card-fg/40 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  {type}...
                </span>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Results header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-6">
              Assessment complete
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-[-0.07em]">
              We found{" "}
              <span className="text-primary">{totalMatched} grants</span>
            </h1>
            <h2 className="text-2xl sm:text-3xl text-card-fg/70 tracking-[-0.07em] mt-2">
              for {org} in {focus}
            </h2>
          </div>

          {/* What's inside */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="rounded-xl border border-white/5 bg-card p-5 text-center">
              <Database size={24} className="text-primary mx-auto mb-2" />
              <p className="text-2xl text-foreground tracking-[-0.05em]">{totalMatched}</p>
              <p className="text-xs text-card-fg/60">Matched grants</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-card p-5 text-center">
              <Lightbulb size={24} className="text-primary mx-auto mb-2" />
              <p className="text-2xl text-foreground tracking-[-0.05em]">{totalMatched}</p>
              <p className="text-xs text-card-fg/60">Application tips included</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-card p-5 text-center">
              <CalendarCheck size={24} className="text-primary mx-auto mb-2" />
              <p className="text-2xl text-foreground tracking-[-0.05em]">Monthly</p>
              <p className="text-xs text-card-fg/60">Database updates</p>
            </div>
          </div>

          {/* Main CTA card */}
          <div className="rounded-2xl border border-primary/20 bg-card p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl text-foreground tracking-[-0.07em]">
              Unlock your {totalMatched} matched grants
            </h2>
            <p className="mt-3 text-card-fg/70 max-w-md mx-auto">
              Get lifetime access to every grant that matches your profile,
              plus application tips, competitiveness ratings, key requirements,
              and direct links to apply.
            </p>

            <div className="mt-8 flex items-baseline justify-center gap-1">
              <span className="text-5xl text-foreground tracking-[-0.07em]">$199</span>
              <span className="text-card-fg/50 text-sm">one-time</span>
            </div>
            <p className="mt-1 text-xs text-card-fg/50">
              Lifetime access. Updated monthly. No subscription.
            </p>

            <ul className="mt-8 space-y-3 text-left max-w-sm mx-auto">
              {[
                "All " + totalMatched + " grants matched to your profile",
                "Application tips for every grant",
                "Competitiveness ratings (low / medium / high)",
                "Key requirements and eligibility details",
                "Monthly updates with new grants",
                "Direct links to apply",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-card-fg">
                  <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/auth/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-base font-medium text-background hover:bg-secondary transition-colors"
            >
              Get Lifetime Access
              <ArrowRight size={16} />
            </Link>

            <p className="mt-3 text-xs text-card-fg/50 flex items-center justify-center gap-1">
              <Shield size={12} />
              Secure payment via Stripe
            </p>
          </div>

          {/* Competitor comparison */}
          <div className="mt-12 rounded-xl border border-white/5 bg-card p-8">
            <h3 className="text-lg text-foreground tracking-[-0.03em] text-center mb-6">
              Less than one month of the alternatives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-lg bg-background/50 p-4">
                <p className="text-card-fg/50 text-xs">Instrumentl</p>
                <p className="text-lg text-foreground mt-1">$179-$899</p>
                <p className="text-card-fg/50 text-xs">per month</p>
              </div>
              <div className="rounded-lg bg-background/50 p-4">
                <p className="text-card-fg/50 text-xs">Candid</p>
                <p className="text-lg text-foreground mt-1">$55-$220</p>
                <p className="text-card-fg/50 text-xs">per month</p>
              </div>
              <div className="rounded-lg bg-background/50 p-4">
                <p className="text-card-fg/50 text-xs">GrantStation</p>
                <p className="text-lg text-foreground mt-1">$799</p>
                <p className="text-card-fg/50 text-xs">per year</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-primary text-xs font-medium">Fundsprout</p>
                <p className="text-lg text-foreground mt-1">$199</p>
                <p className="text-primary text-xs">forever</p>
              </div>
            </div>
          </div>

          {/* Grant writing upsell */}
          <div className="mt-8 rounded-xl border border-white/5 bg-card p-8 text-center">
            <h3 className="text-lg text-foreground tracking-[-0.03em]">
              Need someone to write the grant for you?
            </h3>
            <p className="mt-2 text-sm text-card-fg/70 max-w-md mx-auto">
              Our expert grant writers can craft a winning application.
              Find the grant here, and we&apos;ll help you win it.
            </p>
            <a
              href="https://www.fundsprout.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-secondary transition-colors"
            >
              Learn about our writing service
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
