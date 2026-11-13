import { useState } from "react";
import { Link } from "react-router-dom";
import type { Business } from "@/lib/core";
import { formatNaira, useApp, useToast } from "@/lib/core";
import { Avatar, Button, Field, Input, InfoNote, Modal, Pill, Stars, Textarea } from "@/components/ui";
import { ReviewRow } from "@/components/cards";
import { reviews as allReviews } from "@/mocks/data";

export function BusinessDetailModal({ business, onClose }: { business: Business | null; onClose: () => void }) {
  const { saved, toggleSaved, requestService, requested, addReview, reviews: written } = useApp();
  const toast = useToast();
  const [requestOpen, setRequestOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [note, setNote] = useState("");
  const [rating, setRating] = useState(5);

  if (!business) return null;

  const isSaved = saved.includes(business.id);
  const wasRequested = requested.includes(business.id);
  const businessReviews = allReviews.filter((review) => review.businessId === business.id);
  const hasWritten = written.includes(business.id);

  return (
    <>
      <Modal open onClose={onClose} title={business.name} subtitle={`${business.categoryLabel} · ${business.area}, ${business.city}`} width="max-w-3xl">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={business.cover}
            alt={`${business.name} workspace in ${business.city}`}
            title={`${business.name} ${business.categoryLabel}`}
            className="h-44 w-full object-cover object-top md:h-52"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-primary-950/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
            <div className="flex flex-wrap gap-1.5">
              <Pill tone={business.open ? "open" : "closed"} icon={business.open ? "ri-time-line" : "ri-moon-line"}>
                {business.open ? "Open now" : "Closed"}
              </Pill>
              {business.verified ? <Pill tone="accent" icon="ri-verified-badge-line">Verified business</Pill> : <Pill tone="neutral">Not yet verified</Pill>}
            </div>
            <span className="rounded-lg bg-background-50/95 px-2 py-1 text-[11px] font-semibold text-foreground-800">
              {business.distanceKm} km away
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar initials={business.owner.split(" ").map((part) => part[0]).join("")} tone="teal" />
            <div>
              <p className="text-[13px] font-semibold text-foreground-900">{business.owner}</p>
              <p className="text-[11px] text-foreground-500">Owner since {business.since}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[13px] font-semibold text-foreground-900">
              <i className="ri-star-fill text-accent-600" aria-hidden="true" /> {business.rating}
            </span>
            <span className="text-[11px] text-foreground-500">({business.reviewCount} reviews)</span>
          </div>
        </div>

        <p className="mt-4 text-[13px] leading-relaxed text-foreground-700">{business.about}</p>

        <dl className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-background-200 bg-background-100/60 p-3">
            <dt className="text-[10px] uppercase tracking-wide text-foreground-500">Address</dt>
            <dd className="mt-0.5 text-[12.5px] font-medium text-foreground-900">{business.address}, {business.state}</dd>
          </div>
          <div className="rounded-xl border border-background-200 bg-background-100/60 p-3">
            <dt className="text-[10px] uppercase tracking-wide text-foreground-500">Opening hours</dt>
            <dd className="mt-0.5 text-[12.5px] font-medium text-foreground-900">{business.hours}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {business.languages.map((language) => (
            <Pill key={language} icon="ri-translate-2">{language}</Pill>
          ))}
        </div>

        <div className="mt-5">
          <h4 className="text-[13px] font-semibold text-foreground-950">Services and prices</h4>
          <div className="mt-2 divide-y divide-background-200 overflow-hidden rounded-xl border border-background-200">
            {business.services.map((service) => (
              <div key={service.name} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium text-foreground-900">{service.name}</p>
                  <p className="text-[10.5px] text-foreground-400">{service.duration}</p>
                </div>
                <span className="k-num shrink-0 text-[12.5px] font-semibold text-foreground-900">{service.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <a href={`tel:${business.phone.replace(/\s/g, "")}`} className="col-span-1">
            <Button block size="sm" variant="outline" icon="ri-phone-line">Call</Button>
          </a>
          <a href={`https://wa.me/${business.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer">
            <Button block size="sm" variant="outline" icon="ri-whatsapp-line">WhatsApp</Button>
          </a>
          <Button size="sm" variant="accent" icon="ri-calendar-check-line" onClick={() => setRequestOpen(true)}>
            {wasRequested ? "Request sent" : "Request service"}
          </Button>
          <Button size="sm" variant={isSaved ? "soft" : "outline"} icon={isSaved ? "ri-bookmark-fill" : "ri-bookmark-line"} onClick={() => toggleSaved(business.id)}>
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 items-center gap-1.5 rounded-lg border border-background-300 px-3 text-[12px] font-medium text-foreground-700 transition-colors hover:border-accent-400 hover:text-accent-700"
          >
            <i className="ri-navigation-line" aria-hidden="true" /> Google Maps directions
          </a>
          <Link
            to={`/messages?business=${business.id}`}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-background-300 px-3 text-[12px] font-medium text-foreground-700 transition-colors hover:border-accent-400 hover:text-accent-700"
          >
            <i className="ri-chat-3-line" aria-hidden="true" /> Message business
          </Link>
          <Link
            to="/finance"
            className="flex h-9 items-center gap-1.5 rounded-lg border border-background-300 px-3 text-[12px] font-medium text-foreground-700 transition-colors hover:border-accent-400 hover:text-accent-700"
          >
            <i className="ri-shield-check-line" aria-hidden="true" /> Verified economic profile
          </Link>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h4 className="text-[13px] font-semibold text-foreground-950">Customer reviews</h4>
          <Button size="sm" variant="ghost" icon="ri-quill-pen-line" onClick={() => setReviewOpen(true)}>
            {hasWritten ? "You reviewed this" : "Write a review"}
          </Button>
        </div>

        <div className="mt-2 space-y-2.5">
          {businessReviews.length ? (
            businessReviews.map((review) => <ReviewRow key={review.id} review={review} />)
          ) : (
            <p className="rounded-xl border border-dashed border-background-300 px-4 py-6 text-center text-[12px] text-foreground-500">
              No written reviews yet. Be the first to share your experience.
            </p>
          )}
        </div>
      </Modal>

      <Modal open={requestOpen} onClose={() => setRequestOpen(false)} title="Request a service" subtitle={`${business.name} usually replies within 2 hours`}>
        <div className="space-y-3">
          <Field label="What do you need?" htmlFor="request-note">
            <Textarea
              id="request-note"
              value={note}
              maxLength={500}
              onChange={(event) => setNote(event.target.value)}
              placeholder={`Describe the job, for example: ${business.services[0]?.name ?? "a repair"}`}
            />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Preferred day" htmlFor="request-day">
              <Input id="request-day" type="date" />
            </Field>
            <Field label="Budget range" htmlFor="request-budget">
              <Input id="request-budget" placeholder="e.g. ₦20,000" />
            </Field>
          </div>
          <InfoNote>Service requests are saved in this demo and appear in the customer area and business dashboard.</InfoNote>
          <div className="flex gap-2 pt-1">
            <Button
              block
              onClick={() => {
                requestService(business.id);
                setRequestOpen(false);
                toast(`Request sent to ${business.name}. They will reply in your messages.`);
              }}
            >
              Send request
            </Button>
            <Button variant="outline" onClick={() => setRequestOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title="Write a review" subtitle={business.name}>
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-foreground-700">Your rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  onClick={() => setRating(value)}
                  className="cursor-pointer p-0.5 text-xl text-accent-600"
                >
                  <i className={value <= rating ? "ri-star-fill" : "ri-star-line"} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
          <Field label="Your experience" htmlFor="review-body">
            <Textarea id="review-body" maxLength={500} placeholder="What was the service like, and would you recommend them?" />
          </Field>
          <InfoNote>Reviews help other customers choose with confidence. This demo stores your review locally.</InfoNote>
          <Button
            block
            onClick={() => {
              addReview(business.id);
              setReviewOpen(false);
              toast("Thank you. Your review has been recorded.");
            }}
          >
            Submit review
          </Button>
        </div>
      </Modal>
    </>
  );
}

export function PriceLabel({ value }: { value: number }) {
  return <span className="k-num">{formatNaira(value)}</span>;
}

export { Stars };