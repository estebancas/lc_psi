// JSON-LD builders for the site's structured data (issue #26). Each function
// takes already-fetched Sanity data (Profile / PostDetail) and returns a
// plain object — no schema-dts dependency: the shapes here are simple and
// one-way (written, never read back), and the unit tests in
// tests/unit/schema.test.ts assert exact keys more precisely than a
// generated schema.org type union would.
//
// Omission strategy: every optional field is added via an `if` guard
// mutating a plain object, never assigned `undefined` — the goal is to never
// emit an empty/partial node (e.g. a PostalAddress missing streetAddress, or
// an openingHoursSpecification entry with a missing "opens") until the real
// data exists in Sanity. See AGENTS.md — profile/post data comes from
// `{ next: { revalidate: 30 } }` fetches, not "use cache".
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import { urlForImage } from "@/lib/sanity/image";
import type { Profile } from "@/lib/profile";
import type { PostDetail } from "@/lib/posts";

const PERSON_ID = `${SITE_URL}/#persona`;
const BUSINESS_ID = `${SITE_URL}/#negocio`;
const WEBSITE_ID = `${SITE_URL}/#sitio`;

const DAY_NAME: Record<string, string> = {
  lunes: "Monday",
  martes: "Tuesday",
  miercoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sabado: "Saturday",
  domingo: "Sunday",
};

/** Builds the Psychologist (schema.org MedicalBusiness subtype) node for the practice. */
export function buildPsychologistSchema(profile: Profile): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "Psychologist",
    "@id": BUSINESS_ID,
    name: profile.name,
    url: SITE_URL,
    employee: { "@id": PERSON_ID },
  };

  if (profile.email) node.email = profile.email;
  if (profile.phone) node.telephone = profile.phone;
  if (profile.priceRange) node.priceRange = profile.priceRange;

  if (profile.address) {
    node.address = {
      "@type": "PostalAddress",
      streetAddress: profile.address.calle,
      addressLocality: profile.address.ciudad,
      addressRegion: profile.address.provincia,
      ...(profile.address.codigoPostal ? { postalCode: profile.address.codigoPostal } : {}),
      addressCountry: "CR",
    };
    node.areaServed = { "@type": "City", name: profile.address.ciudad };
  }

  if (profile.geo) {
    node.geo = {
      "@type": "GeoCoordinates",
      latitude: profile.geo.lat,
      longitude: profile.geo.lng,
    };
  }

  const openingHoursSpecification = (profile.openingHours ?? [])
    .filter((range) => range.dias?.length && range.horaInicio && range.horaFin)
    .map((range) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: range.dias.map((dia) => DAY_NAME[dia]).filter(Boolean),
      opens: range.horaInicio,
      closes: range.horaFin,
    }));
  if (openingHoursSpecification.length > 0) {
    node.openingHoursSpecification = openingHoursSpecification;
  }

  if (profile.socialLinks?.length) {
    node.sameAs = profile.socialLinks.map((link) => link.url);
  }

  return node;
}

/** Builds the Person node for the practicing psychologist. */
export function buildPersonSchema(profile: Profile): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    worksFor: { "@id": BUSINESS_ID },
  };

  if (profile.profession) node.jobTitle = profile.profession;
  if (profile.email) node.email = profile.email;
  if (profile.credentials) {
    node.memberOf = { "@type": "Organization", name: profile.credentials };
  }
  if (profile.licenseNumber) {
    node.hasCredential = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      identifier: profile.licenseNumber,
      ...(profile.credentials
        ? { recognizedBy: { "@type": "Organization", name: profile.credentials } }
        : {}),
    };
  }
  if (profile.socialLinks?.length) {
    node.sameAs = profile.socialLinks.map((link) => link.url);
  }

  return node;
}

export function buildWebsiteSchema(): Record<string, unknown> {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
  };
}

/** Homepage graph: Psychologist + Person + WebSite, cross-linked by @id. */
export function buildHomeJsonLd(profile: Profile): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [buildPsychologistSchema(profile), buildPersonSchema(profile), buildWebsiteSchema()],
  };
}

/** BlogPosting node for a single post, authored by the site's Person. */
export function buildBlogPostingSchema(post: PostDetail): Record<string, unknown> {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt,
    author: { "@id": PERSON_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };

  if (post.mainImage) {
    node.image = urlForImage(post.mainImage).width(1200).height(630).url();
  }

  return node;
}

export type BreadcrumbItem = { name: string; path: string };

/** BreadcrumbList node — pass the same `items` used to render the visible Breadcrumbs component, so they can never drift apart. */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
