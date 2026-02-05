import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short summary of the project',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'linkToCode',
      title: 'Link to Code',
      type: 'url',
    }),
    defineField({
      name: 'linkToLive',
      title: 'Link to Live Demo',
      type: 'url',
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'array', 
      of: [{type: 'block'}],
      description: 'Detailed description of the project',
    }),
  ],
})
