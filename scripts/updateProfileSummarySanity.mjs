import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '33fg8g6b';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN;

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-02-04',
  token,
  useCdn: false,
});

const correctSummary = {
  _id: 'profile-summary',
  _type: 'profileSummary',
  title: 'Software Developer',
  summary:
    'As an MCA student at MIT Manipal, I am deeply passionate about technology and continuous learning. My primary expertise spans Artificial Intelligence, software engineering, and full-stack web development, and I am currently expanding my technical horizons by actively exploring IoT and embedded systems. I thrive in collaborative, fast-paced environments and actively participate in technical events, collegiate competitions, and hackathons to build practical solutions and challenge myself alongside my peers.',
  shortSummary:
    'MCA student at MIT Manipal specializing in AI, full-stack software engineering, and embedded IoT systems.',
  highlights: [
    'Academic & Specialization: MCA student at MIT Manipal focusing on Artificial Intelligence, distributed architectures, and modern software engineering.',
    'Full-Stack & Web Engineering: Built scalable web applications and RESTful APIs using Next.js, Python (Flask), Java (Spring Boot), TypeScript, and PostgreSQL.',
    'IoT & Embedded Systems: Practical prototyping experience with microcontrollers, Arduino (C++), and hardware-level telemetry.',
    'Technical Leadership & Hackathons: Active participant and top achiever in competitive collegiate hackathons, technical fests, and cross-functional team projects.',
    'Systems & Digital Forensics: Real-world internship background in Linux security controls and Windows digital forensics analysis.'
  ],
  source: 'MIT Manipal Profile Alignment',
  lastUpdated: new Date().toISOString(),
};

async function updateSanity() {
  console.log('🔄 Updating Sanity profileSummary document...');
  try {
    const res = await client.createOrReplace(correctSummary);
    console.log('✅ Sanity profileSummary successfully updated:', res._id);
  } catch (err) {
    console.error('❌ Failed to update Sanity:', err);
  }
}

updateSanity();
