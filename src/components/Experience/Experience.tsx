"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { experienceQuery } from "@/sanity/lib/queries";
import { motion } from "framer-motion";
import Link from "next/link";

export interface ExperienceItem {
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
  order?: number;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await client.fetch(experienceQuery);
        if (data && Array.isArray(data)) {
          setExperiences(data);
        }
      } catch (err) {
        console.error("Failed to fetch experience from Sanity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'internship':
        return 'border-neon/40 text-neon bg-neon/5';
      case 'full-time':
        return 'border-blue-500/40 text-blue-700 dark:text-blue-400 bg-blue-500/5';
      case 'freelance':
        return 'border-amber-500/40 text-amber-700 dark:text-yellow-400 bg-amber-500/5';
      case 'open source':
        return 'border-purple-500/40 text-purple-700 dark:text-purple-400 bg-purple-500/5';
      default:
        return 'border-foreground/30 text-foreground/70 bg-foreground/5';
    }
  };

  return (
    <div id="experience" className="w-full my-16 px-4 sm:px-6 lg:px-8 pb-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        className="flex flex-col w-full"
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-left">
          <div className="text-left">
            <p className="section-label mb-1 text-left">// 03. experience</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-left">Experience &amp; Internships</h2>
          </div>
          <span className="font-mono text-xs text-foreground/40 self-start sm:self-end">
            $ cat experience.log
          </span>
        </motion.div>

        {loading ? (
          <div className="border-l-2 border-border/60 ml-2 sm:ml-4 pl-4 sm:pl-8 space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="border border-border/50 bg-card/50 dark:bg-black/10 p-6 animate-pulse space-y-3">
                <div className="h-5 bg-foreground/10 rounded w-1/3" />
                <div className="h-4 bg-foreground/10 rounded w-1/4" />
                <div className="h-3 bg-foreground/5 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="border border-border/50 p-6 font-mono text-sm text-foreground/60 text-center">
            No professional experience records synced yet.
          </div>
        ) : (
          /* Timeline list (strictly authentic LinkedIn items) */
          <div className="relative border-l-2 border-border/60 ml-2 sm:ml-4 pl-4 sm:pl-8 space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp._id || index}
                variants={itemVariants}
                className="relative group"
              >
                {/* Timeline node dot */}
                <span className="absolute -left-6.25 sm:-left-10.25 top-1.5 w-3 h-3 rounded-full bg-background border-2 border-neon group-hover:bg-neon group-hover:shadow-[0_0_10px_rgba(113,252,123,0.8)] transition-all duration-300" />

                <div className="border border-border bg-card/70 dark:bg-black/20 hover:border-neon/30 p-4 sm:p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(113,252,123,0.04)] relative">
                  {/* Corner chip accents */}
                  <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neon/40 pointer-events-none" />
                  <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neon/40 pointer-events-none" />

                  {/* Header row: Role, Company, Period */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-neon transition-colors">
                          {exp.role}
                        </h3>
                        <span className={`font-mono text-[10px] sm:text-xs px-2 py-0.5 border ${getTypeBadgeStyle(exp.type)} uppercase tracking-wider`}>
                          {exp.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm font-mono text-foreground/60 mt-1">
                        {exp.companyUrl ? (
                          <Link
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neon/80 hover:underline inline-flex items-center gap-1"
                          >
                            @{exp.company} ↗
                          </Link>
                        ) : (
                          <span className="text-foreground/80 font-semibold">@{exp.company}</span>
                        )}
                        {exp.location && (
                          <>
                            <span className="text-foreground/30">•</span>
                            <span className="text-foreground/50">{exp.location}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Period badge */}
                    <div className="font-mono text-xs text-neon/80 border border-neon/20 px-2.5 py-1 bg-neon/5 self-start sm:self-auto shrink-0">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
                    </div>
                  </div>

                  {/* Summary */}
                  {exp.summary && (
                    <p className="text-foreground/75 text-sm sm:text-base leading-relaxed mb-3">
                      {exp.summary}
                    </p>
                  )}

                  {/* Highlights */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1.5 mb-4 text-left">
                      {exp.highlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-foreground/80 leading-relaxed">
                          <span className="text-neon/60 mt-1 shrink-0 text-xs">▸</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] sm:text-xs px-2 py-0.5 border border-border/60 bg-foreground/5 text-foreground/70"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
