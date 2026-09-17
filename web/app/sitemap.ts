import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";

// Next caches this route the same way it caches any other fetch-backed
// route: getPosts() carries { next: { revalidate: 30 } } (see web/AGENTS.md
// on why Sanity content streams with a short window instead of "use
// cache"), so a newly published post shows up here within ~30s, same as
// everywhere else it's read.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/agendar`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    // publishedAt, not a real last-edit timestamp — Post (from getPosts())
    // doesn't carry _updatedAt today. Good enough as a freshness signal for
    // a site this size; revisit if editors start meaningfully revising
    // published posts.
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
