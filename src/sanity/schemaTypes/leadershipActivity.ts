import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'leadershipActivity',
  title: 'Leadership & Technical Activities',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Topic / Title',
      type: 'string',
      description: 'e.g. Open Source Development, Project Leadership, Hardware Prototyping',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description / Impact',
      type: 'text',
      description: 'Concise IEEE-formatted bullet description of leadership, contributions, and technical activities.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source / AI Model',
      type: 'string',
      initialValue: 'Gemini AI (LinkedIn Analysis)',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
