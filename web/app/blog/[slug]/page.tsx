import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import { getPostBySlug, getPosts } from "@/lib/posts";

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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-xs uppercase tracking-wide opacity-50">
        {post.type === "articulo" ? "Artículo" : "Actualización"} · {post.date}
      </p>
      <h1 className="mt-2 text-3xl font-semibold">{post.title}</h1>
      <div className="prose mt-6 max-w-none leading-relaxed opacity-80">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}
