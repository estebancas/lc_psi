import { getProfile } from "@/lib/profile";
import ContactForm from "./ContactForm";
import ChannelMark from "./ink/ChannelMark";

export default async function Contact() {
  const profile = await getProfile();

  const whatsappNumber = profile?.whatsapp || "50600000000";
  const phoneNumber = profile?.phone || "+506 0000 0000";
  const email = profile?.email || "contacto@psicologalauracastro.com";

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
      // wa.me tolerates a plain digit string, but tel: URIs must not contain
      // spaces — profile.phone is stored in a human-readable "+506 7156 1628"
      // format for display, so strip whitespace only when building the href.
      href: `tel:${phoneNumber.replace(/\s+/g, "")}`,
      external: false,
    },
    {
      kind: "email" as const,
      label: "Correo",
      value: email,
      href: `mailto:${email}`,
      external: false,
    },
    ...(profile?.address
      ? [
          {
            kind: "address" as const,
            label: "Consultorio",
            value: `${profile.address.calle}, ${profile.address.ciudad}, ${profile.address.provincia}`,
            href: profile.geo
              ? `https://www.google.com/maps?q=${profile.geo.lat},${profile.geo.lng}`
              : `https://www.google.com/maps?q=${encodeURIComponent(
                  `${profile.address.calle}, ${profile.address.ciudad}, ${profile.address.provincia}, ${profile.address.pais}`,
                )}`,
            external: true,
          },
        ]
      : []),
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
