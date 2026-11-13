import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LANGUAGES, formatNaira, greeting, useApp, useToast } from "@/lib/core";
import { DashShell, PageHeading } from "@/components/shell";
import { Avatar, Button, Field, InfoNote, Input, Pill, Progress, Select, StatTile, Switch } from "@/components/ui";
import { JobCard } from "@/components/cards";
import { cashflow, courses, jobs, seekerStats, transactions } from "@/mocks/data";

const tabs = [
  { id: "", label: "Overview" },
  { id: "matches", label: "Opportunity matches" },
  { id: "applications", label: "Applications" },
  { id: "skills", label: "Skills and profile" },
  { id: "training", label: "Training" },
  { id: "earnings", label: "Earnings" },
];

const seededApplications = [
  { jobId: "j-02", status: "Shortlisted", stage: 3, note: "Trial day offered for Saturday" },
  { jobId: "j-07", status: "Interview", stage: 2, note: "Call scheduled for Friday at 10:00am" },
];

export default function SeekerDashboard() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const { user, applied, applyToJob } = useApp();
  const tab = params.get("tab") ?? "";

  const [openToWork, setOpenToWork] = useState(true);
  const [skills, setSkills] = useState(["Customer service", "Sewing", "Pattern cutting", "Record keeping"]);
  const [skillDraft, setSkillDraft] = useState("");
  const [languages, setLanguages] = useState<string[]>(["English", "Nigerian Pidgin", "Yoruba"]);
  const [preference, setPreference] = useState("Full time");
  const [city, setCity] = useState("Lagos");
  const [enrolled, setEnrolled] = useState<string[]>([]);

  const setTab = (id: string) => {
    const next = new URLSearchParams(params);
    if (id) next.set("tab", id);
    else next.delete("tab");
    setParams(next);
  };

  const topMatches = [...jobs].sort((a, b) => b.match - a.match).slice(0, 3);
  const appliedJobs = jobs.filter((job) => applied.includes(job.id));

  const handleApply = (jobId: string, employer: string) => {
    applyToJob(jobId);
    toast(applied.includes(jobId) ? `Application withdrawn from ${employer}.` : `Application sent to ${employer}. You can track progress under Applications.`);
  };

  const addSkill = () => {
    const value = skillDraft.trim();
    if (!value) return;
    if (skills.includes(value)) {
      toast("That skill is already on your profile.", "info");
      return;
    }
    setSkills((prev) => [...prev, value]);
    setSkillDraft("");
    toast("Skill added. Your match percentages will update.");
  };

  return (
    <DashShell role="seeker">
      <PageHeading
        title={`${greeting()}, ${user?.name?.split(" ")[0] ?? "Blessing"}`}
        subtitle="Your opportunity workspace. See why roles match, track every application and build the skills that raise your value."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/jobs"><Button variant="outline" size="sm" icon="ri-search-line">Search all jobs</Button></Link>
            <Link to="/ai"><Button size="sm" icon="ri-sparkling-line">Ask Eko AI</Button></Link>
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

      <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-background-200 bg-background-50 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Avatar initials={(user?.name ?? "Blessing Okafor").slice(0, 2).toUpperCase()} size="lg" tone="teal" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[14px] font-semibold text-foreground-950">{user?.name ?? "Blessing Okafor"}</p>
              <Pill tone="verified" icon="ri-shield-check-line">ID checked</Pill>
            </div>
            <p className="mt-0.5 text-[11.5px] text-foreground-500">Tailoring and customer service · Surulere, Lagos · 3 years experience</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {skills.slice(0, 3).map((skill) => (
                <span key={skill} className="rounded bg-background-100 px-1.5 py-0.5 text-[9.5px] text-foreground-600">{skill}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full sm:w-72">
          <Switch checked={openToWork} onChange={(next) => { setOpenToWork(next); toast(next ? "Employers can now see that you are open to work." : "Your profile is hidden from employer search.", "info"); }} label="Open to opportunities" description="Show employers you are available" />
        </div>
      </div>

      {tab === "" ? (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Matched opportunities" value={String(seekerStats.matches)} change="4 new this week" icon="ri-sparkling-2-line" tone="teal" />
            <StatTile label="Applications sent" value={String(seekerStats.applications)} change="2 shortlisted" icon="ri-send-plane-line" tone="navy" />
            <StatTile label="Interviews" value={String(seekerStats.interviews)} change="1 scheduled this week" icon="ri-calendar-check-line" tone="slate" />
            <StatTile label="Earnings recorded" value={formatNaira(seekerStats.earnings, true)} change={`${seekerStats.earningsChange}% this quarter`} icon="ri-wallet-3-line" tone="teal" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-semibold text-foreground-950">Best matches for you</p>
                    <p className="mt-0.5 text-[11px] text-foreground-500">Based on skills, distance, availability and pay expectations</p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setTab("matches")} iconRight="ri-arrow-right-line">See all</Button>
                </div>
                <div className="mt-3 space-y-2.5">
                  {topMatches.map((job) => (
                    <div key={job.id} className="rounded-xl border border-background-200 p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-foreground-950">{job.title}</p>
                          <p className="text-[10.5px] text-foreground-500">{job.employer} · {job.area}, {job.city} · {job.type}</p>
                        </div>
                        <Pill tone="verified">{job.match}% match</Pill>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-600">
                        <i className="ri-sparkling-line mr-1 text-accent-600" aria-hidden="true" />
                        {job.reasons[0]}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="k-num text-[11.5px] font-semibold text-foreground-800">{formatNaira(job.salaryMin, true)} to {formatNaira(job.salaryMax, true)} / {job.period}</p>
                        <Button size="sm" variant={applied.includes(job.id) ? "soft" : "accent"} onClick={() => handleApply(job.id, job.employer)} icon={applied.includes(job.id) ? "ri-check-line" : undefined}>
                          {applied.includes(job.id) ? "Applied" : "Apply"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
                <p className="text-[13px] font-semibold text-foreground-950">Application pipeline</p>
                <div className="mt-3 space-y-2.5">
                  {seededApplications.map((application) => {
                    const job = jobs.find((item) => item.id === application.jobId);
                    if (!job) return null;
                    return (
                      <div key={application.jobId} className="rounded-xl border border-background-200 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="text-[12px] font-semibold text-foreground-900">{job.title}</p>
                            <p className="text-[10.5px] text-foreground-500">{job.employer} · applied {job.posted}</p>
                          </div>
                          <Pill tone={application.status === "Shortlisted" ? "verified" : "neutral"}>{application.status}</Pill>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                          {["Submitted", "Reviewed", "Shortlisted", "Offer"].map((stage, index) => (
                            <div key={stage} className="flex flex-1 items-center gap-1.5">
                              <span className={`h-1.5 flex-1 rounded-full ${index < application.stage ? "bg-accent-500" : "bg-background-200"}`} />
                            </div>
                          ))}
                        </div>
                        <p className="mt-1.5 text-[10.5px] text-foreground-500">{application.note}</p>
                      </div>
                    );
                  })}
                  {appliedJobs.map((job) => (
                    <div key={job.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-accent-200 bg-accent-50/50 p-3">
                      <div>
                        <p className="text-[12px] font-semibold text-foreground-900">{job.title}</p>
                        <p className="text-[10.5px] text-foreground-500">{job.employer} · submitted just now</p>
                      </div>
                      <Pill tone="accent">Submitted</Pill>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-foreground-950">Profile strength</p>
                  <span className="k-num text-sm font-semibold text-foreground-900">{seekerStats.profileStrength}%</span>
                </div>
                <div className="mt-2"><Progress value={seekerStats.profileStrength} /></div>
                <ul className="mt-3 space-y-2">
                  {[
                    { label: "Skills added", done: true },
                    { label: "Location confirmed", done: true },
                    { label: "Languages listed", done: true },
                    { label: "Two references", done: false },
                    { label: "Training certificate", done: false },
                  ].map((item) => (
                    <li key={item.label} className="flex items-center justify-between gap-2 text-[11.5px] text-foreground-600">
                      <span className="flex items-center gap-2">
                        <i className={item.done ? "ri-checkbox-circle-fill text-accent-600" : "ri-checkbox-blank-circle-line text-foreground-300"} aria-hidden="true" />
                        {item.label}
                      </span>
                      {!item.done ? <button type="button" onClick={() => toast(`Add ${item.label.toLowerCase()} from your profile editor.`)} className="cursor-pointer text-[10.5px] font-semibold text-accent-700 hover:underline">Add</button> : null}
                    </li>
                  ))}
                </ul>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setTab("skills")}>Edit profile</Button>
              </div>

              <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
                <p className="text-[13px] font-semibold text-foreground-950">Suggested training</p>
                <div className="mt-2.5 space-y-2">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="rounded-lg border border-background-200 p-2.5">
                      <p className="text-[11.5px] font-semibold text-foreground-900">{course.title}</p>
                      <p className="text-[10px] text-foreground-500">{course.duration} · {course.free ? "Free" : "Paid"}</p>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="ghost" className="mt-2 px-0" onClick={() => setTab("training")} iconRight="ri-arrow-right-line">Browse training</Button>
              </div>

              <div className="rounded-2xl border border-background-200 bg-primary-950 p-4">
                <p className="text-[12.5px] font-semibold text-background-50">Nearby opportunity</p>
                <p className="mt-1 text-[11px] leading-relaxed text-background-300">Adaeze Stitches is 2.4 km from you and shortlisted your application for a trial day.</p>
                <Link to="/messages"><Button size="sm" variant="accent" className="mt-2.5" icon="ri-chat-3-line">Open conversation</Button></Link>
              </div>
            </div>
          </div>
        </>
      ) : null}

      {tab === "matches" ? (
        <div className="space-y-4">
          <InfoNote icon="ri-sparkling-line">
            Match percentages combine your skills, location, availability and pay expectations. Each card explains the strongest reason behind the recommendation.
          </InfoNote>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[...jobs].sort((a, b) => b.match - a.match).map((job) => (
              <JobCard key={job.id} job={job} applied={applied.includes(job.id)} onApply={(item) => handleApply(item.id, item.employer)} />
            ))}
          </div>
        </div>
      ) : null}

      {tab === "applications" ? (
        <div className="rounded-2xl border border-background-200 bg-background-50">
          <div className="border-b border-background-200 p-4 md:p-5">
            <p className="text-[13px] font-semibold text-foreground-950">All applications</p>
            <p className="mt-0.5 text-[11px] text-foreground-500">Track every role you have applied for and what happens next.</p>
          </div>
          <div className="divide-y divide-background-100">
            {[...seededApplications.map((item) => ({ job: jobs.find((job) => job.id === item.jobId), status: item.status, note: item.note })), ...appliedJobs.map((job) => ({ job, status: "Submitted", note: "Waiting for the employer to review your profile" }))]
              .filter((row) => row.job)
              .map((row) => (
                <div key={`${row.job?.id}-${row.status}`} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-foreground-900">{row.job?.title}</p>
                    <p className="text-[10.5px] text-foreground-500">{row.job?.employer} · {row.job?.area}, {row.job?.city} · {row.note}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pill tone={row.status === "Submitted" ? "accent" : "verified"}>{row.status}</Pill>
                    <Button size="sm" variant="ghost" onClick={() => toast(`Conversation with ${row.job?.employer} opened.`)}>Message</Button>
                  </div>
                </div>
              ))}
            {appliedJobs.length === 0 ? (
              <p className="px-4 py-3 text-[11px] text-foreground-500">Applications you send from the opportunities page appear here instantly.</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {tab === "skills" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
              <p className="text-[13px] font-semibold text-foreground-950">Skills and experience</p>
              <p className="mt-0.5 text-[11px] text-foreground-500">Employers search by skill. Be specific, for example "machine sewing" rather than "fashion".</p>

              <div className="mt-4">
                <p className="mb-1.5 text-xs font-semibold text-foreground-700">Your skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span key={skill} className="flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-2.5 py-1 text-[11px] font-medium text-accent-900">
                      {skill}
                      <button type="button" aria-label={`Remove ${skill}`} onClick={() => setSkills((prev) => prev.filter((item) => item !== skill))} className="cursor-pointer text-accent-700 hover:text-accent-900">
                        <i className="ri-close-line" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <Input value={skillDraft} onChange={(event) => setSkillDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addSkill(); }} placeholder="Add a skill" className="sm:max-w-xs" />
                  <Button variant="outline" onClick={addSkill} icon="ri-add-line">Add skill</Button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="City" htmlFor="s-city">
                  <Select id="s-city" value={city} onChange={(event) => setCity(event.target.value)}>
                    {["Lagos", "Ibadan", "Abuja", "Kano", "Port Harcourt", "Enugu"].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Preferred work type" htmlFor="s-pref">
                  <Select id="s-pref" value={preference} onChange={(event) => setPreference(event.target.value)}>
                    {["Full time", "Part time", "Freelance", "Apprenticeship", "Remote"].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Years of experience" htmlFor="s-exp">
                  <Select id="s-exp" defaultValue="1 to 3 years">
                    {["No experience yet", "Under 1 year", "1 to 3 years", "3 to 5 years", "Over 5 years"].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Expected monthly pay" htmlFor="s-pay">
                  <Input id="s-pay" defaultValue="₦70,000" />
                </Field>
              </div>

              <div className="mt-4">
                <p className="mb-1.5 text-xs font-semibold text-foreground-700">Languages</p>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => setLanguages((prev) => (prev.includes(language) ? prev.filter((item) => item !== language) : [...prev, language]))}
                      className={`cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        languages.includes(language) ? "border-accent-500 bg-accent-50 text-accent-800" : "border-background-300 text-foreground-600"
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="mt-4" onClick={() => toast("Profile saved. Your matches will refresh with the new details.")} icon="ri-save-3-line">Save profile</Button>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <p className="text-[13px] font-semibold text-foreground-950">Your availability</p>
              <div className="mt-3 space-y-2">
                <Switch checked={openToWork} onChange={setOpenToWork} label="Open to opportunities" description="Visible to verified employers" />
                <Switch checked={true} onChange={() => toast("Availability preference updated.")} label="Weekend shifts" description="Saturday and Sunday" />
                <Switch checked={false} onChange={() => toast("Availability preference updated.")} label="Night shifts" description="After 8pm" />
              </div>
            </div>
            <InfoNote icon="ri-lightbulb-line">Profiles with a photo, three skills and two references receive roughly twice as many employer views.</InfoNote>
          </div>
        </div>
      ) : null}

      {tab === "training" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isEnrolled = enrolled.includes(course.id);
            return (
              <article key={course.id} className="flex h-full flex-col rounded-2xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-start justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
                    <i className="ri-book-open-line" aria-hidden="true" />
                  </span>
                  {course.free ? <Pill tone="verified">Free</Pill> : <Pill tone="neutral">Paid</Pill>}
                </div>
                <h3 className="mt-3 text-[13px] font-semibold text-foreground-950">{course.title}</h3>
                <p className="text-[10.5px] text-foreground-500">{course.provider} · {course.duration} · {course.level}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {course.skills.map((skill) => (
                    <span key={skill} className="rounded bg-background-100 px-1.5 py-0.5 text-[9.5px] text-foreground-600">{skill}</span>
                  ))}
                </div>
                <div className="mt-auto pt-3">
                  <Button
                    block
                    size="sm"
                    variant={isEnrolled ? "soft" : "outline"}
                    icon={isEnrolled ? "ri-check-line" : "ri-play-circle-line"}
                    onClick={() => {
                      setEnrolled((prev) => (prev.includes(course.id) ? prev.filter((item) => item !== course.id) : [...prev, course.id]));
                      toast(isEnrolled ? `Enrolment removed from ${course.title}.` : `You are enrolled in ${course.title}. Lesson one is unlocked.`);
                    }}
                  >
                    {isEnrolled ? "Enrolled" : "Enrol now"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {tab === "earnings" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-semibold text-foreground-950">Recorded earnings</p>
                  <p className="mt-0.5 text-[11px] text-foreground-500">Freelance and temporary work recorded on EkoLink</p>
                </div>
                <Pill tone="verified">+14% this quarter</Pill>
              </div>
              <div className="mt-4 h-[210px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashflow} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="earnFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(var(--accent-500))" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="oklch(var(--accent-500))" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--background-200))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "oklch(var(--foreground-500))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "oklch(var(--foreground-400))" }} axisLine={false} tickLine={false} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                    <Tooltip formatter={(value) => formatNaira(Number(value))} contentStyle={{ borderRadius: 10, border: "1px solid oklch(var(--background-200))", fontSize: 12 }} />
                    <Area type="monotone" dataKey="income" stroke="oklch(var(--accent-600))" strokeWidth={2} fill="url(#earnFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-background-200 bg-background-50">
              <div className="border-b border-background-200 p-4">
                <p className="text-[13px] font-semibold text-foreground-950">Gig history</p>
              </div>
              <div className="divide-y divide-background-100">
                {transactions.filter((item) => item.kind === "income").slice(0, 6).map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 p-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-foreground-900">{item.label}</p>
                      <p className="text-[10px] text-foreground-500">{item.party} · {item.date} · {item.channel}</p>
                    </div>
                    <span className="k-num text-[12px] font-semibold text-accent-700">+{formatNaira(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-background-200 bg-background-50 p-4">
              <p className="text-[13px] font-semibold text-foreground-950">Earnings summary</p>
              <div className="mt-3 space-y-2 text-[12px]">
                <div className="flex items-center justify-between"><span className="text-foreground-600">This quarter</span><span className="k-num font-semibold text-foreground-900">{formatNaira(seekerStats.earnings)}</span></div>
                <div className="flex items-center justify-between"><span className="text-foreground-600">Completed gigs</span><span className="k-num font-semibold text-foreground-900">14</span></div>
                <div className="flex items-center justify-between"><span className="text-foreground-600">Average per gig</span><span className="k-num font-semibold text-foreground-900">{formatNaira(29400)}</span></div>
                <div className="flex items-center justify-between border-t border-background-200 pt-2"><span className="font-semibold text-foreground-800">Savings rate</span><span className="k-num font-semibold text-accent-700">21%</span></div>
              </div>
            </div>
            <div className="rounded-2xl border border-accent-200 bg-accent-50 p-4">
              <p className="text-[12.5px] font-semibold text-accent-900">Your earnings build a financial record</p>
              <p className="mt-1 text-[11px] leading-relaxed text-accent-800">Consistent gig income raises your Economic Trust Profile and can unlock savings and insurance offers.</p>
              <Link to="/finance" className="mt-2 inline-block"><Button size="sm" variant="outline" icon="ri-line-chart-line">View financial profile</Button></Link>
            </div>
          </div>
        </div>
      ) : null}
    </DashShell>
  );
}