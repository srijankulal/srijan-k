"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { educationQuery, experienceQuery, profileSummaryQuery } from "@/sanity/lib/queries";

const staticData = {
    name: "Srijan Kulal",
    title: "Software Developer",
    location: "Mangalore, India",
    email: "srijankulal1010@gmail.com",
    website: "srijan-k.me",
    github: "github.com/srijankulal",
    linkedin: "linkedin.com/in/srijan-kulal",
    summary: "Backend-focused developer (B.C.A 2023–2026) specializing in Python/Flask, Next.js, and Flutter. Builds secure, scalable applications with real-time features. Also exploring IoT & embedded systems.",
    highlights: [
        "Full-stack web development with React/Next.js + Python Flask",
        "Mobile development with Flutter/Dart",
        "Database design with PostgreSQL & MySQL",
        "RESTful API design & integration",
        "IoT prototyping with Arduino (C++)",
        "Machine Learning & Computer Vision experiments",
    ],
    keyProjects: [
        { name: "ByteSize", role: "Co-developer", tech: "Next.js, AI API", desc: "AI flashcard generation app" },
        { name: "PixelCypher", role: "Solo developer", tech: "Next.js, Spring Boot, Java", desc: "Image steganography system (web + API)" },
        { name: "PlaylistCrafter", role: "Solo developer", tech: "Python/Flask, Spotify API", desc: "Spotify playlist creation tool" },
        { name: "SyntiX", role: "Solo developer", tech: "Python, Flutter", desc: "Cross-platform remote PC control app" },
        { name: "LED Display Library", role: "Author", tech: "C++, Arduino", desc: "Arduino library for 7-segment displays" },
    ],
    availability: "Open to internships, full-time roles, and freelance projects",
};

export default function RecruiterView() {
    const [experiences, setExperiences] = useState<any[]>([]);
    const [education, setEducation] = useState<any[]>([]);
    const [profileSummary, setProfileSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSanityData = async () => {
            try {
                const [exp, edu, summary] = await Promise.all([
                    client.fetch(experienceQuery),
                    client.fetch(educationQuery),
                    client.fetch(profileSummaryQuery)
                ]);
                if (exp && Array.isArray(exp)) setExperiences(exp);
                if (edu && Array.isArray(edu)) setEducation(edu);
                if (summary && (summary.summary || summary.shortSummary)) setProfileSummary(summary);
            } catch (e) {
                console.error("RecruiterView fetch error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchSanityData();
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 16 },
        visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } })
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border border-border p-6 relative"
            >
                <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon/50" />
                <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon/50" />
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-0.5">{staticData.name}</h1>
                        <p className="text-neon font-mono text-lg mb-2">{profileSummary?.title || staticData.title}</p>
                        <p className="font-mono text-sm text-foreground/50">{staticData.location}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 font-mono text-xs text-foreground/50">
                        <a href={`mailto:${staticData.email}`} className="hover:text-neon transition-colors">✉ {staticData.email}</a>
                        <a href={`https://${staticData.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-neon transition-colors">⌥ {staticData.github}</a>
                        <a href={`https://${staticData.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-neon transition-colors">in {staticData.linkedin}</a>
                    </div>
                </div>
                <p className="mt-4 text-foreground/70 leading-relaxed text-sm border-t border-border/40 pt-4">
                    {profileSummary?.shortSummary || profileSummary?.summary || staticData.summary}
                </p>
            </motion.div>

            {/* Availability badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 border border-neon/20 bg-neon/5 px-4 py-2.5 font-mono text-sm text-neon"
            >
                <span className="w-2 h-2 rounded-full bg-neon led-blink" />
                {staticData.availability}
            </motion.div>

            {/* Key Capabilities */}
            <div>
                <p className="section-label mb-3">// key capabilities</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {staticData.highlights.map((h, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            className="flex items-start gap-2 border border-border/30 px-3 py-2 hover:border-neon/20 transition-colors"
                        >
                            <span className="text-neon/50 mt-0.5 shrink-0">▸</span>
                            <span className="text-sm text-foreground/80">{h}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Experience & Internships (Strictly real LinkedIn / Sanity items) */}
            <div>
                <p className="section-label mb-3">// experience &amp; internships</p>
                <div className="space-y-3">
                    {experiences.length > 0 ? (
                        experiences.map((exp, i) => (
                            <motion.div
                                key={exp._id || i}
                                custom={i}
                                variants={fadeUp}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-col sm:flex-row sm:items-center justify-between border-l-2 border-neon/40 pl-4 py-1 hover:border-neon transition-colors"
                            >
                                <div>
                                    <span className="font-bold text-sm text-foreground">{exp.role}</span>
                                    <span className="text-foreground/50 text-xs font-mono ml-2">@{exp.company}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 sm:mt-0 font-mono text-xs">
                                    <span className="text-neon/80 border border-neon/20 px-2 py-0.5 bg-neon/5">
                                        {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
                                    </span>
                                    <span className="text-foreground/40 text-[10px] border border-border/50 px-1.5 py-0.5">{exp.type}</span>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-xs font-mono text-foreground/50 border border-border/30 p-3">
                            {loading ? "Loading experience records..." : "No experience records synced yet."}
                        </div>
                    )}
                </div>
            </div>

            {/* Education (From LinkedIn / Sanity) */}
            <div>
                <p className="section-label mb-3">// education</p>
                <div className="space-y-3">
                    {education.length > 0 ? (
                        education.map((edu, i) => (
                            <div key={edu._id || i} className="border border-border/40 p-4 bg-foreground/2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <p className="font-bold text-sm text-foreground">{edu.degree}</p>
                                    <p className="font-mono text-xs text-foreground/60">{edu.institution}, {edu.location}</p>
                                </div>
                                <span className="font-mono text-xs text-neon/80 border border-neon/20 px-2 py-0.5 bg-neon/5 self-start sm:self-auto">
                                    {edu.startDate} – {edu.current ? "Present" : edu.endDate || "Present"}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="border border-border/40 p-4 bg-foreground/2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <p className="font-bold text-sm text-foreground">Bachelor of Computer Applications (B.C.A)</p>
                                <p className="font-mono text-xs text-foreground/60">St. Aloysius University, Mangalore</p>
                            </div>
                            <span className="font-mono text-xs text-neon/80 border border-neon/20 px-2 py-0.5 bg-neon/5 self-start sm:self-auto">
                                2023 – Present
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Key Projects */}
            <div>
                <p className="section-label mb-3">// selected projects</p>
                <div className="space-y-3">
                    {staticData.keyProjects.map((p, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-l-2 border-border/30 pl-4 py-1 hover:border-neon/40 transition-colors group"
                        >
                            <span className="font-bold text-sm group-hover:text-neon transition-colors w-36 shrink-0">{p.name}</span>
                            <span className="text-foreground/50 text-xs font-mono">{p.tech}</span>
                            <span className="text-foreground/70 text-sm ml-auto">{p.desc}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-3 pt-4 border-t border-border/40"
            >
                <Link href="/resume" className="flex items-center gap-2 border border-neon/30 bg-neon/5 text-neon font-mono text-sm px-4 py-2 hover:bg-neon hover:text-black transition-all duration-200">
                    📄 View Full Resume
                </Link>
                <Link href="/#contact" className="flex items-center gap-2 border border-border/50 text-foreground/60 font-mono text-sm px-4 py-2 hover:text-foreground hover:border-border transition-all duration-200">
                    ✉ Get in Touch
                </Link>
                <Link href="/Projects" className="flex items-center gap-2 border border-border/50 text-foreground/60 font-mono text-sm px-4 py-2 hover:text-foreground hover:border-border transition-all duration-200">
                    ⌥ All Projects
                </Link>
            </motion.div>
        </div>
    );
}
