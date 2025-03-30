'use client'
import ProjectCard from "@/components/ProjectsCard"
import Link from "next/link"
import { useState } from "react"

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    
    const projects = [
        {
          title: "ASCII Chat",
          description: "A real-time chat application with retro ASCII art interface and encryption.",
          technologies: ["React", "TypeScript", "WebSockets"],
          link: "#",
          imageUrl: "/placeholder.svg?height=100&width=100",
          details: "Built with modern web technologies to create a unique chat experience featuring real-time messaging, end-to-end encryption, and customizable ASCII art avatars."
        },
        {
          title: "RetroVault",
          description: "Code snippet manager with ASCII art visualization and sharing capabilities.",
          technologies: ["Next.js", "Tailwind", "PostgreSQL"],
          link: "#",
          imageUrl: "/placeholder.svg?height=100&width=100",
          details: "A developer tool designed for storing and organizing code snippets with unique ASCII visualization features and secure sharing options."
        },
        {
          title: "Pixel Dashboard",
          description: "Monitoring tool with retro-inspired UI for tracking system metrics.",
          technologies: ["Flutter", "Firebase", "GraphQL"],
          link: "#",
          imageUrl: "/placeholder.svg?height=100&width=100",
          details: "Cross-platform monitoring solution with real-time data visualization, custom alerts, and a nostalgic pixel art interface."
        },

      ]
    
    const viewProjectDetails = (index:number):void => {
        setSelectedProject(selectedProject === index ? null : index);
    }
    
    return (
        <div className="flex flex-col justify-center items-center w-full snap-start sm:snap-align-none pt-40 pb-54">
            <div className="text-left">
                <h2 className="text-6xl font-bold mb-2 text-left pl-5">
                    <span className="inline-block">&#62;</span>PROJECTS
                </h2>
                <h2 className="text-6xl font-bold mb-4 text-left pl-11 flex items-center">
                    <u className="mx-1"> Srijan</u>&nbsp;<u>K</u> !
                    <span className="ml-1 inline-block w-4 h-8 animate-caret-blink">_</span>
                </h2>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
                {projects.map((project, index) => (
                    <div key={index} className="transition-all duration-300">
                        <ProjectCard {...project} onClick={() => viewProjectDetails(index)} />
                        {selectedProject === index && (
                            <div className="mt-4 p-6 bg-black/40 backdrop-blur-sm border border-gray-600 rounded-lg max-w-lg">
                                <h3 className="text-xl font-bold mb-2">{project.title} - Details</h3>
                                <p className="mb-4">{project.details}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech, i) => (
                                        <span key={i} className="px-2 py-1 text-xs bg-gray-800 rounded-md">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <Link href={project.link} className="text-blue-400 hover:underline">
                                    View Project &rarr;
                                </Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}