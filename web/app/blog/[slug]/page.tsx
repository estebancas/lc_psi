import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { getPostBySlug, getPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format-date";
import { SITE_NAME, articleSeo, withSiteSuffix } from "@/lib/seo";
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

  if (!post) {
    // Pairs with the notFound() call in BlogPostContent below: without this,
    // a missing slug fell back to bare {} and inherited the root layout's
    // title/description, so a 404 page presented itself to search engines
    // (and social previews) as the homepage.
    return {
      title: "Publicación no encontrada",
      description: "La publicación que buscas no existe o fue eliminada.",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    ...articleSeo({
      path: `/blog/${post.slug}`,
      title: withSiteSuffix(post.title),
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authorName: SITE_NAME,
    }),
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
          {post.type === "articulo" ? "Artículo" : "Actualización"} ·{" "}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
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
