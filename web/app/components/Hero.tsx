import Link from "next/link";
import Image from "next/image";
import { getProfile } from "@/lib/profile";
import { urlForImage } from "@/lib/sanity/image";
import HeroScene from "./ink/HeroScene";

export default async function Hero() {
  const profile = await getProfile();

  const title = profile?.heroTitle || "Terapia psicológica con un enfoque humano";
  const subtitle =
    profile?.heroSubtitle ||
    "Acompañamiento profesional para tu bienestar emocional. Sesiones individuales, de pareja y para adolescentes.";

  const photoUrl = profile?.heroPhoto
    ? urlForImage(profile.heroPhoto).width(500).height(500).url()
    : null;

  return (
    <section className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-12 px-6 py-[var(--space-section)] md:flex-row md:items-stretch">
      <div className="flex flex-1 flex-col items-center gap-7 text-center md:items-start md:text-left">
        <h1 className="font-display max-w-xl text-[clamp(2.75rem,7vw,5.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.02em]">
          {title}
        </h1>
        <p className="max-w-md text-lg text-ink-60">{subtitle}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/#contacto" className="pill pill--accent">
            Agendar una cita
          </Link>
          <Link href="/#servicios" className="pill pill--outline">
            Ver servicios
          </Link>
        </div>
      </div>

      {photoUrl ? (
        <div className="relative aspect-square w-56 flex-shrink-0 overflow-hidden rounded-full border-[1.5px] border-ink md:w-72">
          <Image
            src={photoUrl}
            alt={profile?.name || "Foto de perfil"}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="tile-2 flex w-full max-w-md flex-shrink-0 items-center justify-center border-[1.5px] p-6 md:w-[26rem]">
          <HeroScene className="w-full" />
        </div>
      )}
    </section>
  );
}
