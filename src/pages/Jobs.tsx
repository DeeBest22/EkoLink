import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Job } from "@/lib/core";
import { NIGERIAN_CITIES, cn, formatNaira, useApp, useToast } from "@/lib/core";
import { Button, EmptyState, Field, Input, InfoNote, Pill, Progress, Select, Switch, Segmented } from "@/components/ui";
import { JobCard } from "@/components/cards";
import { jobs } from "@/mocks/data";

type TypeFilter = "all" | Job["type"];

const typeOptions: Array<{ value: TypeFilter; label: string }> = [
  { value: "all", label: "All types" },
  { value: "Full time", label: "Full time" },
  { value: "Part time", label: "Part time" },
  { value: "Freelance", label: "Freelance" },
  { value: "Temporary", label: "Temporary" },
  { value: "Apprenticeship", label: "Apprenticeship" },
];

const paySteps = [0, 40000, 70000, 100000, 150000];

function RangeSlider({
  value,
  max,
  step,
  onChange,
  label,
}: {
  value: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
  label: string;
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="relative h-6">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-background-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent-400 to-accent-600 transition-[width] duration-150"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span
        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent-600 bg-background-50 ring-[3px] ring-accent-100"
        style={{ left: `clamp(8px, ${percent}%, calc(100% - 8px))` }}
      />
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="k-range absolute inset-0 z-10 h-6 w-full cursor-pointer"
      />
    </div>
  );
}

export default function Jobs() {
  const toast = useToast();
  const { applied, applyToJob } = useApp();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [salaryFloor, setSalaryFloor] = useState(0);
  const [view, setView] = useState<"list" | "spotlight">("spotlight");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return jobs
      .filter((job) => {
        const matchesTerm =
          !term ||
          job.title.toLowerCase().includes(term) ||
          job.employer.toLowerCase().includes(term) ||
          job.category.toLowerCase().includes(term) ||
          job.skills.some((skill) => skill.toLowerCase().includes(term));
        const matchesCity = city === "all" || job.city === city;
        const matchesType = type === "all" || job.type === type;
        const matchesRemote = !remoteOnly || job.remote;
        const matchesSalary = job.salaryMin >= salaryFloor;
        return matchesTerm && matchesCity && matchesType && matchesRemote && matchesSalary;
      })
      .sort((a, b) => b.match - a.match);
  }, [query, city, type, remoteOnly, salaryFloor]);

  const spotlight = filtered[0];

  const handleApply = (job: Job) => {
    applyToJob(job.id);
    toast(applied.includes(job.id) ? `Application withdrawn from ${job.employer}.` : `Application submitted to ${job.employer}. Track it in your workspace.`);
  };

  return (
    <>
      <section className="border-b border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 pb-8 pt-8 md:px-8 md:pt-10">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-[11px] text-foreground-500">
                <span>EkoLink</span>
                <i className="ri-arrow-right-s-line" aria-hidden="true" />
                <span className="text-foreground-800">Opportunities</span>
              </div>
              <h1 className="font-display mt-2 text-[28px] text-foreground-950 md:text-[38px]">Work that fits your skills and your street.</h1>
              <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-foreground-600">
                Full time roles, part time shifts, apprenticeships and freelance gigs across Nigeria. Every recommendation explains why it matches, and you can see how far it is from where you live.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Profile strength</p>
                  <span className="k-num text-sm font-semibold text-foreground-900">82%</span>
                </div>
                <div className="mt-2"><Progress value={82} /></div>
                <p className="mt-2 text-[11px] leading-relaxed text-foreground-500">Add two references to reach 90% and unlock more employer matches.</p>
                <Link to="/seeker?tab=skills" className="mt-2 inline-block text-[11.5px] font-semibold text-accent-700 hover:underline">Improve my profile</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-4 py-6 md:px-8 md:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Filters */}
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4 lg:sticky lg:top-20">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-foreground-950">Filters</p>
                <button
                  type="button"
                  onClick={() => { setQuery(""); setCity("all"); setType("all"); setRemoteOnly(false); setSalaryFloor(0); }}
                  className="cursor-pointer text-[11px] font-medium text-accent-700 hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 space-y-3.5">
                <Field label="Search" htmlFor="job-search">
                  <div className="relative">
                    <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-400" aria-hidden="true" />
                    <Input id="job-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Role, skill or employer" className="pl-9" />
                  </div>
                </Field>

                <Field label="City" htmlFor="job-city">
                  <Select id="job-city" value={city} onChange={(event) => setCity(event.target.value)}>
                    <option value="all">All cities</option>
                    {NIGERIAN_CITIES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="Employment type" htmlFor="job-type">
                  <Select id="job-type" value={type} onChange={(event) => setType(event.target.value as TypeFilter)}>
                    {typeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Select>
                </Field>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <label htmlFor="job-salary" className="text-xs font-semibold text-foreground-700">
                      Minimum monthly pay
                    </label>
                    <span
                      className={cn(
                        "k-num rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
                        salaryFloor === 0 ? "bg-background-100 text-foreground-500" : "bg-accent-50 text-accent-800",
                      )}
                    >
                      {salaryFloor === 0 ? "Any" : `${formatNaira(salaryFloor, true)}+`}
                    </span>
                  </div>

                  <div className="mt-3">
                    <RangeSlider value={salaryFloor} max={150000} step={10000} onChange={setSalaryFloor} label="Minimum monthly pay" />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] font-medium tracking-wide text-foreground-400">
                    <span>Any</span>
                    <span>₦75k</span>
                    <span>₦150k</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {paySteps.map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setSalaryFloor(step)}
                        className={cn(
                          "cursor-pointer whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                          salaryFloor === step
                            ? "border-accent-600 bg-accent-600 text-background-50"
                            : "border-background-300 bg-background-50 text-foreground-600 hover:border-accent-300 hover:text-accent-800",
                        )}
                      >
                        {step === 0 ? "Any pay" : `${formatNaira(step, true)}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <Switch checked={remoteOnly} onChange={setRemoteOnly} label="Remote only" description="Show roles you can do from home." />
              </div>

              <div className="mt-4">
                <InfoNote icon="ri-sparkling-line">
                  Match percentages come from skills, distance, availability and pay expectations. They are guidance, not a guarantee of selection.
                </InfoNote>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="lg:col-span-9">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] text-foreground-500">
                <strong className="font-semibold text-foreground-900">{filtered.length}</strong> opportunities, sorted by match
              </p>
              <Segmented
                options={[{ value: "spotlight", label: "Best match" }, { value: "list", label: "All results" }]}
                value={view}
                onChange={(next) => setView(next as "list" | "spotlight")}
              />
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon="ri-briefcase-line"
                title="No opportunities match these filters"
                body="Widen the city or employment type, lower the minimum pay, or clear the remote filter."
                action={<Button size="sm" variant="outline" onClick={() => { setCity("all"); setType("all"); setSalaryFloor(0); setRemoteOnly(false); setQuery(""); }}>Reset filters</Button>}
              />
            ) : view === "spotlight" && spotlight ? (
              <div className="space-y-4">
                <article className="overflow-hidden rounded-2xl border border-background-200 bg-background-50">
                  <div className="flex flex-col gap-4 border-b border-background-200 bg-accent-50/50 p-5 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500 text-background-50">
                        <i className="ri-briefcase-4-line text-xl" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-heading text-lg font-semibold text-foreground-950">{spotlight.title}</h2>
                          <Pill tone="verified" icon="ri-sparkling-line">{spotlight.match}% match</Pill>
                        </div>
                        <p className="mt-1 text-[12px] text-foreground-600">
                          {spotlight.employer} · {spotlight.area}, {spotlight.city} · posted {spotlight.posted}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <Pill>{spotlight.type}</Pill>
                          <Pill>{spotlight.remote ? "Remote" : "On site"}</Pill>
                          <Pill tone="warn">{formatNaira(spotlight.salaryMin, true)} to {formatNaira(spotlight.salaryMax, true)} / {spotlight.period}</Pill>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button variant={applied.includes(spotlight.id) ? "soft" : "accent"} icon={applied.includes(spotlight.id) ? "ri-check-line" : "ri-send-plane-line"} onClick={() => handleApply(spotlight)}>
                        {applied.includes(spotlight.id) ? "Applied" : "Apply now"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-5">
                    <div className="md:col-span-3">
                      <p className="k-label">The role</p>
                      <p className="mt-2 text-[13px] leading-relaxed text-foreground-700">{spotlight.description}</p>
                      <p className="k-label mt-4">Skills required</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {spotlight.skills.map((skill) => (
                          <Pill key={skill} icon="ri-checkbox-circle-line">{skill}</Pill>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" icon="ri-chat-3-line" onClick={() => toast("Conversation opened with the employer in your messages.")}>Message employer</Button>
                        <Button size="sm" variant="ghost" icon="ri-bookmark-line" onClick={() => toast("Opportunity saved. Find it in your workspace.")}>Save</Button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="rounded-xl border border-background-200 bg-background-100/70 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-500">Why this was recommended</p>
                        <ul className="mt-2.5 space-y-2">
                          {spotlight.reasons.map((reason) => (
                            <li key={reason} className="flex items-start gap-2 text-[12px] leading-relaxed text-foreground-700">
                              <i className="ri-check-double-line mt-0.5 text-accent-600" aria-hidden="true" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 border-t border-background-300 pt-2.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-foreground-500">Profile fit</span>
                            <span className="font-semibold text-foreground-900">{spotlight.match}%</span>
                          </div>
                          <div className="mt-1.5"><Progress value={spotlight.match} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filtered.slice(1, 5).map((job) => (
                    <JobCard key={job.id} job={job} applied={applied.includes(job.id)} onApply={handleApply} />
                  ))}
                </div>
                {filtered.length > 5 ? (
                  <div className="text-center">
                    <Button variant="outline" onClick={() => setView("list")} iconRight="ri-arrow-down-line">See all {filtered.length} opportunities</Button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filtered.map((job) => (
                  <div key={job.id} className={cn("h-full")}>
                    <JobCard job={job} applied={applied.includes(job.id)} onApply={handleApply} />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-background-200 bg-primary-950 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-[13px] font-semibold text-background-50">Not sure which role fits you?</p>
                <p className="mt-0.5 text-[11.5px] text-background-300">Eko AI can compare your skills and location against every open opportunity.</p>
              </div>
              <Link to="/ai"><Button variant="accent" size="sm" icon="ri-sparkling-line">Ask Eko AI</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}