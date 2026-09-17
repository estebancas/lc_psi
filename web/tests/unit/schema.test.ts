import { describe, expect, it } from "vitest";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildHomeJsonLd,
  buildPersonSchema,
  buildPsychologistSchema,
  buildWebsiteSchema,
} from "@/lib/schema";
import { SITE_URL } from "@/lib/seo";
import type { Profile } from "@/lib/profile";
import type { PostDetail } from "@/lib/posts";

const MINIMAL_PROFILE: Profile = {
  name: "Laura Castro Cordero",
  heroTitle: "Terapia psicológica en Nicoya",
};

const FULL_PROFILE: Profile = {
  name: "Laura Castro Cordero",
  profession: "Psicóloga",
  heroTitle: "Terapia psicológica en Nicoya",
  email: "lauracastropsi25@gmail.com",
  phone: "+506 7156 1628",
  priceRange: "$$",
  address: {
    calle: "Residencial Brisas Del Cerro, calle 12",
    ciudad: "Nicoya",
    provincia: "Guanacaste",
    pais: "Costa Rica",
  },
  geo: { lat: 10.137282, lng: -85.458089 },
  openingHours: [{ dias: ["lunes", "martes"], horaInicio: "08:00", horaFin: "17:00" }],
  socialLinks: [{ plataforma: "instagram", url: "https://instagram.com/psicologalauracastro" }],
  licenseNumber: "1234",
  credentials: "Colegio de Profesionales en Psicología de Costa Rica",
};

describe("buildPsychologistSchema", () => {
  it("given a full profile, maps address/geo into schema.org PostalAddress/GeoCoordinates", () => {
    const result = buildPsychologistSchema(FULL_PROFILE);

    expect(result["@type"]).toBe("Psychologist");
    expect(result.name).toBe("Laura Castro Cordero");
    expect(result.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: "Residencial Brisas Del Cerro, calle 12",
      addressLocality: "Nicoya",
      addressRegion: "Guanacaste",
      addressCountry: "CR",
    });
    expect(result.geo).toEqual({ "@type": "GeoCoordinates", latitude: 10.137282, longitude: -85.458089 });
    expect(result.areaServed).toEqual({ "@type": "City", name: "Nicoya" });
    expect(result.priceRange).toBe("$$");
    expect(result.sameAs).toEqual(["https://instagram.com/psicologalauracastro"]);
  });

  it("includes postalCode only when codigoPostal is provided", () => {
    const withPostal = buildPsychologistSchema({
      ...FULL_PROFILE,
      address: { ...FULL_PROFILE.address!, codigoPostal: "50101" },
    });
    expect((withPostal.address as Record<string, unknown>).postalCode).toBe("50101");

    const withoutPostal = buildPsychologistSchema(FULL_PROFILE);
    expect(withoutPostal.address).not.toHaveProperty("postalCode");
  });

  it("maps valid opening-hours ranges to OpeningHoursSpecification with English day names", () => {
    const result = buildPsychologistSchema(FULL_PROFILE);
    expect(result.openingHoursSpecification).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday"],
        opens: "08:00",
        closes: "17:00",
      },
    ]);
  });

  it("filters out an opening-hours range with missing start/end times, without emitting an empty entry", () => {
    const result = buildPsychologistSchema({
      ...FULL_PROFILE,
      openingHours: [
        { dias: ["lunes"], horaInicio: "08:00", horaFin: "17:00" },
        { dias: ["sabado"] }, // no times — should be dropped
      ],
    });
    expect(result.openingHoursSpecification).toHaveLength(1);
  });

  it("omits openingHoursSpecification entirely when every range is invalid, rather than emitting an empty array", () => {
    const result = buildPsychologistSchema({
      ...FULL_PROFILE,
      openingHours: [{ dias: ["sabado"] }],
    });
    expect(result).not.toHaveProperty("openingHoursSpecification");
  });

  it("given a minimal profile (today's production reality), omits every optional field entirely rather than emitting empty/partial nodes", () => {
    const result = buildPsychologistSchema(MINIMAL_PROFILE);

    expect(result).not.toHaveProperty("address");
    expect(result).not.toHaveProperty("geo");
    expect(result).not.toHaveProperty("areaServed");
    expect(result).not.toHaveProperty("openingHoursSpecification");
    expect(result).not.toHaveProperty("sameAs");
    expect(result).not.toHaveProperty("priceRange");
    expect(result).not.toHaveProperty("email");
    expect(result).not.toHaveProperty("telephone");

    // Required fields are still present
    expect(result["@type"]).toBe("Psychologist");
    expect(result.name).toBe("Laura Castro Cordero");
    expect(result.url).toBe(SITE_URL);
  });
});

describe("buildPersonSchema", () => {
  it("includes hasCredential and memberOf when both licenseNumber and credentials are present", () => {
    const result = buildPersonSchema(FULL_PROFILE);
    expect(result.memberOf).toEqual({
      "@type": "Organization",
      name: "Colegio de Profesionales en Psicología de Costa Rica",
    });
    expect(result.hasCredential).toEqual({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      identifier: "1234",
      recognizedBy: {
        "@type": "Organization",
        name: "Colegio de Profesionales en Psicología de Costa Rica",
      },
    });
  });

  it("includes hasCredential without a nested recognizedBy when licenseNumber is present but credentials is not", () => {
    const result = buildPersonSchema({
      ...FULL_PROFILE,
      credentials: undefined,
    });
    expect(result.hasCredential).toEqual({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      identifier: "1234",
    });
    expect(result).not.toHaveProperty("memberOf");
  });

  it("omits hasCredential and memberOf entirely when neither is provided", () => {
    const result = buildPersonSchema(MINIMAL_PROFILE);
    expect(result).not.toHaveProperty("hasCredential");
    expect(result).not.toHaveProperty("memberOf");
    expect(result).not.toHaveProperty("sameAs");
  });
});

describe("buildWebsiteSchema", () => {
  it("returns a WebSite node with the canonical site URL", () => {
    expect(buildWebsiteSchema()).toMatchObject({ "@type": "WebSite", url: SITE_URL });
  });
});

describe("buildHomeJsonLd", () => {
  it("combines Psychologist, Person, and WebSite into one @graph, cross-linked by @id", () => {
    const result = buildHomeJsonLd(FULL_PROFILE);
    expect(result["@context"]).toBe("https://schema.org");
    const graph = result["@graph"] as Record<string, unknown>[];
    expect(graph).toHaveLength(3);

    const psychologist = graph.find((n) => n["@type"] === "Psychologist")!;
    const person = graph.find((n) => n["@type"] === "Person")!;
    expect(psychologist.employee).toEqual({ "@id": person["@id"] });
    expect(person.worksFor).toEqual({ "@id": psychologist["@id"] });
  });
});

describe("buildBlogPostingSchema", () => {
  const BASE_POST: PostDetail = {
    slug: "mi-post",
    title: "Mi post",
    excerpt: "Resumen del post.",
    type: "articulo",
    date: "2026-07-15T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
    body: [],
  };

  it("builds headline/dates/author/mainEntityOfPage from the post", () => {
    const result = buildBlogPostingSchema(BASE_POST);
    expect(result).toMatchObject({
      "@type": "BlogPosting",
      headline: "Mi post",
      description: "Resumen del post.",
      datePublished: "2026-07-15T00:00:00Z",
      dateModified: "2026-08-01T00:00:00Z",
      url: `${SITE_URL}/blog/mi-post`,
    });
    expect(result.author).toEqual({ "@id": `${SITE_URL}/#persona` });
    expect(result.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/mi-post`,
    });
  });

  it("omits image when the post has no mainImage", () => {
    const result = buildBlogPostingSchema(BASE_POST);
    expect(result).not.toHaveProperty("image");
  });

  it("includes an absolute Sanity CDN image URL when mainImage is present", () => {
    const result = buildBlogPostingSchema({
      ...BASE_POST,
      mainImage: {
        asset: {
          _ref: "image-abc123-1200x630-png",
          _type: "reference",
        },
      },
    });
    expect(typeof result.image).toBe("string");
    expect(result.image as string).toMatch(/^https:\/\//);
  });
});

describe("buildBreadcrumbSchema", () => {
  it("builds a 1-indexed ItemList with absolute URLs", () => {
    const result = buildBreadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: "Mi post", path: "/blog/mi-post" },
    ]);

    expect(result["@type"]).toBe("BreadcrumbList");
    expect(result.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: "Mi post", item: `${SITE_URL}/blog/mi-post` },
    ]);
  });
});

describe("JSON-LD XSS safety", () => {
  it("escaping '<' to its unicode equivalent (the JsonLd component's approach) prevents a </script> breakout", () => {
    const malicious: Profile = {
      ...MINIMAL_PROFILE,
      name: 'Laura</script><script>alert(1)</script>',
    };
    const serialized = JSON.stringify(buildPsychologistSchema(malicious)).replace(/</g, "\\u003c");
    expect(serialized).not.toContain("</script");
    expect(serialized).not.toContain("<script");
  });
});
