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
      description: 'Ejemplo: +52 55 0000 0000',
    }),
    defineField({
      name: 'whatsapp',
      title: 'Número de WhatsApp',
      type: 'string',
      description: 'Formato internacional sin espacio ni signos, ej: 5210000000000',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Texto pie de página (Tagline)',
      type: 'string',
      description: 'Ejemplo: Psicóloga · Atención presencial y en línea',
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
