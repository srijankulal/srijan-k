"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface ProjectCardProps {
  title: string
  description: string
  technologies: string[]
  link?: string
  live?: string
  imageUrl?: string
  isFreelance?: boolean
  slug?: string
  details?: string
  onClick?: () => void
}

export default function ProjectCard({ 
  title, 
  description, 
  details,
  technologies, 
  link, 
  live,
  imageUrl,
  slug,
  isFreelance = false,
  onClick 
}: ProjectCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const projectUrl = slug ? `/Projects/${slug}` : undefined

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked inside an explicit link or button, don't trigger card navigation
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) {
      return
    }

    if (onClick) {
      onClick()
      return
    }

    if (projectUrl) {
      router.push(projectUrl)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target as HTMLElement
      if (target.closest('a') || target.closest('button')) {
        return
      }
      e.preventDefault()
      if (onClick) {
        onClick()
      } else if (projectUrl) {
        router.push(projectUrl)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -4 }}
      className={`project-card relative flex h-full flex-col transition-all duration-300 bg-background border border-border hover:border-neon/40 hover:shadow-[0_0_24px_rgba(113,252,123,0.09)] group ${
        projectUrl || onClick ? 'cursor-pointer' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role={projectUrl || onClick ? "button" : undefined}
      tabIndex={projectUrl || onClick ? 0 : undefined}
    >
      {/* Top bar with title and corner brackets */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 font-mono text-sm">
        <motion.span 
          animate={{ color: isHovered ? '#71FC7B' : 'currentColor' }}
          transition={{ duration: 0.2 }}
          className="text-foreground/40 font-mono"
        >
          +
        </motion.span>
        {projectUrl ? (
          <span className="text-foreground/80 group-hover:text-neon tracking-wide text-xs font-mono font-medium transition-colors truncate">
            {title}
          </span>
        ) : (
          <span className="text-foreground/70 tracking-wide text-xs font-mono truncate">{title}</span>
        )}
        <motion.span 
          animate={{ color: isHovered ? '#71FC7B' : 'currentColor' }}
          transition={{ duration: 0.2 }}
          className="ml-auto text-foreground/40 font-mono"
        >
          +
        </motion.span>
      </div>

      {/* Main Card Content */}
      <div className="flex min-h-0 flex-1 flex-col p-4">
        {/* Preview image or stylized terminal placeholder */}
        {imageUrl ? (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative mb-4 aspect-video w-full overflow-hidden border border-border/30 bg-black/40 group-hover:border-neon/40 transition-colors" 
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain md:grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </motion.div>
        ) : (
          <div className="relative mb-4 w-full h-32 bg-border/5 border border-border/20 flex flex-col items-center justify-center gap-1 group-hover:border-neon/30 transition-colors">
            <span className="text-neon/60 font-mono text-xs tracking-wider">[ SYSTEM_READY ]</span>
            <span className="text-foreground/30 font-mono text-[10px]">&gt; {slug || 'project_dossier'}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <h3 className="text-base font-bold group-hover:text-neon transition-colors duration-200 truncate">
            {title}
          </h3>

          {isFreelance && (
            <span className="shrink-0 border border-neon/40 bg-neon/5 px-2 py-0.5 font-mono text-[10px] text-neon">
              freelance
            </span>
          )}
        </div>

        {/* Short description clamped cleanly */}
        <p className="text-foreground/60 mb-3 text-xs sm:text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Tech stack badges */}
        <div className="tech-stack mb-3">
          <div className="flex flex-wrap gap-1">
            {technologies.slice(0, 5).map((tech, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 border border-border/50 text-foreground/50 text-[10px] font-mono hover:border-neon/30 hover:text-neon/80 transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 5 && (
              <span className="px-1.5 py-0.5 text-foreground/30 text-[10px] font-mono">
                +{technologies.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Collapsible Details Drawer */}
        {details && (
          <div className="mb-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="flex items-center gap-1.5 text-[11px] font-mono text-neon/75 hover:text-neon hover:underline cursor-pointer transition-colors"
            >
              <span>{isExpanded ? "[-] Hide Preview" : "[+] Show Quick Excerpt"}</span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-2"
                >
                  <div className="p-3 text-xs text-foreground/70 font-mono border-l-2 border-neon/40 bg-neon/5 max-h-40 overflow-y-auto space-y-1.5 leading-relaxed">
                    {details.slice(0, 400)}...
                    {projectUrl && (
                      <div className="pt-2">
                        <Link 
                          href={projectUrl}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] text-neon font-semibold hover:underline"
                        >
                          View Full Project Dossier & Specs →
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action button bar */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/40">
          {projectUrl && (
            <Link
              href={projectUrl}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center py-1.5 text-xs font-mono border border-neon/30 bg-neon/5 text-neon 
                hover:bg-neon hover:text-black hover:border-neon transition-all duration-200 font-medium"
            >
              [ DETAILS ↗ ]
            </Link>
          )}

          {live ? (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center py-1.5 text-xs font-mono border border-border/50 text-foreground/60 
                hover:border-neon/40 hover:text-neon hover:bg-neon/5 transition-all duration-200"
            >
              [ LIVE ]
            </a>
          ) : (
            <span className="flex-1 text-center py-1.5 text-xs text-foreground/25 border border-border/20 font-mono cursor-not-allowed">
              [ OFFLINE ]
            </span>
          )}
          
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center py-1.5 border border-border/50 text-foreground/60 font-mono text-xs 
                hover:bg-neon/10 hover:text-neon hover:border-neon/40 transition-all duration-200"
            >
              &lt;CODE /&gt;
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
