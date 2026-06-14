import Image from "next/image";
import { Container, Section, Eyebrow, Card } from "@/components/ui";
import Icon from "@/components/icon";
import Reveal from "@/components/reveal";

const team = [
  {
    name: "Janine Mae Adovo",
    role: "Founder / CEO",
    initials: "JM",
    image: "/janine-adovo-ceo.jpeg",
  },
  { name: "Jonathan Abulencia", role: "Marketing Lead", initials: "JA" },
  { name: "Joyce Ivana Cerenio", role: "Operations Lead", initials: "JI" },
  { name: "Jessa Faye Casilang", role: "Product & Technology Lead", initials: "JC" },
];

const values = [
  {
    icon: "eco",
    title: "Real ingredients only",
    body:
      "If we wouldn't eat it at home, it doesn't go in the machine. Whole fruit, leafy greens, nut butters, clean protein.",
  },
  {
    icon: "bolt",
    title: "Fast, but not fast food",
    body:
      "We obsess over the 60-second pour without compromising what's inside the cup. Freshly blended, never pre-mixed.",
  },
  {
    icon: "local_florist",
    title: "Local and growing",
    body:
      "We work with Canadian growers and roasters. Our menus rotate with what's actually in season.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ───────────── Header ───────────── */}
      <section className="relative overflow-hidden">
        {/* Decorative gradient orbs — anchored to the top corners so their soft
            falloff is never sliced by overflow-hidden at the section seam. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-28 h-[420px] w-[420px] rounded-full bg-primary-container/25 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-16 h-[300px] w-[300px] rounded-full bg-secondary-container/20 blur-[80px]"
        />

        <Section className="relative pb-0 lg:pb-0 lg:pt-12">
          <Container>
            <Reveal>
              <Eyebrow>About NutriVendo</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl max-w-3xl">
                Smart Vending.{" "}
                <span className="nv-text-gradient-forest">Healthier Lives.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 text-lg text-on-surface-variant max-w-2xl">
                NutriVendo makes fresh smoothies, protein shakes, detox juices, and
                wellness drinks more accessible through smart vending technology
                designed for busy, health-conscious lifestyles.
              </p>
            </Reveal>
          </Container>
        </Section>
      </section>

      {/* ───────────── Value props ───────────── */}
      <Section className="lg:pt-12">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <Card className="group h-full">
                  <div
                    className={
                      "grid h-12 w-12 place-items-center rounded-2xl bg-primary-container text-on-primary-container transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 " +
                      (i % 2 === 1 ? "nv-float-delayed" : "nv-float")
                    }
                  >
                    <Icon name={v.icon} size={24} filled />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{v.title}</h3>
                  <p className="mt-3 text-sm text-on-surface-variant">{v.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────── Our story ───────────── */}
      <section className="relative overflow-hidden bg-surface-container-low">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-primary-container/15 blur-[90px]"
        />
        <Section className="relative">
          <Container>
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
              <Reveal>
                <div>
                  <Eyebrow>Our story</Eyebrow>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Inspired by Healthy Living
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="space-y-4 text-lg text-on-surface-variant">
                  <p>
                    NutriVendo began with a personal love for smoothies and healthy
                    drinks. Growing up, I was inspired by my parents, who often made
                    their own smoothies and detox juices at home using simple, fresh
                    ingredients. Their habit of choosing healthier drinks showed me
                    how small daily choices can support a better lifestyle.
                  </p>
                  <p>
                    That inspiration led to the idea of creating a smarter way for
                    people to enjoy healthy beverages even when they are busy.
                    NutriVendo was built from that idea — bringing the comfort of
                    homemade wellness into a modern, on-the-go experience.
                  </p>
                  <p>
                    What started as a family-inspired habit became a fresh idea for
                    everyday convenience.
                  </p>
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>
      </section>

      {/* ───────────── Team ───────────── */}
      <Section>
        <Container>
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>The team</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                People who actually drink this stuff.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((p, i) => (
              <Reveal key={p.name} delay={i * 90}>
                <Card className="group h-full text-center">
                  {p.image ? (
                    <div className="mx-auto h-20 w-20 overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-300 group-hover:scale-110 group-hover:ring-primary-container">
                      <Image
                        src={p.image}
                        alt={`${p.name}, ${p.role}`}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-container text-2xl font-semibold text-on-primary-container ring-2 ring-transparent transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary group-hover:ring-primary-container">
                      {p.initials}
                    </div>
                  )}
                  <p className="mt-4 font-semibold tracking-tight">{p.name}</p>
                  <p className="text-sm text-on-surface-variant">{p.role}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
