import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-card mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="text-xl text-primary font-bold tracking-[-0.07em]">
              fundsprout
            </Link>
            <p className="mt-3 text-sm text-card-fg/70 max-w-xs">
              Your curated grant database, updated monthly. Find funding that
              fits your organization.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-card-fg/70">
              <li>
                <Link href="/assessment" className="hover:text-foreground transition-colors">
                  Find Grants
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-card-fg/70">
              <li>
                <a
                  href="https://www.fundsprout.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Fundsprout Platform
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@fundsprout.ai"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-card-fg/50">
          &copy; {new Date().getFullYear()} Fundsprout. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
