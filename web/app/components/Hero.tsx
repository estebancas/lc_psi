import Link from "next/link";
import Image from "next/image";
import { getProfile } from "@/lib/profile";
import { urlForImage } from "@/lib/sanity/image";

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
    <section className="mx-auto flex max-w-5xl flex-col-reverse items-center gap-10 px-6 py-20 md:flex-row">
      <div className="flex flex-1 flex-col items-center gap-6 text-center md:items-start md:text-left">
        <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight">
          {title}
        </h1>
        <p className="max-w-md text-lg opacity-80">{subtitle}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#contacto"
            className="rounded-full bg-foreground px-6 py-3 text-center text-background transition-opacity hover:opacity-80"
          >
            Agendar una cita
          </Link>
          <Link
            href="/#servicios"
            className="rounded-full border border-black/15 px-6 py-3 text-center transition-colors hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]"
          >
            Ver servicios
          </Link>
        </div>
      </div>

      {photoUrl ? (
        <div className="relative aspect-square w-48 flex-shrink-0 overflow-hidden rounded-full md:w-64">
          <Image
            src={photoUrl}
            alt={profile?.name || "Foto de perfil"}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="flex aspect-square w-48 flex-shrink-0 items-center justify-center rounded-full bg-black/5 text-sm opacity-50 dark:bg-white/10 md:w-64">
          Foto
        </div>
      )}
    </section>
  );
}
