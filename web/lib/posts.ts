import { defineQuery, type PortableTextBlock } from "next-sanity";
import { client } from "@/lib/sanity/client";

export type PostType = "articulo" | "actualizacion";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO date
  type: PostType;
};

export type PostDetail = Post & {
  body: PortableTextBlock[];
};

const POSTS_QUERY = defineQuery(
  `*[_type == "post"] | order(publishedAt desc){ "slug": slug.current, title, excerpt, type, "date": publishedAt }`
);

const POST_BY_SLUG_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]{ "slug": slug.current, title, excerpt, type, "date": publishedAt, body }`
);

const options = { next: { revalidate: 30 } };

export async function getPosts(): Promise<Post[]> {
  return client.fetch<Post[]>(POSTS_QUERY, {}, options);
}

export async function getLatestPosts(limit: number): Promise<Post[]> {
  const posts = await getPosts();
  return posts.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  return client.fetch<PostDetail | null>(POST_BY_SLUG_QUERY, { slug }, options);
}
