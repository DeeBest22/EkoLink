import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { Role } from "@/lib/core";
import { CATEGORIES, LANGUAGES, NIGERIAN_CITIES, cn, useApp, useToast } from "@/lib/core";
import { Button } from "@/components/ui";
import { Logo } from "@/components/shell";

type FlowRole = "business" | "seeker";

interface Step {
  key: string;
  label: string;
  hint: string;
}

const stepsByRole: Record<FlowRole, Step[]> = {
  business: [
    { key: "identity", label: "Your business", hint: "Name and location" },
    { key: "offer", label: "What you offer", hint: "Services and hours" },
    { key: "trust", label: "Trust and contact", hint: "Verification and reach" },
    { key: "review", label: "Review", hint: "Check and publish" },
  ],
  seeker: [
    { key: "identity", label: "Your craft", hint: "Skill and location" },
    { key: "experience", label: "Experience", hint: "Level and pay" },
    { key: "availability", label: "Availability", hint: "Days and languages" },
    { key: "review", label: "Review", hint: "Check and publish" },
  ],
};

const inputClass =
  "h-11 w-full rounded-xl border border-background-300 bg-background-50 px-3.5 text-sm text-foreground-900 transition-colors placeholder:text-foreground-400 focus:border-accent-500 focus:outline-none";

const labelClass = "mb-1.5 block text-xs font-semibold text-foreground-700";
const hintClass = "mt-1.5 text-[11px] leading-relaxed text-foreground-500";

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-1.5 text-[11.5px] font-semibold transition-colors",
        active
          ? "border-accent-500 bg-accent-50 text-accent-800"
          : "border-background-300 bg-background-50 text-foreground-600 hover:border-accent-300",
      )}
    >
      {active && <i className="ri-check-line text-xs" aria-hidden="true" />}
      {label}
    </button>
  );
}

function FieldBlock({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>
      {children}
      {hint ? <p className={hintClass}>{hint}</p> : null}
    </div>
  );
}

function PreviewRow({ icon, value, placeholder }: { icon: string; value: string; placeholder: string }) {
  const filled = value.trim().length > 0;
  return (
    <div className="flex items-start gap-2.5">
      <i className={cn(icon, "mt-0.5 shrink-0 text-[13px] opacity-70")} aria-hidden="true" />
      <span className={cn("text-[11.5px] leading-5", filled ? "opacity-95" : "opacity-45")}>
        {filled ? value : placeholder}
      </span>
    </div>
  );
}

export default function Onboarding() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { signIn } = useApp();

  const roleParam = params.get("role") === "seeker" ? "seeker" : "business";
  const role = roleParam as FlowRole;
  const steps = stepsByRole[role];

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    displayName: params.get("name") || "",
    email: params.get("email") || "",
    businessName: "",
    category: "mechanics",
    city: "Lagos",
    area: "",
    services: "",
    hours: "Mon to Sat, 8:00am to 7:00pm",
    phone: "",
    whatsapp: "",
    about: "",
    document: "",
    verified: false,
    primarySkill: "",
    experience: "1 to 3 years",
    preference: "Full time",
    expectedPay: "",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"] as string[],
    languages: ["English"] as string[],
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleIn = (key: "days" | "languages", value: string) => {
    setForm((prev) => {
      const list = prev[key];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
  };

  const categoryLabel = useMemo(
    () => CATEGORIES.find((item) => item.id === form.category)?.label ?? "Local service",
    [form.category],
  );

  const businessTitle = form.businessName.trim() || "Your business name";
  const seekerTitle = form.displayName.trim() || "Your name";
  const location = [form.area.trim(), form.city].filter(Boolean).join(", ");

  const stepValid = (index: number) => {
    if (role === "business") {
      if (index === 0) return form.businessName.trim().length > 1;
      if (index === 1) return form.services.trim().length > 2;
      if (index === 2) return form.phone.trim().length > 6;
      return true;
    }
    if (index === 0) return form.displayName.trim().length > 1 && form.primarySkill.trim().length > 1;
    if (index === 1) return form.experience.length > 0 && form.preference.length > 0;
    if (index === 2) return form.days.length > 0;
    return true;
  };

  const goNext = () => {
    if (!stepValid(step)) {
      setError(
        role === "business"
          ? step === 0
            ? "Add your business name so customers can find you."
            : step === 1
              ? "List at least one service with a price."
              : "Add a phone number customers can reach."
          : step === 0
            ? "Add your name and your main skill."
            : step === 1
              ? "Choose your experience level and the work you want."
              : "Pick at least one day you are available.",
      );
      return;
    }
    setError(null);
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const finish = () => {
    setSaving(true);
    const name =
      role === "business"
        ? form.businessName.trim() || form.displayName.trim()
        : form.displayName.trim() || "Ada Obi";
    signIn({ name, email: form.email.trim() || "demo@ekolink.ng", role: role as Role });
    toast(
      role === "business"
        ? `${name} is now listed on EkoLink. Nearby customers can find you.`
        : `Welcome to EkoLink, ${form.displayName.trim().split(" ")[0] || "friend"}. Your matches are ready.`,
    );
    navigate(role === "business" ? "/business" : "/seeker");
    setSaving(false);
  };

  const previewCard = (
    <div className="rounded-2xl bg-primary-950 p-5 text-background-50">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background-50/15 font-heading text-sm font-semibold">
          {(role === "business" ? businessTitle : seekerTitle).slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate font-heading text-[15px] font-semibold leading-tight">
            {role === "business" ? businessTitle : seekerTitle}
          </p>
          <p className="truncate text-[11px] text-background-300">
            {role === "business"
              ? categoryLabel
              : form.primarySkill.trim() || "Your main skill appears here"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5 border-t border-background-50/15 pt-4">
        <PreviewRow icon="ri-map-pin-line" value={location} placeholder="Your area and city" />
        {role === "business" ? (
          <>
            <PreviewRow icon="ri-time-line" value={form.hours} placeholder="Opening hours" />
            <PreviewRow
              icon="ri-list-check-2"
              value={form.services
                .split("\n")
                .filter((line) => line.trim().length > 0)
                .slice(0, 2)
                .join(" • ")}
              placeholder="Your top services"
            />
          </>
        ) : (
          <>
            <PreviewRow icon="ri-briefcase-line" value={form.preference} placeholder="Work preference" />
            <PreviewRow icon="ri-calendar-check-line" value={form.days.join(", ")} placeholder="Available days" />
          </>
        )}
        <PreviewRow icon="ri-translate-2" value={form.languages.join(", ")} placeholder="Languages" />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-background-50/15 pt-4 text-[11px] font-semibold">
        <span
          className={cn("h-2 w-2 rounded-full", form.verified ? "bg-accent-300" : "bg-background-50/40")}
          aria-hidden="true"
        />
        {form.verified
          ? "Documents ready for verification"
          : role === "business"
            ? "New on EkoLink"
            : "Open to opportunities"}
      </div>
    </div>
  );

  const reviewRows =
    role === "business"
      ? [
          { label: "Business name", value: businessTitle },
          { label: "Category", value: categoryLabel },
          { label: "Location", value: location || "Not added" },
          { label: "Opening hours", value: form.hours },
          { label: "Phone", value: form.phone || "Not added" },
          { label: "Verification", value: form.verified ? `${form.document || "Document"} submitted` : "Not submitted yet" },
        ]
      : [
          { label: "Name", value: seekerTitle },
          { label: "Main skill", value: form.primarySkill || "Not added" },
          { label: "Location", value: location || "Not added" },
          { label: "Experience", value: form.experience },
          { label: "Preferred work", value: form.preference },
          { label: "Available days", value: form.days.join(", ") || "Not added" },
        ];

  return (
    <div className="min-h-screen bg-background-50 font-body text-foreground-900 lg:flex">
      {/* Setup rail */}
      <aside className="border-b border-background-200 bg-background-50 lg:sticky lg:top-0 lg:h-screen lg:w-[22rem] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex h-20 items-center justify-between gap-3 border-b border-background-200 px-6">
          <Logo />
          <p className="text-[11px] font-semibold text-foreground-500 lg:hidden">
            {step + 1} / {steps.length}
          </p>
        </div>

        <div className="px-6 py-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-800">
            <i className="ri-sparkling-line" aria-hidden="true" />
            {role === "business" ? "Business setup" : "Job seeker setup"}
          </span>

          <h1 className="font-display mt-3 text-[21px] leading-snug text-foreground-950">
            {role === "business"
              ? "Set up your business profile"
              : `Set up your opportunity profile${form.displayName ? `, ${form.displayName.trim().split(" ")[0]}` : ""}`}
          </h1>
          <p className="mt-2 text-[12px] leading-relaxed text-foreground-500">
            {role === "business"
              ? "Customers read this before they call or message you. It takes about two minutes."
              : "Employers see this when they shortlist you. It takes about two minutes."}
          </p>

          <ol className="mt-6 hidden space-y-1 lg:block">
            {steps.map((item, index) => {
              const done = index < step;
              const current = index === step;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => done && setStep(index)}
                    disabled={!done && !current}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                      current
                        ? "bg-accent-50 text-accent-900"
                        : done
                          ? "cursor-pointer text-foreground-600 hover:bg-background-100 hover:text-foreground-950"
                          : "text-foreground-400",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold",
                        current
                          ? "bg-accent-600 text-background-50"
                          : done
                            ? "bg-accent-100 text-accent-800"
                            : "bg-background-200 text-foreground-500",
                      )}
                      aria-hidden="true"
                    >
                      {done ? <i className="ri-check-line text-[11px]" /> : index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px] font-semibold">{item.label}</span>
                      <span className="block truncate text-[10.5px] text-foreground-400">{item.hint}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 lg:hidden">
            <div className="h-1 overflow-hidden rounded-full bg-background-200">
              <div
                className="h-full rounded-full bg-accent-600 transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] font-semibold text-foreground-500">{steps[step].label}</p>
          </div>

          <div className="mt-8 hidden lg:block">
            <p className="k-label mb-3">{role === "business" ? "What customers will see" : "What employers will see"}</p>
            {previewCard}
          </div>
        </div>
      </aside>

      {/* Form */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-3xl px-5 py-8 md:px-10 md:py-12">
          {role === "business" && step === 0 && (
            <section>
              <h2 className="font-display text-[26px] leading-tight text-foreground-950 md:text-[30px]">
                Tell us about your business
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-500">
                This is the first thing customers see in discovery, so use the name people already know.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldBlock label="Business name" hint="For example, Emeka Auto Works">
                    <input
                      value={form.businessName}
                      onChange={(event) => update("businessName", event.target.value)}
                      placeholder="Your business name"
                      className={inputClass}
                    />
                  </FieldBlock>
                </div>
                <FieldBlock label="Category">
                  <select
                    value={form.category}
                    onChange={(event) => update("category", event.target.value)}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    {CATEGORIES.map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                  </select>
                </FieldBlock>
                <FieldBlock label="City">
                  <select
                    value={form.city}
                    onChange={(event) => update("city", event.target.value)}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    {NIGERIAN_CITIES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </FieldBlock>
                <div className="sm:col-span-2">
                  <FieldBlock label="Area or street" hint="Customers filter by distance, so be specific.">
                    <input
                      value={form.area}
                      onChange={(event) => update("area", event.target.value)}
                      placeholder="For example, Yaba"
                      className={inputClass}
                    />
                  </FieldBlock>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-background-300 bg-background-100/60 p-4">
                <div className="flex items-start gap-2.5 text-[11.5px] leading-relaxed text-foreground-600">
                  <i className="ri-map-pin-line mt-0.5 text-accent-700" aria-hidden="true" />
                  <span>
                    Your exact map pin and photographs are added from the owner dashboard, so you can confirm
                    the location before it goes live.
                  </span>
                </div>
              </div>
            </section>
          )}

          {role === "business" && step === 1 && (
            <section>
              <h2 className="font-display text-[26px] leading-tight text-foreground-950 md:text-[30px]">
                What do you offer?
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-500">
                Clear services with real prices bring better enquiries than a long description.
              </p>

              <div className="mt-7 space-y-4">
                <FieldBlock
                  label="Services and prices"
                  hint="One service per line. Example: Brake pad replacement, ₦25,000"
                >
                  <textarea
                    value={form.services}
                    onChange={(event) => update("services", event.target.value)}
                    maxLength={500}
                    rows={5}
                    placeholder={"Full engine diagnostics, ₦18,000\nBrake pad replacement, ₦25,000\nAir conditioning service, ₦32,000"}
                    className="w-full rounded-xl border border-background-300 bg-background-50 px-3.5 py-3 text-sm leading-relaxed text-foreground-900 transition-colors placeholder:text-foreground-400 focus:border-accent-500 focus:outline-none"
                  />
                </FieldBlock>

                <FieldBlock label="Opening hours">
                  <input
                    value={form.hours}
                    onChange={(event) => update("hours", event.target.value)}
                    placeholder="Mon to Sat, 8:00am to 7:00pm"
                    className={inputClass}
                  />
                </FieldBlock>

                <div>
                  <p className={labelClass}>Languages you serve customers in</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LANGUAGES.map((language) => (
                      <Chip
                        key={language}
                        label={language}
                        active={form.languages.includes(language)}
                        onClick={() => toggleIn("languages", language)}
                      />
                    ))}
                  </div>
                </div>

                <FieldBlock label="Short description" hint="Two sentences about how you work and what makes you reliable.">
                  <textarea
                    value={form.about}
                    onChange={(event) => update("about", event.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="A family run workshop with 14 years of experience. We explain every cost before we touch the car."
                    className="w-full rounded-xl border border-background-300 bg-background-50 px-3.5 py-3 text-sm leading-relaxed text-foreground-900 transition-colors placeholder:text-foreground-400 focus:border-accent-500 focus:outline-none"
                  />
                </FieldBlock>
              </div>
            </section>
          )}

          {role === "business" && step === 2 && (
            <section>
              <h2 className="font-display text-[26px] leading-tight text-foreground-950 md:text-[30px]">
                Trust and contact
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-500">
                Verified businesses appear higher in discovery and receive more replies.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <FieldBlock label="Phone number">
                  <input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="+234 803 000 0000"
                    className={inputClass}
                  />
                </FieldBlock>
                <FieldBlock label="WhatsApp number">
                  <input
                    value={form.whatsapp}
                    onChange={(event) => update("whatsapp", event.target.value)}
                    placeholder="+234 803 000 0000"
                    className={inputClass}
                  />
                </FieldBlock>
                <div className="sm:col-span-2">
                  <FieldBlock label="Verification document" hint="In the live product, documents are checked by the EkoLink trust team.">
                    <select
                      value={form.document}
                      onChange={(event) => update("document", event.target.value)}
                      className={cn(inputClass, "cursor-pointer")}
                    >
                      <option value="">Select a document</option>
                      <option value="CAC certificate">CAC certificate</option>
                      <option value="Shop ownership letter">Shop ownership letter</option>
                      <option value="Utility bill and ID">Utility bill and ID</option>
                    </select>
                  </FieldBlock>
                </div>
              </div>

              <button
                type="button"
                onClick={() => update("verified", !form.verified)}
                aria-pressed={form.verified}
                className={cn(
                  "mt-4 flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                  form.verified ? "border-accent-500 bg-accent-50" : "border-background-300 bg-background-50 hover:border-accent-300",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                    form.verified ? "border-accent-600 bg-accent-600 text-background-50" : "border-background-400",
                  )}
                >
                  {form.verified ? <i className="ri-check-line text-[11px]" aria-hidden="true" /> : null}
                </span>
                <span>
                  <span className="block text-[12.5px] font-semibold text-foreground-950">
                    Submit my business for verification
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-foreground-500">
                    You can still receive enquiries while the check is in progress.
                  </span>
                </span>
              </button>
            </section>
          )}

          {role === "seeker" && step === 0 && (
            <section>
              <h2 className="font-display text-[26px] leading-tight text-foreground-950 md:text-[30px]">
                What do you do best?
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-500">
                Your main skill drives the matches you see, so keep it simple and honest.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <FieldBlock label="Full name">
                  <input
                    value={form.displayName}
                    onChange={(event) => update("displayName", event.target.value)}
                    placeholder="Blessing Okafor"
                    className={inputClass}
                  />
                </FieldBlock>
                <FieldBlock label="Main skill">
                  <input
                    value={form.primarySkill}
                    onChange={(event) => update("primarySkill", event.target.value)}
                    placeholder="Pattern cutting and machine sewing"
                    className={inputClass}
                  />
                </FieldBlock>
                <FieldBlock label="City">
                  <select
                    value={form.city}
                    onChange={(event) => update("city", event.target.value)}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    {NIGERIAN_CITIES.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </FieldBlock>
                <FieldBlock label="Area">
                  <input
                    value={form.area}
                    onChange={(event) => update("area", event.target.value)}
                    placeholder="For example, Surulere"
                    className={inputClass}
                  />
                </FieldBlock>
                <div className="sm:col-span-2">
                  <FieldBlock label="Email address" hint="Employers use this to send interview invitations.">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => update("email", event.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </FieldBlock>
                </div>
              </div>
            </section>
          )}

          {role === "seeker" && step === 1 && (
            <section>
              <h2 className="font-display text-[26px] leading-tight text-foreground-950 md:text-[30px]">
                Experience and pay
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-500">
                Matching uses these answers, together with your location and availability.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <FieldBlock label="Experience">
                  <select
                    value={form.experience}
                    onChange={(event) => update("experience", event.target.value)}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    {["No experience yet", "Under 1 year", "1 to 3 years", "3 to 5 years", "Over 5 years"].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </FieldBlock>
                <FieldBlock label="Preferred work">
                  <select
                    value={form.preference}
                    onChange={(event) => update("preference", event.target.value)}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    {["Full time", "Part time", "Freelance", "Apprenticeship", "Remote"].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </FieldBlock>
                <div className="sm:col-span-2">
                  <FieldBlock label="Expected monthly pay" hint="Leave empty if you are open to any fair offer.">
                    <input
                      value={form.expectedPay}
                      onChange={(event) => update("expectedPay", event.target.value)}
                      placeholder="₦90,000"
                      className={inputClass}
                    />
                  </FieldBlock>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-accent-50 p-4">
                <p className="flex items-center gap-2 text-[11.5px] font-semibold text-accent-900">
                  <i className="ri-sparkling-line" aria-hidden="true" />
                  How matching works
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-accent-900/85">
                  Every recommendation shows a match percentage and a plain reason, such as your skill overlap,
                  your distance from the workplace, or your stated availability.
                </p>
              </div>
            </section>
          )}

          {role === "seeker" && step === 2 && (
            <section>
              <h2 className="font-display text-[26px] leading-tight text-foreground-950 md:text-[30px]">
                When are you available?
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-500">
                Shifts and gigs are filtered by these days, so only pick what you can truly keep.
              </p>

              <div className="mt-7 space-y-6">
                <div>
                  <p className={labelClass}>Available days</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dayOptions.map((day) => (
                      <Chip
                        key={day}
                        label={day}
                        active={form.days.includes(day)}
                        onClick={() => toggleIn("days", day)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className={labelClass}>Languages you speak</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LANGUAGES.map((language) => (
                      <Chip
                        key={language}
                        label={language}
                        active={form.languages.includes(language)}
                        onClick={() => toggleIn("languages", language)}
                      />
                    ))}
                  </div>
                </div>

                <FieldBlock label="Phone number" hint="Employers only see this after you apply.">
                  <input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="+234 800 000 0000"
                    className={inputClass}
                  />
                </FieldBlock>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="font-display text-[26px] leading-tight text-foreground-950 md:text-[30px]">
                Review and publish
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-500">
                Check the details below. You can edit any of them later from your dashboard.
              </p>

              <div className="mt-7 divide-y divide-background-200 overflow-hidden rounded-2xl border border-background-200">
                {reviewRows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                    <p className="text-[11.5px] font-semibold uppercase tracking-wide text-foreground-500">{row.label}</p>
                    <p className="text-[12.5px] font-medium text-foreground-900 sm:max-w-[60%] sm:text-right">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 lg:hidden">{previewCard}</div>

              <div className="mt-5 rounded-2xl bg-background-100 p-4 text-[11px] leading-relaxed text-foreground-600">
                <i className="ri-information-line mr-1.5 text-accent-700" aria-hidden="true" />
                This is a demonstration build. Sample data is used across EkoLink and no information leaves this
                browser.
              </div>
            </section>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-secondary-300 bg-secondary-100 px-3.5 py-3 text-[12px] text-secondary-900">
              <i className="ri-error-warning-line mt-0.5 shrink-0 text-sm" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-2 border-t border-background-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            {step === 0 ? (
              <Link to="/auth" className="text-center text-[12px] font-semibold text-foreground-500 hover:text-primary-700 sm:text-left">
                Back to sign in
              </Link>
            ) : (
              <button
                type="button"
                onClick={goBack}
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-background-300 px-4 py-2.5 text-[12.5px] font-semibold text-foreground-700 transition-colors hover:border-accent-300 sm:justify-start"
              >
                <i className="ri-arrow-left-line" aria-hidden="true" />
                Back
              </button>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="hidden text-[11px] text-foreground-400 sm:block">
                Step {step + 1} of {steps.length}
              </span>
              {step === steps.length - 1 ? (
                <Button size="lg" onClick={finish} disabled={saving} icon="ri-check-line">
                  {role === "business" ? "Publish my business" : "Finish my profile"}
                </Button>
              ) : (
                <Button size="lg" onClick={goNext} iconRight="ri-arrow-right-line">
                  Continue
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}