import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'syncMetadata',
  title: 'Sync Metadata',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title / Service',
      type: 'string',
      initialValue: 'LinkedIn Scraper Sync State',
    }),
    defineField({
      name: 'lastSuccessfulSync',
      title: 'Last Successful Sync',
      type: 'datetime',
    }),
    defineField({
      name: 'lastAttempt',
      title: 'Last Sync Attempt',
      type: 'datetime',
    }),
    defineField({
      name: 'lastStatus',
      title: 'Last Status',
      type: 'string',
      options: {
        list: [
          { title: 'Success', value: 'success' },
          { title: 'Failed', value: 'failed' },
          { title: 'Skipped', value: 'skipped' },
        ],
      },
    }),
    defineField({
      name: 'failureCount',
      title: 'Consecutive Failure Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'lastError',
      title: 'Last Error Message',
      type: 'text',
    }),
    defineField({
      name: 'source',
      title: 'Source Provider',
      type: 'string',
    }),
    defineField({
      name: 'nextScheduledSync',
      title: 'Next Scheduled Scrape',
      type: 'datetime',
    }),
  ],
})
