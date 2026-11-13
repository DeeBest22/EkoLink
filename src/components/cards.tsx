import { Link } from "react-router-dom";
import type { Business, Job, Review } from "@/lib/core";
import { formatNaira, initialsOf } from "@/lib/core";
import { Button, Pill, Stars, Avatar } from "@/components/ui";

export function BusinessCard({
  business,
  saved,
  onToggleSave,
  onOpen,
  compact,
}: {
  business: Business;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  onOpen?: (business: Business) => void;
  compact?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-background-200 bg-background-50 transition-colors duration-300 hover:border-primary-300">
      <div className="relative h-40 w-full overflow-hidden bg-background-200">
        <img
          src={business.image}
          alt={`${business.name}, ${business.categoryLabel.toLowerCase()} in ${business.area}`}
          title={`${business.name} ${business.categoryLabel} ${business.city}`}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5">
          <span className="flex flex-wrap gap-1.5">
            <Pill tone={business.open ? "open" : "closed"} icon={business.open ? "ri-time-line" : "ri-moon-line"}>
              {business.open ? "Open now" : "Closed"}
            </Pill>
            {business.verified ? <Pill tone="verified" icon="ri-verified-badge-line">Verified</Pill> : null}
          </span>
          {onToggleSave ? (
            <button
              type="button"
              aria-label={saved ? `Remove ${business.name} from saved` : `Save ${business.name}`}
              aria-pressed={Boolean(saved)}
              onClick={() => onToggleSave(business.id)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-background-50/90 text-foreground-700 backdrop-blur transition-colors hover:text-accent-700"
            >
              <i className={saved ? "ri-bookmark-fill text-accent-600" : "ri-bookmark-line"} aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-primary-950/75 px-2 py-1 text-[10.5px] font-semibold text-background-50 backdrop-blur">
          <i className="ri-map-pin-line mr-1" aria-hidden="true" />
          {business.distanceKm} km away
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-heading text-[15px] font-semibold text-foreground-950">{business.name}</h3>
            <p className="mt-0.5 text-[11px] text-foreground-500">
              {business.categoryLabel} · {business.area}, {business.city}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="flex items-center gap-1">
              <i className="ri-star-fill text-[12px] text-accent-600" aria-hidden="true" />
              <span className="text-[12px] font-semibold text-foreground-900">{business.rating}</span>
            </div>
            <p className="text-[10px] text-foreground-400">{business.reviewCount} reviews</p>
          </div>
        </div>

        {!compact ? (
          <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-foreground-600">{business.tagline}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {business.services.slice(0, 2).map((service) => (
            <span key={service.name} className="rounded-md bg-background-100 px-2 py-1 text-[10.5px] text-foreground-600">
              {service.name}
            </span>
          ))}
          {business.services.length > 2 ? (
            <span className="text-[10.5px] text-foreground-400">+{business.services.length - 2} more</span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Button size="sm" variant="outline" className="flex-1" onClick={() => onOpen?.(business)} icon="ri-store-2-line">
            View profile
          </Button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Get directions to ${business.name}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-background-300 text-foreground-600 transition-colors hover:border-accent-400 hover:text-accent-700"
          >
            <i className="ri-navigation-line" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function JobCard({ job, applied, onApply }: { job: Job; applied?: boolean; onApply: (job: Job) => void }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-background-200 bg-background-50 p-4 transition-colors duration-300 hover:border-primary-300 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <i className="ri-briefcase-4-line text-lg" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-heading text-[15px] font-semibold text-foreground-950">{job.title}</h3>
            <p className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-foreground-500">
              {job.employer}
              {job.verified ? <i className="ri-verified-badge-fill text-accent-600" aria-label="Verified employer" /> : null}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-accent-50 px-2 py-1 text-[10.5px] font-bold text-accent-800">{job.match}% match</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Pill>{job.type}</Pill>
        <Pill>{job.remote ? "Remote" : `${job.area}, ${job.city}`}</Pill>
        {job.urgent ? <Pill tone="warn" icon="ri-flashlight-line">Urgent</Pill> : null}
      </div>

      <p className="mt-3 line-clamp-2 text-[12.5px] leading-relaxed text-foreground-600">{job.description}</p>

      <div className="mt-3 rounded-lg bg-background-100 px-3 py-2">
        <p className="text-[10px] uppercase tracking-wide text-foreground-500">Recommended because</p>
        <p className="mt-0.5 line-clamp-1 text-[11.5px] text-foreground-700">{job.reasons[0]}</p>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div>
          <p className="k-num text-[15px] font-semibold text-foreground-950">
            {formatNaira(job.salaryMin, true)} to {formatNaira(job.salaryMax, true)}
          </p>
          <p className="text-[10.5px] text-foreground-400">per {job.period} · posted {job.posted}</p>
        </div>
        <Button size="sm" variant={applied ? "soft" : "accent"} onClick={() => onApply(job)} icon={applied ? "ri-check-line" : undefined}>
          {applied ? "Applied" : "Apply"}
        </Button>
      </div>
    </article>
  );
}

export function ReviewRow({ review }: { review: Review }) {
  return (
    <div className="rounded-xl border border-background-200 bg-background-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar initials={initialsOf(review.author)} size="sm" tone="slate" />
          <div>
            <p className="text-[13px] font-semibold text-foreground-900">{review.author}</p>
            <p className="text-[10.5px] text-foreground-400">{review.date}</p>
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>
      <p className="mt-2.5 text-[12.5px] leading-relaxed text-foreground-600">{review.body}</p>
      <p className="mt-2 flex items-center gap-1 text-[10.5px] text-foreground-400">
        <i className="ri-thumb-up-line" aria-hidden="true" /> {review.helpful} found this helpful
      </p>
    </div>
  );
}

export function BusinessMiniRow({ business, onOpen }: { business: Business; onOpen?: (business: Business) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(business)}
      className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-background-200 bg-background-50 p-2.5 text-left transition-colors hover:border-primary-300"
    >
      <span className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-background-200">
        <img src={business.image} alt={business.name} className="h-full w-full object-cover object-top" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-semibold text-foreground-900">{business.name}</span>
        <span className="block truncate text-[10.5px] text-foreground-500">
          {business.categoryLabel} · {business.distanceKm} km
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-foreground-700">
        <i className="ri-star-fill text-accent-600" aria-hidden="true" />
        {business.rating}
      </span>
    </button>
  );
}

export function LinkCard({ to, icon, title, body }: { to: string; icon: string; title: string; body: string }) {
  return (
    <Link to={to} className="group flex items-start gap-3 rounded-xl border border-background-200 bg-background-50 p-4 transition-colors hover:border-accent-300">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700">
        <i className={icon} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-foreground-900">{title}</span>
        <span className="mt-0.5 block text-[11.5px] leading-relaxed text-foreground-500">{body}</span>
      </span>
      <i className="ri-arrow-right-line ml-auto shrink-0 text-foreground-300 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600" aria-hidden="true" />
    </Link>
  );
}