import type { Metadata } from "next";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import BlogPreview from "./components/BlogPreview";
import Contact from "./components/Contact";

// Title/description/openGraph inherit the root layout's — this route's own
// metadata is just the canonical (root layout's openGraph.url already
// points at "/", but alternates.canonical isn't set at the layout level
// since it isn't inherited the way title/openGraph are meant to be reused
// as-is across different routes).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <BlogPreview />
      <Contact />
    </>
  );
}
