import { defineQuery, type PortableTextBlock } from "next-sanity";
import { client } from "@/lib/sanity/client";

export type Profile = {
  name: string;
  profession?: string;
  heroTitle: string;
  heroSubtitle?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heroPhoto?: any;
  aboutTitle?: string;
  bio?: PortableTextBlock[];
  email?: string;
  phone?: string;
  whatsapp?: string;
  footerTagline?: string;
};

const PROFILE_QUERY = defineQuery(
  `*[_type == "profile"][0]{
    name,
    profession,
    heroTitle,
    heroSubtitle,
    heroPhoto,
    aboutTitle,
    bio,
    email,
    phone,
    whatsapp,
    footerTagline
  }`
);

const options = { next: { revalidate: 30 } };

export async function getProfile(): Promise<Profile | null> {
  return client.fetch<Profile | null>(PROFILE_QUERY, {}, options);
}
