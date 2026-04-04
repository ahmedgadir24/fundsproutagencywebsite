"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  organization_name: string | null;
  organization_type: string | null;
  focus_area: string | null;
  state: string | null;
}

export default function AccountForm({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [orgName, setOrgName] = useState(profile.organization_name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    await supabase
      .from("gp_profiles")
      .update({
        full_name: fullName || null,
        organization_name: orgName || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="rounded-xl border border-white/5 bg-card p-5 sm:p-6 space-y-4">
        <h2 className="text-base text-foreground font-medium">Profile</h2>

        <div>
          <label className="block text-xs text-card-fg/50 mb-1.5">Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full rounded-lg border border-white/5 bg-background/50 px-4 py-2.5 text-sm text-card-fg/50 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs text-card-fg/50 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-white/10 bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-card-fg/50 mb-1.5">
            Organization Name
          </label>
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Your organization"
            className="w-full rounded-lg border border-white/10 bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-background hover:bg-secondary transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <Check size={14} />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
