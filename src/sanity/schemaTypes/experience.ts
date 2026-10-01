import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'role',
      title: 'Role / Position',
      type: 'string',
      description: 'e.g. Software Developer Intern, Backend Engineer',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'company',
      title: 'Company / Organization',
      type: 'string',
      description: 'e.g. Acme Corp, Freelance, Open Source',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internship', value: 'Internship' },
          { title: 'Full-time', value: 'Full-time' },
          { title: 'Part-time', value: 'Part-time' },
          { title: 'Contract', value: 'Contract' },
          { title: 'Freelance', value: 'Freelance' },
          { title: 'Open Source', value: 'Open Source' },
          { title: 'Research', value: 'Research' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'Internship',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. Remote, Mangalore, India, Bengaluru, India',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date / Month',
      type: 'string',
      description: 'e.g. Jun 2024 or 2024',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date / Month',
      type: 'string',
      description: 'e.g. Aug 2024 or Present',
    }),
    defineField({
      name: 'current',
      title: 'Currently Working Here',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      description: '1-2 sentence overview of the role',
    }),
    defineField({
      name: 'highlights',
      title: 'Bullet Points / Key Contributions',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Specific achievements and impact points (e.g. "Built REST APIs reducing latency by 30%")',
    }),
    defineField({
      name: 'technologies',
      title: 'Technologies Used',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company / Project Link',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      description: 'Lower numbers appear first',
    }),
  ],
  preview: {
    select: {
      title: 'role',
      subtitle: 'company',
      type: 'type',
    },
    prepare({ title, subtitle, type }) {
      return {
        title: title || 'Untitled Role',
        subtitle: `${subtitle || 'Unknown Company'} (${type || 'Internship'})`,
      }
    },
  },
})
