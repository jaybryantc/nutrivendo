import { Container, Section, Eyebrow, Card } from "@/components/ui";

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
    title: "Coast to coast",
    body: "50+ machines across Toronto, Vancouver, Montréal, Calgary, and Ottawa. Same recipe ethos: real ingredients, no shortcuts.",
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
      <Section className="pb-0">
        <Container>
          <Eyebrow>About NutriVendo</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl max-w-3xl">
            We started NutriVendo because the only fast drink shouldn't be soda.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl">
            We build smart vending machines that blend, pour, and serve fresh
            smoothies, shakes, and juices — using whole ingredients, in 60
            seconds, in the places you spend your day.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Real ingredients only",
                body:
                  "If we wouldn't eat it at home, it doesn't go in the machine. Whole fruit, leafy greens, nut butters, clean protein.",
              },
              {
                title: "Fast, but not fast food",
                body:
                  "We obsess over the 60-second pour without compromising what's inside the cup. Freshly blended, never pre-mixed.",
              },
              {
                title: "Local and growing",
                body:
                  "We work with Canadian growers and roasters. Our menus rotate with what's actually in season.",
              },
            ].map((v) => (
              <Card key={v.title}>
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-3 text-sm text-muted">{v.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              From two coolers to coast to coast.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m) => (
              <Card key={m.year}>
                <p className="text-sm font-semibold text-brand-700">{m.year}</p>
                <h3 className="mt-2 font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-muted">{m.body}</p>
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
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-100 text-2xl font-semibold text-brand-700">
                  {p.initials}
                </div>
                <p className="mt-4 font-semibold">{p.name}</p>
                <p className="text-sm text-muted">{p.role}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
