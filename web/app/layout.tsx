import { Suspense } from "react";
import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import Analytics from "./components/Analytics";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Laura Castro Cordero | Psicóloga",
    // Applied to every route's `title` string automatically — routes below
    // now pass just the page-specific part (e.g. "Blog") instead of
    // repeating this suffix. Not applied to openGraph.title, which Next
    // resolves separately — see withSiteSuffix() in lib/seo.ts.
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Terapia psicológica individual, de pareja y para adolescentes con Laura Castro Cordero.",
  openGraph: {
    title: "Laura Castro Cordero | Psicóloga",
    description:
      "Terapia psicológica individual, de pareja y para adolescentes con Laura Castro Cordero.",
    url: "/",
    siteName: SITE_NAME,
    locale: "es_CR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CR"
      className={`${fraunces.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
