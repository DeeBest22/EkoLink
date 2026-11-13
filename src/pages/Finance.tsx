import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNaira, useToast } from "@/lib/core";
import { Button, InfoNote, Pill, Progress, SectionLabel } from "@/components/ui";
import { cashflow, courses, financeProducts, savingsGoals, transactions, trustProfile } from "@/mocks/data";

const expenseSplit = [
  { name: "Stock and parts", value: 42 },
  { name: "Rent", value: 24 },
  { name: "Staff", value: 18 },
  { name: "Transport", value: 9 },
  { name: "Other", value: 7 },
];

const pieColors = [
  "oklch(var(--primary-500))",
  "oklch(var(--accent-500))",
  "oklch(var(--secondary-400))",
  "oklch(var(--accent-300))",
  "oklch(var(--background-400))",
];

const readiness = [
  { label: "Business activity", value: trustProfile.activity, note: "47 enquiries this quarter" },
  { label: "Income consistency", value: trustProfile.consistency, note: "5 of 6 months recorded" },
  { label: "Transaction depth", value: trustProfile.depth, note: "Transfers, USSD and cash" },
  { label: "Savings behaviour", value: trustProfile.savings, note: "9 of 12 contributions" },
];

export default function Finance() {
  const toast = useToast();
  const [contributions, setContributions] = useState<Record<string, number>>({});
  const [activeKind, setActiveKind] = useState<"All" | "Credit" | "Savings" | "Insurance" | "Business">("All");

  const income = transactions.filter((item) => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions.filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);
  const net = income - expense;

  const products = financeProducts.filter((product) => activeKind === "All" || product.kind === activeKind);

  const contribute = (name: string, amount: number) => {
    setContributions((prev) => ({ ...prev, [name]: (prev[name] ?? 0) + amount }));
    toast(`${formatNaira(amount)} added to ${name}. Keep the rhythm going.`);
  };

  return (
    <>
      <section className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-7 pt-8 md:px-8 md:pt-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-foreground-500">
                <span>EkoLink</span>
                <i className="ri-arrow-right-s-line" aria-hidden="true" />
                <span className="text-foreground-800">Financial inclusion</span>
              </div>
              <h1 className="font-display mt-2 text-[28px] text-foreground-950 md:text-[38px]">Your activity, made visible.</h1>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-foreground-600">
                A clear record of what you earn, what you spend and how consistently you save. This is the evidence partner institutions can use to design fairer offers for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/messages"><Button variant="outline" icon="ri-bank-line">Talk to a partner</Button></Link>
              <Button icon="ri-download-2-line" onClick={() => toast("Your Economic Trust summary is ready to download as a sample report.")}>Export summary</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-4 py-6 md:px-8 md:py-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Trust profile */}
          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-background-200 bg-background-50">
              <div className="relative p-5">
                <div className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-accent-100/50 blur-3xl" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="k-label text-foreground-500">Economic Trust Profile</p>
                      <p className="mt-1 text-[11.5px] text-foreground-600">Emeka Auto Works · Yaba</p>
                    </div>
                    <Pill tone="verified" icon="ri-verified-badge-line">Active</Pill>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div className="flex items-end gap-1.5">
                      <p className="k-num text-[52px] font-semibold leading-none text-foreground-950">78</p>
                      <span className="pb-1.5 text-[12px] font-medium text-foreground-400">/ 100</span>
                    </div>
                    <div className="pb-1 text-right">
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-accent-50 px-2 py-0.5 text-[10.5px] font-semibold text-accent-800">
                        <i className="ri-arrow-up-line text-[10px]" aria-hidden="true" />
                        6 points
                      </span>
                      <p className="mt-1 text-[10px] text-foreground-500">this quarter</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground-400">
                      <span>Starting</span>
                      <span>Building</span>
                      <span>Established</span>
                    </div>
                    <div className="relative mt-2 h-2.5 w-full">
                      <div className="flex h-full w-full overflow-hidden rounded-full">
                        <div className="h-full flex-1 bg-secondary-200" />
                        <div className="h-full flex-1 bg-accent-200" />
                        <div className="h-full flex-1 bg-primary-200" />
                      </div>
                      <span
                        className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-background-50 bg-primary-600 ring-1 ring-primary-300"
                        style={{ left: "78%" }}
                      />
                    </div>
                    <p className="mt-2.5 text-[11px] leading-relaxed text-foreground-600">
                      <strong className="font-semibold text-foreground-900">{trustProfile.band} band</strong>, just 2 points from Established
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {readiness.map((item) => (
                      <div key={item.label} className="rounded-xl border border-background-200 bg-background-100/70 p-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="text-[10.5px] font-medium leading-tight text-foreground-600">{item.label}</p>
                          <p className="k-num shrink-0 text-[12px] font-semibold text-foreground-950">{item.value}</p>
                        </div>
                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background-300">
                          <div className="h-full rounded-full bg-accent-600" style={{ width: `${item.value}%` }} />
                        </div>
                        <p className="mt-1.5 text-[9.5px] leading-snug text-foreground-500">{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-background-200 bg-background-100 px-5 py-3">
                <p className="flex items-start gap-2 text-[10.5px] leading-relaxed text-foreground-500">
                  <i className="ri-information-line mt-0.5 shrink-0 text-accent-600" aria-hidden="true" />
                  <span>
                    Recorded since {trustProfile.since}. This indicator measures financial visibility. It is not a credit score and does not guarantee a loan approval.
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-accent-200 bg-accent-50 p-4">
              <div className="flex items-start gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-600 text-background-50">
                  <i className="ri-arrow-up-circle-line" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold text-accent-900">Next best action</p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-accent-800">Record three more weeks of daily transactions to move income consistency above 85.</p>
                  <Link to="/business?tab=transactions" className="mt-1.5 inline-block text-[11px] font-semibold text-accent-900 underline">Add a transaction</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Numbers and charts */}
          <div className="space-y-5 lg:col-span-8">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: "Income recorded", value: formatNaira(income), icon: "ri-arrow-down-circle-line", tone: "text-accent-700" },
                { label: "Expenses recorded", value: formatNaira(expense), icon: "ri-arrow-up-circle-line", tone: "text-secondary-700" },
                { label: "Net position", value: formatNaira(net), icon: "ri-scales-3-line", tone: "text-primary-700" },
                { label: "Savings rate", value: "18%", icon: "ri-plant-line", tone: "text-accent-700" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-background-200 bg-background-50 p-3.5">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-md bg-background-100 text-sm ${item.tone}`}>
                    <i className={item.icon} aria-hidden="true" />
                  </span>
                  <p className="k-num mt-2 text-[16px] font-semibold text-foreground-950">{item.value}</p>
                  <p className="text-[10.5px] leading-tight text-foreground-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-foreground-950">Cash flow, last six months</p>
                  <p className="mt-0.5 text-[11px] text-foreground-500">Recorded income and expenses in Naira</p>
                </div>
                <div className="flex items-center gap-3 text-[10.5px]">
                  <span className="flex items-center gap-1.5 text-foreground-600"><span className="h-2 w-2 rounded-full bg-accent-500" /> Income</span>
                  <span className="flex items-center gap-1.5 text-foreground-600"><span className="h-2 w-2 rounded-full bg-secondary-400" /> Expenses</span>
                </div>
              </div>
              <div className="mt-4 h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashflow} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(var(--accent-500))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="oklch(var(--accent-500))" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(var(--secondary-400))" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="oklch(var(--secondary-400))" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--background-200))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "oklch(var(--foreground-400))" }} axisLine={false} tickLine={false} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                    <Tooltip
                      formatter={(value) => formatNaira(Number(value))}
                      contentStyle={{ borderRadius: 10, border: "1px solid oklch(var(--background-200))", fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="income" stroke="oklch(var(--accent-600))" strokeWidth={2} fill="url(#incomeFill)" />
                    <Area type="monotone" dataKey="expense" stroke="oklch(var(--secondary-500))" strokeWidth={2} fill="url(#expenseFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <p className="text-[13px] font-semibold text-foreground-950">Where the money goes</p>
                <p className="mt-0.5 text-[11px] text-foreground-500">Share of recorded expenses</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-[150px] w-[150px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={expenseSplit} dataKey="value" nameKey="name" innerRadius={42} outerRadius={66} paddingAngle={2} stroke="none">
                          {expenseSplit.map((entry, index) => (
                            <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: 10, border: "1px solid oklch(var(--background-200))", fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="min-w-0 flex-1 space-y-1.5">
                    {expenseSplit.map((item, index) => (
                      <li key={item.name} className="flex items-center justify-between gap-2 text-[11px]">
                        <span className="flex min-w-0 items-center gap-1.5 text-foreground-600">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                          <span className="truncate">{item.name}</span>
                        </span>
                        <span className="font-semibold text-foreground-900">{item.value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <p className="text-[13px] font-semibold text-foreground-950">Recent activity</p>
                <p className="mt-0.5 text-[11px] text-foreground-500">The records that build your profile</p>
                <ul className="mt-2.5 divide-y divide-background-200">
                  {transactions.slice(0, 5).map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2 py-2">
                      <div className="min-w-0">
                        <p className="truncate text-[11.5px] font-medium text-foreground-900">{item.label}</p>
                        <p className="text-[10px] text-foreground-400">{item.party} · {item.channel}</p>
                      </div>
                      <span className={`k-num shrink-0 text-[11.5px] font-semibold ${item.kind === "income" ? "text-accent-700" : "text-foreground-600"}`}>
                        {item.kind === "income" ? "+" : "-"}{formatNaira(item.amount, true)}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/business?tab=transactions" className="mt-2.5 inline-block text-[11px] font-semibold text-accent-700 hover:underline">View all transactions</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Savings goals */}
        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionLabel>Savings and credit</SectionLabel>
              <h2 className="font-display mt-2 text-[22px] text-foreground-950 md:text-[28px]">Goals that turn discipline into opportunity.</h2>
            </div>
            <Button variant="outline" size="sm" icon="ri-add-line" onClick={() => toast("New savings goal form opened. Set a target and a weekly amount.")}>New savings goal</Button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {savingsGoals.map((goal) => {
              const extra = contributions[goal.name] ?? 0;
              const saved = Math.min(goal.target, goal.saved + extra);
              const percent = Math.round((saved / goal.target) * 100);
              return (
                <div key={goal.name} className="rounded-2xl border border-background-200 bg-background-50 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground-950">{goal.name}</p>
                      <p className="text-[10.5px] text-foreground-500">Target date {goal.due}</p>
                    </div>
                    <Pill tone={percent >= 85 ? "verified" : "neutral"}>{percent}%</Pill>
                  </div>
                  <p className="k-num mt-3 text-lg font-semibold text-foreground-950">
                    {formatNaira(saved)} <span className="text-[11px] font-medium text-foreground-400">of {formatNaira(goal.target)}</span>
                  </p>
                  <div className="mt-2"><Progress value={percent} tone={percent >= 85 ? "accent" : "navy"} /></div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="soft" className="flex-1" icon="ri-add-line" onClick={() => contribute(goal.name, 5000)}>Add ₦5,000</Button>
                    <Button size="sm" variant="ghost" onClick={() => toast(`Reminder set for ${goal.name}.`)}>Remind me</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Products */}
        <div className="mt-9">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionLabel>Financial products</SectionLabel>
              <h2 className="font-display mt-2 text-[22px] text-foreground-950 md:text-[28px]">Matched to your real activity.</h2>
              <p className="mt-1.5 max-w-xl text-[12.5px] leading-relaxed text-foreground-600">
                Partner institutions see your verified profile, not just a form. Eligibility estimates improve as your records grow.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["All", "Credit", "Savings", "Insurance", "Business"] as const).map((kind) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setActiveKind(kind)}
                  className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-[11.5px] font-medium transition-colors ${
                    activeKind === kind ? "border-primary-500 bg-primary-500 text-background-50" : "border-background-300 bg-background-50 text-foreground-600 hover:border-primary-300"
                  }`}
                >
                  {kind}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="flex h-full flex-col rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                    <i className={product.icon} aria-hidden="true" />
                  </span>
                  <Pill tone="neutral">{product.kind}</Pill>
                </div>
                <h3 className="mt-3 text-[14px] font-semibold text-foreground-950">{product.name}</h3>
                <p className="text-[10.5px] text-foreground-500">{product.provider}</p>
                <p className="mt-2 flex-1 text-[11.5px] leading-relaxed text-foreground-600">{product.summary}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-background-100 px-3 py-2">
                  <div>
                    <p className="text-[9.5px] uppercase tracking-wide text-foreground-500">Amount</p>
                    <p className="text-[11.5px] font-semibold text-foreground-900">{product.amount}</p>
                  </div>
                  <div>
                    <p className="text-[9.5px] uppercase tracking-wide text-foreground-500">Rate</p>
                    <p className="text-[11.5px] font-semibold text-foreground-900">{product.rate}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="text-foreground-500">Eligibility estimate</span>
                    <span className="font-semibold text-foreground-900">{product.eligibility}%</span>
                  </div>
                  <div className="mt-1"><Progress value={product.eligibility} tone={product.eligibility >= 80 ? "accent" : "slate"} /></div>
                  <p className="mt-1.5 text-[10.5px] leading-relaxed text-foreground-500">{product.match}</p>
                </div>
                <Button size="sm" variant="outline" className="mt-3" iconRight="ri-arrow-right-line" onClick={() => toast(`${product.name}: a partner advisor will contact you in this demo.`)}>
                  View offer
                </Button>
              </article>
            ))}
          </div>

          <div className="mt-4">
            <InfoNote icon="ri-error-warning-line">
              Eligibility estimates are illustrative sample data. Final terms, rates and approval always come from the licensed institution, and borrowing carries risk.
            </InfoNote>
          </div>
        </div>

        {/* Learning */}
        <div className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel>Financial education</SectionLabel>
            <h2 className="font-display mt-2 text-[22px] text-foreground-950 md:text-[28px]">Small knowledge, lasting difference.</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-foreground-600">
              Short courses in Yoruba, Hausa, Igbo and English, built around everyday trading. Learn how to price, separate business money from family money, and save with a plan.
            </p>
            <div className="mt-4 rounded-2xl border border-background-200 bg-background-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Expense ratio this month</p>
              <div className="mt-2 h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashflow} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--background-200))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "oklch(var(--foreground-400))" }} axisLine={false} tickLine={false} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                    <Tooltip formatter={(value) => formatNaira(Number(value))} contentStyle={{ borderRadius: 10, border: "1px solid oklch(var(--background-200))", fontSize: 12 }} />
                    <Bar dataKey="expense" fill="oklch(var(--primary-400))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7">
            {courses.map((course) => (
              <article key={course.id} className="flex flex-col rounded-xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                    <i className="ri-book-open-line" aria-hidden="true" />
                  </span>
                  {course.free ? <Pill tone="verified">Free</Pill> : <Pill tone="neutral">Paid</Pill>}
                </div>
                <h3 className="mt-2.5 text-[12.5px] font-semibold text-foreground-950">{course.title}</h3>
                <p className="text-[10.5px] text-foreground-500">{course.provider} · {course.duration} · {course.level}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {course.skills.slice(0, 2).map((skill) => (
                    <span key={skill} className="rounded bg-background-100 px-1.5 py-0.5 text-[9.5px] text-foreground-600">{skill}</span>
                  ))}
                </div>
                <Button size="sm" variant="ghost" className="mt-2 justify-start px-0" icon="ri-play-circle-line" onClick={() => toast(`${course.title}: lesson one opened in this demo.`)}>
                  Start learning
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}