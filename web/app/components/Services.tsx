import { getServices } from "@/lib/services";
import ServiceMark from "./ink/ServiceMark";

export default async function Services() {
  const services = await getServices();

  return (
    <section
      id="servicios"
      aria-labelledby="servicios-heading"
      className="ink-rule mx-auto max-w-5xl scroll-mt-20 px-6 py-[var(--space-section)]"
    >
      <h2 id="servicios-heading" className="font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase">
        Servicios
      </h2>

      {services.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {services.map((service, index) => (
            <div key={service.slug} className={`tile-${index % 3} flex flex-col gap-5 p-6`}>
              <ServiceMark slug={service.slug} index={index} className="h-16 w-16" />
              <div>
                <h3 className="font-display text-lg">{service.title}</h3>
                <p className="mt-2 text-sm text-ink-60">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 max-w-md text-ink-60">
          Estoy preparando el detalle de mis servicios. Mientras tanto, escríbeme y con gusto te
          cuento cómo puedo acompañarte.
        </p>
      )}
    </section>
  );
}
