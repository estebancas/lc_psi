import { Suspense } from "react";
import { connection } from "next/server";

async function CopyrightYear() {
  // TODO: Cache Components adoption. Added to unblock the build: remove this connection() to re-trigger the error and review the fix options.
  await connection();
  return <>{new Date().getFullYear()}</>;
}

export default function Footer() {
  return (
    <footer className="border-t border-black/10 py-10 text-sm dark:border-white/10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 text-center opacity-70">
        <p>
          © <Suspense fallback={null}><CopyrightYear /></Suspense> Laura
          Castro Cordero. Todos los derechos reservados.
        </p>
        <p>Psicóloga · Atención presencial y en línea</p>
      </div>
    </footer>
  );
}
