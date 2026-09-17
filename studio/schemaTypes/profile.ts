import { defineType, defineField } from 'sanity'

export const profile = defineType({
  name: 'profile',
  title: 'Perfil y Configuración',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre completo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profession',
      title: 'Título o Profesión',
      type: 'string',
      description: 'Ejemplo: Psicóloga',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Título principal (Hero)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Subtítulo (Hero)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroPhoto',
      title: 'Foto de portada / Perfil',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo (accesibilidad y SEO)',
          type: 'string',
          description:
            'Describe la foto para personas con lectores de pantalla y para buscadores. Ejemplo: "Laura Castro Cordero, psicóloga, sonriendo en su consultorio".',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value: { alt?: string } | undefined) => {
          if (value && !value.alt) {
            return 'El texto alternativo es obligatorio cuando hay una foto.'
          }
          return true
        }),
    }),
    defineField({
      name: 'aboutTitle',
      title: 'Título de la sección Sobre mí',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Biografía (Sobre mí)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Descripción detallada, enfoque terapéutico y formación.',
    }),
    defineField({
      name: 'email',
      title: 'Correo electrónico',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono de contacto (formato visible)',
      type: 'string',
      description: 'Ejemplo: +506 7156 1628',
    }),
    defineField({
      name: 'whatsapp',
      title: 'Número de WhatsApp',
      type: 'string',
      description:
        'Formato internacional completo, sin espacios ni signos: código de país + número, ej: 50671561628 (Costa Rica = 506). Sin el código de país el enlace de WhatsApp del sitio no funciona.',
      validation: (Rule) =>
        Rule.regex(/^\d{8,15}$/, {
          name: 'formato internacional',
          invert: false,
        }).error('Debe ser solo dígitos, incluyendo el código de país (ej: 50671561628).'),
    }),
    defineField({
      name: 'footerTagline',
      title: 'Texto pie de página (Tagline)',
      type: 'string',
      description: 'Ejemplo: Psicóloga · Atención presencial y en línea',
    }),
    defineField({
      name: 'address',
      title: 'Dirección física',
      type: 'object',
      description:
        'Dirección del consultorio. Se usa en el enlace al mapa del sitio y en los datos estructurados para buscadores (SEO local) — debe coincidir exactamente con la dirección en Google Business Profile.',
      fields: [
        defineField({
          name: 'calle',
          title: 'Calle / Señas',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'ciudad',
          title: 'Ciudad',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'provincia',
          title: 'Provincia',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'codigoPostal',
          title: 'Código postal',
          type: 'string',
        }),
        defineField({
          name: 'pais',
          title: 'País',
          type: 'string',
          initialValue: 'Costa Rica',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'geo',
      title: 'Coordenadas (mapa)',
      type: 'object',
      description:
        'Latitud y longitud del consultorio, usadas para el mapa y los datos estructurados. Se obtienen del enlace de Google Maps del consultorio.',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitud',
          type: 'number',
          validation: (Rule) => Rule.required().min(-90).max(90),
        }),
        defineField({
          name: 'lng',
          title: 'Longitud',
          type: 'number',
          validation: (Rule) => Rule.required().min(-180).max(180),
        }),
      ],
    }),
    defineField({
      name: 'openingHours',
      title: 'Horario de atención',
      type: 'array',
      description:
        'Un rango por día o grupo de días. Déjalo vacío si la atención es solo con cita previa sin días fijos.',
      of: [
        defineField({
          name: 'openingHoursRange',
          type: 'object',
          fields: [
            defineField({
              name: 'dias',
              title: 'Días',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                list: [
                  { title: 'Lunes', value: 'lunes' },
                  { title: 'Martes', value: 'martes' },
                  { title: 'Miércoles', value: 'miercoles' },
                  { title: 'Jueves', value: 'jueves' },
                  { title: 'Viernes', value: 'viernes' },
                  { title: 'Sábado', value: 'sabado' },
                  { title: 'Domingo', value: 'domingo' },
                ],
              },
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'horaInicio',
              title: 'Hora de inicio',
              type: 'string',
              description: 'Formato 24h, ej: 08:00',
            }),
            defineField({
              name: 'horaFin',
              title: 'Hora de fin',
              type: 'string',
              description: 'Formato 24h, ej: 17:00',
            }),
          ],
          preview: {
            select: { dias: 'dias', inicio: 'horaInicio', fin: 'horaFin' },
            prepare({ dias, inicio, fin }) {
              return { title: `${(dias || []).join(', ')}: ${inicio || '?'}–${fin || '?'}` }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Redes sociales',
      type: 'array',
      description: 'Enlaces a perfiles en redes sociales, usados también en los datos estructurados.',
      of: [
        defineField({
          name: 'socialLink',
          type: 'object',
          fields: [
            defineField({
              name: 'plataforma',
              title: 'Plataforma',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'Otro', value: 'otro' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
            }),
          ],
          preview: {
            select: { title: 'plataforma', subtitle: 'url' },
          },
        }),
      ],
    }),
    defineField({
      name: 'licenseNumber',
      title: 'Número de incorporación / carné profesional',
      type: 'string',
      description: 'Número de carné del Colegio de Profesionales en Psicología de Costa Rica.',
    }),
    defineField({
      name: 'credentials',
      title: 'Credenciales / Colegiatura',
      type: 'string',
      description: 'Ejemplo: Colegio de Profesionales en Psicología de Costa Rica (COLPSIC)',
    }),
    defineField({
      name: 'priceRange',
      title: 'Rango de precios',
      type: 'string',
      description: 'Indicador simple para buscadores, ej: $$ o ₡₡.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'profession',
      media: 'heroPhoto',
    },
  },
})
