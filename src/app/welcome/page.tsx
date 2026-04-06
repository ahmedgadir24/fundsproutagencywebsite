"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, Sparkles, ArrowRight, AlertCircle } from "lucide-react";

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Sparkles size={24} className="text-primary" />
          </div>
        </main>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}

function WelcomeContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Verify the Stripe session on load
  useEffect(() => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    fetch(`/api/verify-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.paid) {
          setVerified(true);
          if (data.email) {
            setSessionEmail(data.email);
            setEmail(data.email);
          }
          // Fire Meta Pixel Purchase event
          if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
            (window as any).fbq("track", "Purchase", {
              value: 199.0,
              currency: "USD",
              content_name: "Grant Database Lifetime Access",
            });
          }
        } else {
          router.push("/get-started");
        }
      })
      .catch(() => router.push("/"))
      .finally(() => setVerifying(false));
  }, [sessionId, router]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create account via API (uses service role to mark as paid)
      const res = await fetch("/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          session_id: sessionId,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Now sign in with the new credentials
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Success — go to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles size={24} className="text-primary" />
          </div>
          <p className="text-sm text-card-fg/50">Verifying your payment...</p>
        </div>
      </main>
    );
  }

  if (!verified) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-foreground tracking-[-0.07em]">
            Payment successful!
          </h1>
          <p className="mt-3 text-base text-card-fg/60">
            You now have lifetime access to 1,000+ grants.
            <br />
            Create your account to get started.
          </p>
        </div>

        {/* Account creation form */}
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-card p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-xs text-card-fg/50 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={!!sessionEmail}
                className={`w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors ${
                  sessionEmail ? "opacity-60 cursor-not-allowed" : ""
                }`}
                placeholder="you@org.com"
              />
              {sessionEmail && (
                <p className="mt-1 text-xs text-card-fg/40">
                  Using the email from your payment.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-card-fg/50 mb-1.5">
                Create a password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="At least 6 characters"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary py-3.5 text-base font-medium text-background hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Creating your account..." : "Access My Grant Database"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-card-fg/40">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-primary hover:text-secondary transition-colors"
          >
            Log in instead
          </a>
        </p>
      </div>
    </main>
  );
}
