import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNaira, greeting, useApp, useToast } from "@/lib/core";
import { DashShell, PageHeading } from "@/components/shell";
import { Avatar, Button, Field, Input, InfoNote, Modal, Pill, Progress, Select, StatTile, Switch, Textarea } from "@/components/ui";
import { ReviewRow } from "@/components/cards";
import { businesses, businessStats, reviews, serviceRequests, transactions } from "@/mocks/data";

const tabs = [
  { id: "", label: "Overview" },
  { id: "profile", label: "Business profile" },
  { id: "services", label: "Services" },
  { id: "requests", label: "Customer requests" },
  { id: "reviews", label: "Reviews" },
  { id: "transactions", label: "Transactions" },
];

export default function BusinessDashboard() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const { user } = useApp();
  const business = businesses[0];
  const tab = params.get("tab") ?? "";

  const [visible, setVisible] = useState(true);
  const [acceptingRequests, setAcceptingRequests] = useState(true);
  const [requests, setRequests] = useState(serviceRequests.filter((item) => item.businessId === business.id));
  const [services, setServices] = useState(business.services);
  const [serviceModal, setServiceModal] = useState(false);
  const [pinModal, setPinModal] = useState(false);
  const [pin, setPin] = useState({ x: 38, y: 44 });
  const [newService, setNewService] = useState({ name: "", price: "", duration: "" });
  const [profile, setProfile] = useState({
    name: business.name,
    tagline: business.tagline,
    about: business.about,
    phone: business.phone,
    hours: business.hours,
    area: business.area,
  });

  const setTab = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set("tab", id);
    else next.delete("tab");
    setParams(next);
  };

  const income = transactions.filter((item) => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions.filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);

  const addService = () => {
    if (!newService.name.trim()) {
      toast("Add a service name to continue.", "info");
      return;
    }
    setServices((prev) => [...prev, { name: newService.name, price: newService.price || "₦0", duration: newService.duration || "To be agreed" }]);
    setNewService({ name: "", price: "", duration: "" });
    setServiceModal(false);
    toast("Service added to your public profile.");
  };

  return (
    <DashShell role="business">
      <PageHeading
        title={`${greeting()}, ${user?.name?.split(" ")[0] ?? "Emeka"}`}
        subtitle="This is your business workspace. Manage how customers find you, respond to enquiries and keep your financial record current."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" icon="ri-eye-line" onClick={() => setTab("profile")}>View public profile</Button>
            <Button size="sm" icon="ri-add-line" onClick={() => setServiceModal(true)}>Add a service</Button>
          </div>
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

      {/* Identity strip */}
      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-background-200 bg-background-50 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-background-200">
            <img src={business.image} alt={business.name} className="h-full w-full object-cover object-top" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[14px] font-semibold text-foreground-950">{business.name}</p>
              {business.verified ? <Pill tone="verified" icon="ri-verified-badge-line">Verified</Pill> : <Pill tone="warn">Verification pending</Pill>}
            </div>
            <p className="mt-0.5 text-[11.5px] text-foreground-500">
              {business.categoryLabel} · {business.area}, {business.city} · {business.rating} rating from {business.reviewCount} reviews
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-64">
            <Switch checked={visible} onChange={(next) => { setVisible(next); toast(next ? "Your business is now visible to nearby customers." : "Your business is hidden from discovery. Existing customers can still message you.", "info"); }} label="Visible in discovery" description="Appear in nearby searches" />
          </div>
        </div>
      </div>

      {tab === "" ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Profile views" value={businessStats.profileViews.toLocaleString("en-NG")} change={`${businessStats.viewsChange}% this month`} icon="ri-eye-line" tone="navy" />
            <StatTile label="Customer enquiries" value={String(businessStats.enquiries)} change={`${businessStats.enquiriesChange}% this month`} icon="ri-chat-3-line" tone="teal" />
            <StatTile label="Customers served" value={String(businessStats.customers)} change={`${businessStats.customersChange}% this month`} icon="ri-user-heart-line" tone="slate" />
            <StatTile label="Recorded revenue" value={formatNaira(businessStats.revenue, true)} change={`${businessStats.revenueChange}% this month`} icon="ri-wallet-3-line" tone="teal" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground-950">Discovery performance</p>
                    <p className="mt-0.5 text-[11px] text-foreground-500">Weekly profile views over the last 12 weeks</p>
                  </div>
                  <Pill tone="verified" icon="ri-arrow-up-line">+18%</Pill>
                </div>
                <div className="mt-4 h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={businessStats.weeklyViews.map((views, index) => ({ week: `W${index + 1}`, views }))} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--background-200))" vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 10, fill: "oklch(var(--foreground-400))" }} axisLine={false} tickLine={false} interval={1} />
                      <YAxis tick={{ fontSize: 10, fill: "oklch(var(--foreground-400))" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid oklch(var(--background-200))", fontSize: 12 }} />
                      <Bar dataKey="views" fill="oklch(var(--primary-500))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground-950">Customer requests</p>
                    <p className="mt-0.5 text-[11px] text-foreground-500">{requests.filter((item) => item.status === "New").length} new requests need a reply</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setTab("requests")} iconRight="ri-arrow-right-line">Open inbox</Button>
                </div>
                <div className="mt-3 space-y-2">
                  {requests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-background-200 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-foreground-900">{request.service}</p>
                        <p className="text-[10.5px] text-foreground-500">{request.customer} · {request.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="k-num text-[11.5px] font-semibold text-foreground-900">{formatNaira(request.budget)}</span>
                        <Pill tone={request.status === "New" ? "accent" : request.status === "Completed" ? "verified" : "neutral"}>{request.status}</Pill>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <p className="text-[13px] font-semibold text-foreground-950">Financial snapshot</p>
                <p className="mt-0.5 text-[11px] text-foreground-500">Recorded this month</p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-foreground-600">Income</span>
                    <span className="k-num font-semibold text-accent-700">{formatNaira(income)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-foreground-600">Expenses</span>
                    <span className="k-num font-semibold text-foreground-800">{formatNaira(expense)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-background-200 pt-2 text-[12px]">
                    <span className="font-semibold text-foreground-800">Net</span>
                    <span className="k-num font-semibold text-primary-700">{formatNaira(income - expense)}</span>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-accent-50 px-3 py-2">
                  <p className="text-[10.5px] leading-relaxed text-accent-900">Your Economic Trust Profile is at 78. Two more consistent months could unlock better stock credit terms.</p>
                </div>
                <Link to="/finance" className="mt-2.5 inline-block text-[11px] font-semibold text-accent-700 hover:underline">Open financial dashboard</Link>
              </div>

              <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-foreground-950">Verification</p>
                  <Pill tone="verified" icon="ri-shield-check-line">Approved</Pill>
                </div>
                <ul className="mt-3 space-y-2 text-[11.5px]">
                  {[
                    { label: "Business name checked", done: true },
                    { label: "CAC document accepted", done: true },
                    { label: "Location proof accepted", done: true },
                    { label: "Bank account linked", done: false },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center gap-2 text-foreground-600">
                      <i className={item.done ? "ri-checkbox-circle-fill text-accent-600" : "ri-checkbox-blank-circle-line text-foreground-300"} aria-hidden="true" />
                      {item.label}
                    </li>
                  ))}
                </ul>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => toast("A verification advisor will contact you about linking your business account.")}>Complete verification</Button>
              </div>

              <div className="rounded-2xl border border-background-200 bg-primary-950 p-4">
                <p className="text-[12.5px] font-semibold text-background-50">Visibility tip</p>
                <p className="mt-1 text-[11px] leading-relaxed text-background-300">Businesses with 4 or more photos receive about 40 percent more enquiries. Add photos of recent work.</p>
                <Button size="sm" variant="accent" className="mt-3" icon="ri-camera-line" onClick={() => setTab("profile")}>Manage photos</Button>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {tab === "profile" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
              <p className="text-[13px] font-semibold text-foreground-950">Public business profile</p>
              <p className="mt-0.5 text-[11px] text-foreground-500">This is what customers see when they open your card.</p>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Business name" htmlFor="p-name">
                  <Input id="p-name" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
                </Field>
                <Field label="Phone number" htmlFor="p-phone">
                  <Input id="p-phone" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
                </Field>
                <Field label="Short tagline" htmlFor="p-tagline" className="sm:col-span-2">
                  <Input id="p-tagline" value={profile.tagline} onChange={(event) => setProfile({ ...profile, tagline: event.target.value })} />
                </Field>
                <Field label="Area" htmlFor="p-area">
                  <Input id="p-area" value={profile.area} onChange={(event) => setProfile({ ...profile, area: event.target.value })} />
                </Field>
                <Field label="City" htmlFor="p-city">
                  <Select id="p-city" defaultValue={business.city}>
                    {["Lagos", "Ibadan", "Abuja", "Kano", "Port Harcourt", "Enugu"].map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Opening hours" htmlFor="p-hours" className="sm:col-span-2">
                  <Input id="p-hours" value={profile.hours} onChange={(event) => setProfile({ ...profile, hours: event.target.value })} />
                </Field>
                <Field label="About the business" htmlFor="p-about" className="sm:col-span-2">
                  <Textarea id="p-about" value={profile.about} maxLength={500} onChange={(event) => setProfile({ ...profile, about: event.target.value })} />
                </Field>
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-foreground-700">Photographs</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[business.image, business.cover, businesses[8].image, businesses[2].image].map((src, index) => (
                    <div key={src} className="relative h-24 overflow-hidden rounded-lg bg-background-200">
                      <img src={src} alt={`Workshop photo ${index + 1}`} className="h-full w-full object-cover object-top" />
                      {index === 0 ? <span className="absolute left-1.5 top-1.5 rounded bg-primary-950/70 px-1.5 py-0.5 text-[9px] font-semibold text-background-50">Cover</span> : null}
                    </div>
                  ))}
                  <button type="button" onClick={() => toast("Photo upload opened. JPG or PNG, up to 5 MB each.")} className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-background-300 text-[10.5px] text-foreground-500 hover:border-accent-400 hover:text-accent-700">
                    <i className="ri-add-line text-lg" aria-hidden="true" />
                    Add photo
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={() => toast("Profile saved. Changes are live for nearby customers.")} icon="ri-save-3-line">Save changes</Button>
                <Button variant="outline" onClick={() => setPinModal(true)} icon="ri-map-pin-2-line">Update location pin</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <p className="text-[13px] font-semibold text-foreground-950">Discovery controls</p>
              <div className="mt-3 space-y-2">
                <Switch checked={visible} onChange={setVisible} label="Visible in discovery" description="Show my card in nearby searches" />
                <Switch checked={acceptingRequests} onChange={setAcceptingRequests} label="Accepting service requests" description="Customers can request a booking" />
              </div>
            </div>
            <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4">
              <p className="text-[12.5px] font-semibold text-accent-900">Profile completeness</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-accent-800">
                <span>4 of 5 sections complete</span>
                <span className="font-semibold">84%</span>
              </div>
              <div className="mt-1.5"><Progress value={84} /></div>
              <p className="mt-2 text-[10.5px] leading-relaxed text-accent-800">Add your bank account to complete verification and improve financial product eligibility.</p>
            </div>
            <InfoNote icon="ri-camera-line">Clear daylight photos of your workspace build trust faster than logos or stock images.</InfoNote>
          </div>
        </div>
      ) : null}

      {tab === "services" ? (
        <div className="rounded-2xl border border-background-200 bg-background-50">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-200 p-4 md:p-5">
            <div>
              <p className="text-[13px] font-semibold text-foreground-950">Services and prices</p>
              <p className="mt-0.5 text-[11px] text-foreground-500">{services.length} services published on your profile</p>
            </div>
            <Button size="sm" icon="ri-add-line" onClick={() => setServiceModal(true)}>Add service</Button>
          </div>
          <div className="divide-y divide-background-200">
            {services.map((service) => (
              <div key={service.name} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold text-foreground-900">{service.name}</p>
                  <p className="text-[10.5px] text-foreground-500">{service.duration}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="k-num text-[13px] font-semibold text-foreground-950">{service.price}</span>
                  <Button size="sm" variant="ghost" onClick={() => toast("Service editor opened.")}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setServices((prev) => prev.filter((item) => item.name !== service.name)); toast("Service removed from your profile.", "info"); }}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {tab === "requests" ? (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <Avatar initials={request.customer.split(" ").map((part) => part[0]).slice(0, 2).join("")} tone="slate" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground-950">{request.service}</p>
                    <p className="text-[11px] text-foreground-500">{request.customer} · {request.date}</p>
                    <p className="mt-1.5 max-w-xl text-[11.5px] leading-relaxed text-foreground-600">{request.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="k-num text-[14px] font-semibold text-foreground-950">{formatNaira(request.budget)}</p>
                  <Pill tone={request.status === "New" ? "accent" : request.status === "Completed" ? "verified" : "neutral"}>{request.status}</Pill>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-background-200 pt-3">
                <Button size="sm" onClick={() => { setRequests((prev) => prev.map((item) => item.id === request.id ? { ...item, status: "Accepted" } : item)); toast(`Request accepted. ${request.customer} has been notified.`); }}>Accept</Button>
                <Button size="sm" variant="outline" onClick={() => toast(`Message opened with ${request.customer}.`)} icon="ri-chat-3-line">Message</Button>
                <Button size="sm" variant="ghost" onClick={() => { setRequests((prev) => prev.map((item) => item.id === request.id ? { ...item, status: "Completed" } : item)); toast("Marked as completed. This activity supports your trust profile."); }}>Mark completed</Button>
                <Button size="sm" variant="ghost" onClick={() => { setRequests((prev) => prev.filter((item) => item.id !== request.id)); toast("Request declined and removed from your inbox.", "info"); }}>Decline</Button>
              </div>
            </div>
          ))}
          {requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-background-300 px-6 py-12 text-center text-[12px] text-foreground-500">
              No open requests. New customer enquiries will appear here.
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "reviews" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            {reviews.filter((review) => review.businessId === business.id).map((review) => (
              <div key={review.id}>
                <ReviewRow review={review} />
                <div className="mt-1.5 flex justify-end">
                  <Button size="sm" variant="ghost" icon="ri-reply-line" onClick={() => toast(`Reply sent to ${review.author}.`)}>Reply</Button>
                </div>
              </div>
            ))}
            {reviews.filter((review) => review.businessId === business.id).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-background-300 px-6 py-12 text-center text-[12px] text-foreground-500">
                No reviews yet. Ask your last few customers to leave one.
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <p className="text-[13px] font-semibold text-foreground-950">Rating summary</p>
              <div className="mt-2 flex items-end gap-2">
                <p className="k-num text-3xl font-semibold text-foreground-950">{business.rating}</p>
                <p className="pb-1 text-[11px] text-foreground-500">from {business.reviewCount} reviews</p>
              </div>
              <div className="mt-3 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const share = star === 5 ? 78 : star === 4 ? 16 : star === 3 ? 4 : star === 2 ? 1 : 1;
                  return (
                    <div key={star} className="flex items-center gap-2 text-[10.5px]">
                      <span className="w-3 text-foreground-500">{star}</span>
                      <i className="ri-star-fill text-[9px] text-accent-600" aria-hidden="true" />
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-200">
                        <div className="h-full rounded-full bg-accent-500" style={{ width: `${share}%` }} />
                      </div>
                      <span className="w-7 text-right text-foreground-500">{share}%</span>
                    </div>
                  );
                })}
              </div>
              <InfoNote icon="ri-lightbulb-line">Replies to reviews increase repeat customer likelihood by around 20 percent.</InfoNote>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "transactions" ? (
        <div className="rounded-2xl border border-background-200 bg-background-50">
          <div className="grid grid-cols-2 gap-3 border-b border-background-200 p-4 md:grid-cols-4">
            {[
              { label: "Total income", value: formatNaira(income) },
              { label: "Total expenses", value: formatNaira(expense) },
              { label: "Net position", value: formatNaira(income - expense) },
              { label: "Records logged", value: String(transactions.length) },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] uppercase tracking-wide text-foreground-500">{item.label}</p>
                <p className="k-num mt-0.5 text-[15px] font-semibold text-foreground-950">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-background-200 text-[10px] uppercase tracking-wide text-foreground-500">
                  <th className="px-4 py-2.5 font-semibold">Description</th>
                  <th className="px-4 py-2.5 font-semibold">Party</th>
                  <th className="px-4 py-2.5 font-semibold">Channel</th>
                  <th className="px-4 py-2.5 font-semibold">Date</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-100">
                {transactions.map((item) => (
                  <tr key={item.id} className="text-[12px]">
                    <td className="px-4 py-2.5 text-foreground-900">{item.label}</td>
                    <td className="px-4 py-2.5 text-foreground-500">{item.party}</td>
                    <td className="px-4 py-2.5"><Pill>{item.channel}</Pill></td>
                    <td className="px-4 py-2.5 text-foreground-500">{item.date}</td>
                    <td className={`k-num px-4 py-2.5 text-right font-semibold ${item.kind === "income" ? "text-accent-700" : "text-foreground-700"}`}>
                      {item.kind === "income" ? "+" : "-"}{formatNaira(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-background-200 p-4">
            <p className="text-[11px] text-foreground-500">Records marked as verified are shared with your consent when you apply for a financial product.</p>
            <Button size="sm" icon="ri-add-line" onClick={() => toast("New transaction form opened. Record a sale or an expense.")}>Log transaction</Button>
          </div>
        </div>
      ) : null}

      <Modal open={pinModal} onClose={() => setPinModal(false)} title="Update your location pin" subtitle="Tap the map to place your workshop, shop or stall" width="max-w-xl">
        <div className="space-y-3">
          <button
            type="button"
            aria-label="Choose a location on the map"
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setPin({
                x: Math.min(96, Math.max(4, Math.round(((event.clientX - rect.left) / rect.width) * 100))),
                y: Math.min(94, Math.max(6, Math.round(((event.clientY - rect.top) / rect.height) * 100))),
              });
            }}
            className="relative block h-56 w-full cursor-crosshair overflow-hidden rounded-xl border border-background-200 k-map"
          >
            <span className="pointer-events-none absolute inset-0 k-grid opacity-60" />
            <span className="pointer-events-none absolute left-0 right-0 top-[38%] h-2 bg-background-50/80" />
            <span className="pointer-events-none absolute bottom-[26%] left-0 right-0 h-1.5 bg-background-50/70" />
            <span className="pointer-events-none absolute bottom-0 left-[26%] top-0 w-2 bg-background-50/80" />
            <span className="pointer-events-none absolute bottom-0 right-[22%] top-0 w-1.5 bg-background-50/65" />
            <span className="pointer-events-none absolute left-3 top-3 rounded bg-background-50/95 px-2 py-1 text-[10px] font-semibold text-foreground-700">Yaba, Lagos</span>
            <span className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background-50 bg-primary-600 text-background-50">
                <i className="ri-store-2-line text-sm" aria-hidden="true" />
              </span>
              <span className="mx-auto block h-2 w-2 -translate-y-1 rotate-45 bg-primary-600" />
            </span>
          </button>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-background-100 px-3 py-2 text-[11px] text-foreground-600">
            <span>Pin position: {pin.x} percent across, {pin.y} percent down</span>
            <span className="flex items-center gap-1 text-accent-700"><i className="ri-focus-3-line" aria-hidden="true" /> Accuracy about 15 metres</span>
          </div>
          <InfoNote>Customers only see your area and distance, never your exact coordinates.</InfoNote>
          <div className="flex gap-2">
            <Button block onClick={() => { setPinModal(false); toast("Location pin saved. Nearby discovery will use the new position."); }} icon="ri-map-pin-2-line">Save pin</Button>
            <Button variant="outline" onClick={() => setPin({ x: 38, y: 44 })} icon="ri-crosshair-line">Center</Button>
          </div>
        </div>
      </Modal>

      <Modal open={serviceModal} onClose={() => setServiceModal(false)} title="Add a service" subtitle="Customers see this on your public profile">
        <div className="space-y-3">
          <Field label="Service name" htmlFor="ns-name">
            <Input id="ns-name" value={newService.name} onChange={(event) => setNewService({ ...newService, name: event.target.value })} placeholder="e.g. Full engine diagnostics" />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Price" htmlFor="ns-price">
              <Input id="ns-price" value={newService.price} onChange={(event) => setNewService({ ...newService, price: event.target.value })} placeholder="₦18,000" />
            </Field>
            <Field label="Duration" htmlFor="ns-duration">
              <Input id="ns-duration" value={newService.duration} onChange={(event) => setNewService({ ...newService, duration: event.target.value })} placeholder="45 min" />
            </Field>
          </div>
          <Button block onClick={addService} icon="ri-add-line">Publish service</Button>
        </div>
      </Modal>
    </DashShell>
  );
}