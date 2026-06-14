import { Container, Section, Eyebrow, Card } from "@/components/ui";
import Icon from "@/components/icon";

const team = [
  { name: "Janine Mae Adovo", role: "Founder / CEO", initials: "JM" },
  { name: "Jonathan Abulencia", role: "Marketing Lead", initials: "JA" },
  { name: "Joyce Ivana Cerenio", role: "Operations Lead", initials: "JI" },
  { name: "Jessa Faye Casilang", role: "Product & Technology Lead", initials: "JC" },
];

export default function AboutPage() {
  return (
    <>
      <Section className="pb-0 lg:pb-0 lg:pt-12">
        <Container>
          <Eyebrow>About NutriVendo</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl max-w-3xl">
            Smart Vending. Healthier Lives.
          </h1>
          <p className="mt-6 text-lg text-on-surface-variant max-w-2xl">
            NutriVendo makes fresh smoothies, protein shakes, detox juices, and
            wellness drinks more accessible through smart vending technology
            designed for busy, health-conscious lifestyles.
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
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div>
              <Eyebrow>Our story</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Inspired by Healthy Living
              </h2>
            </div>
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
