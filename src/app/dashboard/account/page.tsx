import { createClient } from "@/lib/supabase/server";
import AccountForm from "@/components/AccountForm";

async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("gp_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export default async function AccountPage() {
  const profile = await getProfile();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl text-foreground tracking-[-0.07em]">
          Account
        </h1>
        <p className="mt-1 text-sm text-card-fg/50">
          Manage your profile and account settings.
        </p>
      </div>

      {profile && <AccountForm profile={profile} />}

      {/* Payment status */}
      <div className="mt-8 rounded-xl border border-white/5 bg-card p-5 sm:p-6">
        <h2 className="text-base text-foreground font-medium mb-3">
          Subscription
        </h2>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <div>
            <p className="text-sm text-foreground">Lifetime Access</p>
            <p className="text-xs text-card-fg/50">
              One-time payment of $199 · No renewal required
            </p>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="mt-6 rounded-xl border border-white/5 bg-card p-5 sm:p-6">
        <h2 className="text-base text-foreground font-medium mb-3">
          Need help?
        </h2>
        <p className="text-sm text-card-fg/50 mb-3">
          Contact us for any questions about your account or the grant database.
        </p>
        <a
          href="mailto:support@fundsprout.ai"
          className="text-sm text-primary hover:text-secondary transition-colors"
        >
          support@fundsprout.ai →
        </a>
      </div>
    </div>
  );
}
