"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "../HeaderFooter/Header";
import Footer from "../HeaderFooter/Footer";

interface ProjectDetailViewProps {
  project: {
    _id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    description: string;
    isFreelance?: boolean;
    technologies: string[];
    link?: string;
    live?: string;
    detailsText?: string;
    details?: any[];
    _createdAt?: string;
  };
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Parse structured details into readable sections if available
  const rawText = project.detailsText || (Array.isArray(project.details) ? project.details.map(b => b?.children?.map((c: any) => c.text).join('')).join('\n\n') : '');
  
  const sections = rawText ? rawText.split('\n\n').filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-neon selection:text-black">
      <div className="border-x border-b border-border max-w-7xl mx-auto my-0 sm:my-4 shadow-2xl">
        <Header whereAt="projects" />

        <main className="px-4 sm:px-6 md:px-10 lg:px-12 pt-28 pb-20">
          {/* Breadcrumbs & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/50 text-xs font-mono">
            <Link 
              href="/Projects"
              className="inline-flex items-center gap-2 text-foreground/60 hover:text-neon transition-colors group"
            >
              <span className="text-neon group-hover:-translate-x-1 transition-transform">←</span>
              <span>// ALL PROJECTS</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-foreground/40">SYS_ID: {project.slug || project._id.slice(0, 8)}</span>
              <span className="text-border">•</span>
              <button 
                onClick={handleCopyLink}
                className="hover:text-neon text-foreground/60 transition-colors"
                title="Copy dossier link"
              >
                {copied ? "[ LINK COPIED ✓ ]" : "[ SHARE DOSSIER ]"}
              </button>
            </div>
          </div>

          {/* Project Header Banner */}
          <section className="py-8 md:py-12 border-b border-border/50">
            <div className="flex flex-wrap items-center gap-2.5 mb-4 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-neon led-blink" />
              <span className="text-neon uppercase tracking-wider font-semibold">
                {project.live ? "LIVE PRODUCTION" : "PROJECT DOSSIER"}
              </span>
              <span className="text-foreground/30">|</span>
              {project.isFreelance ? (
                <span className="border border-neon/50 bg-neon/10 text-neon px-2.5 py-0.5 text-[11px]">
                  FREELANCE DEPLOYMENT
                </span>
              ) : (
                <span className="border border-border/60 bg-border/20 text-foreground/60 px-2.5 py-0.5 text-[11px]">
                  ENGINEERING INITIATIVE
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
              <span className="text-neon font-mono text-3xl sm:text-4xl mr-2">&gt;</span>
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl text-foreground/80 max-w-4xl leading-relaxed mb-8">
              {project.description}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm">
              {project.live && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-neon text-black font-semibold hover:shadow-[0_0_25px_rgba(113,252,123,0.35)] transition-all flex items-center gap-2"
                >
                  <span>[ VISIT LIVE APPLICATION ↗ ]</span>
                </motion.a>
              )}

              {project.link && (
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-border hover:border-neon text-foreground hover:text-neon bg-background/80 transition-all flex items-center gap-2"
                >
                  <span>&lt; VIEW SOURCE CODE /&gt;</span>
                </motion.a>
              )}
            </div>
          </section>

          {/* Visual Showcase Viewport */}
          <section className="py-10 border-b border-border/50">
            <div className="relative border border-border bg-card/40 p-2 sm:p-4 group">
              {/* Corner tech accents */}
              <div className="absolute -top-1.5 -left-1.5 text-neon font-mono text-xs select-none">+</div>
              <div className="absolute -top-1.5 -right-1.5 text-neon font-mono text-xs select-none">+</div>
              <div className="absolute -bottom-1.5 -left-1.5 text-neon font-mono text-xs select-none">+</div>
              <div className="absolute -bottom-1.5 -right-1.5 text-neon font-mono text-xs select-none">+</div>

              <div className="flex items-center justify-between pb-3 px-2 border-b border-border/40 font-mono text-xs text-foreground/50">
                <span>VIEWPORT // PREVIEW_FEED</span>
                <span>{project.slug}.ui</span>
              </div>

              {project.imageUrl ? (
                <div className="relative w-full aspect-video max-h-[550px] overflow-hidden bg-black/60 mt-3 border border-border/40">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    priority
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="py-20 sm:py-28 px-4 flex flex-col items-center justify-center text-center bg-black/30 border border-dashed border-border/50 mt-3">
                  <div className="font-mono text-neon text-sm sm:text-base mb-2 tracking-wider">
                    [ SYSTEM SCHEMATIC ACTIVE ]
                  </div>
                  <p className="font-mono text-xs text-foreground/50 max-w-md mb-4">
                    Full technical documentation and cryptographic specifications compiled below.
                  </p>
                  <div className="font-mono text-[11px] text-foreground/30 border border-border/40 px-3 py-1 bg-background/50">
                    &gt; STATUS: READY FOR SANITY MEDIA UPLOAD
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Technical Specifications Grid */}
          <section className="py-10 border-b border-border/50">
            <p className="section-label mb-2">// specifications</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Technical Architecture Matrix</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border border-border bg-card/20 hover:border-neon/40 transition-colors">
                <span className="font-mono text-[11px] text-neon uppercase tracking-wider block mb-1">01. Architecture</span>
                <span className="text-sm font-semibold text-foreground/90 block">
                  {project.technologies.includes('Next.js') || project.technologies.includes('TanStack Start') ? 'Full-Stack SSR / Edge' : 'System & Cloud Pipeline'}
                </span>
              </div>

              <div className="p-4 border border-border bg-card/20 hover:border-neon/40 transition-colors">
                <span className="font-mono text-[11px] text-neon uppercase tracking-wider block mb-1">02. Primary Database</span>
                <span className="text-sm font-semibold text-foreground/90 block">
                  {project.technologies.includes('Supabase') ? 'Supabase PostgreSQL' : project.technologies.includes('PostgreSQL') ? 'PostgreSQL' : 'Cloud Database'}
                </span>
              </div>

              <div className="p-4 border border-border bg-card/20 hover:border-neon/40 transition-colors">
                <span className="font-mono text-[11px] text-neon uppercase tracking-wider block mb-1">03. Security & Cryptography</span>
                <span className="text-sm font-semibold text-foreground/90 block">
                  {project.technologies.includes('AES-256-GCM') ? 'AES-256-GCM Authenticated Cipher' : 'Role-Based Access & Auth'}
                </span>
              </div>

              <div className="p-4 border border-border bg-card/20 hover:border-neon/40 transition-colors">
                <span className="font-mono text-[11px] text-neon uppercase tracking-wider block mb-1">04. Source Integrity</span>
                <span className="text-sm font-semibold text-foreground/90 block">
                  {project.link ? 'Verified Git Repository' : 'Proprietary Core Build'}
                </span>
              </div>
            </div>
          </section>

          {/* Deep-Dive Breakdown & Architecture Text */}
          {sections.length > 0 && (
            <section className="py-10 border-b border-border/50">
              <p className="section-label mb-2">// blueprint</p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Detailed Engineering Breakdown</h2>

              <div className="space-y-6">
                {sections.map((sectionText, idx) => {
                  const isHeader = sectionText.startsWith('Core Features:') || 
                                   sectionText.startsWith('Architecture & Pipeline:') || 
                                   sectionText.startsWith('Security & Architecture:') ||
                                   sectionText.startsWith('Overview');

                  const lines = sectionText.split('\n');

                  return (
                    <div 
                      key={idx} 
                      className="border border-border/60 bg-card/30 p-5 sm:p-6 hover:border-neon/30 transition-colors"
                    >
                      {isHeader ? (
                        <div>
                          <h3 className="text-lg font-bold font-mono text-neon mb-3 flex items-center gap-2">
                            <span>//</span>
                            <span>{lines[0]}</span>
                          </h3>
                          <div className="space-y-2.5 text-sm sm:text-base text-foreground/80 leading-relaxed font-sans pl-2">
                            {lines.slice(1).map((line, lIdx) => (
                              <p key={lIdx} className="flex items-start gap-2">
                                <span className="text-neon/70 font-mono mt-1 shrink-0">▸</span>
                                <span>{line.replace(/^•\s*/, '')}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm sm:text-base text-foreground/80 leading-relaxed font-sans">
                          {lines.map((line, lIdx) => (
                            <p key={lIdx} className={line.startsWith('•') ? "flex items-start gap-2 pl-2" : ""}>
                              {line.startsWith('•') && <span className="text-neon/70 font-mono mt-1 shrink-0">▸</span>}
                              <span>{line.replace(/^•\s*/, '')}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Full Tech Stack Matrix */}
          <section className="py-10">
            <p className="section-label mb-2">// stack</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Technologies & Frameworks</h2>

            <div className="flex flex-wrap gap-2.5">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 border border-border bg-card font-mono text-xs sm:text-sm text-foreground/80 hover:text-neon hover:border-neon/50 hover:bg-neon/5 transition-all duration-200"
                >
                  <span className="text-neon/40 mr-1.5">#</span>
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/Projects"
                className="font-mono text-xs sm:text-sm text-neon hover:underline flex items-center gap-2"
              >
                <span>←</span>
                <span>EXPLORE ALL PROJECTS</span>
              </Link>

              <Link
                href="/#contact"
                className="font-mono text-xs sm:text-sm border border-border px-4 py-2 hover:border-neon hover:text-neon transition-colors"
              >
                [ DISCUSS THIS PROJECT → ]
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
