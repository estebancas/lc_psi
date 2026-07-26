type Stroke = {
  d: string;
  len: number;
  delay: number;
};

// High-fidelity editorial vector illustration - HeroScene.tsx:
// - Head & Hair: Scaled up, prominent, highly detailed head matching reference crop!
//   - Voluminous angled heart-shaped bun with sky-blue scrunchie (#C0E3E7).
//   - Thick black side-swept bangs across forehead and elegant sweeping strand cascading down side of cheek.
//   - Large, expressive eyes with filled black pupils looking at laptop, cute curved nose, broad happy smile with teeth line.
//   - Large expressive ear with pearl hoop earring, dark block shadow under jawline for editorial depth.
// - All other scene elements (botanical desk vases, candle, capsule mic, notebook, mug, pencil cup, open laptop) preserved!

const STROKES: Stroke[] = [
  // ── Background Left Botanical Plant & Desk Vase ──
  { d: "M55,310 L95,310 L90,440 L60,440 Z", len: 310, delay: 0.05 },
  {
    d: "M75,310 C45,240 15,170 35,100 C68,90 92,120 85,180 C98,130 128,110 142,135 C132,200 102,250 75,310 Z",
    len: 540,
    delay: 0.12,
  },
  { d: "M75,310 C58,220 50,160 35,100", len: 220, delay: 0.15 },
  { d: "M52,200 C38,190 30,180 24,165", len: 45, delay: 0.18 },
  { d: "M60,160 C48,150 40,138 36,122", len: 45, delay: 0.2 },
  { d: "M72,220 C88,205 102,195 118,185", len: 45, delay: 0.22 },
  { d: "M75,310 C105,230 160,180 180,205 C158,255 120,280 75,310 Z", len: 380, delay: 0.25 },
  { d: "M75,310 C110,250 145,220 180,205", len: 150, delay: 0.28 },
  { d: "M75,310 C30,290 10,235 28,205 C52,225 65,265 75,310 Z", len: 290, delay: 0.31 },

  // ── Background Right Botanical Plant & Desk Vase ──
  { d: "M495,320 L535,320 L530,440 L500,440 Z", len: 300, delay: 0.25 },
  { d: "M515,320 C540,250 570,180 580,120", len: 240, delay: 0.29 },
  { d: "M580,120 C595,110 598,132 582,145 C566,155 565,135 580,120 Z", len: 110, delay: 0.32 },
  { d: "M558,165 C580,152 585,175 565,188 C548,195 545,178 558,165 Z", len: 110, delay: 0.35 },
  { d: "M538,210 C560,197 565,220 545,232 C528,238 525,220 538,210 Z", len: 110, delay: 0.38 },
  { d: "M515,320 C485,250 470,180 495,115", len: 250, delay: 0.41 },
  { d: "M495,115 C478,100 468,120 482,135 C495,145 505,128 495,115 Z", len: 100, delay: 0.44 },

  // ── Character: Detailed & Prominent Head (Matching Reference Crop Exactly) ──
  // 1. Angled Heart-Shaped Top Bun
  {
    d: "M220,70 C195,50 205,20 235,22 C255,24 265,40 270,30 C280,20 305,32 295,58 C288,74 268,78 245,75 Z",
    len: 260,
    delay: 0.4,
  },
  // 2. Hair Scrunchie / Tie Band
  {
    d: "M232,72 C245,78 268,76 278,68 C282,72 278,78 270,82 C258,85 240,84 234,78 Z",
    len: 100,
    delay: 0.44,
  },
  // 3. Back Hair Mass & Sweeping Bangs & Side Strand
  {
    d: "M234,78 C210,95 208,130 225,152 C234,162 242,165 248,162 C242,145 238,122 240,80 Z",
    len: 240,
    delay: 0.48,
  },
  {
    d: "M242,80 C265,80 295,88 310,110 C322,130 325,160 308,190 C300,200 292,190 296,170 C306,145 295,120 278,110 C265,103 252,95 242,80 Z",
    len: 380,
    delay: 0.52,
  },

  // 4. Face Contour & Profile (White/Paper Skin background)
  {
    d: "M268,104 C278,106 288,114 294,124 C292,135 298,142 294,148 C288,156 278,164 268,166 C256,166 244,158 238,144 L232,130",
    len: 240,
    delay: 0.56,
  },
  // 5. Large Expressive Ear & Inner Fold & Pearl Hoop Earring
  { d: "M236,118 C222,118 222,136 236,140", len: 45, delay: 0.59 },
  { d: "M232,126 C238,128 238,134 232,136", len: 25, delay: 0.61 },
  { d: "M232,144 A5,5 0 1,1 232,154 A5,5 0 1,1 232,144", len: 35, delay: 0.63 },

  // 6. Facial Features (Large, Expressive & Cute matching Reference Crop)
  { d: "M252,112 C258,108 266,110 270,115", len: 25, delay: 0.65 }, // Left eyebrow
  { d: "M254,120 C260,116 268,118 272,124", len: 30, delay: 0.67 }, // Left eye
  { d: "M278,115 C286,110 296,112 302,118", len: 30, delay: 0.69 }, // Right eyebrow
  { d: "M280,124 C288,118 298,120 302,128 C296,134 286,132 280,124 Z", len: 55, delay: 0.71 }, // Right main eye
  { d: "M288,132 C292,136 296,138 292,144 C288,146 284,144 282,144", len: 30, delay: 0.73 }, // Cute nose
  { d: "M268,148 C278,162 292,160 296,150 C288,154 278,154 268,148 Z", len: 65, delay: 0.75 }, // Broad happy smile
  { d: "M270,150 L294,152", len: 25, delay: 0.77 }, // Teeth line

  // 7. Editorial Jawline Block Shadow (Under chin)
  { d: "M248,162 C260,172 272,174 284,164 C272,185 258,185 248,162 Z", len: 90, delay: 0.79 },

  // Neck & Pendant Necklace
  { d: "M258,166 L258,190", len: 30, delay: 0.81 },
  { d: "M280,166 L280,186", len: 30, delay: 0.83 },
  { d: "M256,178 C268,192 278,192 284,176", len: 45, delay: 0.85 },
  { d: "M267,190 A5,5 0 1,1 267,200 A5,5 0 1,1 267,190", len: 35, delay: 0.87 },

  // Sweater & Torso
  { d: "M252,188 L271,220 L290,184", len: 70, delay: 0.89 },
  { d: "M220,196 C180,216 160,264 150,339 L140,444", len: 260, delay: 0.91 },
  { d: "M296,186 C338,206 378,254 393,329 L403,444", len: 260, delay: 0.93 },
  { d: "M230,249 C208,279 193,319 186,369", len: 140, delay: 0.95 },
  { d: "M306,249 C333,279 353,319 363,369", len: 140, delay: 0.97 },

  // Hands & Arms
  { d: "M218,229 C203,269 198,319 213,364 L253,374 C263,374 270,367 266,357 C258,349 243,349 233,357", len: 220, delay: 0.99 },
  { d: "M318,239 C353,269 383,304 413,339 L438,359 C446,359 453,354 448,344 C438,334 423,329 413,339", len: 240, delay: 1.01 },

  // ── Desk Line & Surface ──
  { d: "M20,440 L580,440", len: 560, delay: 1.04 },
  { d: "M20,448 L580,448", len: 560, delay: 1.06 },

  // ── Foreground Left: Patterned Candle Jar with Flame ──
  { d: "M120,375 L170,375 L164,440 L126,440 Z", len: 170, delay: 1.09 },
  { d: "M117,364 L173,364 L173,375 L117,375 Z", len: 120, delay: 1.12 },
  { d: "M126,385 L140,440", len: 60, delay: 1.14 },
  { d: "M140,385 L152,440", len: 60, delay: 1.16 },
  { d: "M152,385 L160,440", len: 60, delay: 1.18 },
  { d: "M145,364 L145,354", len: 15, delay: 1.2 },
  { d: "M145,332 C136,346 140,354 145,354 C150,354 154,346 145,332 Z", len: 50, delay: 1.22 },

  // ── Foreground Left-Center: Standalone Desktop Capsule Microphone ──
  { d: "M182,432 C182,422 216,422 216,432 C216,442 182,442 182,432 Z", len: 60, delay: 1.25 },
  { d: "M199,424 L199,348", len: 80, delay: 1.28 },
  { d: "M184,332 C184,368 214,368 214,332", len: 80, delay: 1.3 },
  { d: "M189,296 C189,282 209,282 209,296 L209,332 C209,344 189,344 189,332 Z", len: 110, delay: 1.33 },
  { d: "M194,314 A5,5 0 1,1 194,324 A5,5 0 1,1 194,314", len: 35, delay: 1.35 },
  { d: "M191,304 L207,304", len: 20, delay: 1.37 },
  { d: "M191,308 L207,308", len: 20, delay: 1.39 },

  // ── Foreground Center: Stacked Notebook & Coffee Mug ──
  { d: "M225,410 L292,410 L297,440 L220,440 Z", len: 150, delay: 1.42 },
  { d: "M230,388 L286,388 L290,410 L226,410 Z", len: 130, delay: 1.44 },
  { d: "M305,385 C305,375 331,375 331,385 L327,440 L309,440 Z", len: 130, delay: 1.47 },
  { d: "M329,392 C341,392 341,415 327,418", len: 40, delay: 1.49 },
  { d: "M313,372 C311,360 317,356 315,345", len: 30, delay: 1.51 },
  { d: "M323,372 C321,360 327,356 325,345", len: 30, delay: 1.53 },

  // ── Foreground Center-Right: Pencil Holder Cup & Pencils ──
  { d: "M345,365 L382,365 L376,440 L351,440 Z", len: 160, delay: 1.55 },
  { d: "M350,365 L340,315 L347,312 L356,365", len: 110, delay: 1.58 },
  { d: "M358,365 L360,305 L367,306 L364,365", len: 110, delay: 1.6 },
  { d: "M368,365 L378,320 L384,322 L374,365", len: 110, delay: 1.62 },

  // ── Foreground Right: Open Laptop with Camera Notch & Virtual Session UI ──
  {
    d: "M405,260 L545,260 C552,260 556,264 556,271 L556,395 C556,402 552,406 545,406 L405,406 C398,406 394,402 394,395 L394,271 C394,264 398,260 405,260 Z",
    len: 540,
    delay: 1.65,
  },
  { d: "M465,260 L485,260 C485,267 465,267 465,260 Z", len: 45, delay: 1.68 },
  { d: "M404,272 L546,272 L546,394 L404,394 Z", len: 480, delay: 1.71 },
  { d: "M414,282 L484,282 L484,342 L414,342 Z", len: 240, delay: 1.74 },
  { d: "M498,290 A14,14 0 1,1 498,318 A14,14 0 1,1 498,290", len: 90, delay: 1.77 },
  { d: "M416,356 L534,356", len: 120, delay: 1.79 },
  { d: "M435,372 A5,5 0 1,1 435,382 A5,5 0 1,1 435,372", len: 35, delay: 1.81 },
  { d: "M475,372 A5,5 0 1,1 475,382 A5,5 0 1,1 475,372", len: 35, delay: 1.83 },
  { d: "M515,372 A5,5 0 1,1 515,382 A5,5 0 1,1 515,372", len: 35, delay: 1.85 },
  { d: "M375,406 L575,406 L590,432 L360,432 Z", len: 480, delay: 1.88 },
  { d: "M445,412 L505,412 L502,424 L448,424 Z", len: 130, delay: 1.91 },
];

export default function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 460"
      className={["ink-mark", "ink-draw", className].filter(Boolean).join(" ")}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <style>{`
          @keyframes hero-fade-in {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
          }
          .hero-fill-sky {
            fill: var(--sky, #C0E3E7);
            animation: hero-fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transform-origin: center;
          }
          .hero-fill-sage {
            fill: var(--sage, #E1EAD8);
            animation: hero-fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            transform-origin: center;
          }
          .hero-fill-ink {
            fill: var(--ink, #14150F);
            animation: hero-fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      </defs>

      {/* ── Layer 0: Duotone Color Block Fills ── */}
      {/* Background Left Monstera / Tropical Leaf Fills */}
      <path
        d="M75,310 C45,240 15,170 35,100 C68,90 92,120 85,180 C98,130 128,110 142,135 C132,200 102,250 75,310 Z"
        className="hero-fill-sky"
        style={{ opacity: 0.6, animationDelay: "0.2s" }}
        stroke="none"
      />
      <path
        d="M75,310 C105,230 160,180 180,205 C158,255 120,280 75,310 Z"
        className="hero-fill-sage"
        style={{ opacity: 0.7, animationDelay: "0.3s" }}
        stroke="none"
      />

      {/* Background Right Foliage Fills */}
      <path
        d="M580,120 C595,110 598,132 582,145 C566,155 565,135 580,120 Z
           M558,165 C580,152 585,175 565,188 C548,195 545,178 558,165 Z"
        className="hero-fill-sky"
        style={{ opacity: 0.65, animationDelay: "0.4s" }}
        stroke="none"
      />
      <path
        d="M495,115 C478,100 468,120 482,135 C495,145 505,128 495,115 Z"
        className="hero-fill-sage"
        style={{ opacity: 0.65, animationDelay: "0.45s" }}
        stroke="none"
      />

      {/* Hair Bun & Scrunchie Fills */}
      <path
        d="M220,70 C195,50 205,20 235,22 C255,24 265,40 270,30 C280,20 305,32 295,58 C288,74 268,78 245,75 Z"
        className="hero-fill-ink"
        style={{ opacity: 0.95, animationDelay: "0.45s" }}
        stroke="none"
      />
      <path
        d="M232,72 C245,78 268,76 278,68 C282,72 278,78 270,82 C258,85 240,84 234,78 Z"
        className="hero-fill-sky"
        style={{ opacity: 0.95, animationDelay: "0.5s" }}
        stroke="none"
      />
      <path
        d="M234,78 C210,95 208,130 225,152 C234,162 242,165 248,162 C242,145 238,122 240,80 Z"
        className="hero-fill-ink"
        style={{ opacity: 0.9, animationDelay: "0.52s" }}
        stroke="none"
      />
      <path
        d="M242,80 C265,80 295,88 310,110 C322,130 325,160 308,190 C300,200 292,190 296,170 C306,145 295,120 278,110 C265,103 252,95 242,80 Z"
        className="hero-fill-ink"
        style={{ opacity: 0.95, animationDelay: "0.55s" }}
        stroke="none"
      />

      {/* Expressive Eye Pupil Fill */}
      <circle
        cx="292"
        cy="126"
        r="4"
        className="hero-fill-ink"
        style={{ opacity: 0.95, animationDelay: "0.72s" }}
        stroke="none"
      />

      {/* Editorial Jawline Block Shadow Fill */}
      <path
        d="M248,162 C260,172 272,174 284,164 C272,185 258,185 248,162 Z"
        className="hero-fill-ink"
        style={{ opacity: 0.85, animationDelay: "0.8s" }}
        stroke="none"
      />

      {/* Therapist Torso / Sweater Fill */}
      <path
        d="M220,196 C180,216 160,264 150,339 L140,444 L403,444 L393,329 C378,254 338,206 296,186 L271,220 Z"
        className="hero-fill-sky"
        style={{ opacity: 0.45, animationDelay: "0.85s" }}
        stroke="none"
      />

      {/* Laptop Screen & Glow Fill */}
      <rect
        x="404"
        y="272"
        width="142"
        height="122"
        rx="2"
        className="hero-fill-sky"
        style={{ opacity: 0.85, animationDelay: "1.0s" }}
        stroke="none"
      />

      {/* Candle Flame & Glow Fill */}
      <circle
        cx="145"
        cy="342"
        r="16"
        className="hero-fill-sky"
        style={{ opacity: 0.5, animationDelay: "1.2s" }}
        stroke="none"
      />
      <path
        d="M145,332 C136,346 140,354 145,354 C150,354 154,346 145,332 Z"
        className="hero-fill-sky"
        style={{ opacity: 0.95, animationDelay: "1.25s" }}
        stroke="none"
      />

      {/* Candle Jar Body Fill */}
      <path
        d="M120,375 L170,375 L164,440 L126,440 Z"
        className="hero-fill-sage"
        style={{ opacity: 0.6, animationDelay: "1.1s" }}
        stroke="none"
      />

      {/* Left & Right Desk Vases Fills */}
      <path
        d="M55,310 L95,310 L90,440 L60,440 Z"
        className="hero-fill-sky"
        style={{ opacity: 0.5, animationDelay: "0.2s" }}
        stroke="none"
      />
      <path
        d="M495,320 L535,320 L530,440 L500,440 Z"
        className="hero-fill-sage"
        style={{ opacity: 0.5, animationDelay: "0.3s" }}
        stroke="none"
      />

      {/* ── Layer 1: Animated Ink Outlines ── */}
      {STROKES.map((stroke, index) => (
        <path
          key={index}
          d={stroke.d}
          style={
            {
              "--len": stroke.len,
              "--delay": `${stroke.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}
