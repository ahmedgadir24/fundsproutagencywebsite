import { createClient } from "@/lib/supabase/server";
import { dummyGrants } from "@/lib/dummy-grants";
import { Grant } from "@/lib/types";
import DashboardGrantBrowser from "@/components/DashboardGrantBrowser";

async function getGrants(): Promise<Grant[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gp_grants")
      .select("*")
      .eq("is_active", true)
      .order("grant_name", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Grant[];
    }
  } catch {
    // Supabase not configured or no data yet
  }

  return dummyGrants.map((g) => ({
    ...g,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })) as Grant[];
}

export default async function DashboardPage() {
  const grants = await getGrants();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl text-foreground tracking-[-0.07em]">
          Grant Database
        </h1>
        <p className="mt-1 text-sm text-card-fg/50">
          {grants.length} grants available · Updated monthly
        </p>
      </div>
      <DashboardGrantBrowser grants={grants} />
    </div>
  );
}
