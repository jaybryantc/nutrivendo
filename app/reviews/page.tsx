import { Container, Section, Eyebrow, Card } from "@/components/ui";
import { reviews } from "@/lib/data";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5 text-brand-500" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={i < n ? "h-4 w-4 fill-current" : "h-4 w-4 fill-current opacity-20"}
        >
          <path d="M10 1.5l2.6 5.5 6 .6-4.5 4.2 1.3 6L10 14.8 4.6 17.8l1.3-6L1.4 7.6l6-.6z" />
        </svg>
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
      <Section className="pb-0">
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
            <div className="text-sm text-muted">
              <p className="font-medium text-foreground">2,300+ reviews</p>
              <p>across all locations</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <Card key={r.id}>
                <Stars n={r.rating} />
                <p className="mt-4 text-sm text-foreground">"{r.body}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-medium text-brand-700">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted">{r.role}</p>
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
