import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import { getCurrentUser } from "@/lib/auth";
import SkipLink from "@/components/skip-link";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
      className={`${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SkipLink />
        <CartProvider>
          <Header user={user} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer user={user} />
        </CartProvider>
      </body>
    </html>
  );
}
