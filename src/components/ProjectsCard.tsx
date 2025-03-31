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
  onClick?: () => void
  details?: string 
  live: string | undefined
}

export default function ProjectCard({ 
  title, 
  description, 
  technologies, 
  link, 
  live,
  imageUrl,
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
      className="project-card relative p-5 transition-all duration-300 bg-background border border-white"
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
        className="ascii-decoration text-white mb-3 font-mono text-lg flex justify-center items-center"
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
      <div className="flex flex-col">
      {imageUrl ? (
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="mb-4 overflow-hidden relative w-full" 
          style={{ minHeight: '200px', height: 'auto' }}
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
      ) : null}
      
        <motion.h3 
          initial={{ y: 10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-bold mb-2"
        >
          <u>{title}</u>
        </motion.h3>

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
                whileHover={{ y: -3, backgroundColor: "#f3f4f6" }}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Bottom ASCII decoration */}
        <div className="flex items-center justify-between mt-auto">
          <motion.div 
            animate={{ x: isHovered ? 5 : 0, opacity: isHovered ? 0.8 : 0.4 }}
            className="ascii-decoration font-mono text-sm"
          >
            {verticalLine} view live
          </motion.div>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={live}
            onClick={(e) => {
              if (!link.trim()) {
                e.preventDefault()
                toast.warning("Link is not available!", {description: "This project link is not available yet."})
                return
              }
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="view-link text-white hover:text-amber-600 font-mono text-sm flex items-center group"
          >
            <span className="mr-2 transition-all duration-300 text-lg group-hover:mr-3">Open</span>
            <motion.span 
              animate={{ x: isHovered ? 5 : 0 }}
              className="text-gray-400 group-hover:text-black transition-colors duration-300"
            >
              →
            </motion.span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}
