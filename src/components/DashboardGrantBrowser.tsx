"use client";

import { useState, useMemo } from "react";
import { Grant } from "@/lib/types";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

const complexityColors: Record<string, string> = {
  Simple: "bg-primary/20 text-primary",
  Moderate: "bg-yellow-500/20 text-yellow-400",
  Complex: "bg-red-500/20 text-red-400",
};

function GrantRow({
  grant,
  isExpanded,
  onToggle,
}: {
  grant: Grant;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-card overflow-hidden hover:border-primary/20 transition-colors">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-5 text-left cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {grant.funding_type}
              </span>
              <span className="inline-flex items-center rounded-full bg-alt/20 px-2 py-0.5 text-[10px] font-medium text-card-fg/70">
                {grant.focus_area}
              </span>
              {grant.estimated_complexity &&
                complexityColors[grant.estimated_complexity] && (
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${complexityColors[grant.estimated_complexity]}`}
                  >
                    {grant.estimated_complexity}
                  </span>
                )}
            </div>
            <h3 className="text-sm sm:text-base text-foreground font-medium tracking-[-0.02em]">
              {grant.grant_name}
            </h3>
            <p className="text-xs sm:text-sm text-card-fg/50 mt-0.5">
              {grant.funding_organization}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              {(grant.amount_min || grant.amount_max) && (
                <p className="text-sm text-primary font-medium">
                  {grant.amount_min && grant.amount_max
                    ? `${formatCurrency(grant.amount_min)} – ${formatCurrency(grant.amount_max)}`
                    : grant.amount_max
                      ? `Up to ${formatCurrency(grant.amount_max)}`
                      : `From ${formatCurrency(grant.amount_min!)}`}
                </p>
              )}
              <p className="text-xs text-card-fg/40">
                {grant.application_deadline || "Rolling"}
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp size={16} className="text-card-fg/40" />
            ) : (
              <ChevronDown size={16} className="text-card-fg/40" />
            )}
          </div>
        </div>

        {/* Mobile amount/deadline */}
        <div className="flex items-center gap-4 mt-2 sm:hidden text-xs text-card-fg/50">
          {(grant.amount_min || grant.amount_max) && (
            <span className="flex items-center gap-1 text-primary">
              <DollarSign size={11} />
              {grant.amount_min && grant.amount_max
                ? `${formatCurrency(grant.amount_min)} – ${formatCurrency(grant.amount_max)}`
                : grant.amount_max
                  ? `Up to ${formatCurrency(grant.amount_max)}`
                  : `From ${formatCurrency(grant.amount_min!)}`}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            {grant.application_deadline || "Rolling"}
          </span>
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-white/5 pt-4 space-y-4">
          {/* Description */}
          <p className="text-sm text-card-fg/70 leading-relaxed">
            {grant.description}
          </p>

          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="rounded-lg bg-background/50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-card-fg/40 mb-1">
                Eligible Organizations
              </p>
              <p className="text-xs text-card-fg/70">
                {grant.eligible_org_types}
              </p>
            </div>
            <div className="rounded-lg bg-background/50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-card-fg/40 mb-1">
                Geography
              </p>
              <p className="text-xs text-card-fg/70 flex items-center gap-1">
                <MapPin size={11} />
                {grant.geographic_eligibility}
              </p>
            </div>
            <div className="rounded-lg bg-background/50 p-3">
              <p className="text-[10px] uppercase tracking-widest text-card-fg/40 mb-1">
                Grant Cycle
              </p>
              <p className="text-xs text-card-fg/70">
                {grant.grant_cycle || "Not specified"}
              </p>
            </div>
            {grant.requires_loi && grant.requires_loi !== "No" && (
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-[10px] uppercase tracking-widest text-card-fg/40 mb-1">
                  Requires LOI
                </p>
                <p className="text-xs text-card-fg/70">
                  {grant.requires_loi}
                </p>
              </div>
            )}
            {grant.org_budget_requirement && (
              <div className="rounded-lg bg-background/50 p-3">
                <p className="text-[10px] uppercase tracking-widest text-card-fg/40 mb-1">
                  Budget Requirement
                </p>
                <p className="text-xs text-card-fg/70">
                  {grant.org_budget_requirement}
                </p>
              </div>
            )}
          </div>

          {/* Apply button */}
          {grant.application_url && (
            <a
              href={grant.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-background hover:bg-secondary transition-colors"
            >
              Apply Now
              <ExternalLink size={14} />
            </a>
          )}

          {/* Grant writing upsell */}
          <div className="rounded-lg border border-white/5 bg-background/30 p-3 flex items-center justify-between gap-3">
            <p className="text-xs text-card-fg/50">
              Need help writing this application?
            </p>
            <a
              href="https://www.fundsprout.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-secondary transition-colors whitespace-nowrap"
            >
              Get grant writing help →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardGrantBrowser({
  grants,
}: {
  grants: Grant[];
}) {
  const [search, setSearch] = useState("");
  const [geography, setGeography] = useState("");
  const [fundingType, setFundingType] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [complexity, setComplexity] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const geographies = useMemo(
    () => [...new Set(grants.map((g) => g.geographic_eligibility))].sort(),
    [grants]
  );
  const fundingTypes = useMemo(
    () => [...new Set(grants.map((g) => g.funding_type))].sort(),
    [grants]
  );
  const focusAreas = useMemo(
    () => [...new Set(grants.map((g) => g.focus_area))].sort(),
    [grants]
  );
  const complexities = useMemo(
    () =>
      [...new Set(grants.map((g) => g.estimated_complexity).filter(Boolean))].sort(),
    [grants]
  );

  const filtered = useMemo(() => {
    return grants.filter((g) => {
      if (geography && g.geographic_eligibility !== geography) return false;
      if (fundingType && g.funding_type !== fundingType) return false;
      if (focusArea && g.focus_area !== focusArea) return false;
      if (complexity && g.estimated_complexity !== complexity) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          g.grant_name.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q) ||
          g.funding_organization.toLowerCase().includes(q) ||
          g.focus_area.toLowerCase().includes(q) ||
          g.geographic_eligibility.toLowerCase().includes(q) ||
          g.eligible_org_types?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [grants, geography, fundingType, focusArea, complexity, search]);

  const hasActiveFilters =
    geography || fundingType || focusArea || complexity || search;

  const clearFilters = () => {
    setSearch("");
    setGeography("");
    setFundingType("");
    setFocusArea("");
    setComplexity("");
  };

  return (
    <div>
      {/* Search + filter toggle */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-card-fg/50"
          />
          <input
            type="text"
            placeholder="Search by grant name, funder, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-card pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-3 sm:px-4 py-2.5 sm:py-3 text-sm transition-colors ${
            showFilters
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-white/10 bg-card text-card-fg hover:border-primary/30"
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 p-3 sm:p-4 rounded-xl border border-white/5 bg-card">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-card-fg/40 mb-1.5">
              Focus Area
            </label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">All</option>
              {focusAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-card-fg/40 mb-1.5">
              Funding Type
            </label>
            <select
              value={fundingType}
              onChange={(e) => setFundingType(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">All</option>
              {fundingTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-card-fg/40 mb-1.5">
              Geography
            </label>
            <select
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">All</option>
              {geographies.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-card-fg/40 mb-1.5">
              Complexity
            </label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">All</option>
              {complexities.map((c) => (
                <option key={c!} value={c!}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-card-fg/50">Filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
              &ldquo;{search}&rdquo;
              <button onClick={() => setSearch("")}>
                <X size={12} />
              </button>
            </span>
          )}
          {focusArea && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
              {focusArea}
              <button onClick={() => setFocusArea("")}>
                <X size={12} />
              </button>
            </span>
          )}
          {fundingType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
              {fundingType}
              <button onClick={() => setFundingType("")}>
                <X size={12} />
              </button>
            </span>
          )}
          {geography && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
              {geography}
              <button onClick={() => setGeography("")}>
                <X size={12} />
              </button>
            </span>
          )}
          {complexity && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
              {complexity}
              <button onClick={() => setComplexity("")}>
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-card-fg/50 hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 text-sm text-card-fg/50">
        {filtered.length} grant{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Grant list */}
      <div className="space-y-2 sm:space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-card-fg/50">
            <p className="text-lg">No grants match your search.</p>
            <p className="text-sm mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          filtered.map((grant) => (
            <GrantRow
              key={grant.id}
              grant={grant}
              isExpanded={expandedId === grant.id}
              onToggle={() =>
                setExpandedId(expandedId === grant.id ? null : grant.id)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
