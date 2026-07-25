import Link from "next/link";
import { getLatestPosts } from "@/lib/posts";

export default async function BlogPreview() {
  const posts = await getLatestPosts(3);

  return (
    <section
      id="blog-preview"
      aria-labelledby="blog-preview-heading"
      className="mx-auto max-w-5xl scroll-mt-20 px-6 py-20"
    >
      <div className="flex items-baseline justify-between">
        <h2 id="blog-preview-heading" className="text-2xl font-semibold">
          Blog
        </h2>
        <Link href="/blog" className="text-sm hover:opacity-70">
          Ver todas las publicaciones →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-xl border border-black/10 p-6 transition-colors hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
          >
            <p className="text-xs uppercase tracking-wide opacity-50">
              {post.type === "articulo" ? "Artículo" : "Actualización"}
            </p>
            <h3 className="mt-2 font-medium">{post.title}</h3>
            <p className="mt-2 text-sm opacity-70">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
