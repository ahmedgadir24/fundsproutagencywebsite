import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GrantBrowser from "@/components/GrantBrowser";
import { dummyGrants } from "@/lib/dummy-grants";
import { Grant } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

async function getGrants(): Promise<Grant[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gp_grants")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data as Grant[];
    }
  } catch {
    // Supabase not configured yet, use dummy data
  }

  return dummyGrants.map((g) => ({
    ...g,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })) as Grant[];
}

async function checkPaymentStatus(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: profile } = await supabase
      .from("gp_profiles")
      .select("has_paid")
      .eq("id", user.id)
      .single();

    return profile?.has_paid ?? false;
  } catch {
    return false;
  }
}

export default async function GrantsPage() {
  const [grants, hasPaid] = await Promise.all([
    getGrants(),
    checkPaymentStatus(),
  ]);

  return (
    <>
      <Navbar />
      <main className="pt-20 sm:pt-24 pb-20 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-[-0.07em]">
              Grant Database
            </h1>
            <p className="mt-2 text-sm sm:text-base text-card-fg/70">
              Browse and search our curated collection of grants. Updated
              monthly.
            </p>
          </div>
          <GrantBrowser grants={grants} hasPaid={hasPaid} />
        </div>
      </main>
      <Footer />
    </>
  );
}
