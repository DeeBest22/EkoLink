import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { Role } from "@/lib/core";
import { cn, useApp, useToast } from "@/lib/core";
import { Button } from "@/components/ui";
import { Logo } from "@/components/shell";

type Mode = "register" | "login";

const PANEL_IMAGE =
  "https://readdy.ai/api/search-image?query=Warm%20documentary%20portrait%20of%20a%20Nigerian%20market%20trader%20in%20a%20busy%20evening%20street%2C%20soft%20amber%20lantern%20light%20against%20a%20deep%20navy%20dusk%20sky%2C%20teal%20accents%2C%20cinematic%20shallow%20depth%20of%20field%2C%20premium%20editorial%20photography&width=1000&height=1400&seq=ekolink-auth-panel-01&orientation=portrait";

const roleOptions: Array<{ id: Role; label: string; sub: string; icon: string }> = [
  { id: "business", label: "Business owner", sub: "Shops, workshops and stalls", icon: "ri-store-2-line" },
  { id: "seeker", label: "Job seeker", sub: "Roles, shifts and gigs", icon: "ri-briefcase-4-line" },
  { id: "customer", label: "Customer", sub: "Find trusted local services", icon: "ri-user-smile-line" },
  { id: "admin", label: "Administrator", sub: "Institution and trust team", icon: "ri-shield-user-line" },
];

const dashboardPath: Record<Role, string> = {
  business: "/business",
  seeker: "/seeker",
  customer: "/customer",
  admin: "/admin",
};

const inputClass =
  "h-11 w-full rounded-xl border border-background-300 bg-background-50 px-3.5 text-sm text-foreground-900 transition-colors placeholder:text-foreground-400 focus:border-accent-500 focus:outline-none";

const labelClass = "mb-1.5 block text-xs font-semibold text-foreground-700";

function Alert({ tone, children }: { tone: "error" | "info"; children: ReactNode }) {
  const isError = tone === "error";
  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-[12px] leading-relaxed",
        isError
          ? "border-secondary-300 bg-secondary-100 text-secondary-900"
          : "border-accent-200 bg-accent-50 text-accent-900",
      )}
    >
      <i className={cn(isError ? "ri-error-warning-line" : "ri-information-line", "mt-0.5 shrink-0 text-sm")} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function RolePicker({ value, onChange }: { value: Role; onChange: (next: Role) => void }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {roleOptions.map((option) => {
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={active}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-xl border p-3 text-left transition-colors",
              active
                ? "border-accent-500 bg-accent-50"
                : "border-background-300 bg-background-50 hover:border-accent-300",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base",
                active ? "bg-accent-600 text-background-50" : "bg-background-100 text-foreground-600",
              )}
            >
              <i className={option.icon} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-foreground-950">{option.label}</span>
              <span className="block truncate text-[10.5px] leading-snug text-foreground-500">{option.sub}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function Auth() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { signIn, user } = useApp();

  const startMode: Mode = params.get("mode") === "login" ? "login" : "register";
  const [mode, setMode] = useState<Mode>(startMode);
  const [role, setRole] = useState<Role>((params.get("role") as Role) || "business");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const activeRole = useMemo(() => roleOptions.find((item) => item.id === role) ?? roleOptions[0], [role]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const enterWorkspace = (targetRole: Role, displayName: string, targetEmail: string) => {
    signIn({
      name: displayName || (targetRole === "admin" ? "EkoLink Admin" : "Ada Obi"),
      email: targetEmail || "demo@ekolink.ng",
      role: targetRole,
    });
  };

  const handleGoogle = () => {
    setError(null);
    setNotice("Google sign in is not connected in this demonstration. Continue with email, or open a demo workspace below.");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    const cleanEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Enter a valid email address, for example ada@example.com.");
      return;
    }
    if (password.length < 6) {
      setError("Your password needs at least 6 characters.");
      return;
    }
    if (mode === "register" && !fullName.trim()) {
      setError("Please add your full name so businesses know who they are talking to.");
      return;
    }

    setSubmitting(true);
    const displayName =
      mode === "register" ? fullName.trim() : cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    enterWorkspace(role, displayName, cleanEmail);

    if (role === "business" || role === "seeker") {
      const query = new URLSearchParams({ role, name: displayName, email: cleanEmail });
      navigate(`/onboarding?${query.toString()}`);
      setSubmitting(false);
      return;
    }

    toast(`Welcome to EkoLink. Your ${activeRole.label.toLowerCase()} space is ready.`);
    navigate(dashboardPath[role]);
    setSubmitting(false);
  };

  const demo = (targetRole: Role) => {
    enterWorkspace(targetRole, targetRole === "business" ? "Emeka Okonkwo" : "Ada Obi", email.trim());
    toast(`Demo ${roleOptions.find((item) => item.id === targetRole)?.label.toLowerCase()} workspace opened.`);
    navigate(dashboardPath[targetRole]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-50 font-body text-foreground-900 lg:flex-row">
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] shrink-0 overflow-hidden bg-primary-950 lg:block xl:w-[44%]">
        <img
          src={PANEL_IMAGE}
          alt="A Nigerian trader in a busy market street at dusk"
          title="EkoLink connects people, businesses and opportunity"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/85 via-primary-950/70 to-primary-950" />

        <div className="relative flex h-full min-h-screen flex-col justify-between px-10 py-10 xl:px-14">
          <Logo light />

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-background-50/20 bg-background-50/10 px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-background-100">
              <i className="ri-node-tree text-accent-300" aria-hidden="true" />
              One connected network
            </span>

            <h1 className="font-display mt-6 text-[40px] leading-[1.05] text-background-50 xl:text-[46px]">
              One account.
              <br />
              Every part of your
              <br />
              <span className="text-accent-300">economic life.</span>
            </h1>

            <p className="mt-4 text-[13.5px] leading-relaxed text-background-200/90">
              Customers find you. Employers find your skills. Partners see the activity behind your
              business. Everything connects.
            </p>

            <div className="mt-8 space-y-2.5">
              {[
                { icon: "ri-map-pin-2-line", text: "12,480 businesses discoverable by location" },
                { icon: "ri-briefcase-4-line", text: "9,200 jobs and gigs matched to real skills" },
                { icon: "ri-shield-check-line", text: "Document checked verification badges" },
                { icon: "ri-line-chart-line", text: "Economic Trust Profiles that build over time" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl border border-background-50/10 bg-background-50/5 px-3.5 py-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-500/20 text-accent-200">
                    <i className={cn(item.icon, "text-sm")} aria-hidden="true" />
                  </span>
                  <span className="text-[11.5px] leading-relaxed text-background-200">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-md rounded-2xl border border-background-50/12 bg-background-50/5 p-4">
            <p className="text-[12px] leading-relaxed text-background-200">
              &ldquo;Before EkoLink, customers only found me by walking past. Now I get enquiries every week
              and I can show my records when I need stock credit.&rdquo;
            </p>
            <p className="mt-2 text-[10.5px] font-semibold text-accent-300">
              Emeka Okonkwo, Emeka Auto Works, Yaba
            </p>
          </div>
        </div>
      </aside>

      {/* Form column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between px-5 py-4 lg:hidden">
          <Logo />
          <Link to="/" className="text-[12px] font-semibold text-foreground-500 hover:text-primary-700">
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-8 md:px-10 md:py-12">
          <div className="w-full max-w-[440px]">
            <h2 className="font-display text-[27px] leading-tight text-foreground-950 md:text-[31px]">
              {mode === "login" ? "Welcome back" : "Create your EkoLink account"}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-foreground-500">
              {mode === "login"
                ? "Pick up where you left off. This demonstration does not store your password."
                : "Choose how you will use EkoLink. It takes about a minute."}
            </p>

            {/* Mode switch */}
            <div className="mt-6 flex items-center gap-1 rounded-full bg-background-100 p-1" role="tablist" aria-label="Sign in or create an account">
              {(["register", "login"] as const).map((value) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={mode === value}
                  onClick={() => switchMode(value)}
                  className={cn(
                    "flex-1 cursor-pointer whitespace-nowrap rounded-full px-3 py-2 text-[12.5px] font-semibold transition-colors",
                    mode === value ? "bg-background-50 text-primary-700" : "text-foreground-500 hover:text-foreground-900",
                  )}
                >
                  {value === "register" ? "Create account" : "Sign in"}
                </button>
              ))}
            </div>

            {notice && (
              <div className="mt-4">
                <Alert tone="info">{notice}</Alert>
              </div>
            )}

            {sessionHint()}

            <button
              type="button"
              onClick={handleGoogle}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap rounded-xl border border-background-300 bg-background-50 py-2.5 text-[13px] font-semibold text-foreground-900 transition-colors hover:bg-background-100"
            >
              <i className="ri-google-fill text-base text-accent-700" aria-hidden="true" />
              {mode === "login" ? "Continue with Google" : "Sign up with Google"}
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-background-200" />
              <span className="text-[11px] font-medium uppercase tracking-wide text-foreground-400">or use email</span>
              <span className="h-px flex-1 bg-background-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {mode === "register" && (
                <div>
                  <label htmlFor="full-name" className={labelClass}>Full name</label>
                  <input
                    id="full-name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Ada Obi"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className={labelClass}>Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              {mode === "register" && (
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+234 800 000 0000"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 6 characters"
                    className={cn(inputClass, "pr-11")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-foreground-400 transition-colors hover:text-foreground-900"
                  >
                    <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div>
                <p className={labelClass}>{mode === "login" ? "Sign in as" : "I am joining as"}</p>
                <RolePicker value={role} onChange={setRole} />
              </div>

              {error && <Alert tone="error">{error}</Alert>}

              <Button type="submit" size="lg" block iconRight="ri-arrow-right-line" disabled={submitting}>
                {mode === "login" ? "Sign in to EkoLink" : "Create my account"}
              </Button>
            </form>

            <p className="mt-4 text-[10.5px] leading-relaxed text-foreground-500">
              By continuing you agree to the EkoLink terms and the financial data disclaimer. This is a
              demonstrator, so activity stays in this browser and no real records are created.
            </p>

            <div className="mt-6 rounded-2xl border border-background-200 bg-background-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11.5px] font-semibold text-foreground-900">Just want a quick look around?</p>
                <Link to="/discover" className="text-[11px] font-semibold text-accent-700 hover:underline">
                  Explore without an account
                </Link>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {roleOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => demo(option.id)}
                    className="cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2.5 py-1.5 text-[11px] font-medium text-foreground-700 transition-colors hover:border-accent-400 hover:text-accent-800"
                  >
                    {option.label} demo
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-foreground-500">
              <span className="flex items-center gap-1.5">
                <i className="ri-lock-line" aria-hidden="true" /> Your demo activity stays in this browser
              </span>
              <Link to="/" className="font-semibold hover:text-primary-700">Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function sessionHint() {
    if (!user) return null;
    return (
      <div className="mt-4">
        <Alert tone="info">
          You are already signed in as <strong className="font-semibold">{user.name}</strong>.{" "}
          <button
            type="button"
            onClick={() => navigate(user.role === "admin" ? "/admin" : `/${user.role}`)}
            className="cursor-pointer font-semibold underline"
          >
            Open my workspace
          </button>
        </Alert>
      </div>
    );
  }
}