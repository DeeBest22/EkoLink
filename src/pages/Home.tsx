import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, SectionLabel } from "@/components/ui";
import { communityImage } from "@/mocks/data";

const HERO_VIDEO =
  "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4";
const HERO_VIDEO_FALLBACK =
  "https://videos.pexels.com/video-files/2098989/2098989-hd_1920_1080_30fps.mp4";

const HERO_POSTER =
  "https://readdy.ai/api/search-image?query=Cinematic%20dusk%20view%20of%20a%20busy%20Nigerian%20market%20street%20with%20warm%20lantern%20glow%20and%20a%20deep%20navy%20sky%2C%20soft%20silhouettes%20of%20traders%20and%20small%20stalls%2C%20moody%20teal%20and%20amber%20highlights%2C%20premium%20editorial%20photography%2C%20atmospheric%20and%20dark%20enough%20for%20white%20text%20overlay&width=1920&height=1080&seq=ekolink-hero-video-02&orientation=landscape";

export default function Home() {
  const [videoOk, setVideoOk] = useState(true);

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 flex min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-primary-950">
        <img
          src={HERO_POSTER}
          alt="A busy Nigerian market street at dusk with warm lantern light"
          title="EkoLink connects local businesses, workers and customers"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {videoOk ? (
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={HERO_POSTER}
            aria-hidden="true"
            onError={() => setVideoOk(false)}
          >
            <source src={HERO_VIDEO} type="video/mp4" />
            <source src={HERO_VIDEO_FALLBACK} type="video/mp4" />
          </video>
        ) : null}

        {/* Whisper-light scrims: the footage stays the star, text stays readable */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary-950/70 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary-950/80 via-primary-950/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary-950/75 via-primary-950/15 to-transparent" />

        <div className="relative mx-auto w-full max-w-[1320px] px-4 pb-10 pt-24 md:px-8 md:pb-20 md:pt-32">
          <div className="k-rise max-w-2xl">
            <span className="inline-flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-background-100/80">
              <span className="h-px w-7 bg-accent-400" aria-hidden="true" />
              Nigeria&apos;s economic network
            </span>

            <h1 className="font-display mt-5 text-[34px] text-background-50 sm:text-[54px] lg:text-[66px]">
              Your Opportunities.
              <br />
              Your Community.
              <br />
              <span className="text-accent-300">Your Economic Future.</span>
            </h1>

            <p className="mt-5 max-w-[26rem] text-[14px] leading-[1.7] text-background-100/80 md:text-[15px]">
              Make your business visible, find real work nearby, and turn everyday activity into financial
              opportunity.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link to="/discover">
                <Button size="lg" variant="accent" iconRight="ri-arrow-right-line">
                  Find businesses near me
                </Button>
              </Link>
              <Link
                to="/jobs"
                className="group inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-md px-1 py-2 text-[13px] font-semibold text-background-50 transition-colors hover:text-accent-300"
              >
                Explore opportunities
                <i
                  className="ri-arrow-right-up-line text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative mx-auto hidden w-full max-w-[1320px] items-center justify-between gap-4 px-4 pb-6 sm:flex md:px-8 md:pb-8">
          <p className="hidden text-[10.5px] uppercase tracking-[0.2em] text-background-100/45 sm:block">
            Lagos · Ibadan · Abuja · Kano · Port Harcourt · Enugu
          </p>
          <span className="hidden items-center gap-2 text-[10.5px] uppercase tracking-[0.2em] text-background-100/45 md:flex">
            Scroll
            <i className="ri-arrow-down-line animate-bounce text-sm" aria-hidden="true" />
          </span>
        </div>
      </section>

      {/* Three pillars */}
      <section className="mx-auto w-full max-w-[1320px] px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl">
          <SectionLabel>One connected ecosystem</SectionLabel>
          <h2 className="font-display mt-4 text-[28px] text-foreground-950 md:text-[40px]">
            Three doors, one network.
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-foreground-600">
            Customers, business owners and job seekers share the same platform, so every action in one
            part of EkoLink makes the rest stronger.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              icon: "ri-map-pin-2-line",
              title: "Discover nearby",
              body: "Find the mechanic, tailor or food vendor around the corner, with real prices, hours and directions.",
              to: "/discover",
              cta: "Open discovery",
            },
            {
              icon: "ri-briefcase-4-line",
              title: "Find real work",
              body: "Roles, shifts and gigs matched to your skills, location and availability, with the reason behind every match.",
              to: "/jobs",
              cta: "Browse opportunities",
            },
            {
              icon: "ri-line-chart-line",
              title: "Build financial visibility",
              body: "Turn verified business activity and savings behaviour into a profile partners can understand.",
              to: "/finance",
              cta: "See how it works",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group flex h-full flex-col rounded-2xl border border-background-200 bg-background-50 p-6 transition-colors hover:border-accent-300"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-lg text-accent-700 transition-colors group-hover:bg-accent-600 group-hover:text-background-50">
                <i className={item.icon} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[16px] font-semibold text-foreground-950">{item.title}</h3>
              <p className="mt-2 flex-1 text-[13px] leading-relaxed text-foreground-600">{item.body}</p>
              <Link
                to={item.to}
                className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary-700 transition-colors hover:text-accent-700"
              >
                {item.cta}
                <i className="ri-arrow-right-line" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature split */}
      <section className="border-y border-background-200 bg-background-100">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-10 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-3xl border border-background-200 bg-background-50">
              <img
                src={communityImage}
                alt="A Nigerian tailor working with a customer inside a bright workshop"
                title="Business growth and customer relationships on EkoLink"
                className="h-[300px] w-full object-cover object-top md:h-[440px]"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <SectionLabel>For business owners</SectionLabel>
            <h2 className="font-display mt-4 text-[28px] text-foreground-950 md:text-[40px]">
              Be found by the customers already around you.
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-foreground-600">
              Your workshop or shop deserves more than word of mouth. EkoLink gives you a professional
              profile, a steady stream of nearby customers, and records that count when you need capital.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                "A profile with photos, services, prices and opening hours",
                "Enquiries, requests and reviews in one inbox",
                "A verified badge that builds trust before the first message",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-foreground-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-[11px] text-accent-800">
                    <i className="ri-check-line" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link to="/auth?mode=register&role=business">
                <Button icon="ri-store-2-line">List your business</Button>
              </Link>
              <Link to="/business">
                <Button variant="outline" icon="ri-dashboard-2-line">
                  Owner dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="mx-auto w-full max-w-[1320px] px-4 py-14 md:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            { value: "₦24B", label: "Economic activity made visible" },
            { value: "6", label: "Cities live across Nigeria" },
            { value: "3,940", label: "Employers hiring on EkoLink" },
            { value: "5", label: "Languages spoken by Eko AI" },
          ].map((item) => (
            <div key={item.label} className="border-l-2 border-accent-500 pl-4">
              <p className="k-num text-[26px] font-semibold text-foreground-950 md:text-[32px]">{item.value}</p>
              <p className="mt-1 text-[11.5px] leading-snug text-foreground-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="border-t border-background-200 bg-background-100">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-16 md:px-8 md:py-24">
          <div className="relative overflow-hidden rounded-3xl border border-background-200 bg-background-50">
            <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-accent-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />

            <div className="relative grid grid-cols-1 gap-10 p-6 md:p-10 lg:grid-cols-12 lg:gap-14 lg:p-12">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-[11px] font-semibold text-accent-800">
                  <i className="ri-sparkling-line text-accent-600" aria-hidden="true" />
                  Free to start
                </span>
                <h2 className="font-display mt-5 text-[30px] leading-[1.07] text-foreground-950 md:text-[44px]">
                  Join the network that
                  <br className="hidden sm:block" /> <span className="text-accent-700">grows with you.</span>
                </h2>
                <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-foreground-600">
                  Whether you sell, sew, repair, drive, or you are looking for your next role, there is a
                  place for you here. Register once and everything connects.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[11.5px] text-foreground-600">
                  <span className="flex items-center gap-1.5">
                    <i className="ri-check-line text-accent-600" aria-hidden="true" /> No monthly fee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="ri-check-line text-accent-600" aria-hidden="true" /> Ready in under 5 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <i className="ri-check-line text-accent-600" aria-hidden="true" /> 5 languages
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-background-200 bg-background-100/60 p-4 md:p-5">
                  <p className="k-label text-foreground-500">Start here</p>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Link to="/auth?mode=register&role=business">
                      <Button block variant="accent" icon="ri-store-2-line">List my business</Button>
                    </Link>
                    <Link to="/auth?mode=register&role=seeker">
                      <Button block variant="primary" icon="ri-briefcase-4-line">Find work</Button>
                    </Link>
                  </div>

                  <div className="mt-3 divide-y divide-background-200 border-t border-background-200">
                    <Link to="/discover" className="group flex items-center gap-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background-50 text-sm text-foreground-600 transition-colors group-hover:bg-accent-50 group-hover:text-accent-700">
                        <i className="ri-map-pin-2-line" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12.5px] font-semibold text-foreground-900">Explore nearby</span>
                        <span className="block text-[10.5px] text-foreground-500">Browse without an account</span>
                      </span>
                      <i className="ri-arrow-right-line text-foreground-400 transition-colors group-hover:text-accent-600" aria-hidden="true" />
                    </Link>
                    <Link to="/ai" className="group flex items-center gap-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background-50 text-sm text-foreground-600 transition-colors group-hover:bg-accent-50 group-hover:text-accent-700">
                        <i className="ri-sparkling-line" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12.5px] font-semibold text-foreground-900">Ask Eko AI</span>
                        <span className="block text-[10.5px] text-foreground-500">Guidance in your own language</span>
                      </span>
                      <i className="ri-arrow-right-line text-foreground-400 transition-colors group-hover:text-accent-600" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative border-t border-background-200 bg-background-100/60 px-6 py-4 md:px-10 lg:px-12">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2.5 text-[11.5px] text-foreground-600">
                <span>Free to join, always</span>
                <span className="hidden h-3 w-px bg-background-300 sm:block" />
                <span>Verified in 48 hours</span>
                <span className="hidden h-3 w-px bg-background-300 sm:block" />
                <span>6 cities live</span>
                <Link to="/finance" className="ml-auto hidden items-center gap-1 font-semibold text-accent-700 hover:text-accent-800 md:inline-flex">
                  Build your financial profile
                  <i className="ri-arrow-right-line" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}