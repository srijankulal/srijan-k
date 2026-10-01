import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'profileSummary',
  title: 'Profile & Resume Summary',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Professional Title',
      type: 'string',
      initialValue: 'Software Developer',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Professional Summary (IEEE Resume)',
      type: 'text',
      description: 'Comprehensive technical summary for Section 1 of the IEEE Resume, generated from LinkedIn experiences & posts and editable here.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortSummary',
      title: 'Short Bio / Overview',
      type: 'text',
      description: 'Concise 1-2 sentence overview used in the recruiter and about views.',
    }),
    defineField({
      name: 'highlights',
      title: 'Key Technical Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Bullet points highlighting core architectural strengths and contributions.',
    }),
    defineField({
      name: 'isCustomOverride',
      title: 'Lock / Preserve Manual Edits',
      type: 'boolean',
      description: 'Enable to prevent automated monthly AI sync from overwriting your custom edits.',
      initialValue: false,
    }),
    defineField({
      name: 'source',
      title: 'Generation Source',
      type: 'string',
      initialValue: 'Gemini AI (LinkedIn Experience & Posts Analysis)',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
    },
  },
})
