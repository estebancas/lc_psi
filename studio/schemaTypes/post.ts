import {defineType, defineField} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          {title: 'Artículo', value: 'articulo'},
          {title: 'Actualización', value: 'actualizacion'},
        ],
        layout: 'radio',
      },
      initialValue: 'articulo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Extracto',
      type: 'text',
      rows: 3,
      description:
        'Resumen del artículo, no una firma o encabezado. Se usa como descripción en resultados de búsqueda y al compartir en redes — debe explicar de qué trata el contenido.',
      validation: (Rule) => Rule.required().min(70).max(160),
    }),
    defineField({
      name: 'seoTitle',
      title: 'Título SEO (opcional)',
      type: 'string',
      description:
        'Si se deja vacío, se usa el título del artículo. Úsalo solo si quieres un título distinto para buscadores.',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descripción SEO (opcional)',
      type: 'text',
      rows: 2,
      description: 'Si se deja vacío, se usa el extracto del artículo.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'image',
      options: {
        hotspot: true,
      },
      description:
        'Imagen mostrada al compartir este artículo en redes sociales. Si se deja vacía, se usa la imagen general del sitio.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo (accesibilidad y SEO)',
          type: 'string',
          description: 'Describe la imagen para personas con lectores de pantalla y para buscadores.',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value: {alt?: string} | undefined) => {
          if (value && !value.alt) {
            return 'El texto alternativo es obligatorio cuando hay una imagen.'
          }
          return true
        }),
    }),
    defineField({
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Subtítulo 2', value: 'h2'},
            {title: 'Subtítulo 3', value: 'h3'},
            {title: 'Subtítulo 4', value: 'h4'},
            {title: 'Cita', value: 'blockquote'},
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'type', date: 'publishedAt'},
  },
})
