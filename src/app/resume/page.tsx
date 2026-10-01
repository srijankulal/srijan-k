"use client";

import { motion } from "framer-motion";
import Header from "@/components/HeaderFooter/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { educationQuery, experienceQuery, leadershipQuery, profileSummaryQuery } from "@/sanity/lib/queries";

interface EducationItem {
  _id?: string;
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

interface ExperienceItem {
  _id?: string;
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

interface LeadershipItem {
  _id?: string;
  title: string;
  description: string;
  source?: string;
  order?: number;
}

interface ProfileSummaryItem {
  _id?: string;
  title?: string;
  summary?: string;
  shortSummary?: string;
  highlights?: string[];
  source?: string;
}

const defaultResume = {
  name: "Srijan K",
  title: "Software Developer",
  location: "Mangalore, Karnataka, India",
  email: "srijankulal1010@gmail.com",
  phone: "+91 8762471304",
  github: "github.com/srijankulal",
  linkedin: "linkedin.com/in/srijan-kulal",
  website: "srijan-k.me",
  summary:
    "Backend-focused Software Developer with solid experience designing and deploying scalable RESTful APIs, full-stack web applications, and cross-platform mobile solutions. Proficient in Python (Flask), Next.js, TypeScript, Java (Spring Boot), Flutter, and PostgreSQL. Demonstrates strong problem-solving skills, solid understanding of software architecture, and a passion for embedded systems and IoT prototyping.",
  skills: {
    "Programming Languages": "Python, TypeScript, JavaScript, Java, C++, C#, Dart, SQL (PostgreSQL, MySQL)",
    "Frameworks & Web Tech": "Next.js, React, Flask, Spring Boot, Flutter, Node.js, Tailwind CSS, HTML5/CSS3",
    "Databases & Storage": "PostgreSQL, MySQL, Vercel Blob Storage, Sanity CMS",
    "IoT & Embedded Systems": "Arduino, PlatformIO, Microcontroller Interfacing, 7-Segment Display Controllers, C++",
    "Tools & Platforms": "Git, GitHub, Vercel, Postman, Linux/Unix, VS Code, CI/CD",
    "Core Competencies": "RESTful API Design, Object-Oriented Architecture, LSB Steganography, Database Modeling, Machine Learning Basics"
  },
  education: [
    {
      degree: "Bachelor of Computer Applications (B.C.A)",
      institution: "St. Aloysius University",
      location: "Mangalore, Karnataka, India",
      period: "2023 – Present",
      gpa: "In Progress",
      coursework:
        "Coursework in Data Structures, Algorithms, DBMS (PostgreSQL/MySQL), OOP (Java/C++), and Web Technologies."
    }
  ],
  projects: [
    {
      name: "ByteSize — AI Flashcard Platform",
      tech: "Next.js, React, Tailwind CSS, AI API",
      link: "https://byte-size-six.vercel.app",
      bullets: [
        "Constructed an intelligent flashcard application using Next.js and external AI APIs to automatically generate study decks from user prompt topics.",
        "Implemented custom document import/export, user topic collections, and responsive flashcard flip animations."
      ]
    },
    {
      name: "PlaylistCrafter — Spotify Playlist Manager",
      tech: "Python, Flask, Spotify Web API, OAuth 2.0, JavaScript",
      link: "https://github.com/srijankulal/PlaylistCrafter",
      bullets: [
        "Developed a web-based music curation tool integrating Spotify Web API with secure OAuth 2.0 user authentication.",
        "Engineered 'Song Sync' and 'Playlist Blend' algorithms for customized playlist generation based on user listening preferences."
      ]
    },
    {
      name: "PixelCypher — LSB Image Steganography Suite",
      tech: "Next.js, TypeScript, Java, Spring Boot, ImageIO",
      link: "https://pixelcypher-app.vercel.app",
      bullets: [
        "Designed a privacy-focused steganography tool encrypting secret text payloads into PNG image pixel channels using LSB techniques.",
        "Built complementary Spring Boot REST API with modular encode/decode endpoints, CORS handling, and unit test suites."
      ]
    },
    {
      name: "SyntiX — Remote PC Media Controller",
      tech: "Python, Flutter, Dart, Windows Core Audio API",
      link: "https://github.com/srijankulal/Syntix",
      bullets: [
        "Programmed a cross-platform mobile client in Flutter connecting over local socket network to control PC volume and brightness in real time.",
        "Integrated Windows Core Audio APIs within a Python daemon background server for lightweight hardware resource usage."
      ]
    },
    {
      name: "LED Display Driver Library",
      tech: "C++, Arduino Framework, PlatformIO",
      link: "https://github.com/srijankulal/LED_Display",
      bullets: [
        "Created an embedded C++ library facilitating digital pin control for standard 7-segment LED modules.",
        "Implemented character mapping tables for full English alphabet, numerical digits (0-9), and custom punctuation symbols."
      ]
    },
    {
      name: "clickXtract — Windows Shell Utility",
      tech: "C#, .NET, Windows Shell API",
      link: "https://github.com/srijankulal/clickXtract",
      bullets: [
        "Built a lightweight desktop utility streamlining one-click archive decompression for ZIP, RAR, and 7z archives with auto-folder creation."
      ]
    }
  ]
};

export default function ResumePage() {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [leadershipList, setLeadershipList] = useState<LeadershipItem[]>([]);
  const [profileSummary, setProfileSummary] = useState<ProfileSummaryItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [edu, exp, lead, summary] = await Promise.all([
          client.fetch(educationQuery),
          client.fetch(experienceQuery),
          client.fetch(leadershipQuery),
          client.fetch(profileSummaryQuery)
        ]);
        if (edu && Array.isArray(edu) && edu.length > 0) setEducationList(edu);
        if (exp && Array.isArray(exp) && exp.length > 0) setExperienceList(exp);
        if (lead && Array.isArray(lead) && lead.length > 0) setLeadershipList(lead);
        if (summary && summary.summary) setProfileSummary(summary);
      } catch (err) {
        console.error("Failed to load sanity resume data:", err);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="border border-border my-4 min-h-screen">
      <div className="print:hidden">
        <Header whereAt="projects" />
      </div>

      <div className="px-2 sm:px-4 md:px-8">
        {/* Page Top Action Bar (Hidden when printing) */}
        <div className="pt-12 pb-6 px-4 border-b border-border flex flex-col sm:flex-row sm:items-end justify-between gap-4 print:hidden">
          <div>
            <p className="section-label mb-1">// standard technical resume</p>
            <h2 className="text-4xl sm:text-5xl font-bold flex items-center">
              <span className="text-neon mr-1">&gt;</span>Resume
              <span className="ml-1 inline-block w-3 h-7 bg-neon animate-caret-blink" />
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 border border-neon/40 bg-neon/10 text-neon font-mono text-xs px-3.5 py-2 hover:bg-neon hover:text-black transition-all duration-200 cursor-pointer"
            >
              ⎙ Print / Save as PDF
            </button>
            <a
              href="/api/resume/pdf"
              download="Srijan_Kulal_Resume.pdf"
              className="flex items-center gap-1.5 border border-border/70 bg-foreground/5 text-foreground/80 font-mono text-xs px-3.5 py-2 hover:text-neon hover:border-neon/40 transition-all duration-200 cursor-pointer"
              title="Download IEEE Resume PDF"
            >
              ↓ Direct PDF
            </a>
            <Link
              href="/"
              className="flex items-center gap-1.5 border border-border/50 text-foreground/50 font-mono text-xs px-3.5 py-2 hover:text-foreground hover:border-border transition-all duration-200"
            >
              ← Portfolio
            </Link>
          </div>
        </div>

        {/* IEEE Standard Resume Document */}
        <main
          id="resume-document"
          className="max-w-4xl mx-auto my-8 sm:my-12 p-6 sm:p-10 border border-border/70 bg-black/20 text-foreground shadow-xl print:shadow-none print:border-none print:p-0 print:m-0 print:bg-white print:text-black"
        >
          {/* IEEE HEADER: Centered Full Name and Contact Row */}
          <header className="text-center pb-4 border-b-2 border-foreground/80 print:border-black">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider font-mono mb-2 text-foreground print:text-black">
              {defaultResume.name}
            </h1>
            <p className="font-mono text-xs sm:text-sm text-neon print:text-black font-semibold mb-2">
              {defaultResume.title} • {defaultResume.location}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-2.5 gap-y-1 font-mono text-xs text-foreground/75 print:text-black">
              <a href={`mailto:${defaultResume.email}`} className="hover:text-neon hover:underline print:no-underline">
                {defaultResume.email}
              </a>
              <span className="text-foreground/30 print:text-black">•</span>
              <a href={`tel:${defaultResume.phone}`} className="hover:text-neon hover:underline print:no-underline">
                {defaultResume.phone}
              </a>
              <span className="text-foreground/30 print:text-black">•</span>
              <a
                href={`https://${defaultResume.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon hover:underline print:no-underline"
              >
                {defaultResume.website}
              </a>
              <span className="text-foreground/30 print:text-black">•</span>
              <a
                href={`https://${defaultResume.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon hover:underline print:no-underline"
              >
                {defaultResume.github}
              </a>
              <span className="text-foreground/30 print:text-black">•</span>
              <a
                href={`https://${defaultResume.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neon hover:underline print:no-underline"
              >
                {defaultResume.linkedin}
              </a>
            </div>
          </header>

          {/* IEEE SECTION 1: PROFESSIONAL SUMMARY (Dynamic & Editable from Sanity CMS) */}
          <section className="mt-6">
            <h2 className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider text-neon print:text-black pb-1 border-b border-border/80 print:border-black">
              Professional Summary
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-foreground/85 print:text-black leading-relaxed text-justify">
              {profileSummary?.summary || defaultResume.summary}
            </p>
          </section>

          {/* IEEE SECTION 2: EDUCATION */}
          <section className="mt-6">
            <h2 className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider text-neon print:text-black pb-1 border-b border-border/80 print:border-black">
              Education
            </h2>
            <div className="mt-2 space-y-3">
              {educationList.length > 0 ? (
                educationList.map((edu, idx) => (
                  <div key={edu._id || idx} className="text-xs sm:text-sm">
                    <div className="flex flex-wrap justify-between items-baseline">
                      <span className="font-bold text-foreground print:text-black">{edu.degree}</span>
                      <span className="font-mono text-xs text-foreground/70 print:text-black">
                        {edu.startDate} – {edu.current ? "Present" : edu.endDate || "Present"}
                      </span>
                    </div>
                    <div className="flex flex-wrap justify-between items-baseline text-xs text-foreground/75 print:text-black">
                      <span>{edu.institution}, {edu.location}</span>
                      {edu.gpa && <span className="font-mono font-medium">Status / Grade: {edu.gpa}</span>}
                    </div>
                    {edu.description && (
                      <p className="text-xs text-foreground/70 print:text-black mt-1">{edu.description}</p>
                    )}
                  </div>
                ))
              ) : (
                defaultResume.education.map((edu, idx) => (
                  <div key={idx} className="text-xs sm:text-sm">
                    <div className="flex flex-wrap justify-between items-baseline">
                      <span className="font-bold text-foreground print:text-black">{edu.degree}</span>
                      <span className="font-mono text-xs text-foreground/70 print:text-black">{edu.period}</span>
                    </div>
                    <div className="flex flex-wrap justify-between items-baseline text-xs text-foreground/75 print:text-black">
                      <span>{edu.institution}, {edu.location}</span>
                      <span className="font-mono font-medium">Grade: {edu.gpa}</span>
                    </div>
                    <p className="text-xs text-foreground/70 print:text-black mt-1 leading-relaxed">
                      <span className="font-semibold text-foreground/90 print:text-black">Relevant Coursework:</span> {edu.coursework}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* IEEE SECTION 3: EXPERIENCE & INTERNSHIPS (Strictly from LinkedIn & Sanity) */}
          <section className="mt-6">
            <h2 className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider text-neon print:text-black pb-1 border-b border-border/80 print:border-black">
              Professional Experience &amp; Internships
            </h2>
            <div className="mt-2 space-y-4">
              {experienceList.length > 0 ? (
                experienceList.map((exp, idx) => (
                  <div key={exp._id || idx} className="text-xs sm:text-sm">
                    <div className="flex flex-wrap justify-between items-baseline">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-foreground print:text-black">{exp.role}</span>
                        <span className="text-foreground/50 print:text-black">|</span>
                        <span className="font-medium text-neon/90 print:text-black">{exp.company}</span>
                        <span className="text-xs font-mono text-foreground/50 print:text-black">({exp.type})</span>
                      </div>
                      <span className="font-mono text-xs text-foreground/70 print:text-black">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
                      </span>
                    </div>
                    {exp.location && (
                      <p className="text-xs text-foreground/60 print:text-black italic mb-1">{exp.location}</p>
                    )}
                    {exp.summary && (
                      <p className="text-xs text-foreground/80 print:text-black mb-1">{exp.summary}</p>
                    )}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-xs sm:text-sm text-foreground/85 print:text-black">
                        {exp.highlights.map((hl, i) => (
                          <li key={i} className="leading-relaxed">{hl}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-foreground/60 print:text-black italic">
                  No professional experience records currently found.
                </p>
              )}
            </div>
          </section>

          {/* IEEE SECTION 4: TECHNICAL PROJECTS */}
          <section className="mt-6">
            <h2 className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider text-neon print:text-black pb-1 border-b border-border/80 print:border-black">
              Technical Projects
            </h2>
            <div className="mt-2 space-y-3.5">
              {defaultResume.projects.map((proj, idx) => (
                <div key={idx} className="text-xs sm:text-sm">
                  <div className="flex flex-wrap justify-between items-baseline">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-foreground print:text-black">{proj.name}</span>
                      <span className="text-foreground/50 print:text-black">|</span>
                      <span className="font-mono text-xs text-neon/80 print:text-black">{proj.tech}</span>
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] text-foreground/60 hover:text-neon hover:underline print:hidden"
                      >
                        [Link ↗]
                      </a>
                    )}
                  </div>
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs sm:text-sm text-foreground/85 print:text-black">
                    {proj.bullets.map((b, i) => (
                      <li key={i} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* IEEE SECTION 5: TECHNICAL SKILLS */}
          <section className="mt-6">
            <h2 className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider text-neon print:text-black pb-1 border-b border-border/80 print:border-black">
              Technical Skills
            </h2>
            <div className="mt-2 space-y-1.5 text-xs sm:text-sm">
              {Object.entries(defaultResume.skills).map(([category, items]) => (
                <div key={category} className="leading-relaxed">
                  <span className="font-bold text-foreground print:text-black">{category}: </span>
                  <span className="text-foreground/85 print:text-black font-mono text-xs">{items}</span>
                </div>
              ))}
            </div>
          </section>

          {/* IEEE SECTION 6: LEADERSHIP & TECHNICAL ACTIVITIES (Dynamically Summarized from LinkedIn) */}
          <section className="mt-6 pb-2">
            <h2 className="text-sm sm:text-base font-bold font-mono uppercase tracking-wider text-neon print:text-black pb-1 border-b border-border/80 print:border-black">
              Leadership &amp; Technical Activities
            </h2>
            <ul className="list-disc list-outside ml-4 mt-2 space-y-1 text-xs sm:text-sm text-foreground/85 print:text-black">
              {leadershipList.length > 0 ? (
                leadershipList.map((item, idx) => (
                  <li key={item._id || idx} className="leading-relaxed">
                    <span className="font-semibold text-foreground print:text-black">{item.title}:</span>{" "}
                    <span>{item.description}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-foreground print:text-black">Open Source Leadership &amp; Tooling:</span> Active contributor and maintainer of open-source utilities and microcontroller libraries on GitHub.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold text-foreground print:text-black">Engineering Project Leadership:</span> Led technical engineering teams across network security, cryptography, and full-stack web applications.
                  </li>
                </>
              )}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
