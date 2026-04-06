"use client";

import { useState } from "react";
import {
  Users,
  Mail,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Download,
  Lock,
  BarChart3,
  MousePointer,
} from "lucide-react";

interface AdminData {
  stats: {
    totalLeads: number;
    totalUsers: number;
    paidUsers: number;
    totalCtaClicks: number;
    unpaidUsers: number;
    recentLeads: number;
    conversionRate: string;
  };
  breakdowns: {
    orgType: Record<string, number>;
    focusArea: Record<string, number>;
    state: Record<string, number>;
    ctaClicks: Record<string, number>;
  };
  emailCaptures: {
    email: string;
    organization_type: string | null;
    focus_area: string | null;
    state: string | null;
    created_at: string;
  }[];
  users: {
    email: string;
    has_paid: boolean;
    organization_name: string | null;
    payment_status: string | null;
    created_at: string;
  }[];
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-card p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon size={16} className={color} />
        </div>
        <p className="text-xs text-card-fg/50 uppercase tracking-widest">
          {label}
        </p>
      </div>
      <p className="text-2xl sm:text-3xl text-foreground tracking-[-0.07em]">
        {value}
      </p>
    </div>
  );
}

function BreakdownTable({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/5 bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5">
        <p className="text-sm text-foreground font-medium">{title}</p>
      </div>
      <div className="divide-y divide-white/5">
        {sorted.slice(0, 10).map(([key, count]) => (
          <div
            key={key}
            className="px-4 py-2.5 flex items-center justify-between text-sm"
          >
            <span className="text-card-fg/70 truncate mr-4">{key}</span>
            <span className="text-foreground font-medium flex-shrink-0">
              {count}
            </span>
          </div>
        ))}
        {sorted.length > 10 && (
          <div className="px-4 py-2 text-xs text-card-fg/40">
            +{sorted.length - 10} more
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"leads" | "users">("leads");

  const fetchData = async (key?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey: key || adminKey }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        setAuthenticated(false);
      } else {
        setData(json);
        setAuthenticated(true);
      }
    } catch {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const exportCSV = (type: "leads" | "users") => {
    if (!data) return;
    let csv = "";
    if (type === "leads") {
      csv =
        "Email,Organization Type,Focus Area,State,Date\n" +
        data.emailCaptures
          .map(
            (e) =>
              `"${e.email}","${e.organization_type || ""}","${e.focus_area || ""}","${e.state || ""}","${new Date(e.created_at).toLocaleDateString()}"`
          )
          .join("\n");
    } else {
      csv =
        "Email,Organization,Paid,Payment Status,Date\n" +
        data.users
          .map(
            (u) =>
              `"${u.email}","${u.organization_name || ""}","${u.has_paid ? "Yes" : "No"}","${u.payment_status || ""}","${new Date(u.created_at).toLocaleDateString()}"`
          )
          .join("\n");
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fundsprout-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Login screen
  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl text-foreground tracking-[-0.07em]">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-card-fg/50">
              Enter admin key to continue.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Admin key"
              className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !adminKey}
              className="w-full rounded-full bg-primary py-3 text-sm font-medium text-background hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading ? "Loading..." : "Access Dashboard"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-card-fg/30">
            Key: last 10 characters of your Supabase service role key
          </p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl text-foreground tracking-[-0.07em]">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-card-fg/50">
              Fundsprout Grant Database analytics
            </p>
          </div>
          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-card-fg/70 hover:text-foreground hover:border-primary/30 transition-colors self-start"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard
            label="Total Leads"
            value={data.stats.totalLeads}
            icon={Mail}
          />
          <StatCard
            label="Registered Users"
            value={data.stats.totalUsers}
            icon={Users}
          />
          <StatCard
            label="Paid Users"
            value={data.stats.paidUsers}
            icon={DollarSign}
          />
          <StatCard
            label="Conversion Rate"
            value={`${data.stats.conversionRate}%`}
            icon={TrendingUp}
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard
            label="CTA Button Clicks"
            value={data.stats.totalCtaClicks}
            icon={MousePointer}
          />
          <StatCard
            label="Last 30 Days Leads"
            value={data.stats.recentLeads}
            icon={BarChart3}
          />
          <StatCard
            label="Unpaid Users"
            value={data.stats.unpaidUsers}
            icon={Users}
            color="text-amber-400"
          />
          <StatCard
            label="Revenue"
            value={`$${(data.stats.paidUsers * 199).toLocaleString()}`}
            icon={DollarSign}
            color="text-emerald-400"
          />
        </div>

        {/* CTA Click Breakdown */}
        {Object.keys(data.breakdowns.ctaClicks).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <BreakdownTable
              title="Button Clicks by Location"
              data={Object.fromEntries(
                Object.entries(data.breakdowns.ctaClicks).map(([k, v]) => [
                  k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                  v,
                ])
              )}
            />
          </div>
        )}

        {/* Lead Breakdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <BreakdownTable
            title="By Organization Type"
            data={data.breakdowns.orgType}
          />
          <BreakdownTable
            title="By Focus Area"
            data={data.breakdowns.focusArea}
          />
          <BreakdownTable
            title="By State"
            data={data.breakdowns.state}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-white/5 mb-4">
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === "leads"
                ? "border-primary text-primary"
                : "border-transparent text-card-fg/50 hover:text-foreground"
            }`}
          >
            Email Captures ({data.emailCaptures.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
              activeTab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-card-fg/50 hover:text-foreground"
            }`}
          >
            Registered Users ({data.users.length})
          </button>
          <div className="flex-1" />
          <button
            onClick={() => exportCSV(activeTab)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-card-fg/50 hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <Download size={12} />
            Export CSV
          </button>
        </div>

        {/* Leads table */}
        {activeTab === "leads" && (
          <div className="rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card text-left">
                    <th className="px-4 py-3 text-xs text-card-fg/40 uppercase tracking-widest font-medium">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs text-card-fg/40 uppercase tracking-widest font-medium hidden sm:table-cell">
                      Org Type
                    </th>
                    <th className="px-4 py-3 text-xs text-card-fg/40 uppercase tracking-widest font-medium hidden md:table-cell">
                      Focus Area
                    </th>
                    <th className="px-4 py-3 text-xs text-card-fg/40 uppercase tracking-widest font-medium hidden lg:table-cell">
                      State
                    </th>
                    <th className="px-4 py-3 text-xs text-card-fg/40 uppercase tracking-widest font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.emailCaptures.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-card-fg/40"
                      >
                        No email captures yet.
                      </td>
                    </tr>
                  ) : (
                    data.emailCaptures.map((lead, i) => (
                      <tr
                        key={`${lead.email}-${i}`}
                        className="hover:bg-white/2"
                      >
                        <td className="px-4 py-3 text-foreground">
                          {lead.email}
                        </td>
                        <td className="px-4 py-3 text-card-fg/60 hidden sm:table-cell">
                          {lead.organization_type || "—"}
                        </td>
                        <td className="px-4 py-3 text-card-fg/60 hidden md:table-cell">
                          {lead.focus_area || "—"}
                        </td>
                        <td className="px-4 py-3 text-card-fg/60 hidden lg:table-cell">
                          {lead.state || "—"}
                        </td>
                        <td className="px-4 py-3 text-card-fg/50 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users table */}
        {activeTab === "users" && (
          <div className="rounded-xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-card text-left">
                    <th className="px-4 py-3 text-xs text-card-fg/40 uppercase tracking-widest font-medium">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs text-card-fg/40 uppercase tracking-widest font-medium hidden sm:table-cell">
                      Organization
                    </th>
                    <th className="px-4 py-3 text-xs text-card-fg/40 uppercase tracking-widest font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs text-card-fg/40 uppercase tracking-widest font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-12 text-center text-card-fg/40"
                      >
                        No registered users yet.
                      </td>
                    </tr>
                  ) : (
                    data.users.map((user, i) => (
                      <tr
                        key={`${user.email}-${i}`}
                        className="hover:bg-white/2"
                      >
                        <td className="px-4 py-3 text-foreground">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-card-fg/60 hidden sm:table-cell">
                          {user.organization_name || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {user.has_paid ? (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                              Unpaid
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-card-fg/50 whitespace-nowrap">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
