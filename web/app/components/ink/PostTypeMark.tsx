const PATHS: Record<"articulo" | "actualizacion", readonly string[]> = {
  articulo: [
    // open book
    "M20,6 C14,3 6,3 2,5 L2,30 C6,28 14,28 20,31 Z",
    "M20,6 C26,3 34,3 38,5 L38,30 C34,28 26,28 20,31 Z",
    "M6,11 L15,13",
    "M6,16 L15,18",
    "M6,21 L14,23",
    "M25,13 L34,11",
    "M25,18 L34,16",
    "M26,23 L34,21",
  ],
  actualizacion: [
    // sprout — a new shoot
    "M18,34 L18,16",
    "M18,20 C18,10 8,8 4,2 C4,12 8,20 18,20",
    "M18,16 C18,8 28,6 32,0 C33,10 28,18 18,16",
  ],
};

export default function PostTypeMark({
  type,
  className,
}: {
  type: "articulo" | "actualizacion";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 38 34"
      className={["ink-mark", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[type].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
