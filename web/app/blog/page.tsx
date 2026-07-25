import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import PostListSkeleton from "@/app/components/PostListSkeleton";

export const metadata: Metadata = {
  title: "Blog | Laura Castro Cordero",
  description: "Artículos y actualizaciones sobre salud mental y bienestar.",
};

async function PostGrid() {
  const posts = await getPosts();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="rounded-xl border border-black/10 p-6 transition-colors hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
        >
          <p className="text-xs uppercase tracking-wide opacity-50">
            {post.type === "articulo" ? "Artículo" : "Actualización"} ·{" "}
            {post.date}
          </p>
          <h2 className="mt-2 font-medium">{post.title}</h2>
          <p className="mt-2 text-sm opacity-70">{post.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-2xl font-semibold">Blog</h1>

      <div className="mt-8">
        <Suspense fallback={<PostListSkeleton />}>
          <PostGrid />
        </Suspense>
      </div>
    </section>
  );
}
