import Image from "next/image";
import Link from "next/link";
import { Container, Section, Eyebrow, Card } from "@/components/ui";
import Icon from "@/components/icon";
import {
  products,
  locations,
  plans,
  isUnlimited,
  getPlan,
} from "@/lib/data";
import LocationsMap from "@/components/locations-map";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import { getCurrentUser } from "@/lib/auth";
import { getActiveSubscription, getPlanUsageThisMonth } from "@/lib/db";

const HERO_IMAGE = "/nutrivendo-smart-machine.png";

const PARTNERS = [
  { name: "FitLife King West", icon: "fitness_center" },
  { name: "Bay Street Tower", icon: "apartment" },
  { name: "Union Station", icon: "train" },
  { name: "U of T Athletic Centre", icon: "exercise" },
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
      <section className="relative overflow-hidden bg-surface">
        {/* Decorative gradient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary-container/25 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-secondary-container/20 blur-[80px]"
        />

        {/* Mobile only: machine as a faded hero backdrop behind the text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 lg:hidden"
        >
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-contain object-center opacity-[0.195] [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
          />
        </div>

        <Container className="relative py-20 sm:py-24 lg:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
            <Reveal>
              {user ? (
                <div className="mb-5 inline-flex flex-wrap items-center gap-2">
                  <Eyebrow>Welcome back, {user.first_name}.</Eyebrow>
                  {subPlan && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 py-1 text-xs font-medium text-on-primary-container ring-1 ring-primary-container">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {subPlan.name} ·{" "}
                      {isUnlimited(subPlan.monthlyQuota)
                        ? "Unlimited"
                        : `${remaining} of ${subPlan.monthlyQuota} left`}
                    </span>
                  )}
                </div>
              ) : (
                <div className="mb-6 flex items-center gap-3">
                  <span className="nv-badge inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-on-primary animate-pulse" />
                    Now in Toronto
                  </span>
                </div>
              )}
              <h1 className="font-display text-5xl font-extrabold leading-[1.01] tracking-tight text-on-surface sm:text-6xl lg:text-[4.5rem]">
                Fresh Nutrition Made{" "}
                <span className="text-primary">Instantly.</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant sm:text-xl">
                Real-ingredient smoothies, shakes, and juices blended fresh
                in 60 seconds through smart vending machines.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/locations"
                  className="focus-ring inline-flex min-h-[56px] items-center gap-2.5 rounded-full bg-primary px-9 text-base font-semibold text-on-primary shadow-lg shadow-primary/25 transition-all hover:bg-brand-700 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Icon name="location_on" size={20} />
                  Find a Machine
                </Link>
                <Link
                  href="/menu"
                  className="focus-ring inline-flex min-h-[56px] items-center gap-2.5 rounded-full border-2 border-primary bg-transparent px-9 text-base font-semibold text-primary transition-all hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Icon name="local_drink" size={20} />
                  Explore Menu
                </Link>
              </div>

              {/* Trust stats row */}
              <div className="mt-12 grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-10">
                {heroStats.map((item, i) => (
                  <div
                    key={item.label[0]}
                    className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-3.5 sm:text-left"
                  >
                    <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-primary-container text-on-primary-container shadow-sm">
                      <Icon name={item.icon} size={22} filled />
                    </span>
                    <span className="font-semibold leading-tight text-on-surface">
                      {item.label[0]}
                      <span className="block text-sm font-normal text-on-surface-variant">
                        {item.label[1]}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120} className="hidden lg:block">
              <div className="relative">
                {/* Floating badge on machine image */}
                <div className="absolute -left-4 top-8 z-10 nv-float">
                  <div className="product-card-shadow flex items-center gap-2 rounded-2xl bg-surface-container-lowest px-4 py-3 ring-1 ring-outline-variant/50">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-container text-on-primary-container">
                      <Icon name="timer" size={18} filled />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">60 seconds</p>
                      <p className="text-[11px] text-on-surface-variant">From tap to sip</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-2 bottom-16 z-10 nv-float-delayed">
                  <div className="product-card-shadow flex items-center gap-2 rounded-2xl bg-surface-container-lowest px-4 py-3 ring-1 ring-outline-variant/50">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary-container text-on-secondary-container">
                      <Icon name="eco" size={18} filled />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">Real ingredients</p>
                      <p className="text-[11px] text-on-surface-variant">No shortcuts</p>
                    </div>
                  </div>
                </div>
                <div className="relative h-[672px]">
                  <Image
                    src={HERO_IMAGE}
                    alt="The NutriVendo smart vending machine"
                    fill
                    priority
                    sizes="(min-width: 1024px) 672px, 100vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ───────────── Partners strip ───────────── */}
      <section className="border-y border-primary-container/25 bg-primary-container/8">
        <Container className="py-5 sm:py-6">
          <div className="flex flex-col items-center gap-4">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-on-surface">
              <span
                aria-hidden
                className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary"
              />
              Stocked daily at
            </p>

            <ul className="hidden flex-wrap items-center justify-center gap-3 sm:flex">
              {PARTNERS.map((p) => (
                <li key={p.name}>
                  <span className="product-card-shadow flex items-center gap-2.5 rounded-full bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface ring-1 ring-outline-variant transition-all hover:-translate-y-0.5 hover:ring-primary">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-container text-on-primary-container">
                      <Icon name={p.icon} size={16} filled />
                    </span>
                    <span className="whitespace-nowrap">{p.name}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div
              aria-hidden
              className="nv-marquee-mask w-full overflow-hidden sm:hidden"
            >
              <div className="nv-marquee flex w-max items-center gap-3">
                {[...PARTNERS, ...PARTNERS].map((p, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2.5 rounded-full bg-surface-container px-4 py-2 text-sm font-medium text-on-surface"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-container text-on-primary-container">
                      <Icon name={p.icon} size={16} filled />
                    </span>
                    <span className="whitespace-nowrap">{p.name}</span>
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
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                A drink, faster than a coffee order.
              </h2>
              <p className="mt-3 text-on-surface-variant">
                No queues, no buttons. Three taps and you&apos;re sipping.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="group text-center">
                  <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary-container text-on-primary-container transition-transform group-hover:scale-110">
                    <Icon name={step.icon} size={40} filled />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-on-surface-variant">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────── Why NutriVendo ───────────── */}
      <Section className="bg-surface-container-low">
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>Why NutriVendo</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Drinks that work as hard as you do.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {valueProps.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="nv-value-card group h-full rounded-2xl bg-surface-container-lowest p-7 ring-1 ring-outline-variant/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-container/10 hover:ring-primary/30">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-container text-on-primary-container transition-transform group-hover:scale-110">
                    <Icon name={v.icon} size={28} filled />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
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
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <Eyebrow>This week&apos;s lineup</Eyebrow>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Crowd favorites
                </h2>
                <p className="mt-3 max-w-lg text-on-surface-variant">
                  Blended to order at every machine. New seasonal flavors drop
                  every Monday.
                </p>
              </div>
              <Link
                href="/menu"
                className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-5 py-2.5 text-sm font-semibold text-primary ring-1 ring-outline-variant transition-all hover:bg-primary hover:text-on-primary hover:ring-primary"
              >
                See full menu
                <Icon name="arrow_forward" size={16} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-5">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────── Locations teaser ───────────── */}
      <section className="vending-pattern py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-12 rounded-[2rem] lg:grid-cols-2">
            <Reveal>
              <div className="text-on-primary">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary-container">
                  Find a machine
                </span>
                <h2 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
                  Freshness is
                  <br />
                  Always Nearby.
                </h2>
                <p className="mt-4 max-w-lg leading-relaxed text-white/80">
                  We&apos;re placing NutriVendo machines in the spots you spend
                  your day — gyms, offices, campuses, and transit hubs. Get
                  directions and live stock right from your phone.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Live stock", "Get directions", "Tap & go"].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur"
                    >
                      <Icon name="check" size={14} />
                      {chip}
                    </span>
                  ))}
                </div>
                <Link
                  href="/locations"
                  className="focus-ring mt-7 inline-flex min-h-[56px] items-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-primary shadow-xl transition-all hover:bg-surface-container hover:-translate-y-0.5"
                >
                  <Icon name="map" size={20} />
                  Open Interactive Map
                </Link>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="relative">
                <LocationsMap
                  fitBounds
                  locations={locations}
                  className="isolate h-[420px] overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl lg:h-[460px]"
                />
                <div className="pointer-events-none absolute -bottom-6 -left-6 z-10 hidden max-w-xs rounded-xl border border-outline-variant bg-white p-4 shadow-2xl lg:block">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                    <span className="text-sm font-semibold text-on-surface">
                      Live Availability
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    4 locations across Toronto with live stock updates.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ───────────── Plans teaser ───────────── */}
      <Section>
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Membership</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Save on every sip.
              </h2>
              <p className="mt-4 text-on-surface-variant">
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
                    "relative h-full rounded-2xl p-7 transition-all " +
                    (plan.highlight
                      ? "bg-primary-container text-on-primary-container shadow-xl md:scale-[1.04] ring-2 ring-primary"
                      : "nv-value-card bg-surface-container-lowest ring-1 ring-outline-variant/40 hover:-translate-y-1 hover:shadow-lg hover:ring-primary/30")
                  }
                >
                  {plan.highlight && (
                    <span className="absolute -top-3.5 right-6 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-on-primary shadow-md">
                      Most popular
                    </span>
                  )}
                  <p className="text-sm opacity-80">{plan.tagline}</p>
                  <h3 className="mt-1 text-2xl font-bold">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="text-5xl font-extrabold tracking-tight">
                      ${plan.monthly}
                    </span>
                    <span className="text-sm opacity-70"> /mo</span>
                  </p>
                  <p
                    className={
                      "mt-1 text-xs font-semibold " +
                      (plan.highlight ? "" : "text-primary")
                    }
                  >
                    {planSavings(plan.id)}
                  </p>
                  <ul className="mt-6 space-y-2.5 text-sm">
                    {plan.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex gap-2">
                        <Icon
                          name="check_circle"
                          size={20}
                          className={
                            plan.highlight
                              ? "text-on-primary-container"
                              : "text-primary"
                          }
                        />
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
                className="focus-ring inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-brand-700 hover:shadow-md"
              >
                Compare all plans
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ───────────── Final CTA ───────────── */}
      <Section className="pb-24">
        <Container>
          <Reveal>
            <div className="vending-pattern relative overflow-hidden rounded-[2rem] px-8 py-14 text-center sm:px-16">
              <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to upgrade your default drink?
              </h2>
              <p className="relative mx-auto mt-3 max-w-xl leading-relaxed text-white/80">
                Join thousands of sippers who&apos;ve replaced the
                vending-machine soda with something their body actually wants.
              </p>
              <div className="relative mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  href="/register"
                  className="focus-ring inline-flex min-h-[56px] items-center rounded-full bg-white px-8 text-base font-semibold text-primary transition-colors hover:bg-surface-container"
                >
                  {user ? "Manage your account" : "Create your account"}
                </Link>
                <Link
                  href="/locations"
                  className="focus-ring inline-flex min-h-[56px] items-center rounded-full border-2 border-white/40 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Find your nearest machine
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

function planSavings(planId: string): string {
  switch (planId) {
    case "starter":
      return "Save 10% per drink";
    case "fuel":
      return "Save 20% per drink";
    case "athlete":
      return "Save 30% per drink";
    default:
      return "";
  }
}

const heroStats: { icon: string; label: [string, string] }[] = [
  { icon: "eco", label: ["Made Fresh", "Instantly"] },
  { icon: "tune", label: ["Customizable", "Your Way"] },
  { icon: "timer", label: ["Ready in", "60 Seconds"] },
];

const howItWorks = [
  {
    icon: "location_on",
    title: "Walk up to a NutriVendo",
    body: "Find one in seconds with our live map — gyms, offices, campuses, transit.",
  },
  {
    icon: "contactless",
    title: "Tap your phone & pick a drink",
    body: "Apple Pay, Google Pay, or your member plan. No buttons, no fuss.",
  },
  {
    icon: "local_drink",
    title: "Sip in 60 seconds",
    body: "The machine blends your drink fresh from real ingredients. Grab it and go.",
  },
];

const valueProps = [
  {
    icon: "spa",
    title: "Real ingredients",
    body: "Whole fruit, leafy greens, nut butters, and clean protein. Nothing you can't pronounce.",
  },
  {
    icon: "eco",
    title: "Always fresh",
    body: "Each machine restocks daily and blends to order. We compost what doesn't sell.",
  },
  {
    icon: "pin_drop",
    title: "Anywhere you are",
    body: "Gyms, offices, campuses, transit hubs. Tap your phone and go in 60 seconds.",
  },
];
