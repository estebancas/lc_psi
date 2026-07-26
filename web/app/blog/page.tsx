import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import PostListSkeleton from "@/app/components/PostListSkeleton";
import PostTypeMark from "@/app/components/ink/PostTypeMark";

export const metadata: Metadata = {
  title: "Blog | Laura Castro Cordero",
  description: "Artículos y actualizaciones sobre salud mental y bienestar.",
};

async function PostGrid() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <p className="max-w-md text-ink-60">
        Aún no hay publicaciones. Pronto compartiré artículos y novedades por aquí.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className={`tile-${index % 3} flex flex-col gap-3 p-6 transition-transform hover:-translate-y-1`}
        >
          <div className="flex items-center gap-2">
            <PostTypeMark type={post.type} className="h-5 w-5" />
            <p className="eyebrow">
              {post.type === "articulo" ? "Artículo" : "Actualización"} · {post.date}
            </p>
          </div>
          <h2 className="font-display text-lg">{post.title}</h2>
          <p className="text-sm text-ink-60">{post.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-[var(--space-section)]">
      <h1 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase">Blog</h1>

      <div className="mt-10">
        <Suspense fallback={<PostListSkeleton />}>
          <PostGrid />
        </Suspense>
      </div>
    </section>
  );
}
