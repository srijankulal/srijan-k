"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface ProjectCardProps {
  title: string
  description: string
  technologies: string[]
  link: string
  imageUrl?: string
  isFreelance?: boolean
  onClick?: () => void
  details?: string 
  live: string | undefined
}

export default function ProjectCard({ 
  title, 
  description, 
  details,
  technologies, 
  link, 
  live,
  imageUrl,
  isFreelance = false,
  onClick 
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -4 }}
      className="project-card relative flex h-full flex-col transition-all duration-300 bg-background border border-border hover:border-neon/25 hover:shadow-[0_0_24px_rgba(113,252,123,0.07)] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Top bar with title */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 font-mono text-sm">
        <motion.span 
          animate={{ color: isHovered ? '#71FC7B' : 'currentColor' }}
          transition={{ duration: 0.2 }}
          className="text-foreground/40"
        >
          +
        </motion.span>
        <span className="text-foreground/70 tracking-wide text-xs">{title}</span>
        <motion.span 
          animate={{ color: isHovered ? '#71FC7B' : 'currentColor' }}
          transition={{ duration: 0.2 }}
          className="ml-auto text-foreground/40"
        >
          +
        </motion.span>
      </div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col p-4">
        {imageUrl ? (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative mb-4 aspect-video w-full overflow-hidden border border-border/30" 
          >
            <Link href={live || '#'} target="_blank" rel="noopener noreferrer">
              <Image
                src={imageUrl}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain md:grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </Link>
          </motion.div>
        ) : (
          <div className="mb-4 w-full h-36 bg-border/10 border border-border/20 flex items-center justify-center">
            <span className="text-foreground/20 font-mono text-xs">[ NO_PREVIEW ]</span>
          </div>
        )}
        
        <h3 className="text-base font-bold mb-1 group-hover:text-neon transition-colors duration-200">
          {title}
        </h3>

        {isFreelance && (
          <span className="mb-2 w-fit border border-neon/40 bg-neon/5 px-2 py-0.5 font-mono text-[10px] text-neon">
            freelance
          </span>
        )}

        <p className="text-foreground/60 mb-4 grow text-sm leading-relaxed">
          {description}
        </p>

        <div className="tech-stack mb-4">
          <div className="flex flex-wrap gap-1">
            {technologies.map((tech, index) => (
              <span 
                key={index}
                className="px-1.5 py-0.5 border border-border/50 text-foreground/50 text-[10px] font-mono hover:border-neon/30 hover:text-neon/70 transition-colors duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {details && (
          <div className="mb-4 text-xs text-foreground/40 font-mono border-l border-neon/30 pl-3 italic leading-relaxed">
            {details}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border/40">
           {live ? (
             <a
               href={live}
               target="_blank"
               rel="noopener noreferrer"
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
               className="flex-1 text-center py-1.5 border border-neon/25 text-neon/70 font-mono text-xs 
                 hover:bg-neon/10 hover:text-neon hover:border-neon/50 transition-all duration-200"
             >
               &lt;CODE /&gt;
             </a>
           )}
        </div>
      </div>
    </motion.div>
  )
}
