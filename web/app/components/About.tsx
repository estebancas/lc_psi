import { PortableText } from "next-sanity";
import { getProfile } from "@/lib/profile";
import { portableTextComponents } from "./portable-text";

export default async function About() {
  const profile = await getProfile();

  const title = profile?.aboutTitle || "Sobre mí";

  return (
    <section
      id="sobre-mi"
      className="ink-rule mx-auto max-w-5xl scroll-mt-20 px-6 py-[var(--space-section)]"
    >
      <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase">{title}</h2>
      <div className="mt-6 max-w-2xl">
        {profile?.bio && profile.bio.length > 0 ? (
          <PortableText value={profile.bio} components={portableTextComponents} />
        ) : (
          <p className="leading-relaxed text-ink-60">
            Soy {profile?.name || "Laura Castro Cordero"},{" "}
            {profile?.profession?.toLowerCase() || "psicóloga"}.
          </p>
        )}
      </div>
    </section>
  );
}
