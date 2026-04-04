import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dummyGrants } from "@/lib/dummy-grants";
import FAQAccordion from "@/components/FAQAccordion";
import {
  Check,
  Lock,
  Calendar,
  Shield,
  ArrowRight,
  Star,
  Target,
  Sparkles,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
      <div className="relative px-4 sm:px-5 pb-4 sm:pb-5">
        <div className="blur-sm select-none pointer-events-none space-y-1.5">
          <div className="h-3 rounded bg-white/5 w-full" />
          <div className="h-3 rounded bg-white/5 w-5/6" />
          <div className="h-3 rounded bg-white/5 w-4/6" />
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

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    title: "1,000+ live grants",
    description:
      "Every grant is currently accepting applications. We remove expired listings and add new ones monthly.",
  },
  {
    title: "Filtered by sector & focus area",
    description:
      "Grants tagged by sector, focus area, amount, and eligibility — find what fits your mission in minutes.",
  },
  {
    title: "Amount & deadline at a glance",
    description:
      "See the grant amount range and application deadline upfront. No clicking through pages to find basic info.",
  },
  {
    title: "Complexity ratings",
    description:
      "Every grant rated by estimated complexity — from quick applications to multi-stage proposals with LOIs.",
  },
  {
    title: "Direct application links",
    description:
      "Every listing links directly to the funder's application page. No middlemen, no paywalls.",
  },
  {
    title: "Monthly updates",
    description:
      "New grants added, expired grants removed, details refreshed. Your $199 covers all future updates.",
  },
];

const FAQS = [
  {
    q: "How is this different from free databases like Grants.gov?",
    a: "Grants.gov only lists federal government grants. Our database curates across foundation, corporate, state, and federal sources — filtered by sector, eligibility, and complexity so you're not drowning in irrelevant listings.",
  },
  {
    q: "How is this different from Instrumentl or GrantWatch?",
    a: "Those are subscription products. Instrumentl charges around $500/month. GrantWatch charges $199/year, every year. We charge $199 once — lifetime access, including all future monthly updates.",
  },
  {
    q: 'What does "lifetime access" mean exactly?',
    a: "\"Lifetime\" means the lifetime of the product — as long as the Fundsprout Grant Database is actively maintained and operated. You pay $199 once and get access for the entire operational lifetime of the service, including all monthly updates. No annual renewal, no subscription.",
  },
  {
    q: "How often is the database updated?",
    a: "Monthly. We add new opportunities, update deadlines, and remove expired listings so you always have current information.",
  },
  {
    q: "What types of grants are included?",
    a: "Federal, state, foundation, and corporate grants across all major focus areas — education, health, environment, arts, community development, technology, workforce development, and more.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — if you're not satisfied within 7 days of purchase, we'll refund you in full. No questions asked.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We found three grants in the first week that we had no idea existed. One of them was a perfect fit — we wouldn't have found it on our own.",
    name: "Sarah M.",
    org: "Executive Director, Community Arts Nonprofit",
  },
  {
    quote:
      "We were paying hundreds a month for another database. Fundsprout has the same grants for $199 total. The math was obvious.",
    name: "James T.",
    org: "Director of Development, Health Services Org",
  },
  {
    quote:
      "The complexity ratings saved me so much time. I stopped wasting effort on grants that needed a 40-page proposal and focused on the ones I could actually turn around.",
    name: "Maria L.",
    org: "Grants Manager, Environmental Nonprofit",
  },
];

const STATS = [
  { value: "$2M+", label: "in grants secured" },
  { value: "30+", label: "organizations served" },
  { value: "$50K", label: "average grant award" },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── SECTION 1: Hero ── */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-primary/4 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          {/* Launch pricing — big and bold */}
          <div className="inline-flex items-center rounded-full bg-primary/15 border-2 border-primary/40 px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-primary font-medium mb-6 sm:mb-8 gap-2.5">
            <Sparkles size={16} className="text-primary" />
            Launch Price: $199 — Lifetime Access
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl text-foreground tracking-[-0.07em]">
            Find the Right Grants
            <br />
            <span className="text-primary">for Your Organization.</span>
          </h1>

          <p className="mt-5 sm:mt-6 text-base sm:text-lg text-card-fg/70 max-w-xl mx-auto leading-relaxed px-2">
            Only <span className="text-foreground font-medium">$199</span> for
            lifetime access to our database of{" "}
            <span className="text-foreground font-medium">1,000+ live grants</span>,
            updated monthly and curated for your organization.
          </p>

          {/* CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/get-started"
              className="w-full sm:w-auto rounded-full bg-primary px-8 sm:px-10 py-3.5 sm:py-4 text-base font-medium text-background hover:bg-secondary transition-colors inline-flex items-center justify-center gap-2"
            >
              Get Lifetime Access — $199
              <ArrowRight size={16} />
            </Link>
          </div>

          <p className="mt-4 text-xs text-card-fg/30 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Shield size={11} /> Secure payment via Stripe
            </span>
            <span className="hidden sm:inline">·</span>
            <span>One-time payment. No subscription.</span>
          </p>

          {/* Assessment CTA — visual card */}
          <div className="mt-10 sm:mt-14 mx-auto max-w-md">
            <Link href="/assessment" className="block group">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 text-center hover:border-primary/40 hover:bg-primary/8 transition-all">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-3">
                  <Target size={20} className="text-primary" />
                </div>
                <p className="text-base sm:text-lg text-foreground font-medium tracking-[-0.03em]">
                  Not sure yet? See your matches first.
                </p>
                <p className="mt-1.5 text-sm text-card-fg/50">
                  Answer 4 quick questions and we&apos;ll show you how many grants
                  match your organization — free.
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:gap-2.5 transition-all">
                  Take the free assessment
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>

          <p className="mt-6 text-xs text-card-fg/40">
            <Link
              href="/auth/login"
              className="hover:text-foreground transition-colors"
            >
              Already have an account? Log in →
            </Link>
          </p>
        </div>
      </section>

      {/* ── SECTION 2: Database peek ── */}
      <section className="pb-6 px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-16 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-[-0.07em]">
              A look inside the database
            </h2>
            <p className="mt-3 text-sm sm:text-base text-card-fg/50 max-w-lg mx-auto px-2">
              Federal, state, foundation, and corporate grants — all in one
              place. Full details unlocked when you get access.
            </p>
          </div>
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dummyGrants.slice(0, 6).map((grant) => (
                <GrantPreviewCard key={grant.id} grant={grant} />
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>
          <div className="text-center pt-4">
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-medium text-background hover:bg-secondary transition-colors"
            >
              Unlock the full database — $199
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: Pricing comparison — simplified ── */}
      <section
        id="pricing"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5"
      >
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-[-0.07em]">
              Stop overpaying for grant access.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-card-fg/50">
              Other platforms charge monthly. We charge once.
            </p>
          </div>

          {/* Clean comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Instrumentl */}
            <div className="rounded-2xl border border-white/5 bg-card p-5 sm:p-6 text-center">
              <p className="text-sm text-card-fg/50 mb-1">Instrumentl</p>
              <p className="text-3xl sm:text-4xl text-foreground tracking-[-0.07em]">
                $500<span className="text-base text-card-fg/40">/mo</span>
              </p>
              <p className="mt-2 text-xs text-card-fg/40">
                ~$6,000 per year
              </p>
              <div className="mt-4 h-px bg-white/5" />
              <p className="mt-4 text-xs text-card-fg/40">Recurring subscription</p>
            </div>

            {/* GrantWatch */}
            <div className="rounded-2xl border border-white/5 bg-card p-5 sm:p-6 text-center">
              <p className="text-sm text-card-fg/50 mb-1">GrantWatch</p>
              <p className="text-3xl sm:text-4xl text-foreground tracking-[-0.07em]">
                $199<span className="text-base text-card-fg/40">/yr</span>
              </p>
              <p className="mt-2 text-xs text-card-fg/40">
                $199 every year
              </p>
              <div className="mt-4 h-px bg-white/5" />
              <p className="mt-4 text-xs text-card-fg/40">Annual subscription</p>
            </div>

            {/* Fundsprout */}
            <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 p-5 sm:p-6 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-background text-[10px] font-medium uppercase tracking-widest px-3 py-1 rounded-full">
                Best Value
              </div>
              <p className="text-sm text-primary mb-1">Fundsprout</p>
              <p className="text-3xl sm:text-4xl text-primary tracking-[-0.07em] font-medium">
                $199<span className="text-base text-primary/60"> once</span>
              </p>
              <p className="mt-2 text-xs text-primary/60">
                $199 total. Forever.
              </p>
              <div className="mt-4 h-px bg-primary/20" />
              <p className="mt-4 text-xs text-primary/80 font-medium">Lifetime access. No renewal.</p>
            </div>
          </div>

          {/* ROI callout */}
          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8 text-center">
            <p className="text-lg sm:text-xl text-foreground tracking-[-0.03em] font-medium">
              The average grant award is $50,000.
            </p>
            <p className="mt-2 text-sm sm:text-base text-card-fg/60 leading-relaxed max-w-lg mx-auto">
              That&apos;s a <span className="text-primary font-medium">250x return</span> on a $199 database.
              One successful application pays for this hundreds of times over — and you get
              lifetime access to keep finding more.
            </p>
            <Link
              href="/get-started"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-background hover:bg-secondary transition-colors"
            >
              Get Lifetime Access — $199
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: What you get ── */}
      <section
        id="features"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-[-0.07em]">
              Everything you need to find and win grants
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex gap-3">
                <Check
                  size={16}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-sm text-foreground font-medium">
                    {f.title}
                  </p>
                  <p className="mt-1 text-sm text-card-fg/50 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Social proof ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          {/* Stats bar — prominent */}
          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6 sm:p-8 mb-12 sm:mb-16">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl sm:text-4xl text-primary tracking-[-0.07em] font-medium">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-card-fg/50">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl text-foreground tracking-[-0.07em]">
              Trusted by organizations that win grants
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-white/5 bg-card p-5 sm:p-6 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className="text-primary fill-primary"
                    />
                  ))}
                </div>
                <p className="text-sm text-card-fg/70 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm text-foreground font-medium">
                    {t.name}
                  </p>
                  <p className="text-xs text-card-fg/40">{t.org}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Credibility */}
          <div className="mt-10 sm:mt-12 text-center">
            <p className="text-sm text-card-fg/50">
              Built by the team behind{" "}
              <a
                href="https://www.fundsprout.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors"
              >
                Fundsprout
              </a>{" "}
              — the AI-powered grant management platform that has helped
              organizations secure over $2M in grant funding.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FAQ ── */}
      <section
        id="faq"
        className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl sm:text-3xl text-center text-foreground tracking-[-0.07em] mb-10 sm:mb-12">
            Frequently asked questions
          </h2>
          <FAQAccordion items={FAQS} />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-foreground tracking-[-0.07em]">
            Your next grant is already in here.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-card-fg/50">
            1,000+ curated opportunities. $199 once. Lifetime access. Updated
            monthly.
          </p>

          {/* How it works mini-strip */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-card-fg/40">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-medium">
                1
              </span>
              Buy lifetime access
            </span>
            <span className="hidden sm:inline text-card-fg/20">→</span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-medium">
                2
              </span>
              Create your account
            </span>
            <span className="hidden sm:inline text-card-fg/20">→</span>
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-medium">
                3
              </span>
              Find grants & apply
            </span>
          </div>

          <div className="mt-8 sm:mt-10">
            <Link
              href="/get-started"
              className="w-full sm:w-auto rounded-full bg-primary px-10 sm:px-12 py-3.5 sm:py-4 text-base font-medium text-background hover:bg-secondary transition-colors inline-flex items-center justify-center gap-2"
            >
              Get Lifetime Access — $199
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-4 text-xs text-card-fg/30">
            <Shield size={11} className="inline mr-1" />
            Secure checkout powered by Stripe. 7-day money-back guarantee.
          </p>

          <p className="mt-10 sm:mt-12 text-sm text-card-fg/40">
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
      </section>

      <Footer />
    </>
  );
}
