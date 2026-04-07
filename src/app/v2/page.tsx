"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import FAQAccordion from "@/components/FAQAccordion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  DollarSign,
  ExternalLink,
  Filter,
  Lock,
  Search,
  Shield,
  TrendingUp,
  Unlock,
  Users,
  BarChart3,
  RefreshCw,
  Link2,
  Building2,
  Target,
  Sparkles,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const PURCHASE_URL = "/get-started";

// ─── Countdown Hook ──────────────────────────────────────────────────────────

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = targetDate.getTime() - Date.now();
    return Math.max(0, diff);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = targetDate.getTime() - Date.now();
      setTimeLeft(Math.max(0, diff));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

// ─── Assessment Flow ─────────────────────────────────────────────────────────

const ORG_TYPES = [
  { value: "nonprofit", label: "501(c)(3) Nonprofit", icon: "🏛️" },
  { value: "school", label: "School / University", icon: "🎓" },
  { value: "government", label: "Government Agency", icon: "🏢" },
  { value: "faithbased", label: "Faith-Based Organization", icon: "⛪" },
  { value: "tribal", label: "Tribal Organization", icon: "🪶" },
  { value: "other", label: "Other", icon: "📋" },
];

const FOCUS_AREAS = [
  "Education",
  "Healthcare",
  "Arts & Culture",
  "Environment",
  "Community Development",
  "Technology",
  "Social Services",
  "Youth & Families",
  "Housing",
  "Economic Development",
  "Research",
  "Other",
];

const FUNDING_RANGES = [
  { value: "small", label: "Under $10,000", desc: "Seed & micro grants" },
  { value: "medium", label: "$10,000 — $50,000", desc: "Program grants" },
  {
    value: "large",
    label: "$50,000 — $100,000",
    desc: "Major project grants",
  },
  { value: "xlarge", label: "$100,000+", desc: "Large-scale funding" },
];

function getMatchCount(
  orgType: string,
  focusAreas: string[],
  fundingRange: string
): number {
  let base = 85;
  if (orgType === "nonprofit") base += 120;
  else if (orgType === "school") base += 80;
  else if (orgType === "government") base += 60;
  else base += 40;
  base += focusAreas.length * 18;
  if (fundingRange === "small") base += 45;
  else if (fundingRange === "medium") base += 35;
  else if (fundingRange === "large") base += 20;
  else base += 10;
  return Math.min(312, Math.max(47, base));
}

function AssessmentFlow() {
  const [step, setStep] = useState(0);
  const [orgType, setOrgType] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [fundingRange, setFundingRange] = useState("");
  const [complete, setComplete] = useState(false);
  const totalSteps = 3;

  const toggleFocusArea = (area: string) => {
    setFocusAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const canProceed = () => {
    if (step === 0) return orgType !== "";
    if (step === 1) return focusAreas.length > 0;
    if (step === 2) return fundingRange !== "";
    return false;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else setComplete(true);
  };

  const matchCount = getMatchCount(orgType, focusAreas, fundingRange);

  if (complete) {
    return (
      <div className="rounded-2xl border-2 border-primary bg-primary/5 p-8 md:p-10 text-center space-y-6">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary/20">
          <Sparkles className="size-8 text-primary" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl mb-2">
            {matchCount} grants match your organization
          </h3>
          <p className="text-card-fg/50 max-w-md mx-auto">
            Based on your profile, we found {matchCount} active grants you may
            be eligible for. Get full access to see details, deadlines, and
            application links.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto py-4">
          <div className="text-center">
            <p className="text-2xl text-primary">{matchCount}</p>
            <p className="text-xs text-card-fg/50">Matching grants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-primary">$50K</p>
            <p className="text-xs text-card-fg/50">Avg. award</p>
          </div>
          <div className="text-center">
            <p className="text-2xl text-primary">$199</p>
            <p className="text-xs text-card-fg/50">One-time</p>
          </div>
        </div>
        <div className="space-y-3">
          <Link
            href={PURCHASE_URL}
            className="inline-flex items-center gap-2 h-12 px-8 text-base font-medium rounded-full bg-primary text-background hover:bg-secondary transition-colors"
          >
            Unlock All {matchCount} Grants — $199
            <ArrowRight className="size-4" />
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-sm text-card-fg/50">
            <Shield className="size-4 text-primary" />
            <span>7-day money-back guarantee</span>
          </div>
        </div>
        <button
          onClick={() => {
            setComplete(false);
            setStep(0);
            setOrgType("");
            setFocusAreas([]);
            setFundingRange("");
          }}
          className="text-xs text-card-fg/50 underline hover:text-foreground"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-card p-6 md:p-8 space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-card-fg/50">
            Step {step + 1} of {totalSteps}
          </span>
          <span className="text-card-fg/50">
            {Math.round(((step + 1) / totalSteps) * 100)}% complete
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[280px]">
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  What type of organization are you?
                </h3>
                <p className="text-sm text-card-fg/50">
                  This helps us filter relevant grants
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ORG_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setOrgType(type.value)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    orgType === type.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-white/5 hover:border-primary/30 hover:bg-white/[0.02]"
                  }`}
                >
                  <span className="text-xl">{type.icon}</span>
                  <span className="font-medium text-sm">{type.label}</span>
                  {orgType === type.value && (
                    <Check className="size-4 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  What are your focus areas?
                </h3>
                <p className="text-sm text-card-fg/50">Select all that apply</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleFocusArea(area)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    focusAreas.includes(area)
                      ? "bg-primary text-background"
                      : "bg-white/5 text-card-fg/50 hover:bg-white/10 hover:text-foreground"
                  }`}
                >
                  {focusAreas.includes(area) && (
                    <Check className="size-3 inline mr-1.5" />
                  )}
                  {area}
                </button>
              ))}
            </div>
            {focusAreas.length > 0 && (
              <p className="text-sm text-card-fg/50">
                {focusAreas.length} selected
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  What funding range are you looking for?
                </h3>
                <p className="text-sm text-card-fg/50">
                  We&apos;ll show grants in your range
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FUNDING_RANGES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setFundingRange(range.value)}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    fundingRange === range.value
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "border-white/5 hover:border-primary/30 hover:bg-white/[0.02]"
                  }`}
                >
                  <span className="font-semibold text-sm">{range.label}</span>
                  <span className="text-xs text-card-fg/50 mt-0.5">
                    {range.desc}
                  </span>
                  {fundingRange === range.value && (
                    <Check className="size-4 text-primary mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-card-fg/50 hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-default"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium rounded-full bg-primary text-background hover:bg-secondary disabled:opacity-40 cursor-pointer disabled:cursor-default transition-colors"
        >
          {step === totalSteps - 1 ? "See My Matches" : "Next"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

// ─── FAQ Data ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "How is this different from Grants.gov?",
    a: "Grants.gov is a government portal that only lists federal grants and requires you to dig through complex listings. Fundsprout curates federal, state, corporate, AND foundation grants — all in one place, with eligibility filters, complexity ratings, and direct application links. We do the research so you don't have to.",
  },
  {
    q: "Why is this so much cheaper than Instrumentl or GrantWatch?",
    a: "Instrumentl charges $500/month ($6,000/year) because they layer on CRM and workflow tools most small nonprofits don't need. GrantWatch charges $199/year — every year. We charge $199 once because we believe every nonprofit deserves access to grant opportunities, not just the ones with big budgets.",
  },
  {
    q: "What does 'lifetime access' actually mean?",
    a: "You pay $199 once and get access forever. That includes monthly updates with new grants added and expired ones removed. No recurring fees, no subscription to cancel, no price increases. The database evolves — your access doesn't expire.",
  },
  {
    q: "How often is the database updated?",
    a: "Monthly. Our team reviews every listing, adds new opportunities, removes expired ones, and updates deadlines. You'll always have current, active grants — not stale listings from two years ago.",
  },
  {
    q: "What types of grants are included?",
    a: "Federal government grants, state grants, corporate grants (Walmart, Google, Kellogg, etc.), and private foundation grants. Categories span education, healthcare, arts, community development, technology, environment, social services, and more.",
  },
  {
    q: "What if the database doesn't have what I need?",
    a: "We offer a 7-day money-back guarantee. If you sign up and the database doesn't have grants relevant to your organization, just email us within 7 days for a full refund. No questions asked.",
  },
];

// ─── Main Page Component ─────────────────────────────────────────────────────

export default function V2LandingPage() {
  const deadline = new Date("2026-04-20T23:59:59");
  const { days, hours, minutes, seconds } = useCountdown(deadline);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── URGENCY BANNER ── */}
      <div className="bg-primary/10 border-b border-primary/20 py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-sm">
          <span className="text-primary font-semibold">
            🔥 Launch Price — Ends April 20
          </span>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              {days}d
            </span>
            <span className="text-card-fg/40">:</span>
            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              {String(hours).padStart(2, "0")}h
            </span>
            <span className="text-card-fg/40">:</span>
            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              {String(minutes).padStart(2, "0")}m
            </span>
            <span className="text-card-fg/40">:</span>
            <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              {String(seconds).padStart(2, "0")}s
            </span>
          </div>
        </div>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between">
          <Link
            href="/"
            className="text-xl text-primary font-bold tracking-[-0.07em]"
          >
            fundsprout
          </Link>
          <Link
            href={PURCHASE_URL}
            className="text-sm font-medium rounded-full bg-primary text-background px-5 py-2 hover:bg-secondary transition-colors"
          >
            Get Lifetime Access — $199
          </Link>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(105,196,14,0.12),transparent)]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-foreground border border-white/10">
            <Shield className="size-3 mr-1.5 text-primary" />
            7-Day Money-Back Guarantee — Try Risk-Free
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.1]">
            Stop Wasting Hours{" "}
            <br className="hidden sm:block" />
            <span className="text-primary">Searching for Grants</span>
          </h1>

          <p className="text-lg md:text-xl text-card-fg/50 max-w-2xl mx-auto leading-relaxed">
            1,000+ curated grant opportunities for nonprofits. Filtered by your
            organization type, focus area, and eligibility. Updated monthly.{" "}
            <span className="text-foreground font-medium">
              $199 once — not $500/month.
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="#assessment"
              className="inline-flex items-center justify-center gap-2 text-base h-12 px-8 rounded-full bg-primary text-background font-medium hover:bg-secondary transition-colors"
            >
              See Grants That Match You — Free
              <ArrowRight className="size-4" />
            </a>
            <Link
              href={PURCHASE_URL}
              className="inline-flex items-center justify-center text-base h-12 px-6 rounded-full border border-white/10 text-foreground hover:bg-white/5 transition-colors"
            >
              Get Lifetime Access — $199
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-card-fg/50">
            <div className="flex items-center gap-1.5">
              <Shield className="size-4 text-primary" />
              <span>7-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-primary" />
              <span>One-time payment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="size-4 text-primary" />
              <span>Secure checkout via Stripe</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT PREVIEW ── */}
      <section className="px-4 sm:px-6 py-16 md:py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
              See What You Get
            </p>
            <h2 className="text-3xl md:text-4xl mb-4">
              A real look inside the database
            </h2>
            <p className="text-card-fg/50 max-w-xl mx-auto">
              Not just grant names — full details, eligibility criteria, amounts,
              deadlines, and direct application links.
            </p>
          </div>

          {/* Database Mockup */}
          <div className="relative rounded-2xl border border-white/5 bg-card overflow-hidden shadow-2xl shadow-primary/5">
            {/* Mock top bar */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500/60" />
                <div className="size-3 rounded-full bg-yellow-500/60" />
                <div className="size-3 rounded-full bg-primary/60" />
              </div>
              <div className="flex-1 flex items-center gap-2 bg-background/50 rounded-md px-3 py-1 text-xs text-card-fg/40">
                <Search className="size-3" />
                <span>Search 1,000+ grants...</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-card-fg/40">
                <Filter className="size-3" />
                <span>Filters</span>
              </div>
            </div>

            {/* Mock filter bar */}
            <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.01] text-xs">
              <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-full font-medium">
                Nonprofits
              </span>
              <span className="bg-white/5 text-card-fg px-2.5 py-1 rounded-full">
                Education
              </span>
              <span className="bg-white/5 text-card-fg px-2.5 py-1 rounded-full">
                $10K - $100K
              </span>
              <span className="bg-white/5 text-card-fg px-2.5 py-1 rounded-full">
                501(c)(3)
              </span>
              <span className="text-card-fg/40 flex items-center ml-1">
                Showing 147 of 1,024 grants
              </span>
            </div>

            {/* Grant cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
              {/* UNLOCKED CARD */}
              <div className="col-span-1 md:col-span-2 lg:col-span-2 rounded-xl border-2 border-primary/40 bg-primary/5 p-5 relative">
                <div className="absolute -top-3 left-4">
                  <span className="inline-flex items-center gap-1 bg-primary text-background text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <Unlock className="size-3" /> Full Access
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <h3 className="font-semibold text-lg tracking-normal">
                      Community Development Block Grant (CDBG)
                    </h3>
                    <p className="text-sm text-card-fg/50 leading-relaxed">
                      Federal funding to develop viable urban communities by
                      providing decent housing, a suitable living environment,
                      and expanding economic opportunities, principally for low-
                      and moderate-income persons.
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="size-3.5 text-primary" />
                        <span className="font-medium">
                          $50,000 — $500,000
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-yellow-500" />
                        <span>Deadline: June 30, 2026</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="size-3.5 text-blue-400" />
                        <span>Complexity: Medium</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["Housing", "Community Dev", "Federal", "501(c)(3)"].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-white/5 text-card-fg px-2 py-0.5 rounded-full border border-white/5"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 pt-2">
                      {[
                        "Eligibility criteria included",
                        "Application checklist",
                        "Direct link to apply",
                      ].map((text) => (
                        <div
                          key={text}
                          className="flex items-center gap-1.5 text-xs text-card-fg/40"
                        >
                          <Check className="size-3 text-primary" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="sm:flex-shrink-0">
                    <Link
                      href={PURCHASE_URL}
                      className="inline-flex items-center gap-1.5 text-sm font-medium rounded-full bg-primary text-background px-4 py-2 hover:bg-secondary transition-colors"
                    >
                      View Full Details
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Locked cards */}
              {[
                {
                  name: "Walmart Foundation Local Giving",
                  amount: "$25,000 — $50,000",
                  tag: "Corporate",
                },
                {
                  name: "Google Ad Grants",
                  amount: "$10,000/month",
                  tag: "Technology",
                },
                {
                  name: "W.K. Kellogg Foundation",
                  amount: "$100,000 — $500,000",
                  tag: "Education",
                },
                {
                  name: "NEA Grants for Arts Projects",
                  amount: "$10,000 — $100,000",
                  tag: "Arts",
                },
              ].map((grant, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/5 bg-card/50 p-4 opacity-60 relative"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate pr-2 tracking-normal">
                        {grant.name}
                      </h3>
                      <Lock className="size-3.5 text-card-fg/40 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-card-fg/40">
                      <DollarSign className="size-3" />
                      <span>{grant.amount}</span>
                    </div>
                    <span className="inline-block text-[10px] bg-white/5 text-card-fg px-2 py-0.5 rounded-full border border-white/5">
                      {grant.tag}
                    </span>
                    <div className="h-8 bg-white/[0.02] rounded mt-2 flex items-center justify-center text-xs text-card-fg/40">
                      <Lock className="size-3 mr-1" /> Unlock to view details
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-card-fg/40 mt-6">
            This is what your dashboard looks like after purchasing. Full details
            on every grant — no more guessing.
          </p>
        </div>
      </section>

      {/* ── ASSESSMENT SECTION ── */}
      <section
        id="assessment"
        className="px-4 sm:px-6 py-16 md:py-24 border-t border-white/5 bg-card/40"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
              Free Grant Match
            </p>
            <h2 className="text-3xl md:text-4xl mb-4">
              See how many grants match your organization
            </h2>
            <p className="text-card-fg/50 max-w-lg mx-auto">
              Answer 3 quick questions — no email required. We&apos;ll show you
              exactly how many grants in our database match your profile.
            </p>
          </div>
          <AssessmentFlow />
        </div>
      </section>

      {/* ── PRICE COMPARISON ── */}
      <section className="px-4 sm:px-6 py-16 md:py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
              Compare & Save
            </p>
            <h2 className="text-3xl md:text-4xl mb-4">
              Pay once. Search forever.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Instrumentl */}
            <div className="rounded-2xl border border-white/5 bg-card p-6 opacity-60">
              <p className="text-sm font-medium text-card-fg/50 mb-4">
                Instrumentl
              </p>
              <div className="mb-4">
                <span className="text-3xl">$500</span>
                <span className="text-card-fg/50">/month</span>
              </div>
              <p className="text-sm text-card-fg/50 mb-4">= $6,000/year</p>
              <ul className="space-y-2 text-sm text-card-fg/50">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5" /> Grant database
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5" /> Saved searches
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5" /> Deadline tracking
                </li>
              </ul>
            </div>

            {/* GrantWatch */}
            <div className="rounded-2xl border border-white/5 bg-card p-6 opacity-60">
              <p className="text-sm font-medium text-card-fg/50 mb-4">
                GrantWatch
              </p>
              <div className="mb-4">
                <span className="text-3xl">$199</span>
                <span className="text-card-fg/50">/year</span>
              </div>
              <p className="text-sm text-card-fg/50 mb-4">
                = $199 every year
              </p>
              <ul className="space-y-2 text-sm text-card-fg/50">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5" /> Grant listings
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5" /> Email alerts
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5" /> Basic filters
                </li>
              </ul>
            </div>

            {/* Fundsprout */}
            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-background text-xs font-medium px-3 py-0.5 rounded-full">
                  Best Value
                </span>
              </div>
              <p className="text-sm font-medium text-primary mb-4">
                Fundsprout
              </p>
              <div className="mb-4">
                <span className="text-3xl">$199</span>
                <span className="text-card-fg/50"> once</span>
              </div>
              <p className="text-sm text-primary mb-4 font-medium">
                = $199 total. Forever.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary" /> 1,000+ curated
                  grants
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary" /> Smart matching &
                  filters
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary" /> Complexity ratings
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary" /> Direct application
                  links
                </li>
                <li className="flex items-center gap-2">
                  <Check className="size-3.5 text-primary" /> Monthly updates
                  for life
                </li>
              </ul>
              <Link
                href={PURCHASE_URL}
                className="flex items-center justify-center gap-2 w-full mt-6 rounded-full bg-primary text-background py-3 font-medium hover:bg-secondary transition-colors"
              >
                Get Lifetime Access
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 sm:px-6 py-16 md:py-24 border-t border-white/5 bg-card/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
              What&apos;s Inside
            </p>
            <h2 className="text-3xl md:text-4xl mb-4">
              Everything you need to find and win grants
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Search,
                title: "1,000+ Live Grants",
                desc: "Federal, state, corporate, and foundation grants — all verified and active. No dead links.",
                color: "text-primary",
              },
              {
                icon: Filter,
                title: "Smart Filters",
                desc: "Filter by org type, focus area, funding amount, eligibility, and deadline. Find what fits in seconds.",
                color: "text-blue-400",
              },
              {
                icon: DollarSign,
                title: "Amounts & Deadlines",
                desc: "Every listing includes funding range, deadline, and application timeline. No surprises.",
                color: "text-secondary",
              },
              {
                icon: BarChart3,
                title: "Complexity Ratings",
                desc: "We rate each grant's application difficulty so you can pick realistic wins for your team.",
                color: "text-primary",
              },
              {
                icon: Link2,
                title: "Direct Application Links",
                desc: "Click straight through to the official application page. No middleman, no extra steps.",
                color: "text-secondary",
              },
              {
                icon: RefreshCw,
                title: "Monthly Updates",
                desc: "New grants added every month. Old ones removed. Your database stays current — forever.",
                color: "text-primary",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-white/5 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-white/5 mb-4">
                  <feature.icon className={`size-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold mb-2 tracking-normal">
                  {feature.title}
                </h3>
                <p className="text-sm text-card-fg/50 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI SECTION ── */}
      <section className="px-4 sm:px-6 py-16 md:py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
            <TrendingUp className="size-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl mb-4">
            The average grant in our database is worth $50,000
          </h2>
          <p className="text-xl text-card-fg/50 mb-6 leading-relaxed">
            Even if you win just one, that&apos;s a{" "}
            <span className="text-foreground font-semibold">250x return</span>{" "}
            on your $199.
            <br />
            And you&apos;ll have{" "}
            <span className="text-foreground font-semibold">
              1,000+ to choose from
            </span>
            .
          </p>
          <Link
            href={PURCHASE_URL}
            className="inline-flex items-center gap-2 h-12 px-8 text-base font-medium rounded-full bg-primary text-background hover:bg-secondary transition-colors"
          >
            Get Lifetime Access — $199
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── FOUNDER SECTION ── */}
      <section className="px-4 sm:px-6 py-16 md:py-24 border-t border-white/5 bg-card/40">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/5 bg-card p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex items-center gap-3 md:flex-col md:items-center md:text-center flex-shrink-0">
                <Image
                  src="/images/abdulgadir.png"
                  alt="Abdulgadir Ahmed"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-2 border-primary/20"
                />
                <div className="md:mt-2">
                  <p className="font-medium text-sm text-foreground">
                    Abdulgadir Ahmed
                  </p>
                  <p className="text-xs text-card-fg/50">
                    Co-Founder, Fundsprout
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-medium tracking-normal">
                  Why we built this
                </h3>
                <p className="text-card-fg/50 leading-relaxed">
                  &quot;I&apos;ve worked with organizations across sectors to
                  unlock growth capital — from strategy consulting at Boston
                  Consulting Group to investing at KKR and Peterson Partners. I
                  kept seeing the same problem: nonprofits missing out on
                  millions in funding because they couldn&apos;t find the right
                  grants. The big databases charge $500/month. Most organizations
                  can&apos;t afford that.
                </p>
                <p className="text-card-fg/50 leading-relaxed">
                  My focus at Fundsprout is translating complex funding
                  landscapes into actionable opportunities. We&apos;ve helped
                  organizations secure over $2M in grant funding. This database
                  is the tool I wish existed when I started.&quot;
                </p>
                <div className="flex items-center gap-4 pt-2 text-sm text-card-fg/50">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="size-4 text-primary" />
                    <span>$2M+ in grants secured</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="size-4 text-primary" />
                    <span>Harvard MBA · BCG · KKR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GUARANTEE ── */}
      <section className="px-4 sm:px-6 py-16 md:py-24 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex size-20 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Shield className="size-10 text-primary" />
          </div>
          <h2 className="text-3xl mb-4">7-Day Money-Back Guarantee</h2>
          <p className="text-lg text-card-fg/50 leading-relaxed mb-6">
            Try the full database for 7 days. If it doesn&apos;t have what
            you&apos;re looking for, email us and we&apos;ll refund every penny.
            No questions asked.
          </p>
          <p className="text-sm text-card-fg/40">
            We&apos;re confident you&apos;ll find grants worth pursuing. But if
            not — you&apos;re fully protected.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 sm:px-6 py-16 md:py-24 border-t border-white/5 bg-card/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Frequently Asked Questions</h2>
          </div>
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="px-4 sm:px-6 py-20 md:py-28 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl">
            Your next grant is already in here
          </h2>
          <p className="text-lg text-card-fg/50">
            1,000+ opportunities. $199 once. 7-day guarantee.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="#assessment"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-medium rounded-full bg-primary text-background hover:bg-secondary transition-colors"
            >
              See Your Matches — Free
              <ArrowRight className="size-4" />
            </a>
            <Link
              href={PURCHASE_URL}
              className="inline-flex items-center justify-center h-12 px-6 text-base rounded-full border border-white/10 text-foreground hover:bg-white/5 transition-colors"
            >
              Get Lifetime Access — $199
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-sm text-card-fg/40 pt-4">
            <Shield className="size-4 text-primary" />
            <span>
              7-day money-back guarantee · One-time payment · Secure checkout via
              Stripe
            </span>
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-background/95 backdrop-blur-md p-3 sm:hidden safe-area-bottom">
        <Link
          href={PURCHASE_URL}
          className="flex items-center justify-center gap-2 w-full h-11 text-base font-medium rounded-full bg-primary text-background hover:bg-secondary transition-colors"
        >
          Get Lifetime Access — $199
          <ArrowRight className="size-4" />
        </Link>
        <p className="text-center text-[10px] text-card-fg/40 mt-1">
          ✅ 7-day money-back guarantee
        </p>
      </div>

      {/* Bottom padding for sticky CTA on mobile */}
      <div className="h-20 sm:hidden" />
    </div>
  );
}
