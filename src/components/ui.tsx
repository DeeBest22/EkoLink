import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useEffect, useId } from "react";
import { cn, useLockBody } from "@/lib/core";

/* ------------------------------ Button ------------------------------ */

type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "soft";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  block?: boolean;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary-500 text-background-50 hover:bg-primary-600 active:bg-primary-700",
  accent: "bg-accent-600 text-background-50 hover:bg-accent-700 active:bg-accent-800",
  outline: "border border-background-300 bg-background-50 text-foreground-900 hover:border-primary-300 hover:text-primary-700",
  ghost: "text-foreground-700 hover:bg-background-100 hover:text-foreground-950",
  soft: "bg-primary-50 text-primary-700 hover:bg-primary-100",
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-[13px] rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-[15px] rounded-xl gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  block,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        block && "w-full",
        className,
      )}
      {...rest}
    >
      {icon ? <i className={cn(icon, "text-[1.05em]")} aria-hidden="true" /> : null}
      {children}
      {iconRight ? <i className={cn(iconRight, "text-[1.05em]")} aria-hidden="true" /> : null}
    </button>
  );
}

/* ------------------------------ Tags ------------------------------ */

export function Pill({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "verified" | "open" | "closed" | "accent" | "navy" | "warn";
  icon?: string;
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-background-100 text-foreground-700 border-background-200",
    verified: "bg-accent-50 text-accent-800 border-accent-200",
    open: "bg-accent-50 text-accent-800 border-accent-200",
    closed: "bg-background-100 text-foreground-500 border-background-200",
    accent: "bg-accent-600 text-background-50 border-accent-600",
    navy: "bg-primary-500 text-background-50 border-primary-500",
    warn: "bg-secondary-100 text-secondary-900 border-secondary-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none",
        tones[tone],
        className,
      )}
    >
      {icon ? <i className={cn(icon, "text-[12px]")} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function SectionLabel({ children, light }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={cn("k-label flex items-center gap-2", light && "text-accent-200")}>
      <span className={cn("h-px w-6", light ? "bg-accent-300/70" : "bg-accent-500")} />
      {children}
    </div>
  );
}

/* ------------------------------ Fields ------------------------------ */

const fieldBase =
  "w-full rounded-xl border border-background-300 bg-background-50 px-3.5 text-sm text-foreground-900 placeholder:text-foreground-400 transition-colors focus:border-accent-500 focus:outline-none";

interface FieldWrapProps {
  label?: string;
  hint?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, htmlFor, children, className }: FieldWrapProps) {
  return (
    <div className={cn("min-w-0", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold text-foreground-700">
          {label}
        </label>
      ) : null}
      {children}
      {hint ? <p className="mt-1.5 text-[11px] leading-relaxed text-foreground-500">{hint}</p> : null}
    </div>
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "h-11", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-[104px] py-2.5 leading-relaxed", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "h-11 cursor-pointer appearance-none pr-9", className)} {...rest}>
      {children}
    </select>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-background-200 bg-background-50 px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground-900">{label}</p>
        {description ? <p className="mt-0.5 text-xs leading-relaxed text-foreground-500">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
          checked ? "bg-accent-600" : "bg-background-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-background-50 transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

/* ------------------------------ Display ------------------------------ */

export function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const full = Math.round(rating);
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-accent-600", size === "md" ? "text-sm" : "text-[11px]")}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= full ? "ri-star-fill" : "ri-star-line opacity-40"} aria-hidden="true" />
      ))}
    </span>
  );
}

export function Avatar({
  initials,
  size = "md",
  tone = "navy",
}: {
  initials: string;
  size?: "sm" | "md" | "lg";
  tone?: "navy" | "teal" | "slate";
}) {
  const sizes = { sm: "h-8 w-8 text-[11px]", md: "h-10 w-10 text-xs", lg: "h-14 w-14 text-base" };
  const tones = {
    navy: "bg-primary-500 text-background-50",
    teal: "bg-accent-600 text-background-50",
    slate: "bg-secondary-200 text-secondary-900",
  };
  return (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full font-heading font-semibold", sizes[size], tones[tone])}>
      {initials}
    </span>
  );
}

export function Progress({ value, tone = "accent" }: { value: number; tone?: "accent" | "navy" | "slate" }) {
  const tones = { accent: "bg-accent-600", navy: "bg-primary-500", slate: "bg-secondary-400" };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-background-200" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full transition-all duration-700", tones[tone])} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function StatTile({
  label,
  value,
  change,
  icon,
  tone = "navy",
}: {
  label: string;
  value: string;
  change?: string;
  icon: string;
  tone?: "navy" | "teal" | "slate";
}) {
  const tones = {
    navy: "bg-primary-50 text-primary-700",
    teal: "bg-accent-50 text-accent-700",
    slate: "bg-secondary-100 text-secondary-800",
  };
  return (
    <div className="rounded-2xl border border-background-200 bg-background-50 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-500">{label}</p>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg text-base", tones[tone])}>
          <i className={icon} aria-hidden="true" />
        </span>
      </div>
      <p className="k-num mt-3 text-2xl font-semibold text-foreground-950">{value}</p>
      {change ? (
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-accent-700">
          <i className="ri-arrow-up-line" aria-hidden="true" />
          {change}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------ Tabs ------------------------------ */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (next: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1 rounded-full bg-background-100 p-1", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
            value === option.value ? "bg-background-50 text-primary-700" : "text-foreground-600 hover:text-foreground-900",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------ Modal ------------------------------ */

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: string;
}) {
  useLockBody(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-primary-950/45 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close dialog" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div className={cn("k-fade relative z-10 w-full rounded-t-2xl border border-background-200 bg-background-50 sm:rounded-2xl", width)}>
        <div className="flex items-start justify-between gap-4 border-b border-background-200 px-5 py-4">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground-950">{title}</h3>
            {subtitle ? <p className="mt-0.5 text-xs text-foreground-500">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-500 transition-colors hover:bg-background-100 hover:text-foreground-900"
          >
            <i className="ri-close-line text-lg" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------ Misc ------------------------------ */

export function EmptyState({ icon, title, body, action }: { icon: string; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-background-300 bg-background-100/60 px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-xl text-accent-700">
        <i className={icon} aria-hidden="true" />
      </span>
      <h4 className="mt-3 text-sm font-semibold text-foreground-900">{title}</h4>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-foreground-500">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function InfoNote({ children, icon = "ri-information-line" }: { children: ReactNode; icon?: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-accent-200 bg-accent-50 px-3.5 py-3 text-xs leading-relaxed text-accent-900">
      <i className={cn(icon, "mt-0.5 text-sm")} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function useFieldId(prefix = "field") {
  const raw = useId();
  return `${prefix}-${raw.replace(/:/g, "")}`;
}