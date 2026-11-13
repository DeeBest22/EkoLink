import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNaira, useToast } from "@/lib/core";
import { DashShell, PageHeading } from "@/components/shell";
import { Button, InfoNote, Pill, Progress, StatTile } from "@/components/ui";
import { adminStats, adminUsers, fraudSignals, jobs, partnerInstitutions, reportedBusinesses, verificationQueue } from "@/mocks/data";

const tabs = [
  { id: "", label: "Overview" },
  { id: "verification", label: "Verification" },
  { id: "users", label: "Users" },
  { id: "opportunities", label: "Opportunities" },
  { id: "reports", label: "Reports and fraud" },
  { id: "partners", label: "Financial partners" },
];

const pieColors = [
  "oklch(var(--primary-500))",
  "oklch(var(--accent-500))",
  "oklch(var(--secondary-400))",
  "oklch(var(--accent-300))",
  "oklch(var(--primary-300))",
  "oklch(var(--background-400))",
];

export default function AdminDashboard() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const tab = params.get("tab") ?? "";

  const [queue, setQueue] = useState(verificationQueue);
  const [reports, setReports] = useState(reportedBusinesses);
  const [featured, setFeatured] = useState<string[]>([]);

  const setTab = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set("tab", id);
    else next.delete("tab");
    setParams(next);
  };

  const decide = (id: string, approved: boolean) => {
    const record = queue.find((item) => item.id === id);
    setQueue((prev) => prev.filter((item) => item.id !== id));
    toast(`${record?.business ?? "Business"} ${approved ? "approved and verified" : "rejected. The owner can resubmit documents"}.`, approved ? "success" : "info");
  };

  return (
    <DashShell role="admin">
      <PageHeading
        title="Ecosystem overview"
        subtitle="Institutional view of users, businesses, opportunity supply and financial partner activity. Sample data for demonstration."
        action={
          <div className="flex flex-wrap gap-2">
            <Pill tone="verified" icon="ri-shield-check-line">All systems normal</Pill>
            <Button size="sm" variant="outline" icon="ri-download-2-line" onClick={() => toast("Weekly ecosystem report generated as a sample file.")}>Export report</Button>
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

      {tab === "" ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Total users" value={adminStats.users.toLocaleString("en-NG")} change={`${adminStats.monthlyGrowth}% monthly growth`} icon="ri-group-line" tone="navy" />
            <StatTile label="Registered businesses" value={adminStats.businesses.toLocaleString("en-NG")} change="1,240 added this month" icon="ri-store-2-line" tone="teal" />
            <StatTile label="Job seekers" value={adminStats.seekers.toLocaleString("en-NG")} change="2,180 active this week" icon="ri-briefcase-4-line" tone="slate" />
            <StatTile label="Employers" value={adminStats.employers.toLocaleString("en-NG")} change="312 hiring now" icon="ri-building-4-line" tone="teal" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground-950">Economic activity</p>
                    <p className="mt-0.5 text-[11px] text-foreground-500">Discovery sessions, job applications and recorded transactions</p>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[10.5px] text-foreground-600">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary-500" /> Discovery</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent-500" /> Applications</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary-400" /> Transactions</span>
                  </div>
                </div>
                <div className="mt-4 h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adminStats.activitySeries} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
                      <defs>
                        <linearGradient id="adminDiscovery" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="oklch(var(--primary-500))" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="oklch(var(--primary-500))" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--background-200))" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "oklch(var(--foreground-400))" }} axisLine={false} tickLine={false} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                      <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid oklch(var(--background-200))", fontSize: 12 }} />
                      <Area type="monotone" dataKey="discovery" stroke="oklch(var(--primary-500))" strokeWidth={2} fill="url(#adminDiscovery)" />
                      <Area type="monotone" dataKey="applications" stroke="oklch(var(--accent-600))" strokeWidth={2} fill="transparent" />
                      <Area type="monotone" dataKey="transactions" stroke="oklch(var(--secondary-500))" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                  <p className="text-[13px] font-semibold text-foreground-950">Geographic distribution</p>
                  <p className="mt-0.5 text-[11px] text-foreground-500">Registered businesses by city</p>
                  <div className="mt-3 space-y-2.5">
                    {adminStats.cityDistribution.map((city) => {
                      const percent = Math.round((city.businesses / adminStats.businesses) * 100);
                      return (
                        <div key={city.city}>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-foreground-600">{city.city}</span>
                            <span className="font-semibold text-foreground-900">{city.businesses.toLocaleString("en-NG")}</span>
                          </div>
                          <div className="mt-1"><Progress value={percent * 2.2} tone={city.city === "Lagos" ? "navy" : "accent"} /></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                  <p className="text-[13px] font-semibold text-foreground-950">Business categories</p>
                  <p className="mt-0.5 text-[11px] text-foreground-500">Share of registered businesses</p>
                  <div className="mt-2 h-[170px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={adminStats.categorySplit} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2} stroke="none">
                          {adminStats.categorySplit.map((entry, index) => (
                            <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: 10, border: "1px solid oklch(var(--background-200))", fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {adminStats.categorySplit.map((entry, index) => (
                      <span key={entry.name} className="flex items-center gap-1.5 text-[10px] text-foreground-600">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                        {entry.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-foreground-950">Needs attention</p>
                  <Pill tone="warn">{adminStats.pendingVerification} pending</Pill>
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    { label: "Verification queue", value: queue.length, icon: "ri-shield-check-line" },
                    { label: "Reported businesses", value: reports.filter((item) => item.status !== "Resolved").length, icon: "ri-flag-line" },
                    { label: "Fraud signals", value: adminStats.flaggedTransactions, icon: "ri-alarm-warning-line" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg border border-background-200 px-3 py-2">
                      <span className="flex items-center gap-2 text-[11.5px] text-foreground-600">
                        <i className={`${item.icon} text-foreground-400`} aria-hidden="true" />
                        {item.label}
                      </span>
                      <span className="k-num text-[12px] font-semibold text-foreground-950">{item.value}</span>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setTab("verification")}>Review queue</Button>
              </div>

              <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <p className="text-[13px] font-semibold text-foreground-950">Fraud monitoring</p>
                <div className="mt-2 space-y-2">
                  {fraudSignals.slice(0, 3).map((signal) => (
                    <div key={signal.id} className="rounded-lg border border-background-200 p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-foreground-900">{signal.label}</p>
                        <Pill tone={signal.risk === "High" ? "warn" : "neutral"}>{signal.risk}</Pill>
                      </div>
                      <p className="mt-1 text-[10px] leading-relaxed text-foreground-500">{signal.detail}</p>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="ghost" className="mt-2 px-0" onClick={() => setTab("reports")} iconRight="ri-arrow-right-line">Open fraud desk</Button>
              </div>

              <div className="rounded-2xl border border-background-200 bg-primary-950 p-4">
                <p className="text-[12.5px] font-semibold text-background-50">Platform health</p>
                <p className="mt-1 text-[11px] leading-relaxed text-background-300">Verification backlog is 38 items, within the 48 hour target. Fraud signals are reviewed daily.</p>
                <div className="mt-2.5 h-[70px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={adminStats.activitySeries}>
                      <Bar dataKey="transactions" fill="oklch(var(--accent-500))" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {tab === "verification" ? (
        <div className="rounded-2xl border border-background-200 bg-background-50">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-200 p-4 md:p-5">
            <div>
              <p className="text-[13px] font-semibold text-foreground-950">Business verification queue</p>
              <p className="mt-0.5 text-[11px] text-foreground-500">Check business name, address and category before approving a badge.</p>
            </div>
            <Pill tone="warn">{queue.length} awaiting decision</Pill>
          </div>
          <div className="divide-y divide-background-100">
            {queue.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[12.5px] font-semibold text-foreground-950">{item.business}</p>
                    <Pill tone={item.risk === "High" ? "warn" : "neutral"}>{item.risk} risk</Pill>
                  </div>
                  <p className="mt-0.5 text-[10.5px] text-foreground-500">{item.city} · {item.document} · submitted {item.submitted}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast(`Documents for ${item.business} opened for review.`)}>Open documents</Button>
                  <Button size="sm" onClick={() => decide(item.id, true)} icon="ri-check-line">Approve</Button>
                  <Button size="sm" variant="ghost" onClick={() => decide(item.id, false)}>Reject</Button>
                </div>
              </div>
            ))}
            {queue.length === 0 ? (
              <div className="px-4 py-12 text-center text-[12px] text-foreground-500">Queue cleared. New submissions appear here automatically.</div>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "users" ? (
        <div className="rounded-2xl border border-background-200 bg-background-50">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-200 p-4 md:p-5">
            <div>
              <p className="text-[13px] font-semibold text-foreground-950">User management</p>
              <p className="mt-0.5 text-[11px] text-foreground-500">A sample of accounts across the six launch cities.</p>
            </div>
            <Button size="sm" variant="outline" icon="ri-search-line" onClick={() => toast("User search opened. Filter by city, role or status.")}>Search users</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-background-200 text-[10px] uppercase tracking-wide text-foreground-500">
                  <th className="px-4 py-2.5 font-semibold">Name</th>
                  <th className="px-4 py-2.5 font-semibold">Role</th>
                  <th className="px-4 py-2.5 font-semibold">City</th>
                  <th className="px-4 py-2.5 font-semibold">Joined</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-100">
                {adminUsers.map((item) => (
                  <tr key={item.id} className="text-[12px]">
                    <td className="px-4 py-2.5 font-medium text-foreground-900">{item.name}</td>
                    <td className="px-4 py-2.5 text-foreground-500">{item.role}</td>
                    <td className="px-4 py-2.5 text-foreground-500">{item.city}</td>
                    <td className="px-4 py-2.5 text-foreground-500">{item.joined}</td>
                    <td className="px-4 py-2.5">
                      <Pill tone={item.status === "Verified" ? "verified" : item.status === "Under review" ? "warn" : "neutral"}>{item.status}</Pill>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button type="button" onClick={() => toast(`${item.name}: account panel opened.`)} className="cursor-pointer text-[11px] font-semibold text-accent-700 hover:underline">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {tab === "opportunities" ? (
        <div className="rounded-2xl border border-background-200 bg-background-50">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-200 p-4 md:p-5">
            <div>
              <p className="text-[13px] font-semibold text-foreground-950">Job opportunity management</p>
              <p className="mt-0.5 text-[11px] text-foreground-500">Feature roles on the public board or suspend listings that break the rules.</p>
            </div>
            <Pill tone="neutral">{jobs.length} live listings</Pill>
          </div>
          <div className="divide-y divide-background-100">
            {jobs.map((job) => {
              const isFeatured = featured.includes(job.id);
              return (
                <div key={job.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[12.5px] font-semibold text-foreground-950">{job.title}</p>
                      {isFeatured ? <Pill tone="accent">Featured</Pill> : null}
                      {job.urgent ? <Pill tone="warn">Urgent</Pill> : null}
                    </div>
                    <p className="mt-0.5 text-[10.5px] text-foreground-500">{job.employer} · {job.city} · {job.type} · {formatNaira(job.salaryMin, true)} to {formatNaira(job.salaryMax, true)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={isFeatured ? "soft" : "outline"}
                      onClick={() => {
                        setFeatured((prev) => (prev.includes(job.id) ? prev.filter((id) => id !== job.id) : [...prev, job.id]));
                        toast(isFeatured ? `${job.title} removed from featured slots.` : `${job.title} is now featured on the public board.`);
                      }}
                    >
                      {isFeatured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toast(`${job.title} suspended for review.`)}>Suspend</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="rounded-2xl border border-background-200 bg-background-50">
              <div className="border-b border-background-200 p-4">
                <p className="text-[13px] font-semibold text-foreground-950">Reported businesses</p>
                <p className="mt-0.5 text-[11px] text-foreground-500">Review evidence from both sides before taking action.</p>
              </div>
              <div className="divide-y divide-background-100">
                {reports.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold text-foreground-950">{item.business}</p>
                        <p className="mt-0.5 max-w-lg text-[11px] leading-relaxed text-foreground-600">{item.reason}</p>
                      </div>
                      <Pill tone={item.status === "Resolved" ? "verified" : "warn"}>{item.status}</Pill>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10.5px] text-foreground-500">{item.reports} report{item.reports === 1 ? "" : "s"} on file</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast(`Evidence for ${item.business} opened.`)}>Review evidence</Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setReports((prev) => prev.map((row) => (row.id === item.id ? { ...row, status: "Resolved" } : row)));
                            toast(`${item.business} marked as resolved.`);
                          }}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-foreground-950">Fraud signals</p>
                <Pill tone="warn">{fraudSignals.length} open</Pill>
              </div>
              <div className="mt-3 space-y-2.5">
                {fraudSignals.map((signal) => (
                  <div key={signal.id} className="rounded-lg border border-background-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11.5px] font-semibold text-foreground-900">{signal.label}</p>
                      <Pill tone={signal.risk === "High" ? "warn" : "neutral"}>{signal.risk}</Pill>
                    </div>
                    <p className="mt-1 text-[10.5px] leading-relaxed text-foreground-500">{signal.detail}</p>
                    <p className="mt-1 text-[10px] text-foreground-400">Location: {signal.city}</p>
                  </div>
                ))}
              </div>
            </div>
            <InfoNote icon="ri-shield-keyhole-line">Fraud signals combine transaction patterns and location checks. No account is suspended without a human review.</InfoNote>
          </div>
        </div>
      ) : null}

      {tab === "partners" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-background-200 bg-background-50">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-background-200 p-4">
                <div>
                  <p className="text-[13px] font-semibold text-foreground-950">Financial partner management</p>
                  <p className="mt-0.5 text-[11px] text-foreground-500">Institutions offering credit, savings and insurance through EkoLink.</p>
                </div>
                <Button size="sm" icon="ri-add-line" onClick={() => toast("Partner onboarding form opened.")}>Add partner</Button>
              </div>
              <div className="divide-y divide-background-100">
                {partnerInstitutions.map((partner) => (
                  <div key={partner.name} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                        <i className="ri-bank-line" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[12.5px] font-semibold text-foreground-950">{partner.name}</p>
                        <p className="text-[10.5px] text-foreground-500">{partner.kind} · {partner.products} products</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Pill tone="verified">{partner.status}</Pill>
                      <Button size="sm" variant="ghost" onClick={() => toast(`${partner.name} partner settings opened.`)}>Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <p className="text-[13px] font-semibold text-foreground-950">Product reach</p>
              <div className="mt-3 space-y-2.5">
                {[
                  { label: "Credit products", value: 6, percent: 60 },
                  { label: "Savings products", value: 5, percent: 50 },
                  { label: "Insurance products", value: 5, percent: 50 },
                  { label: "Business tools", value: 3, percent: 30 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-foreground-600">{item.label}</span>
                      <span className="font-semibold text-foreground-900">{item.value}</span>
                    </div>
                    <div className="mt-1"><Progress value={item.percent} tone="accent" /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4">
              <p className="text-[12.5px] font-semibold text-accent-900">Responsible lending</p>
              <p className="mt-1 text-[11px] leading-relaxed text-accent-800">Every partner must show full pricing before acceptance. EkoLink never approves or denies credit itself.</p>
            </div>
          </div>
        </div>
      ) : null}
    </DashShell>
  );
}