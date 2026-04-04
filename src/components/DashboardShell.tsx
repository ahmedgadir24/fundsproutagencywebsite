"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  LogOut,
  Menu,
  X,
  Database,
  ExternalLink,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Grant Database", icon: Database },
  { href: "/dashboard/account", label: "Account", icon: User },
];

export default function DashboardShell({
  children,
  userEmail,
  orgName,
}: {
  children: React.ReactNode;
  userEmail: string;
  orgName: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Mobile top bar */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "var(--card-bg)",
        }}
      >
        <Link
          href="/dashboard"
          className="text-lg text-primary font-bold tracking-[-0.07em]"
        >
          fundsprout
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="text-card-fg/50 hover:text-foreground transition-colors p-1"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground p-1"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 70,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 256,
          minWidth: 256,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          background: "var(--card-bg)",
          overflowY: "auto",
          zIndex: 80,
          position: sidebarOpen ? "fixed" : undefined,
          ...(sidebarOpen
            ? { top: 0, left: 0, bottom: 0 }
            : {}),
        }}
        className={`hidden md:flex ${sidebarOpen ? "!flex !fixed" : ""}`}
      >
        {/* Logo */}
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <Link
            href="/dashboard"
            className="text-xl text-primary font-bold tracking-[-0.07em]"
          >
            fundsprout
          </Link>
          <p className="text-[11px] text-card-fg/40 mt-0.5">Grant Database</p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }} className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-card-fg/60 hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Upsell */}
        <div style={{ padding: "0 12px 12px", flexShrink: 0 }}>
          <a
            href="https://www.fundsprout.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-card-fg/40 hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <ExternalLink size={16} />
            Grant Writing Help
          </a>
        </div>

        {/* User + Sign out */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <div className="px-3 mb-3">
            <p className="text-sm text-foreground truncate">
              {orgName || userEmail}
            </p>
            {orgName && (
              <p className="text-xs text-card-fg/40 truncate">{userEmail}</p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-card-fg/50 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content — takes remaining space, scrolls independently */}
      <main
        style={{
          flex: 1,
          height: "100vh",
          overflowY: "auto",
          minWidth: 0,
        }}
        className="pt-14 md:pt-0"
      >
        {children}
      </main>
    </div>
  );
}
