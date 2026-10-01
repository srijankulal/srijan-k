import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'linkedinPosts',
  title: 'Offline Bulk LinkedIn Posts & Reminder State',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Offline Scraped LinkedIn Posts',
    }),
    defineField({
      name: 'rawText',
      title: 'Raw Bulk Posts Text',
      type: 'text',
      rows: 15,
      description: 'Bulk raw text of posts scraped offline or pasted from LinkedIn.',
    }),
    defineField({
      name: 'postsCount',
      title: 'Estimated Posts Count',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'reviewStatus',
      title: 'Review / Reminder Status',
      type: 'string',
      options: {
        list: [
          { title: 'Up to Date', value: 'up-to-date' },
          { title: 'Monthly Reminder Sent', value: 'reminder-sent' },
          { title: '48h Follow-up Sent', value: 'followup-sent' },
          { title: 'Dismissed / Using Old Summary', value: 'dismissed' },
        ],
      },
      initialValue: 'up-to-date',
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Posts Update Date',
      type: 'datetime',
    }),
    defineField({
      name: 'lastReminderSent',
      title: 'Last Monthly Reminder Sent Date',
      type: 'datetime',
    }),
    defineField({
      name: 'followupReminderSent',
      title: 'Last Follow-up Reminder Sent Date (48h)',
      type: 'datetime',
    }),
    defineField({
      name: 'lastSummaryGenerated',
      title: 'Last Gemini Summary Generated Date',
      type: 'datetime',
    }),
  ],
});
