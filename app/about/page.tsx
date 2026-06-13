import { Container, Section, Eyebrow, Card } from "@/components/ui";
import Icon from "@/components/icon";

const milestones = [
  {
    year: "2021",
    title: "Two coolers in one gym",
    body: "Founders Jess and Marco placed the first prototype in a Kensington Market gym after months of blending in their kitchen.",
  },
  {
    year: "2022",
    title: "The first smart machine",
    body: "We built our own touchscreen, payment, and inventory stack. The drinks stopped running out at 4pm.",
  },
  {
    year: "2024",
    title: "Across the city",
    body: "4 machines across Toronto — from gyms to transit hubs to campus. Same recipe ethos: real ingredients, no shortcuts.",
  },
  {
    year: "2026",
    title: "You're reading this",
    body: "We're rolling out membership plans, custom blends, and partnerships with local growers.",
  },
];

const team = [
  { name: "Jess Okonkwo", role: "Co-founder & CEO", initials: "JO" },
  { name: "Marco Reyes", role: "Co-founder & CTO", initials: "MR" },
  { name: "Aisha Patel", role: "Head of Nutrition", initials: "AP" },
  { name: "Devon Lee", role: "Head of Operations", initials: "DL" },
];

export default function AboutPage() {
  return (
    <>
      <Section className="pb-0 lg:pb-0 lg:pt-12">
        <Container>
          <Eyebrow>About NutriVendo</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl max-w-3xl">
            We started NutriVendo because the only fast drink shouldn't be soda.
          </h1>
          <p className="mt-6 text-lg text-on-surface-variant max-w-2xl">
            We build smart vending machines that blend, pour, and serve fresh
            smoothies, shakes, and juices — using whole ingredients, in 60
            seconds, in the places you spend your day.
          </p>
        </Container>
      </Section>

      <Section className="lg:pt-12">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {[
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
            ].map((v) => (
              <Card key={v.title}>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-container text-on-primary-container">
                  <Icon name={v.icon} size={24} filled />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-3 text-sm text-on-surface-variant">{v.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface-container-low">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              From two coolers to across Toronto.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <Card key={m.year}>
                <span className="inline-flex rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">
                  {m.year}
                </span>
                <h3 className="mt-3 font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-2 text-sm text-on-surface-variant">{m.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>The team</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              People who actually drink this stuff.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((p) => (
              <Card key={p.name} className="text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary-container text-2xl font-semibold text-on-primary-container">
                  {p.initials}
                </div>
                <p className="mt-4 font-semibold tracking-tight">{p.name}</p>
                <p className="text-sm text-on-surface-variant">{p.role}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
