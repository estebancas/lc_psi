import type { Metadata } from "next";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import BlogPreview from "./components/BlogPreview";
import Contact from "./components/Contact";
import JsonLd from "./components/JsonLd";
import { getProfile } from "@/lib/profile";
import { buildHomeJsonLd } from "@/lib/schema";

// Title/description/openGraph inherit the root layout's — this route's own
// metadata is just the canonical (root layout's openGraph.url already
// points at "/", but alternates.canonical isn't set at the layout level
// since it isn't inherited the way title/openGraph are meant to be reused
// as-is across different routes).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  // getProfile() is already called independently by Hero/About/Contact below
  // — this call dedupes against the same fetch (identical query/params/
  // options) within one render pass, at no extra network cost. It's a
  // `{ next: { revalidate: 30 } }`-tagged fetch, not bare sync IO, so it
  // needs no Suspense boundary to stay prerenderable (same pattern as
  // Footer.tsx awaiting getProfile() at layout scope — see web/AGENTS.md).
  const profile = await getProfile();

  return (
    <>
      {profile && <JsonLd data={buildHomeJsonLd(profile)} />}
      <Hero />
      <About />
      <Services />
      <BlogPreview />
      <Contact />
    </>
  );
}
