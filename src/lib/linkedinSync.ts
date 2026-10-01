import { writeClient, client } from '@/sanity/lib/client';
import { fetchLinkedInFromApify } from './apifyLinkedIn';
import { summarizeLeadershipWithGemini, summarizeProfileWithGemini } from './geminiSummarizer';
import { sendSummaryErrorEmail } from './errorNotifier';

export interface LinkedInEducation {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
}

export interface LinkedInExperience {
  role: string;
  company: string;
  type: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  summary?: string;
  highlights?: string[];
  technologies?: string[];
  companyUrl?: string;
}

export interface LinkedInProfileData {
  name: string;
  headline?: string;
  location?: string;
  education: LinkedInEducation[];
  experience: LinkedInExperience[];
}

export interface SyncOptions {
  username?: string;
  force?: boolean;
  minIntervalDays?: number;
}

export interface SyncReport {
  success: boolean;
  status: 'synced' | 'skipped' | 'failed';
  timestamp: string;
  source: string;
  message?: string;
  lastSuccessfulSync?: string;
  nextScheduledSync?: string;
  summary: {
    education: { added: number; updated: number; unchanged: number };
    experience: { added: number; updated: number; unchanged: number };
  };
  details: {
    type: 'education' | 'experience';
    title: string;
    action: 'added' | 'updated' | 'unchanged';
    id: string;
  }[];
  error?: string;
}

/**
 * Creates a deterministic, URL-friendly slug/ID for Sanity document deduplication
 */
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 48);
}

const METADATA_DOC_ID = 'linkedin-sync-metadata';
const DEFAULT_INTERVAL_DAYS = 30; // Scrape once a month

/**
 * Fetch LinkedIn profile via Apify Actor or custom scraper endpoint
 */
export async function fetchLinkedInProfile(username: string = 'srijan-kulal'): Promise<{ data: LinkedInProfileData | null; source: string; error?: string }> {
  const profileUrl = `https://www.linkedin.com/in/${username}/`;

  // Strategy 1: Apify LinkedIn Scraper
  const apifyToken = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;
  if (apifyToken) {
    const { data: apifyData, error: apifyError } = await fetchLinkedInFromApify(profileUrl);
    if (apifyData && (apifyData.education.length > 0 || apifyData.experience.length > 0)) {
      return { data: apifyData, source: 'apify_actor' };
    }
    if (apifyError) {
      console.warn('[LinkedIn Sync] Apify error:', apifyError);
      return { data: null, source: 'apify_actor', error: apifyError };
    }
  }

  // Strategy 2: User-configured custom scraper / Proxycurl endpoint
  const scraperUrl = process.env.LINKEDIN_SCRAPER_URL;
  const rapidApiKey = process.env.RAPIDAPI_KEY || process.env.RAPID_API_KEY;

  if (scraperUrl) {
    try {
      const res = await fetch(scraperUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(rapidApiKey ? { 'x-rapidapi-key': rapidApiKey } : {})
        },
        next: { revalidate: 0 }
      });
      if (res.ok) {
        const json = await res.json();
        if (json && (json.experience || json.education)) {
          return { data: json, source: 'custom_scraper_api' };
        }
      }
    } catch (e: any) {
      console.warn('[LinkedIn Sync] Scraper API error:', e);
      return { data: null, source: 'custom_scraper_api', error: e.message || String(e) };
    }
  }

  return {
    data: null,
    source: 'none',
    error: 'No active LinkedIn scraper service available (APIFY_API_TOKEN or LINKEDIN_SCRAPER_URL required).'
  };
}

/**
 * Synchronizes LinkedIn profile data to Sanity CMS with monthly schedule & next-day retry logic.
 */
export async function syncLinkedInToSanity(options: SyncOptions = {}): Promise<SyncReport> {
  const {
    username = 'srijan-kulal',
    force = false,
    minIntervalDays = DEFAULT_INTERVAL_DAYS
  } = options;

  const now = new Date();
  const timestamp = now.toISOString();

  const report: SyncReport = {
    success: false,
    status: 'failed',
    timestamp,
    source: 'unknown',
    summary: {
      education: { added: 0, updated: 0, unchanged: 0 },
      experience: { added: 0, updated: 0, unchanged: 0 }
    },
    details: []
  };

  const hasWriteToken = Boolean(process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN);
  const activeClient = hasWriteToken ? writeClient : client;

  try {
    // 1. Fetch metadata state from Sanity
    let metadata: any = null;
    try {
      metadata = await activeClient.fetch(`*[_type == "syncMetadata" && _id == "${METADATA_DOC_ID}"][0]`);
    } catch (err) {
      console.warn('[LinkedIn Sync] Could not fetch sync metadata:', err);
    }

    // 2. Evaluate Monthly Schedule vs. Retry Logic
    if (metadata && !force) {
      const lastSuccess = metadata.lastSuccessfulSync ? new Date(metadata.lastSuccessfulSync).getTime() : 0;
      const daysSinceSuccess = lastSuccess > 0 ? (now.getTime() - lastSuccess) / (1000 * 60 * 60 * 24) : 999;
      const lastFailed = metadata.lastStatus === 'failed';

      // If last run was successful and it has been less than 30 days, skip scrape to conserve API runs
      if (!lastFailed && daysSinceSuccess < minIntervalDays) {
        const remainingDays = Math.ceil(minIntervalDays - daysSinceSuccess);
        const nextDate = new Date(lastSuccess + minIntervalDays * 24 * 60 * 60 * 1000).toISOString();

        report.success = true;
        report.status = 'skipped';
        report.source = metadata.source || 'cache';
        report.lastSuccessfulSync = metadata.lastSuccessfulSync;
        report.nextScheduledSync = nextDate;
        report.message = `Monthly sync is already up-to-date (last synced ${Math.floor(daysSinceSuccess)} days ago). Next scheduled scrape in ${remainingDays} days. Pass force=true to override.`;

        return report;
      }
      // If lastStatus === 'failed', we proceed to retry immediately on this scheduled run!
    }

    if (!hasWriteToken) {
      report.error = "SANITY_API_TOKEN is not configured in environment variables. Running in read-only audit mode.";
      return report;
    }

    // 3. Perform Live Profile Fetch via Apify / Scraper
    const { data: profile, source, error: fetchError } = await fetchLinkedInProfile(username);
    report.source = source;

    if (!profile || fetchError) {
      const errMsg = fetchError || 'Failed to retrieve profile data from LinkedIn scraper.';
      report.error = errMsg;
      report.status = 'failed';

      // Record failure in Sanity so the next daily cron / retry triggers automatically
      try {
        await writeClient.createOrReplace({
          _id: METADATA_DOC_ID,
          _type: 'syncMetadata',
          title: 'LinkedIn Scraper Sync State',
          lastAttempt: timestamp,
          lastStatus: 'failed',
          failureCount: ((metadata?.failureCount || 0) + 1),
          lastError: errMsg,
          source,
          // Preserve last successful sync date
          lastSuccessfulSync: metadata?.lastSuccessfulSync || null,
        });
      } catch (metaErr) {
        console.error('[LinkedIn Sync] Failed to record failure metadata:', metaErr);
      }

      return report;
    }

    // 4. Fetch existing Sanity documents
    const [existingEducation, existingExperience] = await Promise.all([
      activeClient.fetch<any[]>(`*[_type == "education"]`),
      activeClient.fetch<any[]>(`*[_type == "experience"]`)
    ]);

    // 5. Sync Education
    if (profile.education && Array.isArray(profile.education)) {
      for (let i = 0; i < profile.education.length; i++) {
        const edu = profile.education[i];
        const docId = `education-linkedin-${createSlug(edu.institution + '-' + edu.degree)}`;

        const existing = existingEducation?.find(
          (e) => e._id === docId || (e.institution?.toLowerCase() === edu.institution.toLowerCase() && e.degree?.toLowerCase() === edu.degree.toLowerCase())
        );

        const eduDoc = {
          _id: docId,
          _type: 'education',
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy || 'Computer Applications',
          location: edu.location || 'Mangalore, Karnataka, India',
          startDate: edu.startDate,
          endDate: edu.endDate || (edu.current ? 'Present' : '2026'),
          current: Boolean(edu.current),
          gpa: edu.gpa || 'In Progress',
          description: edu.description || '',
          order: i
        };

        if (!existing) {
          await writeClient.createOrReplace(eduDoc);
          report.summary.education.added++;
          report.details.push({
            type: 'education',
            title: `${edu.degree} @ ${edu.institution}`,
            action: 'added',
            id: docId
          });
        } else {
          const hasChanged =
            existing.institution !== eduDoc.institution ||
            existing.degree !== eduDoc.degree ||
            existing.startDate !== eduDoc.startDate ||
            existing.endDate !== eduDoc.endDate ||
            existing.gpa !== eduDoc.gpa;

          if (hasChanged) {
            await writeClient.createOrReplace({ ...existing, ...eduDoc, _id: existing._id });
            report.summary.education.updated++;
            report.details.push({
              type: 'education',
              title: `${edu.degree} @ ${edu.institution}`,
              action: 'updated',
              id: existing._id
            });
          } else {
            report.summary.education.unchanged++;
            report.details.push({
              type: 'education',
              title: `${edu.degree} @ ${edu.institution}`,
              action: 'unchanged',
              id: existing._id
            });
          }
        }
      }
    }

    // 6. Sync Experience & Internships (Strictly real LinkedIn items)
    if (profile.experience && Array.isArray(profile.experience)) {
      for (let i = 0; i < profile.experience.length; i++) {
        const exp = profile.experience[i];
        const docId = `experience-linkedin-${createSlug(exp.company + '-' + exp.role)}`;

        const existing = existingExperience?.find(
          (e) => e._id === docId || (e.company?.toLowerCase() === exp.company.toLowerCase() && e.role?.toLowerCase() === exp.role.toLowerCase())
        );

        const expDoc = {
          _id: docId,
          _type: 'experience',
          role: exp.role,
          company: exp.company,
          type: exp.type || 'Internship',
          location: exp.location || 'Remote',
          startDate: exp.startDate,
          endDate: exp.endDate || (exp.current ? 'Present' : ''),
          current: Boolean(exp.current),
          summary: exp.summary || '',
          highlights: exp.highlights || [],
          technologies: exp.technologies || [],
          companyUrl: exp.companyUrl || '',
          order: i
        };

        if (!existing) {
          await writeClient.createOrReplace(expDoc);
          report.summary.experience.added++;
          report.details.push({
            type: 'experience',
            title: `${exp.role} @ ${exp.company}`,
            action: 'added',
            id: docId
          });
        } else {
          const hasChanged =
            existing.role !== expDoc.role ||
            existing.company !== expDoc.company ||
            existing.type !== expDoc.type ||
            existing.startDate !== expDoc.startDate ||
            existing.endDate !== expDoc.endDate ||
            existing.summary !== expDoc.summary;

          if (hasChanged) {
            await writeClient.createOrReplace({ ...existing, ...expDoc, _id: existing._id });
            report.summary.experience.updated++;
            report.details.push({
              type: 'experience',
              title: `${exp.role} @ ${exp.company}`,
              action: 'updated',
              id: existing._id
            });
          } else {
            report.summary.experience.unchanged++;
            report.details.push({
              type: 'experience',
              title: `${exp.role} @ ${exp.company}`,
              action: 'unchanged',
              id: existing._id
            });
          }
        }
      }
    }

    // 7. Sync Profile Summary & Leadership (Summarized via Gemini AI from LinkedIn experience and posts)
    try {
      // Check if user has manually locked their summary in Sanity
      const existingSummary = await activeClient.fetch(`*[_type == "profileSummary" && _id == "profile-summary"][0]`);

      if (!existingSummary || !existingSummary.isCustomOverride) {
        const profileSummary = await summarizeProfileWithGemini({
          name: profile.name,
          headline: profile.headline,
          about: (profile as any).about,
          experiences: profile.experience,
          education: profile.education,
          posts: (profile as any).posts || [],
          activities: (profile as any).activities || [],
        });

        await writeClient.createOrReplace({
          _id: 'profile-summary',
          _type: 'profileSummary',
          title: profileSummary.title,
          summary: profileSummary.summary,
          shortSummary: profileSummary.shortSummary,
          highlights: profileSummary.highlights,
          source: profileSummary.source,
          lastUpdated: timestamp,
          isCustomOverride: false,
        });
      } else {
        console.log('[LinkedIn Sync] Custom summary lock is enabled in Sanity Studio. Preserving manual edits.');
      }

      // Sync Leadership & Technical Activities
      const { activities: leadershipActivities } = await summarizeLeadershipWithGemini({
        name: profile.name,
        headline: profile.headline,
        experiences: profile.experience,
        posts: (profile as any).posts || [],
        activities: (profile as any).activities || [],
      });

      for (let i = 0; i < leadershipActivities.length; i++) {
        const item = leadershipActivities[i];
        const docId = `leadership-activity-${i}`;
        await writeClient.createOrReplace({
          _id: docId,
          _type: 'leadershipActivity',
          title: item.title,
          description: item.description,
          source: item.source || 'Gemini AI',
          order: i,
        });
      }
    } catch (aiErr: any) {
      console.warn('[LinkedIn Sync] AI summarization warning:', aiErr);
      await sendSummaryErrorEmail({
        stage: 'sanity_write',
        targetFile: 'src/lib/linkedinSync.ts',
        errorMessage: `Failed during AI summarization or Sanity document persistence: ${aiErr?.message || String(aiErr)}`,
        errorStack: aiErr?.stack,
        profileName: profile.name,
      });
    }

    // 8. Update Metadata on Successful Sync
    const nextScheduled = new Date(now.getTime() + minIntervalDays * 24 * 60 * 60 * 1000).toISOString();
    await writeClient.createOrReplace({
      _id: METADATA_DOC_ID,
      _type: 'syncMetadata',
      title: 'LinkedIn Scraper Sync State',
      lastSuccessfulSync: timestamp,
      lastAttempt: timestamp,
      lastStatus: 'success',
      failureCount: 0,
      lastError: null,
      source,
      nextScheduledSync: nextScheduled,
    });

    report.success = true;
    report.status = 'synced';
    report.lastSuccessfulSync = timestamp;
    report.nextScheduledSync = nextScheduled;
    report.message = `Successfully synchronized profile from LinkedIn (${source}). Next monthly scrape on ${new Date(nextScheduled).toLocaleDateString()}.`;

    return report;
  } catch (err: any) {
    console.error('[LinkedIn Sync] Error during sync:', err);
    report.error = err.message || String(err);
    report.status = 'failed';

    if (hasWriteToken) {
      try {
        await writeClient.createOrReplace({
          _id: METADATA_DOC_ID,
          _type: 'syncMetadata',
          title: 'LinkedIn Scraper Sync State',
          lastAttempt: timestamp,
          lastStatus: 'failed',
          failureCount: 1,
          lastError: err.message || String(err),
          source: report.source,
        });
      } catch (metaErr) {
        // ignore
      }
    }

    return report;
  }
}
