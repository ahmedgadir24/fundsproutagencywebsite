"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Menu, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });
    } catch {
      // Supabase not configured yet
    }
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    { href: "/#pricing", label: "Pricing" },
    { href: "/#features", label: "Features" },
    { href: "/#faq", label: "FAQ" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <Link
              href="/"
              className="text-xl sm:text-2xl text-primary font-bold tracking-[-0.07em]"
            >
              fundsprout
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-card-fg/70 hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-card-fg/70 hover:text-foreground transition-colors"
                  >
                    Sign Out
                  </button>
                  <Link
                    href="/dashboard"
                    className="text-sm text-card-fg/70 hover:text-foreground transition-colors"
                  >
                    My Grants
                  </Link>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-card-fg/70 hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  Log In
                </Link>
              )}
              <Link
                href="/get-started"
                className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-background hover:bg-secondary transition-colors"
              >
                Get Access — $199
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-foreground p-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile nav */}
          {menuOpen && (
            <div className="md:hidden border-t border-white/5 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-card-fg/70 hover:text-foreground py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block text-sm text-card-fg/70 hover:text-foreground py-1"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Grants
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="block text-sm text-card-fg/70 hover:text-foreground py-1"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block text-sm text-card-fg/70 hover:text-foreground py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Log In
                </Link>
              )}
              <Link
                href="/get-started"
                className="block rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-background text-center mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Get Access — $199
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-xl border-t border-white/5 px-4 py-3 safe-area-bottom">
        <Link
          href="/get-started"
          className="block rounded-full bg-primary px-6 py-3 text-sm font-medium text-background text-center hover:bg-secondary transition-colors"
        >
          Get Lifetime Access — $199
        </Link>
      </div>
    </>
  );
}
