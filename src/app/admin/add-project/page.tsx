'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ExtractedProject {
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  linkToCode: string;
  linkToLive: string;
  isFreelance: boolean;
  detailsText: string;
  missing: {
    image: boolean;
    linkToCode: boolean;
    linkToLive: boolean;
  };
}

export default function AddProjectPortal() {
  const [step, setStep] = useState<'input' | 'review' | 'success'>('input');
  const [readmeText, setReadmeText] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Extracted and editable project state
  const [project, setProject] = useState<ExtractedProject | null>(null);
  const [newTechInput, setNewTechInput] = useState('');

  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [skipImage, setSkipImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success output state
  const [publishedSlug, setPublishedSlug] = useState('');
  const [publishedTitle, setPublishedTitle] = useState('');

  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubFetchStatus, setGithubFetchStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch README directly from GitHub repo
  async function handleFetchFromGithub() {
    if (!githubUrl.trim()) {
      setErrorMessage('Please enter a GitHub repository URL first.');
      return;
    }

    setIsFetchingGithub(true);
    setErrorMessage('');
    setGithubFetchStatus(null);

    try {
      const token = sessionStorage.getItem('admin_portal_token') || sessionStorage.getItem('posts_portal_token') || '';
      const res = await fetch(`/api/admin/fetch-github-readme?url=${encodeURIComponent(githubUrl.trim())}&token=${encodeURIComponent(token)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch README from GitHub.');
      }

      setReadmeText(data.readme);
      setGithubFetchStatus({
        success: true,
        message: `✓ Successfully fetched README.md from ${data.owner}/${data.repo}`,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Error fetching README from GitHub.');
      setGithubFetchStatus({
        success: false,
        message: `Failed to fetch: ${err.message}`,
      });
    } finally {
      setIsFetchingGithub(false);
    }
  }

  // Handle Gemini parsing
  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!readmeText.trim() && !githubUrl.trim()) {
      setErrorMessage('Please paste README markdown content or enter a GitHub repository URL.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const token = sessionStorage.getItem('admin_portal_token') || sessionStorage.getItem('posts_portal_token') || '';
      const res = await fetch('/api/admin/parse-readme', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ readme: readmeText, githubUrl: githubUrl.trim(), token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze README.');
      }

      setProject(data.project);
      setStep('review');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with Gemini parser.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  // Handle image file selection
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setSkipImage(false);
    }
  }

  function handleRemoveImage() {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Tech tags management
  function handleAddTech(e: React.KeyboardEvent | React.MouseEvent) {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!newTechInput.trim() || !project) return;
    const clean = newTechInput.trim();
    if (!project.technologies.includes(clean)) {
      setProject({ ...project, technologies: [...project.technologies, clean] });
    }
    setNewTechInput('');
  }

  function handleRemoveTech(techToRemove: string) {
    if (!project) return;
    setProject({
      ...project,
      technologies: project.technologies.filter(t => t !== techToRemove),
    });
  }

  // Handle publishing to Sanity
  async function handlePublish() {
    if (!project) return;
    if (!project.title.trim() || !project.slug.trim()) {
      setErrorMessage('Project title and slug cannot be empty.');
      return;
    }

    setIsPublishing(true);
    setErrorMessage('');

    try {
      const token = sessionStorage.getItem('admin_portal_token') || sessionStorage.getItem('posts_portal_token') || '';
      const formData = new FormData();
      formData.append('projectData', JSON.stringify({ ...project, token }));

      if (selectedImage && !skipImage) {
        formData.append('image', selectedImage);
      }

      const res = await fetch('/api/admin/publish-project', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project to Sanity.');
      }

      setPublishedSlug(data.slug);
      setPublishedTitle(data.title);
      setStep('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to publish to Sanity.');
    } finally {
      setIsPublishing(false);
    }
  }

  function handleReset() {
    setStep('input');
    setReadmeText('');
    setGithubUrl('');
    setProject(null);
    handleRemoveImage();
    setSkipImage(false);
    setErrorMessage('');
  }

  return (
    <div className="min-h-screen bg-[#070b0f] text-gray-200 font-mono p-4 sm:p-6 md:p-10 selection:bg-neon selection:text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-neon mb-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-neon led-blink" />
              <span>// ADMIN CREATOR PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
              &gt; README to Sanity Project Ingestion
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/admin/posts-sync"
              className="text-gray-400 hover:text-neon border border-border/50 px-3 py-1.5 transition-colors"
            >
              [ LinkedIn Sync ]
            </Link>
            <Link
              href="/Projects"
              className="text-gray-400 hover:text-neon border border-border/50 px-3 py-1.5 transition-colors"
            >
              [ View Projects ]
            </Link>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="border border-red-500/50 bg-red-950/30 p-4 text-xs text-red-300 flex items-start gap-3">
            <span className="text-red-400 font-bold">⚠ ERROR:</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: INPUT README */}
        {step === 'input' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border/80 bg-[#0d131a] p-5 sm:p-8 space-y-6 shadow-xl"
          >
            <div>
              <p className="text-neon text-xs mb-1 font-bold">// STEP 01. INGESTION</p>
              <h2 className="text-lg font-bold text-white mb-2">Paste README Markdown</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                Paste the contents of your GitHub project README. Gemini 3.1 Flash will automatically parse title, slug, summary, tech stack, architecture, and feature bullets.
              </p>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    GitHub Repository URL:
                  </label>
                  <span className="text-[10px] text-gray-500">
                    Enter repo URL to auto-fetch README
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://github.com/srijankulal/my-project"
                    value={githubUrl}
                    onChange={(e) => {
                      setGithubUrl(e.target.value);
                      setGithubFetchStatus(null);
                    }}
                    className="grow bg-[#05080c] border border-border/60 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleFetchFromGithub}
                    disabled={isFetchingGithub || !githubUrl.trim()}
                    className="px-4 py-2.5 border border-neon/40 bg-neon/10 hover:bg-neon hover:text-black text-neon text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1.5"
                  >
                    {isFetchingGithub ? (
                      <>
                        <span className="animate-spin inline-block">⟳</span>
                        <span>FETCHING...</span>
                      </>
                    ) : (
                      <span>⬇ FETCH README</span>
                    )}
                  </button>
                </div>

                {githubFetchStatus && (
                  <div className={`mt-2 text-xs font-mono p-2 border ${
                    githubFetchStatus.success 
                      ? 'border-neon/40 bg-neon/5 text-neon' 
                      : 'border-red-500/40 bg-red-950/20 text-red-300'
                  }`}>
                    {githubFetchStatus.message}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-300">
                    README.md Markdown Content: {githubUrl ? '(Auto-filled or paste manually)' : '*'}
                  </label>
                  {readmeText && (
                    <span className="text-[10px] text-neon/70">
                      {readmeText.length} characters loaded
                    </span>
                  )}
                </div>
                <textarea
                  rows={16}
                  required={!githubUrl.trim()}
                  placeholder="# 📮 Project Name — Tagline&#10;&#10;A crisp description of what the project does...&#10;&#10;## Features&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Tech Stack&#10;- React, Vite, Supabase..."
                  value={readmeText}
                  onChange={(e) => setReadmeText(e.target.value)}
                  className="w-full bg-[#05080c] border border-border/60 p-4 text-xs text-gray-200 placeholder-gray-600 font-mono focus:outline-none focus:border-neon transition-colors leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setReadmeText('')}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  [ Clear Textarea ]
                </button>

                <button
                  type="submit"
                  disabled={isAnalyzing || !readmeText.trim()}
                  className="px-6 py-3 bg-neon text-black font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(113,252,123,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="animate-spin inline-block">⟳</span>
                      <span>PARSING WITH GEMINI AI...</span>
                    </>
                  ) : (
                    <span>⚡ ANALYZE &amp; EXTRACT METADATA →</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 2: REVIEW, PHOTO UPLOAD & MISSING FIELDS */}
        {step === 'review' && project && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border/80 bg-[#0d131a] p-5 sm:p-8 space-y-6 shadow-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-4">
              <div>
                <p className="text-neon text-xs font-bold">// STEP 02. REVIEW &amp; ASSETS</p>
                <h2 className="text-lg font-bold text-white">Review Extracted Data &amp; Upload Media</h2>
              </div>
              <button
                onClick={() => setStep('input')}
                className="text-xs text-gray-400 hover:text-white border border-border/50 px-3 py-1 transition-colors"
              >
                ← Back to README
              </button>
            </div>

            {/* Missing Assets Notice */}
            {(project.missing.image || project.missing.linkToLive || project.missing.linkToCode) && (
              <div className="border border-yellow-500/40 bg-yellow-950/20 p-4 text-xs space-y-1.5 text-yellow-200">
                <div className="font-bold flex items-center gap-2">
                  <span className="text-yellow-400">⚡</span>
                  <span>Missing Details Checklist:</span>
                </div>
                <div className="pl-5 space-y-1 text-gray-300">
                  {project.missing.image && (
                    <p className="text-yellow-300/90">
                      • Preview Photo: Please upload a preview image below or click &quot;Skip&quot; to publish without it.
                    </p>
                  )}
                  {project.missing.linkToLive && (
                    <p className="text-gray-300">
                      • Live Demo URL: Not detected in README. You can enter it below or leave it empty ([ OFFLINE ]).
                    </p>
                  )}
                  {project.missing.linkToCode && (
                    <p className="text-gray-300">
                      • GitHub Code URL: Not detected in README. You can enter it below or leave it empty.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Photo / Image Upload Section */}
            <div className="border border-border/60 bg-[#080d12] p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <span>📸 Project Preview Image:</span>
                  {selectedImage ? (
                    <span className="text-neon text-[11px] font-normal">[ Ready to Upload ]</span>
                  ) : skipImage ? (
                    <span className="text-gray-400 text-[11px] font-normal">[ Skipped ]</span>
                  ) : (
                    <span className="text-yellow-400 text-[11px] font-normal">[ Action Requested ]</span>
                  )}
                </label>

                {!selectedImage && (
                  <button
                    type="button"
                    onClick={() => setSkipImage(!skipImage)}
                    className="text-[11px] text-neon hover:underline"
                  >
                    {skipImage ? "[-] Upload Photo Instead" : "[+] Skip Photo Upload"}
                  </button>
                )}
              </div>

              {!skipImage && (
                <div className="space-y-3">
                  {imagePreview ? (
                    <div className="relative aspect-video max-h-60 w-full overflow-hidden border border-border bg-black">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-950/80 text-red-300 border border-red-500/60 text-xs px-2.5 py-1 hover:bg-red-800 transition-colors"
                      >
                        [ Remove Image ]
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border/60 hover:border-neon/60 bg-black/30 p-8 text-center cursor-pointer transition-colors"
                    >
                      <p className="text-sm font-bold text-gray-200 mb-1">
                        Drag and drop a project screenshot or click to browse
                      </p>
                      <p className="text-xs text-gray-500">Supports PNG, JPG, WEBP (Max 10MB)</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Project Title: *
                </label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  className="w-full bg-[#05080c] border border-border/60 px-3 py-2 text-xs text-white focus:outline-none focus:border-neon"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Slug (URL identifier): *
                </label>
                <input
                  type="text"
                  value={project.slug}
                  onChange={(e) => setProject({ ...project, slug: e.target.value })}
                  className="w-full bg-[#05080c] border border-border/60 px-3 py-2 text-xs text-white focus:outline-none focus:border-neon"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-300">
                    GitHub / Code URL:
                  </label>
                  {!project.linkToCode && (
                    <span className="text-[10px] text-gray-500">[ Optional ]</span>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={project.linkToCode}
                  onChange={(e) => setProject({ ...project, linkToCode: e.target.value })}
                  className="w-full bg-[#05080c] border border-border/60 px-3 py-2 text-xs text-white focus:outline-none focus:border-neon"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-300">
                    Live Demo / Deployment URL:
                  </label>
                  {!project.linkToLive && (
                    <span className="text-[10px] text-gray-500">[ Optional / Offline ]</span>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://my-app.vercel.app"
                  value={project.linkToLive}
                  onChange={(e) => setProject({ ...project, linkToLive: e.target.value })}
                  className="w-full bg-[#05080c] border border-border/60 px-3 py-2 text-xs text-white focus:outline-none focus:border-neon"
                />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Short Summary (Card Description):
              </label>
              <textarea
                rows={3}
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                className="w-full bg-[#05080c] border border-border/60 p-3 text-xs text-white focus:outline-none focus:border-neon leading-relaxed"
              />
            </div>

            {/* Tech Stack Chips Editor */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Technologies &amp; Frameworks:
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 border border-border/70 bg-black/40 px-2.5 py-1 text-xs text-gray-200"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="text-gray-500 hover:text-red-400 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add technology (e.g. Tailwind, Docker) and press Enter"
                  value={newTechInput}
                  onChange={(e) => setNewTechInput(e.target.value)}
                  onKeyDown={handleAddTech}
                  className="grow bg-[#05080c] border border-border/60 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neon"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="border border-border/60 px-3 py-1.5 text-xs hover:border-neon hover:text-neon"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Detailed Architecture Breakdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Detailed Engineering &amp; Architecture Breakdown:
              </label>
              <textarea
                rows={8}
                value={project.detailsText}
                onChange={(e) => setProject({ ...project, detailsText: e.target.value })}
                className="w-full bg-[#05080c] border border-border/60 p-3 text-xs text-gray-300 font-mono focus:outline-none focus:border-neon leading-relaxed"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-xs text-gray-400 hover:text-white"
              >
                ← Edit README
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="px-8 py-3 bg-neon text-black font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(113,252,123,0.3)] disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <span className="animate-spin inline-block">⟳</span>
                    <span>PUBLISHING TO SANITY CMS...</span>
                  </>
                ) : (
                  <span>🚀 CONFIRM &amp; PUBLISH TO SANITY →</span>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-neon/50 bg-[#0d1612] p-8 text-center space-y-6 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full border-2 border-neon text-neon flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>

            <div>
              <span className="text-neon text-xs font-bold tracking-widest uppercase block mb-1">
                [ TRANSACTION COMPLETE ]
              </span>
              <h2 className="text-2xl font-bold text-white mb-2">
                {publishedTitle} Successfully Published!
              </h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                The project has been written to Sanity CMS with all structured architecture sections and media assets.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={`/Projects/${publishedSlug}`}
                className="px-5 py-2.5 bg-neon text-black font-bold text-xs hover:shadow-[0_0_15px_rgba(113,252,123,0.4)] transition-all"
              >
                [ View Project Dossier ↗ ]
              </Link>
              <Link
                href="/Projects"
                className="px-5 py-2.5 border border-border text-white text-xs hover:border-neon hover:text-neon transition-colors"
              >
                [ View All Projects ]
              </Link>
              <Link
                href="/studio"
                target="_blank"
                className="px-5 py-2.5 border border-border text-gray-400 text-xs hover:text-white transition-colors"
              >
                [ Open Sanity Studio ↗ ]
              </Link>
            </div>

            <div className="pt-4 border-t border-border/40">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-neon hover:underline"
              >
                + Ingest Another Project README
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
