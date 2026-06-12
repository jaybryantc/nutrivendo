import Image from "next/image";
import Link from "next/link";
import { Container, Section, Eyebrow, Card } from "@/components/ui";
import {
  products,
  locations,
  reviews,
  plans,
  isUnlimited,
  getPlan,
} from "@/lib/data";
import LocationsMap from "@/components/locations-map";
import Reveal from "@/components/reveal";
import StickyMobileCTA from "@/components/sticky-mobile-cta";
import { getCurrentUser } from "@/lib/auth";
import { getActiveSubscription, getPlanUsageThisMonth } from "@/lib/db";

const HERO_IMAGE = "/nutrivendo-smart-machine.jpeg";

// Scattered fresh-ingredient cutouts around the hero. Mirrors the reference:
// a few soft leaves floating up top, with fruit + spinach grounded in two
// clusters around the machine base. `front` lifts a piece above the machine
// image, `bob` uses the calmer grounded motion, `mobile` keeps it on phones.
const HERO_DECOR = [
  // Leaves only, balanced around the open margins — clear of the machine
  // (x ~52%–86%) and the headline/CTA text on the left.

  // ── Evenly spaced leaves along the top edge ──
  { src: "/deco-leaf.png", w: 176, h: 351, className: "left-[4%] top-[2%] w-[28px] sm:w-[46px] opacity-90", rot: "-18deg", delay: "0s", dur: "7s", front: false, bob: false, mobile: true },
  { src: "/deco-leaf.png", w: 176, h: 351, className: "left-[25%] top-[5%] w-[26px] sm:w-[36px] opacity-75", rot: "14deg", delay: "1.8s", dur: "8.2s", front: false, bob: false, mobile: false },
  { src: "/deco-mint.png", w: 388, h: 281, className: "left-[47%] top-[3%] w-[34px] sm:w-[46px] opacity-85", rot: "16deg", delay: "1.1s", dur: "7.6s", front: false, bob: false, mobile: false },
  { src: "/deco-leaf.png", w: 176, h: 351, className: "left-[68%] top-[5%] w-[30px] sm:w-[42px] opacity-85", rot: "-12deg", delay: "1.0s", dur: "7.5s", front: false, bob: false, mobile: false },

  // ── One more floating leaf in the top-right ──
  { src: "/deco-leaf.png", w: 176, h: 351, className: "right-[8%] top-[5%] w-[30px] sm:w-[42px] opacity-85", rot: "-14deg", delay: "0.4s", dur: "7.1s", front: false, bob: false, mobile: false },

  // ── Leaves down the left margin ──
  { src: "/deco-leaf.png", w: 176, h: 351, className: "left-[3%] top-[30%] w-[30px] sm:w-[40px] opacity-85", rot: "28deg", delay: "1.4s", dur: "7.8s", front: false, bob: false, mobile: false },
  { src: "/deco-leaf.png", w: 176, h: 351, className: "left-[4%] top-[64%] w-[26px] sm:w-[36px] opacity-80", rot: "-16deg", delay: "0.7s", dur: "7.3s", front: false, bob: false, mobile: false },

  // ── Leaves down the right margin, beside the machine ──
  { src: "/deco-leaf.png", w: 176, h: 351, className: "right-[3%] top-[22%] w-[32px] sm:w-[44px] opacity-85", rot: "18deg", delay: "0.6s", dur: "7.2s", front: false, bob: false, mobile: false },
  { src: "/deco-leaf.png", w: 176, h: 351, className: "right-[2%] top-[54%] w-[28px] sm:w-[38px] opacity-80", rot: "-22deg", delay: "2.0s", dur: "7.4s", front: false, bob: false, mobile: false },

] as const;

const PARTNERS = [
  "FitLife King West",
  "Bay Street Tower",
  "Union Station",
  "U of T Athletic Centre",
] as const;

export default async function HomePage() {
  const featured = products.filter((p) => p.bestseller);

  const user = await getCurrentUser();
  const sub = user ? await getActiveSubscription(user.id) : null;
  const subPlan = sub ? getPlan(sub.plan_id) : null;
  const used = user && subPlan ? await getPlanUsageThisMonth(user.id) : 0;
  const remaining = subPlan ? Math.max(0, subPlan.monthlyQuota - used) : 0;

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden bg-background">

        {/* Floating fresh-ingredient cutouts */}
        {HERO_DECOR.map((d, i) => (
          <Image
            key={i}
            src={d.src}
            alt=""
            aria-hidden
            width={d.w}
            height={d.h}
            style={
              {
                animationDelay: d.delay,
                animationDuration: d.dur,
                "--nv-rot": d.rot,
              } as React.CSSProperties
            }
            className={`${d.bob ? "nv-bob" : "nv-float"} pointer-events-none absolute h-auto select-none drop-shadow-[0_8px_10px_rgba(0,0,0,0.12)] ${
              d.front ? "z-20" : ""
            } ${d.mobile ? "block" : "hidden sm:block"} ${d.className}`}
          />
        ))}

        <Container className="relative py-20 sm:py-28 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <Reveal>
              {user ? (
                <div className="inline-flex flex-wrap items-center gap-2">
                  <Eyebrow>Welcome back, {user.first_name}.</Eyebrow>
                  {subPlan && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      {subPlan.name} ·{" "}
                      {isUnlimited(subPlan.monthlyQuota)
                        ? "Unlimited"
                        : `${remaining} of ${subPlan.monthlyQuota} left`}
                    </span>
                  )}
                </div>
              ) : (
                <Eyebrow>Fresh nutrition. Instantly.</Eyebrow>
              )}
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl leading-[1.02]">
                Fresh Nutrition Made
                <span className="block">
                  <span className="text-brand-600">Instantly.</span>
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-muted max-w-xl leading-relaxed">
                NutriVendo delivers fresh, customizable healthy drinks instantly
                through smart vending technology.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/locations"
                  className="focus-ring inline-flex h-12 items-center rounded-full bg-brand-600 px-6 text-base font-medium text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700 hover:shadow-md transition-all"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"
                    />
                    <circle cx="12" cy="11" r="2.2" />
                  </svg>
                  Find a Machine
                </Link>
                <Link
                  href="/menu"
                  className="focus-ring inline-flex h-12 items-center rounded-full border border-border bg-white px-6 text-base font-medium text-foreground hover:bg-surface hover:border-brand-200 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mr-2 h-4 w-4 text-brand-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 8h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 8z"
                    />
                    <path strokeLinecap="round" d="M9 8V6a3 3 0 0 1 6 0v2" />
                  </svg>
                  Explore Menu
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4 text-sm">
                {[
                  {
                    label: ["Made Fresh", "Instantly"],
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 3c-9 0-16 5-16 13 0 1.7.4 3.2 1.1 4.5M5 20.5C9 16 13 12.5 18 11"
                      />
                    ),
                  },
                  {
                    label: ["Customizable", "Your Way"],
                    icon: (
                      <>
                        <path strokeLinecap="round" d="M4 7h10M18 7h2M4 17h2M10 17h10" />
                        <circle cx="16" cy="7" r="2" />
                        <circle cx="8" cy="17" r="2" />
                      </>
                    ),
                  },
                  {
                    label: ["Ready in", "60 Seconds"],
                    icon: (
                      <>
                        <circle cx="12" cy="13" r="8" />
                        <path strokeLinecap="round" d="M12 9v4l2.5 2.5M9 2h6" />
                      </>
                    ),
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && (
                      <span
                        aria-hidden
                        className="hidden sm:block h-8 w-px bg-border -ml-2 mr-1"
                      />
                    )}
                    <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden
                      >
                        {item.icon}
                      </svg>
                    </span>
                    <span className="font-medium leading-tight text-foreground">
                      {item.label[0]}
                      <span className="block text-muted font-normal">
                        {item.label[1]}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={HERO_IMAGE}
                    alt="The NutriVendo smart vending machine"
                    fill
                    priority
                    sizes="(min-width: 1024px) 520px, 100vw"
                    className="object-contain mix-blend-multiply"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ───────────── Partners strip ───────────── */}
      <section className="border-y border-border bg-white">
        <Container className="py-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Stocked daily at
            </p>

            {/* Desktop: static wrapped list (kept screen-reader-only on mobile) */}
            <ul className="sr-only sm:not-sr-only sm:flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-foreground/70">
              {PARTNERS.map((p, i) => (
                <li key={p} className="flex items-center gap-6">
                  <span className="whitespace-nowrap">{p}</span>
                  {i < PARTNERS.length - 1 && (
                    <span aria-hidden className="text-border">·</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile: continuous marquee */}
            <div
              aria-hidden
              className="nv-marquee-mask w-full overflow-hidden sm:hidden"
            >
              <div className="nv-marquee flex w-max items-center text-sm font-medium text-foreground/70">
                {[...PARTNERS, ...PARTNERS].map((p, i) => (
                  <span key={i} className="flex items-center">
                    <span className="whitespace-nowrap">{p}</span>
                    <span className="px-6 text-border">·</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ───────────── How it works ───────────── */}
      <Section>
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                A drink, faster than a coffee order.
              </h2>
              <p className="mt-3 text-muted">
                No queues, no buttons. Three taps and you're sipping.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 relative grid gap-10 md:grid-cols-3">
            <div
              aria-hidden
              className="pointer-events-none absolute top-7 left-[16%] right-[16%] hidden md:block"
            >
              <svg
                className="w-full h-2 text-brand-200"
                viewBox="0 0 600 2"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="1"
                  x2="600"
                  y2="1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 6"
                />
              </svg>
            </div>
            {howItWorks.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="relative text-center md:text-left">
                  <div
                    className={
                      "relative z-10 mx-auto md:mx-0 grid h-14 w-14 place-items-center rounded-2xl text-base font-semibold shadow-sm " +
                      (i === 2
                        ? "bg-accent-600 text-white shadow-accent-600/30"
                        : "bg-brand-600 text-white shadow-brand-600/30")
                    }
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed max-w-sm md:max-w-none mx-auto md:mx-0">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────── Why NutriVendo ───────────── */}
      <Section className="bg-surface">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>Why NutriVendo</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Drinks that work as hard as you do.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {valueProps.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-200">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-100/0 group-hover:bg-brand-100/60 blur-2xl transition-colors duration-500"
                  />
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {v.icon}
                    </svg>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────── Featured products ───────────── */}
      <Section>
        <Container>
          <Reveal>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div className="max-w-2xl">
                <Eyebrow>This week's lineup</Eyebrow>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Crowd favorites
                </h2>
                <p className="mt-3 text-muted max-w-lg">
                  Blended to order at every machine. New seasonal flavors drop
                  every Monday.
                </p>
              </div>
              <Link
                href="/menu"
                className="focus-ring rounded-full px-2 py-1 text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                See full menu →
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <article className="group h-full overflow-hidden rounded-2xl border border-border bg-white transition-all hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="relative aspect-[4/5] overflow-hidden bg-brand-100/40">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"
                    />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-brand-700 backdrop-blur">
                      {p.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-tight">{p.name}</h3>
                      <span className="text-sm font-semibold text-brand-700">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-xs text-muted">
                      <span>{p.calories} cal</span>
                      <span>{p.protein}g protein</span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────── Locations teaser ───────────── */}
      <Section className="bg-surface">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <Eyebrow>Find a machine</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Drinks where you already are.
              </h2>
              <p className="mt-4 text-muted max-w-lg leading-relaxed">
                We're placing NutriVendo machines in the spots you spend your
                day — gyms, offices, campuses, and transit hubs. Get directions
                and live stock right from your phone.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Live stock", "Get directions", "Tap & go"].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12l5 5L20 7"
                      />
                    </svg>
                    {chip}
                  </span>
                ))}
              </div>
              <Link
                href="/locations"
                className="focus-ring mt-7 inline-flex h-11 items-center rounded-full bg-brand-600 px-5 text-sm font-medium text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
              >
                See all locations
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <div className="relative">
                <LocationsMap
                  fitBounds
                  locations={locations}
                  className="h-[420px] lg:h-[460px] shadow-xl shadow-brand-900/5"
                />
                <div className="pointer-events-none absolute right-4 top-4 z-[400] inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-brand-500"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 2c3.5 4.8 6 8.4 6 12a6 6 0 1 1-12 0c0-3.6 2.5-7.2 6-12z" />
                  </svg>
                  4 locations · Toronto
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ───────────── Plans teaser ───────────── */}
      <Section className="bg-gradient-to-b from-surface to-background">
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <Eyebrow>Membership</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Save on every sip.
              </h2>
              <p className="mt-4 text-muted">
                Monthly plans for casual sippers, regulars, and the truly
                devoted. Cancel anytime.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-center">
            {plans.map((plan, i) => (
              <Reveal key={plan.id} delay={i * 80}>
                <div
                  className={
                    "relative h-full rounded-2xl border bg-white p-6 transition-all " +
                    (plan.highlight
                      ? "border-brand-500 ring-2 ring-brand-500/30 shadow-xl shadow-brand-500/10 md:scale-[1.04]"
                      : "border-border hover:border-brand-200 hover:-translate-y-0.5 hover:shadow-lg")
                  }
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 right-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
                      Most popular
                    </span>
                  )}
                  <p className="text-sm text-muted">{plan.tagline}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{plan.name}</h3>
                  <p className="mt-3">
                    <span className="text-4xl font-semibold tracking-tight">
                      ${plan.monthly}
                    </span>
                    <span className="text-muted text-sm"> /mo</span>
                  </p>
                  <p className="mt-1 text-xs text-brand-700">
                    {planSavings(plan.id)}
                  </p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {plan.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex gap-2">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 flex-none text-brand-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 12l5 5L20 7"
                          />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 text-center">
              <Link
                href="/plans"
                className="focus-ring inline-flex h-11 items-center rounded-full bg-brand-600 px-6 text-sm font-medium text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
              >
                Compare all plans
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ───────────── Reviews ───────────── */}
      <Section>
        <Container>
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100">
                <Stars n={5} />
                4.9 / 5 · 2,300+ reviews
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Loved by daily sippers.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.slice(0, 3).map((r, i) => (
              <Reveal key={r.id} delay={i * 80}>
                <Card className="relative h-full overflow-hidden">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-4 -right-2 text-[8rem] font-serif leading-none text-brand-100 select-none"
                  >
                    “
                  </span>
                  <Stars n={r.rating} />
                  <p className="relative mt-4 text-sm text-foreground leading-relaxed">
                    {r.body}
                  </p>
                  <div className="relative mt-6 flex items-center gap-3">
                    <div
                      aria-hidden
                      className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-sm font-medium text-brand-700"
                    >
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted">{r.role}</p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────── Final CTA ───────────── */}
      <Section className="pb-24">
        <Container>
          <Reveal>
            <div
              className="relative overflow-hidden rounded-3xl bg-brand-600 px-8 py-14 text-center text-white sm:px-16"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.10) 0, transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.10) 0, transparent 45%)",
              }}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="pointer-events-none absolute -bottom-4 -right-4 h-40 w-40 text-white/10"
                fill="currentColor"
              >
                <path d="M12 2c3.5 4.8 6 8.4 6 12a6 6 0 1 1-12 0c0-3.6 2.5-7.2 6-12z" />
              </svg>
              <h2 className="relative text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to upgrade your default drink?
              </h2>
              <p className="relative mt-3 text-brand-50/90 max-w-xl mx-auto leading-relaxed">
                Join thousands of sippers who've replaced the vending-machine
                soda with something their body actually wants.
              </p>
              <div className="relative mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="focus-ring inline-flex h-12 items-center rounded-full bg-white px-6 text-base font-medium text-brand-700 hover:bg-brand-50 transition-colors"
                >
                  {user ? "Manage your account" : "Create your account"}
                </Link>
                <Link
                  href="/locations"
                  className="focus-ring inline-flex h-12 items-center rounded-full border border-white/30 px-6 text-base font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Find your nearest machine
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <StickyMobileCTA />
    </>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <div className="inline-flex gap-0.5 text-brand-500" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={
            i < n
              ? "h-4 w-4 fill-current"
              : "h-4 w-4 fill-current opacity-20"
          }
        >
          <path d="M10 1.5l2.6 5.5 6 .6-4.5 4.2 1.3 6L10 14.8 4.6 17.8l1.3-6L1.4 7.6l6-.6z" />
        </svg>
      ))}
    </div>
  );
}

function planSavings(planId: string): string {
  switch (planId) {
    case "starter":
      return "Save 10% per drink";
    case "fuel":
      return "Save 20% per drink";
    case "athlete":
      return "Save 30% on guest drinks";
    default:
      return "";
  }
}

const howItWorks = [
  {
    title: "Walk up to a NutriVendo",
    body:
      "Find one in seconds with our live map — gyms, offices, campuses, transit.",
  },
  {
    title: "Tap your phone & pick a drink",
    body:
      "Apple Pay, Google Pay, or your member plan. No buttons, no fuss.",
  },
  {
    title: "Sip in 60 seconds",
    body:
      "The machine blends your drink fresh from real ingredients. Grab it and go.",
  },
];

const valueProps = [
  {
    title: "Real ingredients",
    body:
      "Whole fruit, leafy greens, nut butters, and clean protein. Nothing you can't pronounce.",
    icon: (
      <>
        <path d="M11 3c4 0 8 4 8 9 0 5-4 8-9 8s-7-4-7-8c0-1 .5-3 2-4" />
        <path d="M11 3c-3 4-4 7-4 10" />
      </>
    ),
  },
  {
    title: "Always fresh",
    body:
      "Each machine restocks daily and blends to order. We compost what doesn't sell.",
    icon: (
      <>
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
        <path d="M5.6 5.6l2.1 2.1" />
        <path d="M16.3 16.3l2.1 2.1" />
        <path d="M5.6 18.4l2.1-2.1" />
        <path d="M16.3 7.7l2.1-2.1" />
      </>
    ),
  },
  {
    title: "Anywhere you are",
    body:
      "Gyms, offices, campuses, transit hubs. Tap your phone and go in 60 seconds.",
    icon: (
      <>
        <path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z" />
        <circle cx="12" cy="9" r="2.5" />
      </>
    ),
  },
];
