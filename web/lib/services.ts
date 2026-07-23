import { defineQuery } from "next-sanity";
import { client } from "@/lib/sanity/client";

export type Service = {
  slug: string;
  title: string;
  description: string;
};

const SERVICES_QUERY = defineQuery(
  `*[_type == "service"] | order(order asc){ "slug": slug.current, title, description }`
);

const options = { next: { revalidate: 30 } };

export async function getServices(): Promise<Service[]> {
  return client.fetch<Service[]>(SERVICES_QUERY, {}, options);
}
