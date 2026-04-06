import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin emails that can access this endpoint
const ADMIN_EMAILS = [
  "abdulgadir@pilgrimcapital.io",
  // Add more admin emails here
];

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const { adminKey } = await request.json();

    // Simple auth check — require admin key from the page
    if (adminKey !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-10)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminClient();

    // Fetch only from gp_ tables (not shared auth.users)
    const [emailCapturesRes, profilesRes] = await Promise.all([
      supabase
        .from("gp_email_captures")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("gp_profiles")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    const emailCaptures = emailCapturesRes.data || [];
    const profiles = profilesRes.data || [];

    // Compute stats — only count grant database users, not other project's users
    const totalLeads = emailCaptures.length;
    const totalUsers = profiles.length;
    const paidUsers = profiles.filter((p) => p.has_paid).length;
    const unpaidUsers = totalUsers - paidUsers;

    // Leads by day (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentLeads = emailCaptures.filter(
      (e) => new Date(e.created_at) >= thirtyDaysAgo
    );

    // Leads by org type
    const orgTypeBreakdown: Record<string, number> = {};
    emailCaptures.forEach((e) => {
      const type = e.organization_type || "Not specified";
      orgTypeBreakdown[type] = (orgTypeBreakdown[type] || 0) + 1;
    });

    // Leads by focus area
    const focusAreaBreakdown: Record<string, number> = {};
    emailCaptures.forEach((e) => {
      const area = e.focus_area || "Not specified";
      focusAreaBreakdown[area] = (focusAreaBreakdown[area] || 0) + 1;
    });

    // Leads by state
    const stateBreakdown: Record<string, number> = {};
    emailCaptures.forEach((e) => {
      const state = e.state || "Not specified";
      stateBreakdown[state] = (stateBreakdown[state] || 0) + 1;
    });

    // Conversion rate
    const conversionRate =
      totalLeads > 0 ? ((paidUsers / totalLeads) * 100).toFixed(1) : "0";

    return NextResponse.json({
      stats: {
        totalLeads,
        totalUsers,
        paidUsers,
        unpaidUsers,
        recentLeads: recentLeads.length,
        conversionRate,
      },
      breakdowns: {
        orgType: orgTypeBreakdown,
        focusArea: focusAreaBreakdown,
        state: stateBreakdown,
      },
      emailCaptures: emailCaptures.map((e) => ({
        email: e.email,
        organization_type: e.organization_type,
        focus_area: e.focus_area,
        state: e.state,
        created_at: e.created_at,
      })),
      users: profiles.map((p) => ({
        email: p.email,
        has_paid: p.has_paid,
        organization_name: p.organization_name,
        payment_status: p.payment_status,
        created_at: p.created_at,
      })),
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin data" },
      { status: 500 }
    );
  }
}
