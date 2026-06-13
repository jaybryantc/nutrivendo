import { Container, Section, Eyebrow, Card } from "@/components/ui";
import Icon from "@/components/icon";
import { reviews } from "@/lib/data";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-primary" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={18}
          filled
          className={i < n ? "" : "opacity-20"}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const avg =
    Math.round(
      (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10
    ) / 10;

  return (
    <>
      <Section className="pb-0 lg:pb-0 lg:pt-12">
        <Container>
          <Eyebrow>Reviews</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl max-w-3xl">
            Real people. Real drinks. Real opinions.
          </h1>
          <div className="mt-8 flex items-center gap-6">
            <div>
              <p className="text-5xl font-semibold">{avg.toFixed(1)}</p>
              <Stars n={Math.round(avg)} />
            </div>
            <div className="text-sm text-on-surface-variant">
              <p className="font-medium text-on-surface">2,300+ reviews</p>
              <p>across all locations</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="lg:pt-12">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <Card key={r.id} className="flex flex-col">
                <Icon name="format_quote" size={28} filled className="text-primary" />
                <Stars n={r.rating} />
                <p className="mt-4 text-sm text-on-surface">"{r.body}"</p>
                <div className="mt-auto flex items-center gap-3 pt-5">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-container text-sm font-medium text-on-primary-container">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{r.name}</p>
                    <p className="text-xs text-on-surface-variant">{r.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
