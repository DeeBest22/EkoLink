import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Domain types
 * ------------------------------------------------------------------ */

export type Role = "business" | "seeker" | "customer" | "admin";

export interface Service {
  name: string;
  price: string;
  duration: string;
}

export interface Business {
  id: string;
  name: string;
  owner: string;
  category: string;
  categoryLabel: string;
  tagline: string;
  about: string;
  phone: string;
  whatsapp: string;
  address: string;
  area: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  open: boolean;
  hours: string;
  image: string;
  cover: string;
  since: number;
  services: Service[];
  languages: string[];
  mapX: number;
  mapY: number;
}

export interface Job {
  id: string;
  title: string;
  employer: string;
  type: "Full time" | "Part time" | "Freelance" | "Temporary" | "Apprenticeship";
  category: string;
  city: string;
  area: string;
  salaryMin: number;
  salaryMax: number;
  period: "month" | "day" | "project" | "week";
  remote: boolean;
  posted: string;
  skills: string[];
  description: string;
  match: number;
  reasons: string[];
  verified: boolean;
  urgent: boolean;
}

export interface Review {
  id: string;
  businessId: string;
  author: string;
  rating: number;
  date: string;
  body: string;
  helpful: number;
}

export interface Transaction {
  id: string;
  label: string;
  party: string;
  amount: number;
  date: string;
  kind: "income" | "expense";
  channel: "Transfer" | "Cash" | "USSD" | "Card";
}

export interface FinancialProduct {
  id: string;
  name: string;
  provider: string;
  kind: "Credit" | "Savings" | "Insurance" | "Business";
  summary: string;
  amount: string;
  rate: string;
  eligibility: number;
  match: string;
  icon: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  level: string;
  skills: string[];
  free: boolean;
}

export interface Thread {
  id: string;
  name: string;
  role: string;
  initials: string;
  preview: string;
  time: string;
  unread: number;
  kind: "Customer" | "Business" | "Employer" | "Support";
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: "application" | "message" | "verification" | "finance" | "opportunity";
  read: boolean;
}

export interface TrustProfile {
  activity: number;
  consistency: number;
  depth: number;
  savings: number;
  band: string;
  since: string;
}

export interface DemoUser {
  name: string;
  email: string;
  role: Role;
  businessId?: string;
}

/* ------------------------------------------------------------------ *
 * Taxonomy
 * ------------------------------------------------------------------ */

export const CATEGORIES = [
  { id: "mechanics", label: "Mechanics", icon: "ri-tools-line" },
  { id: "tailors", label: "Tailors", icon: "ri-scissors-line" },
  { id: "food", label: "Food vendors", icon: "ri-restaurant-2-line" },
  { id: "plumbers", label: "Plumbers", icon: "ri-drop-line" },
  { id: "electricians", label: "Electricians", icon: "ri-flashlight-line" },
  { id: "phone-repair", label: "Phone repairers", icon: "ri-smartphone-line" },
  { id: "hairdressers", label: "Hairdressers", icon: "ri-user-star-line" },
  { id: "cleaners", label: "Cleaners", icon: "ri-brush-line" },
] as const;

export const DISTANCES = [1, 3, 5, 10, 20];

export const NIGERIAN_CITIES = [
  "Lagos",
  "Ibadan",
  "Abuja",
  "Kano",
  "Port Harcourt",
  "Enugu",
];

export const LANGUAGES = [
  "English",
  "Nigerian Pidgin",
  "Yoruba",
  "Hausa",
  "Igbo",
];

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatNaira(value: number, compact = false) {
  if (compact) {
    if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
    if (value >= 1_000) return `₦${Math.round(value / 1_000)}k`;
    return `₦${value}`;
  }
  return `₦${value.toLocaleString("en-NG")}`;
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function matchTone(match: number) {
  if (match >= 90) return "text-accent-700 bg-accent-100";
  if (match >= 80) return "text-primary-700 bg-primary-100";
  return "text-secondary-800 bg-secondary-200";
}

export function ratingTone(rating: number) {
  if (rating >= 4.7) return "text-accent-700";
  if (rating >= 4.3) return "text-primary-700";
  return "text-secondary-700";
}

/* ------------------------------------------------------------------ *
 * Demo session and activity state (persisted in the browser)
 * ------------------------------------------------------------------ */

interface PersistedState {
  user: DemoUser | null;
  saved: string[];
  applied: string[];
  requested: string[];
  reviews: string[];
  readNotices: string[];
  following: string[];
}

const STORAGE_KEY = "ekolink.demo.v1";

const emptyState: PersistedState = {
  user: null,
  saved: [],
  applied: [],
  requested: [],
  reviews: [],
  readNotices: [],
  following: [],
};

function loadState(): PersistedState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return { ...emptyState, ...parsed };
  } catch {
    return emptyState;
  }
}

interface AppContextValue extends PersistedState {
  signIn: (user: DemoUser) => void;
  signOut: () => void;
  toggleSaved: (id: string) => void;
  applyToJob: (id: string) => void;
  requestService: (id: string) => void;
  addReview: (id: string) => void;
  markNoticeRead: (id: string) => void;
  toggleFollow: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(loadState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable, the session still works in memory */
    }
  }, [state]);

  const toggleList = useCallback((key: "saved" | "applied" | "requested" | "reviews" | "readNotices" | "following", id: string) => {
    setState((prev) => {
      const list = prev[key];
      const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
      return { ...prev, [key]: next };
    });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      signIn: (user) => setState((prev) => ({ ...prev, user })),
      signOut: () => setState((prev) => ({ ...prev, user: null })),
      toggleSaved: (id) => toggleList("saved", id),
      applyToJob: (id) => toggleList("applied", id),
      requestService: (id) => toggleList("requested", id),
      addReview: (id) => toggleList("reviews", id),
      markNoticeRead: (id) => toggleList("readNotices", id),
      toggleFollow: (id) => toggleList("following", id),
    }),
    [state, toggleList],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

/* ------------------------------------------------------------------ *
 * Toasts
 * ------------------------------------------------------------------ */

interface Toast {
  id: number;
  message: string;
  tone: "success" | "info";
}

const ToastContext = createContext<((message: string, tone?: "success" | "info") => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, tone: "success" | "info" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex flex-col items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="k-toast pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border border-background-200 bg-background-50 px-4 py-3 text-sm text-foreground-900"
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-background-50",
                toast.tone === "success" ? "bg-accent-600" : "bg-primary-600",
              )}
            >
              <i className={toast.tone === "success" ? "ri-check-line" : "ri-information-line"} />
            </span>
            <span className="leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

/* ------------------------------------------------------------------ *
 * Small UI helpers
 * ------------------------------------------------------------------ */

export function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}