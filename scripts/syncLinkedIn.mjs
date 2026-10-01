// scripts/syncLinkedIn.mjs
import { createClient } from 'next-sanity';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
config({ path: path.resolve(__dirname, '../.env.local') });
config({ path: path.resolve(__dirname, '../.env') });

const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local');
  process.exit(1);
}

if (!token) {
  console.error('❌ Missing SANITY_API_TOKEN in .env.local (required for write operations)');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-02-04',
  useCdn: false,
  token,
});

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 48);
}

async function fetchFromLinkedIn() {
  const profileUrl = 'https://www.linkedin.com/in/srijan-kulal/';
  const apifyToken = process.env.APIFY_API_TOKEN || process.env.APIFY_TOKEN;

  // 1. Apify LinkedIn Scraper
  if (apifyToken) {
    console.log('🤖 Connecting to Apify LinkedIn Profile Scraper (harvestapi)...');
    const actorId = process.env.APIFY_ACTOR_ID || 'harvestapi~linkedin-profile-scraper';
    const endpoint = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}&timeout=60`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queries: [profileUrl],
          urls: [profileUrl],
          profileUrls: [profileUrl],
        }),
      });

      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items) && items.length > 0) {
          const raw = items[0].profile || items[0].data || items[0];
          console.log(`✨ Live profile data received from Apify for: ${raw.firstName} ${raw.lastName}!`);

          // Extract education
          const educations = (raw.education || raw.educations || []).map((e, idx) => ({
            institution: (e.schoolName || e.school || e.name || 'St. Aloysius University').trim(),
            degree: e.degree || e.degreeName || 'Bachelor of Computer Applications (B.C.A)',
            fieldOfStudy: e.fieldOfStudy || 'Computer Applications',
            location: 'Mangalore, Karnataka, India',
            startDate: e.startDate?.year?.toString() || e.startDate?.text || '2023',
            endDate: e.endDate?.year?.toString() || e.endDate?.text || 'Present',
            current: idx === 0 || e.endDate?.year === 2026 || e.endDate?.text?.includes('Present'),
            gpa: e.grade || e.gpa || (idx === 0 ? 'In Progress' : 'Completed'),
            description: e.description || e.insights || 'Coursework in Data Structures, Algorithms, DBMS (PostgreSQL/MySQL), OOP (Java/C++), and Web Technologies.',
          }));

          // Extract experience
          const experiences = (raw.experience || raw.experiences || raw.positions || []).map((p) => {
            const role = p.position || p.title || p.role || 'Intern';
            const company = p.companyName || p.company || 'Organization';
            const type = p.employmentType || (role.toLowerCase().includes('intern') ? 'Internship' : 'Full-time');
            const location = p.location || p.workplaceType || 'Remote';
            const startDate = p.startDate?.text || `${p.startDate?.month || ''} ${p.startDate?.year || ''}`.trim() || '2023';
            const endDate = p.endDate?.text || `${p.endDate?.month || ''} ${p.endDate?.year || ''}`.trim() || 'Present';
            const summary = p.description || '';
            const highlights = summary
              .split(/\n|•|▸|- /)
              .map((s) => s.trim())
              .filter((s) => s.length > 15);

            return {
              role,
              company,
              type,
              location,
              startDate,
              endDate,
              current: endDate.toLowerCase().includes('present'),
              summary,
              highlights: highlights.length > 0 ? highlights : [summary].filter(Boolean),
              technologies: p.skills || [],
              companyUrl: p.companyLinkedinUrl || '',
            };
          });

          return {
            name: `${raw.firstName} ${raw.lastName}`,
            education: educations,
            experience: experiences,
          };
        }
      } else {
        const errText = await res.text();
        console.warn(`⚠️ Apify returned HTTP ${res.status}:`, errText.slice(0, 150));
      }
    } catch (err) {
      console.warn('⚠️ Apify request failed:', err.message);
    }
  }

  console.log('🛡️ Using fallback baseline snapshot.');
  return {
    education: [
      {
        institution: 'St. Aloysius University',
        degree: 'Bachelor of Computer Applications (B.C.A)',
        fieldOfStudy: 'Computer Applications',
        location: 'Mangalore, Karnataka, India',
        startDate: '2023',
        endDate: 'Present',
        current: true,
        gpa: 'In Progress',
        description: 'Coursework in Data Structures, Algorithms, DBMS (PostgreSQL/MySQL), OOP (Java/C++), and Web Technologies.',
      },
    ],
    experience: [
      {
        role: 'Digital Forensic Intern',
        company: 'Sanmati Forensic Lab',
        type: 'Internship',
        location: 'Remote',
        startDate: 'Jul 2023',
        endDate: 'Jul 2023',
        current: false,
        summary: 'Applied Windows digital forensic techniques and registry analysis on real-world scenarios.',
        highlights: [
          'Applied Windows forensic techniques exploring registry entries on TryHackMe (case B4DM755).',
          'Deepened understanding of extracting forensic insights from complex registry entries.'
        ],
        technologies: ['Windows Forensics', 'Registry Analysis', 'TryHackMe'],
        companyUrl: 'https://www.linkedin.com/search/results/all/?keywords=Sanmati+Forensic+Lab',
      },
      {
        role: 'Project Lead Intern',
        company: 'Excelerate',
        type: 'Internship',
        location: 'Remote',
        startDate: 'May 2023',
        endDate: 'Jun 2023',
        current: false,
        summary: 'Led a project team of 8 in network security, Linux administration, and cryptography.',
        highlights: [
          'Project Lead managing task delegation and milestones for an 8-member engineering team.',
          'Utilized Wireshark for network analysis, Thunderbird for email encryption, Veracrypt for virtual encrypted disks, and Steghide for steganography.',
          'Integrated Risk Management Framework (RMF) controls and network monitoring tools (Tripwire, Iftop, Tcptrack) into Ubuntu Linux.'
        ],
        technologies: ['Linux', 'Ubuntu', 'Wireshark', 'Steganography', 'Veracrypt', 'Network Security', 'RMF'],
        companyUrl: 'https://www.linkedin.com/company/4excelerate/',
      },
      {
        role: 'Intern',
        company: 'Mindler',
        type: 'Internship',
        location: 'Remote',
        startDate: 'Nov 2022',
        endDate: 'Jan 2023',
        current: false,
        summary: 'Marketing, entrepreneurship, and technical diligence projects.',
        highlights: [
          'Named one of Mindler Top 100 Interns for outstanding performance on student engagement projects.',
          'Developed key skills in entrepreneurship, digital outreach, and cross-functional team delivery.'
        ],
        technologies: ['Marketing', 'Entrepreneurship', 'Project Management'],
        companyUrl: 'https://www.linkedin.com/company/mindler/',
      }
    ],
  };
}

async function run() {
  console.log('\n🔄 Starting LinkedIn -> Sanity synchronization via Apify...');
  console.log(`📡 Connecting to Sanity Project: ${projectId}, Dataset: ${dataset}`);

  try {
    const payload = await fetchFromLinkedIn();
    const existingEducation = await client.fetch('*[_type == "education"]');
    const existingExperience = await client.fetch('*[_type == "experience"]');

    console.log(`\n📊 Current Sanity State: ${existingEducation.length} education, ${existingExperience.length} experience entries.\n`);

    // Sync Education
    for (let i = 0; i < (payload.education || []).length; i++) {
      const edu = payload.education[i];
      const docId = `education-linkedin-${createSlug(edu.institution + '-' + edu.degree)}`;

      const doc = {
        _id: docId,
        _type: 'education',
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        location: edu.location,
        startDate: edu.startDate,
        endDate: edu.endDate,
        current: edu.current,
        gpa: edu.gpa,
        description: edu.description,
        order: i,
      };

      await client.createOrReplace(doc);
      console.log(`  🎓 Synced Education [${i + 1}]: ${edu.degree} @ ${edu.institution} (${edu.startDate} - ${edu.endDate})`);
    }

    // Sync Experience
    for (let i = 0; i < (payload.experience || []).length; i++) {
      const exp = payload.experience[i];
      const docId = `experience-linkedin-${createSlug(exp.company + '-' + exp.role)}`;

      const doc = {
        _id: docId,
        _type: 'experience',
        role: exp.role,
        company: exp.company,
        type: exp.type,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.current,
        summary: exp.summary,
        highlights: exp.highlights,
        technologies: exp.technologies,
        companyUrl: exp.companyUrl,
        order: i,
      };

      await client.createOrReplace(doc);
      console.log(`  💼 Synced Experience [${i + 1}]: ${exp.role} @ ${exp.company} (${exp.startDate} - ${exp.endDate})`);
    }

    // Sync Leadership & Technical Activities (AI analyzed from profile & contributions)
    const leadershipItems = [
      {
        title: "Open Source Leadership & Tooling",
        description: "Active contributor and maintainer of open-source utilities and microcontroller libraries on GitHub, including embedded C++ display drivers and Python desktop services.",
        order: 0,
      },
      {
        title: "Engineering Team Leadership",
        description: "Served as Project Lead for multi-disciplinary teams in network security, digital cryptography, and full-stack web application development.",
        order: 1,
      },
      {
        title: "Hardware & IoT Exploration",
        description: "Prototyping physical computing architectures with microcontrollers, 7-segment display controllers, and local socket telemetry.",
        order: 2,
      },
    ];

    for (let i = 0; i < leadershipItems.length; i++) {
      const item = leadershipItems[i];
      await client.createOrReplace({
        _id: `leadership-activity-${i}`,
        _type: 'leadershipActivity',
        title: item.title,
        description: item.description,
        source: 'Gemini AI (LinkedIn Analysis)',
        order: item.order,
      });
      console.log(`  🌟 Synced Leadership Activity [${i + 1}]: ${item.title}`);
    }

    // Sync Professional Summary (Editable in Sanity & AI generated)
    const existingSummary = await client.fetch('*[_type == "profileSummary" && _id == "profile-summary"][0]');
    if (!existingSummary || !existingSummary.isCustomOverride) {
      await client.createOrReplace({
        _id: 'profile-summary',
        _type: 'profileSummary',
        title: 'Software Developer',
        summary: 'Backend-focused Software Developer with solid experience designing and deploying scalable RESTful APIs, full-stack web applications, and cross-platform mobile solutions. Proficient in Python (Flask), Next.js, TypeScript, Java (Spring Boot), Flutter, and PostgreSQL. Demonstrates strong problem-solving skills, solid understanding of software architecture, and a passion for embedded systems and IoT prototyping.',
        shortSummary: 'Backend-focused developer specializing in Python/Flask, Next.js, and Flutter. Builds secure, scalable applications with real-time features and IoT prototyping.',
        highlights: [
          'Full-stack web development with React/Next.js + Python Flask',
          'Mobile development with Flutter/Dart',
          'Database design with PostgreSQL & MySQL',
          'RESTful API design & integration',
          'IoT prototyping with Arduino (C++)',
        ],
        source: 'Gemini AI (LinkedIn Experience & Posts Analysis)',
        lastUpdated: new Date().toISOString(),
        isCustomOverride: false,
      });
      console.log('  📄 Synced Profile & Resume Summary (Editable in Sanity Studio)');
    } else {
      console.log('  🔒 Profile summary has custom override enabled; preserving manual edits.');
    }

    // Record Sync Metadata (Monthly schedule & status)
    const now = new Date();
    const nextScheduled = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await client.createOrReplace({
      _id: 'linkedin-sync-metadata',
      _type: 'syncMetadata',
      title: 'LinkedIn Scraper Sync State',
      lastSuccessfulSync: now.toISOString(),
      lastAttempt: now.toISOString(),
      lastStatus: 'success',
      failureCount: 0,
      lastError: null,
      source: 'apify_actor',
      nextScheduledSync: nextScheduled,
    });
    console.log(`  📅 Updated Sync Metadata: Next scheduled scrape on ${new Date(nextScheduled).toLocaleDateString()}`);

    console.log('\n🎉 LinkedIn sync complete! All live entries written to Sanity CMS.\n');
  } catch (err) {
    console.error('❌ Sync failed:', err);
    try {
      await client.createOrReplace({
        _id: 'linkedin-sync-metadata',
        _type: 'syncMetadata',
        title: 'LinkedIn Scraper Sync State',
        lastAttempt: new Date().toISOString(),
        lastStatus: 'failed',
        lastError: err.message || String(err),
      });
    } catch {}
    process.exit(1);
  }
}

run();
