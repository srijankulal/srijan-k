"use client"

import { useState } from "react"
import Image from "next/image"

interface ProjectCardProps {
  title: string
  description: string
  technologies: string[]
  link: string
  imageUrl?: string
  onClick?: () => void
  details?: string
}

export default function ProjectCard({ title, description, technologies, link, imageUrl }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Simple ASCII decorations
  const corner = "+"
  const horizontalLine = "───"
  const verticalLine = "│"

  return (
    <div
      className={`project-card  relative p-5 transition-all duration-300 bg-background border border-dashed border-white ${
        isHovered ? "shadow-md transform -translate-y-1" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top ASCII decoration */}
      <div className="ascii-decoration text-white mb-3 font-mono text-sm">
        {corner}
        {horizontalLine} {title} {horizontalLine}
        {corner}
      </div>

      {/* Content */}
      <div className="flex flex-col ">
        {imageUrl && (
          <div className="mb-4 overflow-hidden">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              width={300}
              height={200}
              className="object-cover w-full h-32 grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        )}

        <h3 className="text-xl font-bold mb-2"><u>{title}</u></h3>

        <p className="text-foreground mb-4 flex-grow text-sm">{description}</p>

        <div className="tech-stack mb-4">
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech, index) => (
              <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom ASCII decoration */}
        <div className="flex items-center justify-between mt-auto">
          <div className="ascii-decoration text-gray-400 font-mono text-sm">{verticalLine} view</div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="view-link text-white hover:text-amber-600 font-mono text-sm flex items-center group"
          >
            <span className="mr-2 transition-all duration-300 group-hover:mr-3">project</span>
            <span className="text-gray-400 group-hover:text-black transition-colors duration-300">→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

