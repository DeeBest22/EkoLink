import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Business } from "@/lib/core";
import { CATEGORIES, DISTANCES, cn, useApp, useToast } from "@/lib/core";
import { Button, Segmented, EmptyState, InfoNote } from "@/components/ui";
import { BusinessCard } from "@/components/cards";
import { BusinessDetailModal } from "@/components/business-detail";
import { businesses } from "@/mocks/data";

type SortKey = "distance" | "rating" | "reviews";

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: "distance", label: "Nearest" },
  { value: "rating", label: "Top rated" },
  { value: "reviews", label: "Most reviewed" },
];

export default function Discover() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const { saved, toggleSaved } = useApp();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "all");
  const [distance, setDistance] = useState(5);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("distance");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Business | null>(null);
  const [locationShared, setLocationShared] = useState(false);
  const [finding, setFinding] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = businesses.filter((business) => {
      const matchesTerm =
        !term ||
        business.name.toLowerCase().includes(term) ||
        business.categoryLabel.toLowerCase().includes(term) ||
        business.tagline.toLowerCase().includes(term) ||
        business.services.some((service) => service.name.toLowerCase().includes(term)) ||
        business.area.toLowerCase().includes(term) ||
        business.city.toLowerCase().includes(term);
      const matchesCategory = category === "all" || business.category === category;
      const matchesDistance = business.distanceKm <= distance;
      const matchesVerified = !verifiedOnly || business.verified;
      const matchesOpen = !openOnly || business.open;
      return matchesTerm && matchesCategory && matchesDistance && matchesVerified && matchesOpen;
    });

    return list.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "reviews") return b.reviewCount - a.reviewCount;
      return a.distanceKm - b.distanceKm;
    });
  }, [query, category, distance, verifiedOnly, openOnly, sort]);

  const selected = filtered.find((business) => business.id === selectedId) ?? filtered[0] ?? null;

  const shareLocation = () => {
    setFinding(true);
    const settle = () => {
      setFinding(false);
      setLocationShared(true);
      setDistance(5);
      toast("Location shared. Showing businesses within 5 km of Yaba, Lagos.");
    };

    if (!navigator.geolocation) {
      window.setTimeout(settle, 700);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => settle(),
      () => {
        window.setTimeout(() => {
          settle();
          toast("Location permission was not granted. Showing a demo location in Yaba, Lagos.", "info");
        }, 500);
      },
      { timeout: 5000 },
    );
  };

  const applyCategory = (id: string) => {
    setCategory(id);
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    setParams(next, { replace: true });
    setSelectedId(null);
  };

  const submitSearch = () => {
    const next = new URLSearchParams(params);
    if (query.trim()) next.set("q", query.trim());
    else next.delete("q");
    setParams(next, { replace: true });
    setSelectedId(null);
  };

  return (
    <>
      <BusinessDetailModal business={detail} onClose={() => setDetail(null)} />

      <section className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-foreground-500">
                <span>EkoLink</span>
                <i className="ri-arrow-right-s-line" aria-hidden="true" />
                <span className="text-foreground-800">Discovery</span>
              </div>
              <h1 className="font-display mt-2 text-[28px] text-foreground-950 md:text-[38px]">Find businesses near you.</h1>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-foreground-600">
                Mechanics, tailors, food vendors, plumbers, electricians, phone repairers, hairdressers and cleaners around your location. Compare distance, ratings and prices before you call.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={shareLocation} icon={locationShared ? "ri-map-pin-line" : "ri-focus-3-line"} variant={locationShared ? "soft" : "primary"}>
                {finding ? "Finding you..." : locationShared ? "Location shared, Yaba" : "Find businesses near me"}
              </Button>
              <span className="flex items-center gap-1.5 rounded-xl border border-background-200 bg-background-50 px-3 py-2 text-[11px] text-foreground-600">
                <i className="ri-map-pin-line text-accent-600" aria-hidden="true" />
                {locationShared ? "Using your location" : "Demo location: Yaba, Lagos"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-background-200 bg-background-50 p-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") submitSearch(); }}
                placeholder="Business name, service or area"
                aria-label="Search businesses"
                className="h-11 w-full rounded-xl bg-transparent pl-9 pr-3 text-sm text-foreground-900 placeholder:text-foreground-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Segmented options={sortOptions} value={sort} onChange={setSort} className="hidden sm:flex" />
              <Button onClick={submitSearch} icon="ri-search-line">Search</Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyCategory("all")}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                category === "all" ? "border-primary-500 bg-primary-500 text-background-50" : "border-background-300 bg-background-50 text-foreground-600 hover:border-primary-300",
              )}
            >
              All categories
            </button>
            {CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => applyCategory(item.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors",
                  category === item.id ? "border-primary-500 bg-primary-500 text-background-50" : "border-background-300 bg-background-50 text-foreground-600 hover:border-primary-300",
                )}
              >
                <i className={item.icon} aria-hidden="true" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-4 py-6 md:px-8 md:py-8">
        {/* Filter bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-background-200 bg-background-50 p-3.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Distance</span>
            {DISTANCES.map((km) => (
              <button
                key={km}
                type="button"
                onClick={() => { setDistance(km); setSelectedId(null); }}
                className={cn(
                  "cursor-pointer rounded-lg border px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
                  distance === km ? "border-accent-500 bg-accent-50 text-accent-800" : "border-background-300 text-foreground-600 hover:border-accent-300",
                )}
              >
                {km} km
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setVerifiedOnly((prev) => !prev)}
              aria-pressed={verifiedOnly}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] font-medium transition-colors",
                verifiedOnly ? "border-accent-500 bg-accent-50 text-accent-800" : "border-background-300 text-foreground-600",
              )}
            >
              <i className="ri-verified-badge-line" aria-hidden="true" /> Verified only
            </button>
            <button
              type="button"
              onClick={() => setOpenOnly((prev) => !prev)}
              aria-pressed={openOnly}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] font-medium transition-colors",
                openOnly ? "border-accent-500 bg-accent-50 text-accent-800" : "border-background-300 text-foreground-600",
              )}
            >
              <i className="ri-time-line" aria-hidden="true" /> Open now
            </button>
            <span className="ml-1 text-[11.5px] text-foreground-500">
              <strong className="font-semibold text-foreground-900">{filtered.length}</strong> result{filtered.length === 1 ? "" : "s"} within {distance} km
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* Map */}
          <div className="lg:col-span-7 lg:sticky lg:top-20">
            <div className="relative h-[320px] overflow-hidden rounded-2xl border border-background-200 sm:h-[420px] lg:h-[560px]">
              <div className="absolute inset-0 k-map" />
              <div className="absolute inset-0 k-grid opacity-60" />
              <div className="pointer-events-none absolute inset-0 opacity-70">
                <div className="absolute left-0 right-0 top-[38%] h-[10px] bg-background-50/80" />
                <div className="absolute bottom-[26%] left-0 right-0 h-[6px] bg-background-50/70" />
                <div className="absolute bottom-0 left-[26%] top-0 w-[10px] bg-background-50/80" />
                <div className="absolute bottom-0 right-[22%] top-0 w-[6px] bg-background-50/65" />
                <div className="absolute left-[8%] top-[10%] h-16 w-24 rounded-md bg-background-50/55" />
                <div className="absolute right-[12%] top-[16%] h-20 w-16 rounded-md bg-background-50/55" />
                <div className="absolute bottom-[12%] left-[12%] h-14 w-20 rounded-md bg-background-50/50" />
                <div className="absolute bottom-[30%] left-[45%] h-12 w-24 rounded-md bg-background-50/45" />
              </div>

              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg border border-background-200 bg-background-50/95 px-2.5 py-1.5 text-[10.5px] font-semibold text-foreground-700 backdrop-blur">
                <i className="ri-map-2-line text-accent-600" aria-hidden="true" />
                Simulated map · Yaba, Lagos
              </div>
              <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg border border-background-200 bg-background-50/95 backdrop-blur">
                <button type="button" aria-label="Zoom in" className="flex h-8 w-8 cursor-pointer items-center justify-center border-b border-background-200 text-foreground-600 hover:text-primary-700">
                  <i className="ri-add-line" aria-hidden="true" />
                </button>
                <button type="button" aria-label="Zoom out" className="flex h-8 w-8 cursor-pointer items-center justify-center text-foreground-600 hover:text-primary-700">
                  <i className="ri-subtract-line" aria-hidden="true" />
                </button>
              </div>

              {/* you are here */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inset-0 -m-3 rounded-full bg-accent-500/30 k-ping" />
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-background-50 bg-primary-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-background-50" />
                </span>
                <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-background-50/95 px-1.5 py-0.5 text-[10px] font-semibold text-foreground-800">
                  You
                </span>
              </div>

              {/* pins */}
              {filtered.map((business) => {
                const active = selected?.id === business.id;
                return (
                  <button
                    key={business.id}
                    type="button"
                    onClick={() => setSelectedId(business.id)}
                    aria-label={`${business.name}, ${business.distanceKm} km away`}
                    style={{ left: `${business.mapX}%`, top: `${business.mapY}%` }}
                    className="absolute z-10 -translate-x-1/2 -translate-y-full cursor-pointer"
                  >
                    <span
                      className={cn(
                        "flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2 py-1.5 text-[10.5px] font-semibold transition-all",
                        active
                          ? "border-primary-600 bg-primary-600 text-background-50"
                          : "border-background-200 bg-background-50 text-foreground-800 hover:border-accent-400",
                      )}
                    >
                      <i className={business.verified ? "ri-verified-badge-fill text-accent-500" : "ri-store-2-line"} aria-hidden="true" />
                      <span className="max-w-[104px] truncate">{business.name.split(" ")[0]}</span>
                      <span className={cn("text-[9.5px]", active ? "text-background-200" : "text-foreground-400")}>{business.distanceKm}km</span>
                    </span>
                    <span className={cn("mx-auto block h-2 w-2 -translate-y-[3px] rotate-45 border-b border-r", active ? "border-primary-600 bg-primary-600" : "border-background-200 bg-background-50")} />
                  </button>
                );
              })}

              {/* selected popup */}
              {selected ? (
                <div className="absolute inset-x-3 bottom-3 z-20 rounded-xl border border-background-200 bg-background-50/97 p-2.5 backdrop-blur md:inset-x-4 md:bottom-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-background-200">
                      <img src={selected.image} alt={selected.name} className="h-full w-full object-cover object-top" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-semibold text-foreground-950">{selected.name}</p>
                      <p className="truncate text-[10.5px] text-foreground-500">
                        {selected.categoryLabel} · {selected.distanceKm} km · {selected.open ? "Open now" : "Closed"}
                      </p>
                    </div>
                    <button type="button" onClick={() => setDetail(selected)} className="shrink-0 cursor-pointer rounded-lg bg-primary-500 px-2.5 py-1.5 text-[11px] font-semibold text-background-50 hover:bg-primary-600">
                      View
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-foreground-500">
              <span className="flex items-center gap-1.5"><i className="ri-information-line" aria-hidden="true" /> Pins are illustrative. Directions open in Google Maps.</span>
              <span className="flex items-center gap-1.5"><i className="ri-shield-check-line text-accent-600" aria-hidden="true" /> Verified badges are document checked</span>
            </div>
          </div>

          {/* Results list */}
          <div className="lg:col-span-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-[12px] font-semibold text-foreground-900">Businesses near you</p>
              <div className="sm:hidden">
                <Segmented options={sortOptions} value={sort} onChange={setSort} />
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon="ri-search-eye-line"
                title="No businesses match these filters"
                body="Try a wider distance, a different category, or clear the verified and open filters."
                action={<Button size="sm" variant="outline" onClick={() => { setDistance(20); setCategory("all"); setVerifiedOnly(false); setOpenOnly(false); setQuery(""); }}>Reset filters</Button>}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.slice(0, 8).map((business) => (
                  <div key={business.id} onMouseEnter={() => setSelectedId(business.id)}>
                    <BusinessCard business={business} compact saved={saved.includes(business.id)} onToggleSave={toggleSaved} onOpen={setDetail} />
                  </div>
                ))}
                {filtered.length > 8 ? (
                  <InfoNote icon="ri-filter-3-line">Showing the 8 closest matches. Narrow the distance filter to refine the list.</InfoNote>
                ) : null}
              </div>
            )}

            <div className="mt-4 rounded-2xl border border-background-200 bg-background-50 p-4">
              <div className="flex items-start gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <i className="ri-store-2-line" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold text-foreground-900">Own a business in this area?</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-foreground-500">Add your workshop, shop or stall and appear in nearby searches within a day.</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/auth?mode=register&role=business">
                  <Button size="sm" icon="ri-add-line">List my business</Button>
                </Link>
                <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" icon="ri-external-link-line">Open Google Maps</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}