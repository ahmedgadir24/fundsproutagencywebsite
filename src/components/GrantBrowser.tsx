"use client";

import { useState, useMemo } from "react";
import { Grant } from "@/lib/types";
import GrantCard from "./GrantCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

const PREVIEW_LIMIT = 3;

export default function GrantBrowser({
  grants,
  hasPaid,
}: {
  grants: Grant[];
  hasPaid: boolean;
}) {
  const [search, setSearch] = useState("");
  const [geography, setGeography] = useState("");
  const [grantType, setGrantType] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique filter values
  const geographies = useMemo(
    () => [...new Set(grants.map((g) => g.geography))].sort(),
    [grants]
  );
  const grantTypes = useMemo(
    () => [...new Set(grants.map((g) => g.grant_type))].sort(),
    [grants]
  );
  const focusAreas = useMemo(
    () => [...new Set(grants.map((g) => g.focus_area))].sort(),
    [grants]
  );

  const filtered = useMemo(() => {
    return grants.filter((g) => {
      if (geography && g.geography !== geography) return false;
      if (grantType && g.grant_type !== grantType) return false;
      if (focusArea && g.focus_area !== focusArea) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.funder.toLowerCase().includes(q) ||
          g.focus_area.toLowerCase().includes(q) ||
          g.geography.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [grants, geography, grantType, focusArea, search]);

  const hasActiveFilters = geography || grantType || focusArea || search;

  const clearFilters = () => {
    setSearch("");
    setGeography("");
    setGrantType("");
    setFocusArea("");
  };

  return (
    <div>
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-card-fg/50"
          />
          <input
            type="text"
            placeholder="Search grants by keyword, funder, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-card pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-card-fg/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors ${
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xl border border-white/5 bg-card">
          <div>
            <label className="block text-xs text-card-fg/60 mb-1.5">
              Geography
            </label>
            <select
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">All Locations</option>
              {geographies.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-card-fg/60 mb-1.5">
              Grant Type
            </label>
            <select
              value={grantType}
              onChange={(e) => setGrantType(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">All Types</option>
              {grantTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-card-fg/60 mb-1.5">
              Focus Area
            </label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="">All Areas</option>
              {focusAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-card-fg/50">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
              &ldquo;{search}&rdquo;
              <button onClick={() => setSearch("")}>
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
          {grantType && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
              {grantType}
              <button onClick={() => setGrantType("")}>
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
          <button
            onClick={clearFilters}
            className="text-xs text-card-fg/50 hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="mb-4 text-sm text-card-fg/60">
        {filtered.length} grant{filtered.length !== 1 ? "s" : ""} found
      </div>

      {/* Grant list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-card-fg/50">
            <p className="text-lg">No grants match your search.</p>
            <p className="text-sm mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            {filtered.slice(0, hasPaid ? undefined : PREVIEW_LIMIT).map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
            {!hasPaid && filtered.length > PREVIEW_LIMIT && (
              <>
                {filtered.slice(PREVIEW_LIMIT, PREVIEW_LIMIT + 2).map((grant) => (
                  <GrantCard key={grant.id} grant={grant} locked />
                ))}
                <div className="text-center py-12 rounded-xl border border-dashed border-primary/20 bg-card/50">
                  <p className="text-xl text-foreground tracking-[-0.03em]">
                    +{filtered.length - PREVIEW_LIMIT} more grants available
                  </p>
                  <p className="mt-2 text-sm text-card-fg/70">
                    Get lifetime access to see all grants, detailed advice, and
                    application tips.
                  </p>
                  <a
                    href="/auth/signup"
                    className="mt-4 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-medium text-background hover:bg-secondary transition-colors"
                  >
                    Unlock Full Access — $199
                  </a>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
