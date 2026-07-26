import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { getPostBySlug, getPosts } from "@/lib/posts";
import PostSkeleton from "@/app/components/PostSkeleton";
import PostTypeMark from "@/app/components/ink/PostTypeMark";
import { portableTextComponents } from "@/app/components/portable-text";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: `${post.title} | Laura Castro Cordero`,
    description: post.excerpt,
  };
}

async function BlogPostContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <>
      <div className="flex items-center gap-2">
        <PostTypeMark type={post.type} className="h-5 w-5" />
        <p className="eyebrow">
          {post.type === "articulo" ? "Artículo" : "Actualización"} · {post.date}
        </p>
      </div>
      <h1 className="font-display mt-3 text-[clamp(2rem,5vw,3rem)] leading-[1.05]">
        {post.title}
      </h1>
      <div className="mt-8 max-w-none">
        <PortableText value={post.body} components={portableTextComponents} />
      </div>
    </>
  );
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-[var(--space-section)]">
      <Suspense fallback={<PostSkeleton />}>
        <BlogPostContent params={params} />
      </Suspense>
    </article>
  );
}
