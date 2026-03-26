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
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl text-primary font-bold tracking-[-0.07em]">
            fundsprout
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/#pricing"
              className="text-sm text-card-fg hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            {user ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-card-fg hover:text-foreground transition-colors"
                >
                  Sign Out
                </button>
                <Link
                  href="/grants"
                  className="text-sm text-card-fg hover:text-foreground transition-colors"
                >
                  My Grants
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm text-card-fg hover:text-foreground transition-colors"
              >
                Log In
              </Link>
            )}
            <Link
              href="/assessment"
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-background hover:bg-secondary transition-colors"
            >
              Find My Grants
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 py-4 space-y-3">
            <Link
              href="/#pricing"
              className="block text-sm text-card-fg hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  href="/grants"
                  className="block text-sm text-card-fg hover:text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  My Grants
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMenuOpen(false);
                  }}
                  className="block text-sm text-card-fg hover:text-foreground"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="block text-sm text-card-fg hover:text-foreground"
                onClick={() => setMenuOpen(false)}
              >
                Log In
              </Link>
            )}
            <Link
              href="/assessment"
              className="block rounded-full bg-primary px-5 py-2 text-sm font-medium text-background text-center"
              onClick={() => setMenuOpen(false)}
            >
              Find My Grants
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
