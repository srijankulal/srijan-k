import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  fields: [
    defineField({
      name: 'institution',
      title: 'Institution / University',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'degree',
      title: 'Degree / Qualification',
      type: 'string',
      description: 'e.g. Bachelor of Computer Applications (B.C.A)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fieldOfStudy',
      title: 'Field of Study / Major',
      type: 'string',
      description: 'e.g. Computer Science, Computer Applications',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. Mangalore, India',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date / Year',
      type: 'string',
      description: 'e.g. 2023',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date / Year',
      type: 'string',
      description: 'e.g. 2026 or Present',
    }),
    defineField({
      name: 'current',
      title: 'Currently Enrolled',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'gpa',
      title: 'GPA / Score / Status',
      type: 'string',
      description: 'e.g. In Progress, 8.5/10, First Class with Distinction',
    }),
    defineField({
      name: 'description',
      title: 'Description / Highlights',
      type: 'text',
      description: 'Key coursework, achievements, activities',
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
      title: 'degree',
      subtitle: 'institution',
    },
  },
})
