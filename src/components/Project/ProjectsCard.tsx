"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
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

  // Simple ASCII decorations
  const corner = "+"
  const horizontalLine = "───"
  const verticalLine = "│"


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
      className="project-card relative flex h-full flex-col p-5 transition-all duration-300 bg-background border border-black dark:border-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Top ASCII decoration */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="ascii-decoration text-black dark:text-white mb-3 font-mono text-lg flex justify-center items-center"
      >
        <motion.span animate={{ rotate: isHovered ? 90 : 0 }} transition={{ duration: 0.3 }}>
          {corner}
        </motion.span>
        {horizontalLine} {title} {horizontalLine}
        <motion.span animate={{ rotate: isHovered ? 90 : 0 }} transition={{ duration: 0.3 }}>
          {corner}
        </motion.span>
      </motion.div>

      {/* Content */}
      <div className="flex min-h-0 flex-1 flex-col">
      {imageUrl ? (
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="relative mb-4 aspect-video w-full overflow-hidden" 
        >
          <Link href={live || '#'} target="_blank" rel="noopener noreferrer">
          
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain md:grayscale hover:grayscale-0 transition-all duration-500"
            />
          </Link>
        </motion.div>
      ) : (
        <div className="mb-4 w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}
      
        <motion.h3 
          initial={{ y: 10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold mb-2"
        >
          <u>{title}</u>
        </motion.h3>

        {isFreelance && (
          <span className="mb-2 w-fit border border-neon/50 bg-neon/10 px-2 py-0.5 font-mono text-xs text-neon">
            Freelance
          </span>
        )}

        <motion.p 
          initial={{ y: 10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-foreground mb-4 flex-grow text-sm"
        >
          {description}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="tech-stack mb-4"
        >
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech, index) => (
              <motion.span 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -3, backgroundColor: "#fff", color: "#000" }}
                className="px-2 py-0.5 border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-mono"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {details && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }}
             className="mb-6 text-sm text-gray-600 dark:text-gray-400 font-mono border-l-2 border-neon pl-3 italic"
           >
             {details}
           </motion.div>
        )}

        <div className="flex items-center justify-between gap-4 mt-auto border-t border-neutral-600 dark:border-neutral-400 pt-4">
           {live ? (
             <a
               href={live}
               target="_blank"
               rel="noopener noreferrer"
               className="flex-1 text-center py-2 bg-neutral-200 hover:bg-neutral-300 border-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700 border dark:border-neutral-600 font-mono text-sm transition-colors text-black dark:text-white"
             >
               [ LIVE DEMO ]
             </a>
           ) : (
             <span className="flex-1 text-center py-2 text-gray-500 border border-neutral-600 dark:border-neutral-400 font-mono text-sm cursor-not-allowed">
               [ OFFLINE ]
             </span>
           )}
           
           {link && (
             <a
               href={link}
               target="_blank"
               rel="noopener noreferrer"
               className="flex-1 text-center py-2 bg-neon/10 hover:bg-neon/20 border border-neon/50 text-neon font-mono text-sm transition-colors"
             >
               &lt;CODE /&gt;
             </a>
           )}
        </div>
      </div>
    </motion.div>
  )
}
