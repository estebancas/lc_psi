const PATHS: Record<"whatsapp" | "phone" | "email", readonly string[]> = {
  whatsapp: [
    // chat bubble
    "M8,10 L40,10 Q46,10 46,16 L46,32 Q46,38 40,38 L18,38 L10,46 L11,38 L8,38 Q2,38 2,32 L2,16 Q2,10 8,10 Z",
    // two small dots + a curved "talking" line, standing in for a handset
    "M14,24 C14,20 18,17 23,17 C28,17 32,20 32,24",
    "M14,24 C14,28 18,31 23,31",
    "M32,24 C32,28 29,30 26,31",
  ],
  phone: [
    "M14,4 C14,3 15,2 16,2 L20,2 C21,2 22,3 22,4 L24,14 C24,15 23,16 22,17 L19,19 C21,26 26,31 33,33 L35,30 C36,29 37,28 38,28 L48,30 C49,30 50,31 50,32 L50,36 C50,42 45,46 39,46 C22,46 8,32 8,15 C8,10 10,6 14,4 Z",
  ],
  email: [
    "M4,12 L44,12 Q48,12 48,16 L48,38 Q48,42 44,42 L4,42 Q0,42 0,38 L0,16 Q0,12 4,12 Z",
    "M2,15 L24,30 L46,15",
  ],
};

export default function ChannelMark({
  kind,
  className,
}: {
  kind: "whatsapp" | "phone" | "email";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 50 48"
      className={["ink-mark", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[kind].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
