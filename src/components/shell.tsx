import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Avatar, Pill } from "@/components/ui";
import { cn, useApp } from "@/lib/core";
import type { Role } from "@/lib/core";

export function Logo({ light, compact }: { light?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="flex cursor-pointer items-center gap-2.5" aria-label="EkoLink home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 text-background-50">
        <i className="ri-node-tree text-lg" aria-hidden="true" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-2 border-background-50 bg-accent-500" />
      </span>
      <span className={cn("font-heading text-[17px] font-semibold tracking-tight", light ? "text-background-50" : "text-foreground-950")}>
        Eko<span className="text-accent-600">Link</span>
      </span>
      {!compact ? (
        <span className={cn("ml-1 hidden rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] lg:inline", light ? "border-background-50/25 text-background-100" : "border-background-300 text-foreground-500")}>
          Nigeria
        </span>
      ) : null}
    </Link>
  );
}

const publicLinks = [
  { to: "/discover", label: "Discover businesses" },
  { to: "/jobs", label: "Find work" },
  { to: "/finance", label: "Financial inclusion" },
  { to: "/ai", label: "Eko AI" },
];

export function PublicNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const dash = user ? (user.role === "admin" ? "/admin" : `/${user.role}`) : "/auth";
  const onDark = location.pathname === "/" && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled || !onDark ? "border-b border-background-200 bg-background-50/92 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between gap-4 px-4 md:px-8">
        <Logo light={onDark} />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {publicLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                  onDark
                    ? isActive
                      ? "bg-background-50/15 text-background-50"
                      : "text-background-100/85 hover:bg-background-50/10 hover:text-background-50"
                    : isActive
                      ? "bg-background-100 text-primary-700"
                      : "text-foreground-600 hover:bg-background-100 hover:text-foreground-950",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link to={dash} className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-background-100">
                <Avatar initials={user.name.slice(0, 2).toUpperCase()} size="sm" tone="teal" />
                <span className="max-w-[120px] truncate text-[13px] font-semibold text-foreground-800">{user.name.split(" ")[0]}</span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className={cn(
                  "px-3 py-2 text-[13px] font-semibold transition-colors",
                  onDark ? "text-background-100 hover:text-background-50" : "text-foreground-700 hover:text-primary-700",
                )}
              >
                Sign in
              </Link>
              <Link to="/auth?mode=register">
                <Button size="sm" variant={onDark ? "accent" : "primary"} iconRight="ri-arrow-right-line">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border md:hidden",
            onDark ? "border-background-50/30 text-background-50" : "border-background-200 text-foreground-800",
          )}
        >
          <i className={open ? "ri-close-line text-lg" : "ri-menu-3-line text-lg"} aria-hidden="true" />
        </button>
      </div>

      {open ? (
        <div className="k-fade border-t border-background-200 bg-background-50 px-4 pb-5 pt-3 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {publicLinks.map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center justify-between border-b border-background-100 py-3 text-sm font-medium text-foreground-800">
                {link.label}
                <i className="ri-arrow-right-s-line text-foreground-400" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={dash}><Button block variant="outline">Open my dashboard</Button></Link>
                <Button block variant="ghost" onClick={() => { signOut(); navigate("/"); }}>Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/auth?mode=register"><Button block iconRight="ri-arrow-right-line">Create an account</Button></Link>
                <Link to="/auth"><Button block variant="outline">Sign in</Button></Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function PublicLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background-50">
      <PublicNav />
      <main className="w-full flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-background-200 bg-background-100">
      <div className="mx-auto w-full max-w-[1320px] px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground-600">
              Connecting People. Empowering Businesses. Unlocking Opportunities.
            </p>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-foreground-500">
              EkoLink makes informal businesses visible, links people to real work, and turns everyday economic activity into financial visibility.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {["ri-twitter-x-line", "ri-linkedin-line", "ri-instagram-line", "ri-whatsapp-line"].map((icon) => (
                <span key={icon} className="flex h-9 w-9 items-center justify-center rounded-lg border border-background-300 bg-background-50 text-foreground-600">
                  <i className={icon} aria-hidden="true" />
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="k-label">Platform</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-foreground-600">
              <li><Link className="transition-colors hover:text-primary-700" to="/discover">Discover businesses</Link></li>
              <li><Link className="transition-colors hover:text-primary-700" to="/jobs">Find work</Link></li>
              <li><Link className="transition-colors hover:text-primary-700" to="/finance">Financial inclusion</Link></li>
              <li><Link className="transition-colors hover:text-primary-700" to="/ai">Eko AI</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="k-label">For business</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-foreground-600">
              <li><Link className="transition-colors hover:text-primary-700" to="/auth?mode=register&role=business">List your business</Link></li>
              <li><Link className="transition-colors hover:text-primary-700" to="/business">Owner dashboard</Link></li>
              <li><Link className="transition-colors hover:text-primary-700" to="/finance">Financial products</Link></li>
              <li><Link className="transition-colors hover:text-primary-700" to="/messages">Messages</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="k-label">Coverage</p>
            <p className="mt-4 text-[13px] leading-relaxed text-foreground-600">
              Lagos, Ibadan, Abuja, Kano, Port Harcourt and Enugu. New cities added every quarter.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["Lagos", "Ibadan", "Abuja", "Kano", "Port Harcourt", "Enugu"].map((city) => (
                <span key={city} className="rounded-full border border-background-300 bg-background-50 px-2.5 py-1 text-[11px] text-foreground-600">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-background-300 pt-6 text-[11px] text-foreground-500 sm:flex-row sm:items-center sm:justify-between">
          <p>EkoLink. Built for Nigeria. All figures shown in this demonstrator are sample data.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Financial disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* --------------------------- Dashboard shell --------------------------- */

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

const navByRole: Record<Role, NavItem[]> = {
  business: [
    { to: "/business", label: "Overview", icon: "ri-dashboard-2-line", end: true },
    { to: "/business?tab=profile", label: "Business profile", icon: "ri-store-2-line" },
    { to: "/business?tab=services", label: "Services", icon: "ri-list-check-2" },
    { to: "/business?tab=requests", label: "Customer requests", icon: "ri-inbox-line" },
    { to: "/business?tab=reviews", label: "Reviews", icon: "ri-star-line" },
    { to: "/business?tab=transactions", label: "Transactions", icon: "ri-exchange-dollar-line" },
  ],
  seeker: [
    { to: "/seeker", label: "Overview", icon: "ri-dashboard-2-line", end: true },
    { to: "/seeker?tab=matches", label: "Opportunity matches", icon: "ri-sparkling-2-line" },
    { to: "/seeker?tab=applications", label: "Applications", icon: "ri-file-list-3-line" },
    { to: "/seeker?tab=skills", label: "Skills and profile", icon: "ri-user-settings-line" },
    { to: "/seeker?tab=training", label: "Training", icon: "ri-book-open-line" },
    { to: "/seeker?tab=earnings", label: "Earnings", icon: "ri-wallet-3-line" },
  ],
  customer: [
    { to: "/customer", label: "Overview", icon: "ri-dashboard-2-line", end: true },
    { to: "/customer?tab=saved", label: "Saved businesses", icon: "ri-bookmark-line" },
    { to: "/customer?tab=requests", label: "Requests and bookings", icon: "ri-calendar-check-line" },
    { to: "/customer?tab=searches", label: "Recent searches", icon: "ri-history-line" },
    { to: "/customer?tab=reviews", label: "My reviews", icon: "ri-star-line" },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: "ri-dashboard-2-line", end: true },
    { to: "/admin?tab=verification", label: "Verification", icon: "ri-shield-check-line" },
    { to: "/admin?tab=users", label: "Users", icon: "ri-group-line" },
    { to: "/admin?tab=opportunities", label: "Opportunities", icon: "ri-briefcase-line" },
    { to: "/admin?tab=reports", label: "Reports", icon: "ri-flag-line" },
    { to: "/admin?tab=partners", label: "Financial partners", icon: "ri-bank-line" },
  ],
};

const roleTitles: Record<Role, string> = {
  business: "Business workspace",
  seeker: "Opportunity workspace",
  customer: "Customer space",
  admin: "Institution console",
};

const roleLabels: Record<Role, string> = {
  business: "Business owner",
  seeker: "Job seeker",
  customer: "Customer",
  admin: "Administrator",
};

export function DashShell({ role, children }: { role: Role; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const items = navByRole[role];
  const name = user?.name ?? roleLabels[role];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen w-full bg-background-100">
      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-[60] flex w-[260px] shrink-0 flex-col border-r border-background-200 bg-background-50 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-background-200 px-5">
            <Logo compact />
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-foreground-500 lg:hidden">
              <i className="ri-close-line" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <p className="k-label px-2">{roleTitles[role]}</p>
            <nav className="mt-3 flex flex-col gap-0.5" aria-label="Dashboard">
              {items.map((item) => {
                const active = item.end
                  ? location.pathname === item.to && !location.search
                  : location.pathname + location.search === item.to;
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                      active ? "bg-primary-500 text-background-50" : "text-foreground-600 hover:bg-background-100 hover:text-foreground-950",
                    )}
                  >
                    <i className={cn(item.icon, "text-base")} aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <p className="k-label mt-6 px-2">Across EkoLink</p>
            <nav className="mt-3 flex flex-col gap-0.5" aria-label="Shared">
              {[
                { to: "/discover", label: "Discovery", icon: "ri-map-pin-2-line" },
                { to: "/jobs", label: "Opportunities", icon: "ri-briefcase-4-line" },
                { to: "/finance", label: "Financial inclusion", icon: "ri-line-chart-line" },
                { to: "/messages", label: "Messages", icon: "ri-chat-3-line" },
                { to: "/ai", label: "Eko AI", icon: "ri-sparkling-line" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-foreground-600 transition-colors hover:bg-background-100 hover:text-foreground-950"
                >
                  <i className={cn(item.icon, "text-base")} aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="border-t border-background-200 p-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-background-100 px-3 py-2.5">
              <Avatar initials={name.slice(0, 2).toUpperCase()} size="sm" tone={role === "admin" ? "navy" : "teal"} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-foreground-900">{name}</p>
                <p className="truncate text-[10px] uppercase tracking-wide text-foreground-500">{roleLabels[role]}</p>
              </div>
              <button
                type="button"
                aria-label="Sign out"
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-200 hover:text-foreground-900"
              >
                <i className="ri-logout-box-r-line text-sm" aria-hidden="true" />
              </button>
            </div>
            <Link to="/" className="mt-2 flex items-center justify-center gap-1 py-1 text-[11px] text-foreground-500 hover:text-primary-700">
              <i className="ri-arrow-left-line" aria-hidden="true" /> Back to public site
            </Link>
          </div>
        </aside>

        {open ? <button type="button" aria-label="Close overlay" onClick={() => setOpen(false)} className="fixed inset-0 z-[55] bg-primary-950/40 lg:hidden" /> : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-background-200 bg-background-50/92 px-4 backdrop-blur-xl md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-background-200 text-foreground-700 lg:hidden"
              >
                <i className="ri-menu-3-line" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground-950">{roleTitles[role]}</p>
                <p className="hidden truncate text-[11px] text-foreground-500 sm:block">Demo workspace with sample Nigerian data</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/discover" className="hidden items-center gap-2 rounded-lg border border-background-200 px-3 py-2 text-[12px] text-foreground-500 transition-colors hover:border-accent-300 hover:text-accent-700 sm:flex">
                <i className="ri-search-line" aria-hidden="true" />
                Search businesses
              </Link>
              <Link to="/messages" aria-label="Messages and notifications" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-background-200 text-foreground-600 transition-colors hover:text-primary-700">
                <i className="ri-notification-3-line" aria-hidden="true" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-500" />
              </Link>
              <Link to="/finance" className="hidden sm:block">
                <Pill tone="verified" icon="ri-shield-check-line">Trust profile active</Pill>
              </Link>
            </div>
          </header>

          <main className="min-h-[calc(100vh-4rem)] w-full px-4 py-6 md:px-6 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function PageHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground-950 md:text-[26px]">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-foreground-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}