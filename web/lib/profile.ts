import { defineQuery, type PortableTextBlock } from "next-sanity";
import { client } from "@/lib/sanity/client";

export type Address = {
  calle: string;
  ciudad: string;
  provincia: string;
  codigoPostal?: string;
  pais: string;
};

export type Geo = {
  lat: number;
  lng: number;
};

export type OpeningHoursRange = {
  dias: string[];
  horaInicio?: string;
  horaFin?: string;
};

export type SocialLink = {
  plataforma: string;
  url: string;
};

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
  address?: Address;
  geo?: Geo;
  openingHours?: OpeningHoursRange[];
  socialLinks?: SocialLink[];
  licenseNumber?: string;
  credentials?: string;
  priceRange?: string;
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
    footerTagline,
    address,
    geo,
    openingHours,
    socialLinks,
    licenseNumber,
    credentials,
    priceRange
  }`
);

const options = { next: { revalidate: 30 } };

export async function getProfile(): Promise<Profile | null> {
  return client.fetch<Profile | null>(PROFILE_QUERY, {}, options);
}
