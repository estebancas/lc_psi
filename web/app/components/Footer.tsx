import { Suspense } from "react";
import { connection } from "next/server";
import { getProfile } from "@/lib/profile";

async function CopyrightYear() {
  await connection();
  return <>{new Date().getFullYear()}</>;
}

export default async function Footer() {
  const profile = await getProfile();
  const name = profile?.name || "Laura Castro Cordero";
  const tagline = profile?.footerTagline || "Psicóloga · Atención presencial y en línea";

  return (
    <footer className="border-t border-black/10 py-10 text-sm dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 text-center opacity-70">
        <p>
          © <Suspense fallback={null}><CopyrightYear /></Suspense> {name}. Todos los derechos reservados.
        </p>
        <p>{tagline}</p>
      </div>
    </footer>
  );
}
