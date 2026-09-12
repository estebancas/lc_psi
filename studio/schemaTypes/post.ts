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
