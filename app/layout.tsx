import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import Footer from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import { getCurrentUser } from "@/lib/auth";
import SkipLink from "@/components/skip-link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nutrivendo.example"),
  title: {
    default: "NutriVendo",
    template: "%s | NutriVendo",
  },
  description:
    "Your on-the-go source for delicious and healthy smoothies, shakes, and juices, conveniently available through smart vending machines.",
  openGraph: {
    title: "NutriVendo",
    description:
      "Your on-the-go source for delicious and healthy smoothies, shakes, and juices, conveniently available through smart vending machines.",
    url: "https://nutrivendo.example",
    siteName: "NutriVendo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriVendo",
    description:
      "Your on-the-go source for delicious and healthy smoothies, shakes, and juices, conveniently available through smart vending machines.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- icon font, loaded once in the root layout */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <SkipLink />
        <CartProvider>
          <Header user={user} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer user={user} />
          <BottomNav user={user} />
        </CartProvider>
      </body>
    </html>
  );
}
