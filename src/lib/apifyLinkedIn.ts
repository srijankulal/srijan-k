import { LinkedInProfileData, LinkedInEducation, LinkedInExperience } from './linkedinSync';

/**
 * Normalizes Apify harvestapi and other LinkedIn actor outputs into standard LinkedInProfileData
 */
export function normalizeApifyProfile(rawItem: any): LinkedInProfileData | null {
  if (!rawItem || typeof rawItem !== 'object') return null;

  const profile = rawItem.profile || rawItem.data || rawItem;

  const name =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.fullName || profile.name || 'Srijan Kulal';

  const headline = profile.headline || profile.title || '';
  const location =
    profile.location?.parsed?.text ||
    profile.location?.linkedinText ||
    profile.location ||
    'Mangalore, Karnataka, India';

  // Normalize Education
  const rawEducations =
    profile.education ||
    profile.educations ||
    profile.schools ||
    [];

  const education: LinkedInEducation[] = Array.isArray(rawEducations)
    ? rawEducations.map((edu: any, idx: number) => {
        const institution = (edu.schoolName || edu.school || edu.name || 'St. Aloysius University').trim();
        const degree = edu.degree || edu.degreeName || edu.qualification || 'Bachelor of Computer Applications (B.C.A)';
        const fieldOfStudy = edu.fieldOfStudy || 'Computer Applications';
        const eduLocation = 'Mangalore, Karnataka, India';

        const startDate =
          typeof edu.startDate === 'object'
            ? edu.startDate?.year?.toString() || edu.startDate?.text || '2023'
            : edu.startDate?.toString() || '2023';

        const endDate =
          typeof edu.endDate === 'object'
            ? edu.endDate?.year?.toString() || edu.endDate?.text || 'Present'
            : edu.endDate?.toString() || 'Present';

        const current =
          idx === 0 || endDate === 'Present' || endDate.includes('2026') || edu.current === true;

        const gpa = edu.grade || edu.gpa || (current ? 'In Progress' : 'Completed');

        const description =
          edu.description ||
          edu.insights ||
          'Coursework in Data Structures, Algorithms, DBMS (PostgreSQL/MySQL), OOP (Java/C++), and Web Technologies.';

        return {
          institution,
          degree,
          fieldOfStudy,
          location: eduLocation,
          startDate,
          endDate,
          current,
          gpa,
          description,
        };
      })
    : [];

  // Normalize Experience / Internships
  const rawExperiences =
    profile.experience ||
    profile.experiences ||
    profile.positions ||
    profile.positionHistory ||
    [];

  const experience: LinkedInExperience[] = Array.isArray(rawExperiences)
    ? rawExperiences.map((exp: any) => {
        const role = exp.position || exp.title || exp.role || 'Software Developer';
        const company = exp.companyName || exp.company || 'Organization';
        const type = exp.employmentType || (role.toLowerCase().includes('intern') ? 'Internship' : 'Full-time');
        const expLocation = exp.location || exp.workplaceType || 'Remote';

        const startDate =
          typeof exp.startDate === 'object'
            ? exp.startDate?.text || `${exp.startDate?.month || ''} ${exp.startDate?.year || ''}`.trim()
            : exp.startDate?.toString() || '2023';

        const endDate =
          typeof exp.endDate === 'object'
            ? exp.endDate?.text || `${exp.endDate?.month || ''} ${exp.endDate?.year || ''}`.trim()
            : exp.endDate?.toString() || 'Present';

        const current = Boolean(exp.current) || endDate.toLowerCase().includes('present');
        const summary = exp.description || '';

        // Extract clean bullet highlights from description
        const highlights = summary
          .split(/\n|•|▸|- /)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 15);

        const technologies: string[] = Array.isArray(exp.skills)
          ? exp.skills
          : Array.isArray(exp.technologies)
          ? exp.technologies
          : [];

        const companyUrl = exp.companyLinkedinUrl || exp.companyUrl || '';

        return {
          role,
          company,
          type,
          location: expLocation,
          startDate,
          endDate,
          current,
          summary,
          highlights: highlights.length > 0 ? highlights : [summary].filter(Boolean),
          technologies,
          companyUrl,
        };
      })
    : [];

  return {
    name,
    headline,
    location,
    education,
    experience,
  };
}

/**
 * Fetch live LinkedIn profile data via Apify HarvestAPI Actor
 */
export async function fetchLinkedInFromApify(
  profileUrl: string = 'https://www.linkedin.com/in/srijan-kulal/'
): Promise<{ data: LinkedInProfileData | null; error?: string }> {
  const apifyToken = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;

  if (!apifyToken) {
    return {
      data: null,
      error: 'APIFY_API_TOKEN is not set in environment variables.',
    };
  }

  const actorId =
    process.env.APIFY_ACTOR_ID || 'harvestapi~linkedin-profile-scraper';

  const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}&timeout=60`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queries: [profileUrl],
        urls: [profileUrl],
        profileUrls: [profileUrl],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        data: null,
        error: `Apify API responded with status ${response.status}: ${errText.slice(0, 200)}`,
      };
    }

    const items = await response.json();

    if (!Array.isArray(items) || items.length === 0) {
      return {
        data: null,
        error: 'Apify Actor returned empty dataset items.',
      };
    }

    const normalized = normalizeApifyProfile(items[0]);
    if (!normalized) {
      return {
        data: null,
        error: 'Failed to normalize Apify dataset item.',
      };
    }

    return { data: normalized };
  } catch (err: any) {
    return {
      data: null,
      error: `Apify request failed: ${err.message || String(err)}`,
    };
  }
}
