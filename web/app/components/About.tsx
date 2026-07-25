import { PortableText } from "next-sanity";
import { getProfile } from "@/lib/profile";

export default async function About() {
  const profile = await getProfile();

  const title = profile?.aboutTitle || "Sobre mí";

  return (
    <section id="sobre-mi" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="prose mt-4 max-w-2xl leading-relaxed opacity-80">
        {profile?.bio && profile.bio.length > 0 ? (
          <PortableText value={profile.bio} />
        ) : (
          <p>
            Soy {profile?.name || "Laura Castro Cordero"},{" "}
            {profile?.profession?.toLowerCase() || "psicóloga"}.
          </p>
        )}
      </div>
    </section>
  );
}
