import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check payment status
  const { data: profile } = await supabase
    .from("gp_profiles")
    .select("has_paid, email, organization_name")
    .eq("id", user.id)
    .single();

  if (!profile?.has_paid) {
    redirect("/get-started");
  }

  return (
    <DashboardShell
      userEmail={profile?.email || user.email || ""}
      orgName={profile?.organization_name || null}
    >
      {children}
    </DashboardShell>
  );
}
