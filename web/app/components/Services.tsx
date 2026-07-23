import { getServices } from "@/lib/services";

export default async function Services() {
  const services = await getServices();

  return (
    <section id="servicios" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-20">
      <h2 className="text-2xl font-semibold">Servicios</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.slug}
            className="rounded-xl border border-black/10 p-6 dark:border-white/10"
          >
            <h3 className="font-medium">{service.title}</h3>
            <p className="mt-2 text-sm opacity-70">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
