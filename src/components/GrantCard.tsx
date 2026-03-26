"use client";

import Link from "next/link";
import { Grant } from "@/lib/types";
import { MapPin, Calendar, DollarSign, Lock } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function GrantCard({
  grant,
  locked = false,
}: {
  grant: Grant;
  locked?: boolean;
}) {
  const competitivenessColors = {
    low: "bg-primary/20 text-primary",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="group relative rounded-xl border border-white/5 bg-card p-6 hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {grant.grant_type}
            </span>
            <span className="inline-flex items-center rounded-full bg-alt/20 px-2.5 py-0.5 text-xs font-medium text-card-fg">
              {grant.focus_area}
            </span>
            {grant.competitiveness && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${competitivenessColors[grant.competitiveness]}`}
              >
                {grant.competitiveness} competition
              </span>
            )}
          </div>

          <h3 className="text-lg font-medium text-foreground tracking-[-0.03em] group-hover:text-primary transition-colors">
            {locked ? (
              <span className="flex items-center gap-2">
                {grant.title}
                <Lock size={14} className="text-card-fg/50" />
              </span>
            ) : (
              <Link href={`/grants/${grant.id}`}>{grant.title}</Link>
            )}
          </h3>

          <p className="mt-1 text-sm text-card-fg/70">{grant.funder}</p>

          <p className="mt-3 text-sm text-card-fg line-clamp-2">
            {grant.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-card-fg/60">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {grant.geography}
            </span>
            {grant.deadline && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Deadline:{" "}
                {new Date(grant.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {(grant.amount_min || grant.amount_max) && (
              <span className="flex items-center gap-1">
                <DollarSign size={12} />
                {grant.amount_min && grant.amount_max
                  ? `${formatCurrency(grant.amount_min)} - ${formatCurrency(grant.amount_max)}`
                  : grant.amount_max
                    ? `Up to ${formatCurrency(grant.amount_max)}`
                    : `From ${formatCurrency(grant.amount_min!)}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {locked && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/90 via-background/40 to-transparent flex items-end justify-center pb-6">
          <Link
            href="/auth/signup"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-background hover:bg-secondary transition-colors"
          >
            Unlock Full Access
          </Link>
        </div>
      )}
    </div>
  );
}
