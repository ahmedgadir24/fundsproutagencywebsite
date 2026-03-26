import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroEmailCapture from "@/components/HeroEmailCapture";
import {
  ArrowRight,
  Check,
  Shield,
  Clock,
  Search,
  X,
  Target,
  Sparkles,
  CalendarCheck,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs text-primary mb-6">
            $199 for lifetime access — no subscription
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal text-foreground tracking-[-0.07em]">
            Stop searching.
            <br />
            <span className="text-primary">Start finding.</span>
          </h1>
          <p className="mt-6 text-lg text-card-fg/80 max-w-2xl mx-auto leading-relaxed">
            Enter your email and we&apos;ll match you with grants your
            organization actually qualifies for. No more sifting through
            hundreds of irrelevant results.
          </p>

          {/* Email capture */}
          <HeroEmailCapture />

          <p className="mt-4 text-xs text-card-fg/50">
            Free to see your matches. No credit card required.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl text-center text-foreground tracking-[-0.07em] mb-4">
            Grant searching is broken.
          </h2>
          <p className="text-center text-card-fg/70 mb-12 max-w-2xl mx-auto">
            You&apos;re not alone. Here&apos;s what we hear from organizations
            like yours every day.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Search,
                pain: '"I found 300 grants but none of them are relevant."',
                description:
                  "Most databases dump hundreds of results and leave you to figure out which ones actually fit. That's not discovery — that's more work.",
              },
              {
                icon: Clock,
                pain: '"We spent 40 hours on an application and got rejected."',
                description:
                  "Without knowing competitiveness levels and what reviewers look for, you're flying blind. We give you the intel upfront.",
              },
              {
                icon: X,
                pain: '"We can\'t afford $200/month just to search for funding."',
                description:
                  "Instrumentl, Candid, GrantStation — they all charge monthly subscriptions. That's $2,000+ per year just to look for money.",
              },
              {
                icon: Target,
                pain: '"I don\'t even know if we qualify for half of these."',
                description:
                  "Every funder has different eligibility rules. We filter by your org type, geography, and focus area so you only see what fits.",
              },
            ].map((item) => (
              <div
                key={item.pain}
                className="rounded-xl border border-white/5 bg-card p-6"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-primary" />
                </div>
                <p className="text-foreground font-medium text-sm mb-2">
                  {item.pain}
                </p>
                <p className="text-sm text-card-fg/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl text-center text-foreground tracking-[-0.07em] mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: Sparkles,
                title: "Tell us about your org",
                description:
                  "Enter your email and answer a few quick questions about your organization type, mission, and location.",
              },
              {
                step: "2",
                icon: Target,
                title: "See how many grants match",
                description:
                  "We search our curated database and tell you exactly how many grants fit your profile.",
              },
              {
                step: "3",
                icon: CalendarCheck,
                title: "Unlock your matches",
                description:
                  "Pay once ($199) for lifetime access to your matched grants, application tips, and monthly updates.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative">
                  <item.icon size={24} className="text-primary" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-background text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg text-foreground tracking-[-0.03em] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-card-fg/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl text-foreground tracking-[-0.07em]">
            Pay once. Access forever.
          </h2>
          <p className="mt-3 text-card-fg/70 max-w-xl mx-auto">
            Other tools charge $179-$899 per month. You shouldn&apos;t have to
            rent access to find funding.
          </p>

          {/* Named competitor comparison */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <div className="rounded-xl border border-white/5 bg-card p-5">
              <p className="text-xs text-card-fg/50 mb-1">Instrumentl</p>
              <p className="text-xl text-foreground tracking-[-0.05em]">
                $179-$899
              </p>
              <p className="text-xs text-card-fg/50">per month</p>
              <p className="text-xs text-card-fg/40 mt-2">
                $2,148-$10,788/yr
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-card p-5">
              <p className="text-xs text-card-fg/50 mb-1">Candid</p>
              <p className="text-xl text-foreground tracking-[-0.05em]">
                $55-$220
              </p>
              <p className="text-xs text-card-fg/50">per month</p>
              <p className="text-xs text-card-fg/40 mt-2">
                $660-$2,640/yr
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-card p-5">
              <p className="text-xs text-card-fg/50 mb-1">GrantStation</p>
              <p className="text-xl text-foreground tracking-[-0.05em]">
                $799
              </p>
              <p className="text-xs text-card-fg/50">per year</p>
              <p className="text-xs text-card-fg/40 mt-2">
                Renews annually
              </p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <p className="text-xs text-primary font-medium mb-1">
                Fundsprout
              </p>
              <p className="text-xl text-foreground tracking-[-0.05em]">
                $199
              </p>
              <p className="text-xs text-primary">one-time. forever.</p>
              <p className="text-xs text-primary/60 mt-2">
                No renewals ever.
              </p>
            </div>
          </div>

          {/* Pricing card */}
          <div className="mt-12 rounded-2xl border border-primary/20 bg-card p-8 sm:p-12 max-w-lg mx-auto">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl text-foreground tracking-[-0.07em]">
                $199
              </span>
              <span className="text-card-fg/50 text-sm">/ lifetime</span>
            </div>
            <p className="mt-2 text-sm text-card-fg/70">
              One payment. Updated monthly. Yours forever.
            </p>

            <ul className="mt-8 space-y-3 text-left">
              {[
                "Grants matched to your organization's profile",
                "Application tips and competitiveness ratings",
                "Key requirements and eligibility details",
                "Monthly updates with new opportunities",
                "Direct application links",
                "New grants added as we find them",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-card-fg"
                >
                  <Check
                    size={16}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <HeroEmailCapture compact />

            <p className="mt-4 text-xs text-card-fg/50 flex items-center justify-center gap-1">
              <Shield size={12} />
              Secure payment via Stripe
            </p>
          </div>

          {/* Grant writing upsell */}
          <div className="mt-12 rounded-xl border border-white/5 bg-card p-8 max-w-lg mx-auto">
            <h3 className="text-lg text-foreground tracking-[-0.03em]">
              Need help writing a grant application?
            </h3>
            <p className="mt-2 text-sm text-card-fg/70">
              Found a grant you love? Our expert grant writers will craft a
              winning application for you. Stop spending weeks writing proposals
              — let us handle it.
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
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl text-center text-foreground tracking-[-0.07em] mb-12">
            Questions? Answered.
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What does "lifetime access" mean?',
                a: "You pay once and get access to the full grant database forever. We update it monthly with new opportunities, deadlines, and amounts — all included.",
              },
              {
                q: "How is this different from Instrumentl or GrantStation?",
                a: "Those tools charge $179-$899 per month. We offer a curated, searchable grant database for a one-time payment of $199. No subscriptions, no recurring fees.",
              },
              {
                q: "How often is the database updated?",
                a: "Monthly. We add new grants, update deadlines, and remove expired opportunities so you always have current information.",
              },
              {
                q: "Can I see my matches before paying?",
                a: "Yes. Take our free assessment to see how many grants match your organization. You only pay when you're ready to access the full details.",
              },
              {
                q: "What if I need help writing a grant application?",
                a: "We offer a professional grant writing service through our main platform at fundsprout.ai. Find the grant here, and we'll help you win it.",
              },
              {
                q: "What types of grants are included?",
                a: "Federal, state, foundation, and corporate grants across all major focus areas — education, health, environment, arts, community development, technology, and more.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="border-b border-white/5 pb-6"
              >
                <h3 className="text-foreground font-medium text-sm">
                  {item.q}
                </h3>
                <p className="mt-2 text-sm text-card-fg/70 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl text-foreground tracking-[-0.07em]">
            Your next grant is waiting.
          </h2>
          <p className="mt-3 text-card-fg/70">
            Enter your email. We&apos;ll match you with grants in under 2
            minutes.
          </p>
          <div className="mt-8">
            <HeroEmailCapture compact />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
