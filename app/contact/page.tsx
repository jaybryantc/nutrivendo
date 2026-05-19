"use client";

import { useState } from "react";
import { Container, Section, Eyebrow, Card, Button, Input, Textarea, Label } from "@/components/ui";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Section className="pb-0">
        <Container>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl max-w-3xl">
            Talk to a human at NutriVendo.
          </h1>
          <p className="mt-4 text-muted max-w-2xl">
            Partnerships, machine requests, press, or feedback — we read every
            message and reply within one business day.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Card>
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-brand-700">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">
                    Message sent. Thanks!
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    We'll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required placeholder="Jane Sipper" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <select
                      id="topic"
                      name="topic"
                      className="w-full h-11 rounded-xl border border-border bg-white px-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    >
                      <option>General feedback</option>
                      <option>Partner with us</option>
                      <option>Request a machine</option>
                      <option>Press inquiry</option>
                      <option>Something's broken</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" rows={5} required placeholder="Tell us what's on your mind..." />
                  </div>
                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Send message
                  </Button>
                </form>
              )}
            </Card>

            <div className="space-y-4">
              <Card>
                <h3 className="font-semibold">Email</h3>
                <p className="mt-2 text-sm text-muted">hi@nutrivendo.example</p>
                <p className="text-sm text-muted">press@nutrivendo.example</p>
              </Card>
              <Card>
                <h3 className="font-semibold">Headquarters</h3>
                <p className="mt-2 text-sm text-muted">
                  340 King Street West
                  <br />
                  Toronto, ON M5V 1J9
                </p>
              </Card>
              <Card>
                <h3 className="font-semibold">Support hours</h3>
                <p className="mt-2 text-sm text-muted">Mon–Fri, 8am–6pm ET</p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
