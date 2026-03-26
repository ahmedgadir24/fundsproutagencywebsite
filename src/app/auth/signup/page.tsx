"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import { Check, Shield } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          organization_name: orgName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/grants");
      router.refresh();
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl text-foreground tracking-[-0.07em]">
              Get started
            </h1>
            <p className="mt-2 text-sm text-card-fg/70">
              Create your account to browse grants. Pay when you&apos;re ready
              for full access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Signup form */}
            <form onSubmit={handleSignup} className="space-y-4 md:col-span-1">
              <div>
                <label className="block text-xs text-card-fg/60 mb-1.5">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Your Organization"
                />
              </div>
              <div>
                <label className="block text-xs text-card-fg/60 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="you@org.com"
                />
              </div>
              <div>
                <label className="block text-xs text-card-fg/60 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-primary py-3 text-sm font-medium text-background hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Free Account"}
              </button>

              <p className="text-xs text-card-fg/50 text-center flex items-center justify-center gap-1">
                <Shield size={12} />
                Free to browse. Pay $199 for full access.
              </p>
            </form>

            {/* Benefits sidebar */}
            <div className="hidden md:block rounded-xl border border-white/5 bg-card p-6">
              <h3 className="text-sm font-medium text-foreground mb-4">
                What you get with full access:
              </h3>
              <ul className="space-y-3">
                {[
                  "Complete grant database",
                  "Monthly updates",
                  "Search & filter tools",
                  "Application tips",
                  "Competitiveness ratings",
                  "Key requirements",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-card-fg/80"
                  >
                    <Check size={14} className="text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-2xl text-foreground tracking-[-0.07em]">
                  $199
                </p>
                <p className="text-xs text-card-fg/50">
                  One-time. Lifetime access.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-card-fg/50">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:text-secondary transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
