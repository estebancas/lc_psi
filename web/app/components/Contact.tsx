import { getProfile } from "@/lib/profile";
import ContactForm from "./ContactForm";
import ChannelMark from "./ink/ChannelMark";

export default async function Contact() {
  const profile = await getProfile();

  const whatsappNumber = profile?.whatsapp || "5210000000000";
  const phoneNumber = profile?.phone || "+52 55 0000 0000";
  const email = profile?.email || "contacto@lauracastro.mx";

  const channels = [
    {
      kind: "whatsapp" as const,
      label: "WhatsApp",
      value: "Escríbeme directo",
      href: `https://wa.me/${whatsappNumber}`,
      external: true,
    },
    {
      kind: "phone" as const,
      label: "Teléfono",
      value: phoneNumber,
      href: `tel:${phoneNumber}`,
      external: false,
    },
    {
      kind: "email" as const,
      label: "Correo",
      value: email,
      href: `mailto:${email}`,
      external: false,
    },
  ];

  return (
    <section
      id="contacto"
      className="ink-rule mx-auto max-w-5xl scroll-mt-20 px-6 py-[var(--space-section)]"
    >
      <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase">Contacto</h2>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <ContactForm />

        <div className="flex flex-col gap-4">
          {channels.map((channel, index) => (
            <a
              key={channel.kind}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className={`tile-${index % 3} flex items-center gap-4 p-5 transition-transform hover:-translate-y-1`}
            >
              <ChannelMark kind={channel.kind} className="h-8 w-8 flex-shrink-0" />
              <div>
                <p className="eyebrow">{channel.label}</p>
                <p className="mt-1 font-display text-lg">{channel.value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
