// Fixture data served by the e2e stub server (tests/e2e/stub/server.mjs)
// in place of the real Sanity API. Field selections must mirror the GROQ
// projections in lib/posts.ts, lib/services.ts, lib/profile.ts exactly.
//
// All copy is Spanish — this is user-facing text per AGENTS.md, even in test
// fixtures, since assertions match against it.

export const profile = {
  name: "Laura Castro Cordero",
  profession: "Psicóloga clínica",
  heroTitle: "Terapia psicológica con un enfoque humano",
  heroSubtitle:
    "Acompañamiento profesional para tu bienestar emocional. Sesiones individuales, de pareja y para adolescentes.",
  // Deliberately omit heroPhoto: Hero.tsx falls back to a placeholder when
  // it's absent, which keeps the browser from ever requesting cdn.sanity.io.
  aboutTitle: "Sobre mí",
  bio: [
    {
      _type: "block",
      _key: "bio1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "bio1span",
          text: "Acompaño procesos de bienestar emocional desde hace más de diez años.",
        },
      ],
    },
  ],
  email: "contacto@lauracastro.mx",
  phone: "+52 55 0000 0000",
  whatsapp: "5210000000000",
  footerTagline: "Terapia con un enfoque humano.",
};

export const services = [
  {
    slug: "terapia-individual",
    title: "Terapia individual",
    description: [
      {
        _type: "block",
        _key: "ti-intro",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "ti-introspan",
            marks: ["strong"],
            text: "Puede ser adecuada para:",
          },
        ],
      },
      {
        _type: "block",
        _key: "ti-item1",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "ti-item1span",
            text: "Orientación ante una situación específica",
          },
        ],
      },
      {
        _type: "block",
        _key: "ti-item2",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: "ti-item2span",
            text: "Toma de decisiones importantes",
          },
        ],
      },
    ],
  },
  {
    slug: "terapia-de-pareja",
    title: "Terapia de pareja",
    description: [
      {
        _type: "block",
        _key: "tp-body1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "tp-body1span",
            text: "Acompañamiento para fortalecer la comunicación en la relación.",
          },
        ],
      },
    ],
  },
  {
    slug: "terapia-para-adolescentes",
    title: "Terapia para adolescentes",
    description: [
      {
        _type: "block",
        _key: "ta-body1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "ta-body1span",
            text: "Espacio seguro de escucha para adolescentes.",
          },
        ],
      },
    ],
  },
];

export const posts = [
  {
    slug: "ansiedad-como-reconocerla",
    title: "Ansiedad: cómo reconocerla",
    excerpt: "Señales tempranas de la ansiedad y cómo pedir ayuda a tiempo.",
    type: "articulo",
    date: "2026-07-20",
  },
  {
    slug: "nuevo-horario-de-consulta",
    title: "Nuevo horario de consulta",
    excerpt: "A partir de agosto habrá nuevos horarios disponibles.",
    type: "actualizacion",
    date: "2026-07-15",
  },
  {
    slug: "terapia-de-pareja-primeros-pasos",
    title: "Terapia de pareja: primeros pasos",
    excerpt: "Qué esperar de las primeras sesiones en pareja.",
    type: "articulo",
    date: "2026-07-10",
  },
];

export const postsBySlug = Object.fromEntries(
  posts.map((post) => [
    post.slug,
    {
      ...post,
      body: [
        {
          _type: "block",
          _key: `${post.slug}-body1`,
          style: "normal",
          children: [
            {
              _type: "span",
              _key: `${post.slug}-body1span`,
              text: `Contenido completo de "${post.title}".`,
            },
          ],
        },
      ],
    },
  ]),
);
