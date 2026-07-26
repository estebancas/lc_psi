type MarkPaths = readonly string[];

// One small ink drawing per service. Keyed by the real Sanity slugs first;
// any slug we don't recognize (or a service with no slug at all) falls back
// to a generic mark chosen by grid position, so an arbitrary number of
// Sanity-authored services always renders a drawing, never a blank tile.
const BY_SLUG: Record<string, MarkPaths> = {
  "terapia-individual": [
    // armchair
    "M18,55 Q18,48 25,48 L53,48 Q60,48 60,55 L60,72 Q60,78 53,78 L25,78 Q18,78 18,72 Z",
    "M21,48 Q17,26 32,22 Q42,19 52,23 Q63,27 58,48",
    "M18,55 Q10,55 10,64 Q11,72 19,71",
    "M60,55 Q68,55 68,64 Q67,72 59,71",
    // small plant, set apart from the chair so the two read as separate objects
    "M74,78 L90,78 L87,92 L77,92 Z",
    "M82,78 C80,66 76,58 70,50",
    "M82,78 C82,64 83,54 85,44",
    "M82,78 C85,66 90,58 94,52",
  ],
  "terapia-de-pareja": [
    // two chairs, standing on legs (so they read as furniture, not a face),
    // backrests leaning apart — facing each other in conversation
    "M8,50 Q8,44 14,44 L30,44 Q36,44 36,50 L36,62 Q36,67 30,67 L14,67 Q8,67 8,62 Z",
    "M10,44 Q7,28 20,25",
    "M14,67 L11,75",
    "M30,67 L33,75",
    "M60,50 Q60,44 66,44 L82,44 Q88,44 88,50 L88,62 Q88,67 82,67 L66,67 Q60,67 60,62 Z",
    "M86,44 Q89,28 76,25",
    "M66,67 L63,75",
    "M82,67 L85,75",
    // a beat of dialogue between them
    "M41,54 L46,54",
    "M50,54 L55,54",
  ],
  "terapia-para-adolescentes": [
    // backpack
    "M28,40 Q28,30 48,30 Q68,30 68,40 L68,78 Q68,86 58,86 L38,86 Q28,86 28,78 Z",
    "M38,30 Q38,18 48,18 Q58,18 58,30",
    "M40,50 L56,50 L56,64 L40,64 Z",
    // headphone arc over the top
    "M22,52 Q22,20 48,18 Q74,20 74,52",
    "M20,48 L24,48 L24,60 L20,60 Z",
    "M72,48 L76,48 L76,60 L72,60 Z",
  ],
  "terapia-en-linea": [
    // laptop
    "M18,66 L78,66 L72,50 L24,50 Z",
    "M24,50 L24,24 L72,24 L72,50",
    "M14,66 L82,66 L78,74 L18,74 Z",
    // mug with steam
    "M62,36 C62,30 68,27 74,27 C78,27 82,30 82,35 L81,44 C80,49 75,52 70,52 C65,52 61,49 60,44 Z",
    "M68,22 C66,17 71,15 69,10",
  ],
};

// Rotation used when a service has no recognized slug (or none at all).
const GENERIC: readonly MarkPaths[] = [
  // steaming cup
  [
    "M28,42 C28,35 35,31 42,31 C49,31 56,35 56,42 L54,58 C53,65 47,69 41,69 C35,69 29,65 28,58 Z",
    "M56,40 C67,40 67,56 56,56",
    "M36,26 C34,19 40,17 38,10",
    "M48,26 C46,19 52,17 50,10",
  ],
  // head with a sprouting branch — quiet mind, growth
  [
    "M30,50 C30,32 44,20 58,22 C72,24 78,38 74,52 C71,62 62,70 56,78 L44,78 C41,70 34,64 32,58 Z",
    "M50,22 C48,14 54,10 51,3",
    "M51,3 C55,3 57,7 56,10",
    "M51,3 C47,4 45,8 46,11",
  ],
];

function markFor(slug: string | undefined, index: number): MarkPaths {
  if (slug && BY_SLUG[slug]) return BY_SLUG[slug];
  const genericIndex = index % (Object.keys(BY_SLUG).length + GENERIC.length);
  const bySlugValues = Object.values(BY_SLUG);
  const all = [...bySlugValues, ...GENERIC];
  return all[genericIndex];
}

export default function ServiceMark({
  slug,
  index,
  className,
}: {
  slug?: string;
  index: number;
  className?: string;
}) {
  const paths = markFor(slug, index);

  return (
    <svg
      viewBox="0 0 96 96"
      className={["ink-mark", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
