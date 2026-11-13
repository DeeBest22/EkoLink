import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { Business } from "@/lib/core";
import { formatNaira, greeting, useApp, useToast } from "@/lib/core";
import { DashShell, PageHeading } from "@/components/shell";
import { Button, EmptyState, Field, InfoNote, Input, Pill, Select, StatTile } from "@/components/ui";
import { BusinessCard, ReviewRow } from "@/components/cards";
import { BusinessDetailModal } from "@/components/business-detail";
import { businesses, recentSearches, reviews, serviceRequests } from "@/mocks/data";

const tabs = [
  { id: "", label: "Overview" },
  { id: "saved", label: "Saved businesses" },
  { id: "requests", label: "Requests and bookings" },
  { id: "searches", label: "Recent searches" },
  { id: "reviews", label: "My reviews" },
  { id: "profile", label: "Customer profile" },
];

export default function CustomerDashboard() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, saved, toggleSaved, requested, reviews: written, addReview } = useApp();
  const tab = params.get("tab") ?? "";
  const [detail, setDetail] = useState<Business | null>(null);

  const savedBusinesses = businesses.filter((business) => saved.includes(business.id));
  const requestedBusinesses = businesses.filter((business) => requested.includes(business.id));
  const reviewedBusinesses = businesses.filter((business) => written.includes(business.id));

  const setTab = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set("tab", id);
    else next.delete("tab");
    setParams(next);
  };

  const activeRequests = serviceRequests.filter((item) => item.businessId === businesses[0].id || item.businessId === businesses[1].id).slice(0, 3);

  return (
    <DashShell role="customer">
      <BusinessDetailModal business={detail} onClose={() => setDetail(null)} />

      <PageHeading
        title={`${greeting()}, ${user?.name?.split(" ")[0] ?? "Tola"}`}
        subtitle="Your saved businesses, service requests and reviews in one place. Discovery stays open even without an account."
        action={
          <Link to="/discover"><Button size="sm" icon="ri-map-pin-2-line">Find businesses near me</Button></Link>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`cursor-pointer whitespace-nowrap rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors ${
              tab === item.id ? "border-primary-500 bg-primary-500 text-background-50" : "border-background-200 bg-background-50 text-foreground-600 hover:border-primary-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "" ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Saved businesses" value={String(savedBusinesses.length)} icon="ri-bookmark-line" tone="navy" />
            <StatTile label="Open requests" value={String(requestedBusinesses.length + 1)} icon="ri-calendar-check-line" tone="teal" />
            <StatTile label="Reviews written" value={String(reviewedBusinesses.length + 2)} icon="ri-star-line" tone="slate" />
            <StatTile label="Average spend" value={formatNaira(18500)} icon="ri-wallet-3-line" tone="teal" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground-950">Recommended near you</p>
                    <p className="mt-0.5 text-[11px] text-foreground-500">Based on your saved businesses and recent searches</p>
                  </div>
                  <Link to="/discover"><Button size="sm" variant="ghost" iconRight="ri-arrow-right-line">Open discovery</Button></Link>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {businesses.slice(0, 3).map((business) => (
                    <button
                      key={business.id}
                      type="button"
                      onClick={() => setDetail(business)}
                      className="cursor-pointer overflow-hidden rounded-xl border border-background-200 text-left transition-colors hover:border-primary-300"
                    >
                      <span className="block h-24 w-full overflow-hidden bg-background-200">
                        <img src={business.image} alt={business.name} className="h-full w-full object-cover object-top" />
                      </span>
                      <span className="block p-2.5">
                        <span className="block truncate text-[11.5px] font-semibold text-foreground-900">{business.name}</span>
                        <span className="mt-0.5 flex items-center justify-between text-[10px] text-foreground-500">
                          <span>{business.distanceKm} km</span>
                          <span className="flex items-center gap-0.5"><i className="ri-star-fill text-accent-600" aria-hidden="true" />{business.rating}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-foreground-950">Your active requests</p>
                  <Button size="sm" variant="ghost" onClick={() => setTab("requests")} iconRight="ri-arrow-right-line">View all</Button>
                </div>
                <div className="mt-3 space-y-2">
                  {activeRequests.map((request) => {
                    const business = businesses.find((item) => item.id === request.businessId);
                    return (
                      <div key={request.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-background-200 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-semibold text-foreground-900">{request.service}</p>
                          <p className="text-[10.5px] text-foreground-500">{business?.name} · {request.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="k-num text-[11px] font-semibold text-foreground-800">{formatNaira(request.budget)}</span>
                          <Pill tone={request.status === "Accepted" ? "verified" : request.status === "New" ? "accent" : "neutral"}>{request.status}</Pill>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-foreground-950">Saved businesses</p>
                  <span className="k-num text-sm font-semibold text-foreground-700">{savedBusinesses.length}</span>
                </div>
                {savedBusinesses.length ? (
                  <div className="mt-2.5 space-y-1.5">
                    {savedBusinesses.slice(0, 3).map((business) => (
                      <button key={business.id} type="button" onClick={() => setDetail(business)} className="flex w-full cursor-pointer items-center gap-2 rounded-lg border border-background-200 p-1.5 text-left hover:border-primary-300">
                        <span className="h-8 w-8 overflow-hidden rounded bg-background-200">
                          <img src={business.image} alt={business.name} className="h-full w-full object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11px] font-semibold text-foreground-900">{business.name}</span>
                          <span className="block text-[9.5px] text-foreground-500">{business.categoryLabel}</span>
                        </span>
                        <i className="ri-arrow-right-s-line text-foreground-300" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] leading-relaxed text-foreground-500">No saved businesses yet. Tap the bookmark on any card during discovery.</p>
                )}
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setTab("saved")}>Manage saved</Button>
              </div>

              <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <p className="text-[13px] font-semibold text-foreground-950">Recent searches</p>
                <div className="mt-2 space-y-1.5">
                  {recentSearches.slice(0, 3).map((search) => (
                    <button key={search.id} type="button" onClick={() => navigate(`/discover?q=${encodeURIComponent(search.term)}`)} className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] text-foreground-600 hover:bg-background-100">
                      <span className="flex min-w-0 items-center gap-1.5"><i className="ri-history-line text-foreground-400" aria-hidden="true" /><span className="truncate">{search.term}</span></span>
                      <span className="shrink-0 text-[9.5px] text-foreground-400">{search.results} results</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-background-200 bg-primary-950 p-4">
                <p className="text-[12.5px] font-semibold text-background-50">Need help choosing?</p>
                <p className="mt-1 text-[11px] leading-relaxed text-background-300">Describe the problem and Eko AI will suggest nearby verified businesses.</p>
                <Link to="/ai"><Button size="sm" variant="accent" className="mt-2.5" icon="ri-sparkling-line">Ask Eko AI</Button></Link>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {tab === "saved" ? (
        savedBusinesses.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {savedBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} saved onToggleSave={toggleSaved} onOpen={setDetail} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="ri-bookmark-line"
            title="Nothing saved yet"
            body="Browse nearby businesses and tap the bookmark on any card. Saved businesses stay here for quick access."
            action={<Link to="/discover"><Button size="sm" icon="ri-map-pin-2-line">Start discovering</Button></Link>}
          />
        )
      ) : null}

      {tab === "requests" ? (
        <div className="space-y-3">
          {requestedBusinesses.map((business) => (
            <div key={business.id} className="rounded-2xl border border-accent-200 bg-accent-50/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-background-200">
                    <img src={business.image} alt={business.name} className="h-full w-full object-cover" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-foreground-950">Request sent to {business.name}</p>
                    <p className="text-[10.5px] text-foreground-500">Typically replies within 2 hours · {business.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone="accent">Awaiting reply</Pill>
                  <Button size="sm" variant="outline" onClick={() => toast(`${business.name} has been notified that you are waiting.`)}>Follow up</Button>
                </div>
              </div>
            </div>
          ))}

          {activeRequests.map((request) => {
            const business = businesses.find((item) => item.id === request.businessId);
            return (
              <div key={request.id} className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[12.5px] font-semibold text-foreground-950">{request.service}</p>
                    <p className="text-[10.5px] text-foreground-500">{business?.name} · {request.date}</p>
                    <p className="mt-1 max-w-lg text-[11px] leading-relaxed text-foreground-600">{request.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="k-num text-[13px] font-semibold text-foreground-950">{formatNaira(request.budget)}</p>
                    <Pill tone={request.status === "Completed" ? "verified" : request.status === "New" ? "accent" : "neutral"}>{request.status}</Pill>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-background-200 pt-3">
                  <Button size="sm" variant="outline" icon="ri-chat-3-line" onClick={() => toast(`Conversation with ${business?.name} opened.`)}>Message</Button>
                  <Button size="sm" variant="ghost" icon="ri-star-line" onClick={() => { if (business) { addReview(business.id); toast(`Review for ${business.name} saved.`); } }}>Leave review</Button>
                </div>
              </div>
            );
          })}

          {requestedBusinesses.length === 0 && activeRequests.length === 0 ? (
            <EmptyState icon="ri-calendar-check-line" title="No requests yet" body="Open a business profile and send a service request. You can track every reply here." action={<Link to="/discover"><Button size="sm">Find a business</Button></Link>} />
          ) : null}
        </div>
      ) : null}

      {tab === "searches" ? (
        <div className="rounded-2xl border border-background-200 bg-background-50">
          <div className="border-b border-background-200 p-4">
            <p className="text-[13px] font-semibold text-foreground-950">Recent searches</p>
            <p className="mt-0.5 text-[11px] text-foreground-500">Run any search again to see current results.</p>
          </div>
          <div className="divide-y divide-background-100">
            {recentSearches.map((search) => (
              <div key={search.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-100 text-foreground-500">
                    <i className="ri-history-line" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[12px] font-medium text-foreground-900">{search.term}</p>
                    <p className="text-[10px] text-foreground-500">{search.results} results · {search.when}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate(`/discover?q=${encodeURIComponent(search.term)}`)}>Search again</Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "profile" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
              <p className="text-[13px] font-semibold text-foreground-950">Your details</p>
              <p className="mt-0.5 text-[11px] text-foreground-500">Used to suggest businesses near you and to keep your bookings together.</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Full name" htmlFor="c-name">
                  <Input id="c-name" defaultValue={user?.name ?? "Tola Adeyemi"} />
                </Field>
                <Field label="Email address" htmlFor="c-email">
                  <Input id="c-email" type="email" defaultValue={user?.email ?? "tola@example.com"} />
                </Field>
                <Field label="Phone number" htmlFor="c-phone">
                  <Input id="c-phone" defaultValue="+234 802 118 6634" />
                </Field>
                <Field label="Usual city" htmlFor="c-city">
                  <Select id="c-city" defaultValue="Lagos">
                    {["Lagos", "Ibadan", "Abuja", "Kano", "Port Harcourt", "Enugu"].map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Select>
                </Field>
              </div>
              <div className="mt-4">
                <p className="mb-1.5 text-xs font-semibold text-foreground-700">Services you usually need</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Mechanics", "Food vendors", "Hairdressers", "Plumbers", "Tailors"].map((item) => (
                    <span key={item} className="rounded-full border border-accent-200 bg-accent-50 px-2.5 py-1 text-[11px] font-medium text-accent-900">{item}</span>
                  ))}
                </div>
              </div>
              <Button className="mt-4" onClick={() => toast("Customer profile saved.")} icon="ri-save-3-line">Save profile</Button>
            </div>
          </div>
          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <p className="text-[13px] font-semibold text-foreground-950">Account summary</p>
              <div className="mt-3 space-y-2 text-[12px]">
                <div className="flex items-center justify-between"><span className="text-foreground-600">Saved businesses</span><span className="font-semibold text-foreground-900">{savedBusinesses.length}</span></div>
                <div className="flex items-center justify-between"><span className="text-foreground-600">Requests sent</span><span className="font-semibold text-foreground-900">{requestedBusinesses.length + activeRequests.length}</span></div>
                <div className="flex items-center justify-between"><span className="text-foreground-600">Reviews written</span><span className="font-semibold text-foreground-900">{reviewedBusinesses.length}</span></div>
                <div className="flex items-center justify-between border-t border-background-200 pt-2"><span className="text-foreground-600">Member since</span><span className="font-semibold text-foreground-900">March 2025</span></div>
              </div>
            </div>
            <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4">
              <p className="text-[12.5px] font-semibold text-accent-900">Account is optional</p>
              <p className="mt-1 text-[11px] leading-relaxed text-accent-800">You can keep exploring businesses without signing in. An account only keeps your saved list, requests and reviews together.</p>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "reviews" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            {reviewedBusinesses.map((business) => (
              <div key={business.id} className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[12.5px] font-semibold text-foreground-950">{business.name}</p>
                    <p className="text-[10.5px] text-foreground-500">{business.categoryLabel} · {business.area}, {business.city}</p>
                  </div>
                  <Pill tone="verified" icon="ri-check-line">Published</Pill>
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-foreground-600">Your review has been recorded in this demonstration. In a live account it would appear on the public profile after moderation.</p>
              </div>
            ))}
            {reviews.filter((review) => review.author.startsWith("Tola") || review.author.startsWith("Amaka")).slice(0, 1).map((review) => (
              <ReviewRow key={review.id} review={review} />
            ))}
            {reviewedBusinesses.length === 0 ? (
              <EmptyState icon="ri-star-line" title="You have not written a review yet" body="Reviews help other customers pick confidently and reward good businesses." action={<Link to="/discover"><Button size="sm">Find a business to review</Button></Link>} />
            ) : null}
          </div>
          <div className="lg:col-span-4">
            <InfoNote icon="ri-star-line">Reviews must describe a real experience. Businesses can reply but cannot delete a review.</InfoNote>
          </div>
        </div>
      ) : null}
    </DashShell>
  );
}