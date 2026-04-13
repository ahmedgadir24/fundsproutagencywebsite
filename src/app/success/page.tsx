"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Fire Meta Pixel Purchase event
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Purchase", {
        value: 199.0,
        currency: "USD",
        content_name: "Fundsprout Grant Database",
        content_type: "product",
      });
    }

    // Check for session_id and redirect to welcome
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (sessionId) {
      router.replace(`/welcome?session_id=${sessionId}`);
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-5">
          <Sparkles size={28} className="text-primary" />
        </div>
        <h1 className="text-3xl text-foreground tracking-[-0.07em]">
          Payment successful!
        </h1>
        <p className="mt-3 text-base text-card-fg/60">
          Setting up your account...
        </p>
      </div>
    </main>
  );
}
