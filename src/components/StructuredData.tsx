/**
 * Structured data for AI crawlers, search engines, and job-matching bots.
 * Uses JSON-LD Person schema + a hidden but indexable text block.
 * This is 100% factual — no embellishments.
 */
export default function StructuredData() {
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Srijan Kulal",
        "alternateName": "Srijan K",
        "url": "https://srijan-k.me",
        "email": "srijankulal1010@gmail.com",
        "telephone": "+918762471304",
        "jobTitle": "Software Developer",
        "description": "Backend-focused software developer with experience in Python, Flask, Next.js, Flutter, and PostgreSQL. Interested in IoT and embedded systems. Currently pursuing B.C.A at St. Aloysius University, Mangalore.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Mangalore",
            "addressRegion": "Karnataka",
            "addressCountry": "IN"
        },
        "sameAs": [
            "https://github.com/srijankulal",
            "https://www.linkedin.com/in/srijan-kulal"
        ],
        "knowsAbout": [
            "Python", "Flask", "Next.js", "React", "TypeScript",
            "Flutter", "Dart", "PostgreSQL", "MySQL",
            "REST API Development", "Backend Development",
            "IoT", "Arduino", "Embedded Systems", "C++",
            "Machine Learning", "Computer Vision",
            "Java", "Spring Boot", "Node.js",
            "Git", "GitHub", "Vercel", "Web Development"
        ],
        "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "St. Aloysius University",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mangalore",
                "addressCountry": "IN"
            }
        },
        "hasOccupation": {
            "@type": "Occupation",
            "name": "Software Developer",
            "occupationLocation": {
                "@type": "Country",
                "name": "India"
            },
            "skills": "Python, Flask, Next.js, React, TypeScript, Flutter, PostgreSQL, REST APIs, IoT, Arduino"
        },
        "seeks": {
            "@type": "Demand",
            "name": "Software Developer Roles",
            "description": "Open to full-time positions, internships, and freelance projects in software development, backend engineering, full-stack development, and IoT."
        }
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Srijan K Portfolio",
        "url": "https://srijan-k.me",
        "author": {
            "@type": "Person",
            "name": "Srijan Kulal"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            {/*
              Hidden indexable text for AI crawlers and ATS systems.
              Visually hidden but accessible to screen readers and crawlers.
              All facts — no fabrications.
            */}
            <div className="sr-only" aria-label="Developer profile summary for indexing">
                <h1>Srijan Kulal — Software Developer</h1>
                <p>
                    Srijan Kulal is a software developer based in Mangalore, Karnataka, India.
                    Pursuing Bachelor of Computer Applications (B.C.A) at St. Aloysius University (2023–2026).
                    Available for software developer roles, backend developer positions, full-stack developer internships, and freelance projects.
                </p>
                <h2>Technical Skills</h2>
                <ul>
                    <li>Programming Languages: Python, TypeScript, JavaScript, Java, Dart, C++, C#</li>
                    <li>Frontend: React, Next.js, Flutter, Tailwind CSS</li>
                    <li>Backend: Flask, Node.js, Spring Boot, RESTful API design</li>
                    <li>Databases: PostgreSQL, MySQL</li>
                    <li>IoT and Embedded: Arduino, C++, PlatformIO, 7-segment displays</li>
                    <li>Other: Machine Learning, Computer Vision, Image Steganography, Git, Vercel</li>
                </ul>
                <h2>Projects</h2>
                <ul>
                    <li>ByteSize — AI-powered flashcard app built with Next.js and an AI API</li>
                    <li>PlaylistCrafter — Spotify API playlist tool using Python Flask and OAuth 2.0</li>
                    <li>PixelCypher — LSB image steganography app and Spring Boot REST API</li>
                    <li>SyntiX — Cross-platform remote PC control (Python desktop, Flutter mobile)</li>
                    <li>clickXtract — Windows file extraction utility in C#</li>
                    <li>LED Display Library — Arduino C++ library for 7-segment LED displays</li>
                </ul>
                <h2>Contact</h2>
                <p>Email: srijankulal1010@gmail.com</p>
                <p>Phone: +91 8762471304</p>
                <p>GitHub: github.com/srijankulal</p>
                <p>LinkedIn: linkedin.com/in/srijan-kulal</p>
                <p>Location: Mangalore, Karnataka, India</p>
                <h2>Open To</h2>
                <p>Full-time software developer roles, backend developer jobs, full-stack developer internships, freelance web development projects, IoT projects. 
                   Actively seeking opportunities in India and remote positions globally.</p>
            </div>
        </>
    );
}
