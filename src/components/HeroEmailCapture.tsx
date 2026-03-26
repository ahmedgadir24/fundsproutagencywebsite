"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function HeroEmailCapture({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Store email in sessionStorage so assessment flow can use it
    sessionStorage.setItem("lead_email", email);
    router.push("/assessment");
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? "mt-6" : "mt-8"}>
      <div className={`flex flex-col sm:flex-row gap-3 ${compact ? "" : "max-w-lg mx-auto"}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your work email"
          className="flex-1 rounded-full border border-white/10 bg-card px-5 py-3.5 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          type="submit"
          className="rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-background hover:bg-secondary transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {compact ? "Find My Grants" : "Find My Grants"}
          <ArrowRight size={14} />
        </button>
      </div>
    </form>
  );
}
