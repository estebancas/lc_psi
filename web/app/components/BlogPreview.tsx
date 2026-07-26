import Link from "next/link";
import { getLatestPosts } from "@/lib/posts";
import PostTypeMark from "./ink/PostTypeMark";

export default async function BlogPreview() {
  const posts = await getLatestPosts(3);

  return (
    <section
      id="blog-preview"
      aria-labelledby="blog-preview-heading"
      className="ink-rule mx-auto max-w-5xl scroll-mt-20 px-6 py-[var(--space-section)]"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="blog-preview-heading"
          className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase"
        >
          Blog
        </h2>
        <Link href="/blog" className="ink-underline text-sm">
          Ver todas las publicaciones
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`tile-${index % 3} flex flex-col gap-3 p-6 transition-transform hover:-translate-y-1`}
            >
              <div className="flex items-center gap-2">
                <PostTypeMark type={post.type} className="h-5 w-5" />
                <p className="eyebrow">
                  {post.type === "articulo" ? "Artículo" : "Actualización"}
                </p>
              </div>
              <h3 className="font-display text-lg">{post.title}</h3>
              <p className="text-sm text-ink-60">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-8 max-w-md text-ink-60">
          Aún no hay publicaciones. Pronto compartiré artículos y novedades por aquí.
        </p>
      )}
    </section>
  );
}
