const whatsappNumber = "5210000000000"; // placeholder, formato E.164 sin "+"
const phoneNumber = "+52 55 0000 0000"; // placeholder
const email = "contacto@lauracastro.mx"; // placeholder

export default function Contact() {
  return (
    <section id="contacto" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
      <h2 className="text-2xl font-semibold">Contacto</h2>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <form className="flex flex-col gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm dark:border-white/20"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm dark:border-white/20"
          />
          <textarea
            name="mensaje"
            placeholder="Mensaje"
            rows={4}
            className="rounded-lg border border-black/15 bg-transparent px-4 py-3 text-sm dark:border-white/20"
          />
          <button
            type="submit"
            className="rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-80"
          >
            Enviar mensaje
          </button>
        </form>

        <div className="flex flex-col gap-4 text-sm">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-black/10 px-4 py-3 hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
          >
            WhatsApp
          </a>
          <a
            href={`tel:${phoneNumber}`}
            className="rounded-lg border border-black/10 px-4 py-3 hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
          >
            Llamar: {phoneNumber}
          </a>
          <a
            href={`mailto:${email}`}
            className="rounded-lg border border-black/10 px-4 py-3 hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.05]"
          >
            {email}
          </a>
        </div>
      </div>
    </section>
  );
}
