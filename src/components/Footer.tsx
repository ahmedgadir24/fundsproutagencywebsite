import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-card mt-auto mb-16 md:mb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-xl text-primary font-bold tracking-[-0.07em]"
            >
              fundsprout
            </Link>
            <p className="mt-3 text-sm text-card-fg/70 max-w-xs">
              A curated grant database built by the team behind Fundsprout — the
              AI-powered grant management platform.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-card-fg/70">
              <li>
                <Link
                  href="/assessment"
                  className="hover:text-foreground transition-colors"
                >
                  Find Grants
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-foreground transition-colors"
                >
                  Log In
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
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-card-fg/70">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
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
