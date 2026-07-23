import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import BlogPreview from "./components/BlogPreview";
import Contact from "./components/Contact";

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
