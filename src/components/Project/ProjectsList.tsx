'use client'
import Header from "../HeaderFooter/Header";
import ProjectCard from "./ProjectsCard"
import { useEffect, useState } from "react"

interface ProjectsListProps {
  projects: any[]
}

export default function ProjectsList({ projects }: ProjectsListProps) {
    const [isVisible, setIsVisible] = useState(false)
    
    useEffect(() => {
        setIsVisible(true)
    }, [])
    
    return (
        <div className="border border-neutral-600 dark:border-neutral-400 my-4">
            <Header whereAt="projects" />
            <div className="px-2 sm:px-4 md:px-8">
                <div className="flex flex-col justify-center items-center w-full snap-start sm:snap-align-none pt-40 pb-54">
                    <div className="text-left transform transition-all duration-700 ease-in-out w-full" 
                        style={{ 
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)'
                        }}>
                        <h2 className="text-6xl font-bold mb-2 text-left pl-5">
                            <span className="inline-block">&#62;</span>PROJECTS
                            <span className="ml-1 inline-block w-4 h-8 animate-caret-blink">_</span>
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full max-w-7xl px-4">
                            {projects.map((project, index) => (
                                <div key={index} 
                                    className="transition-all duration-500 w-full"
                                    style={{ 
                                        opacity: isVisible ? 1 : 0,
                                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                        transitionDelay: `${index * 100}ms`
                                    }}>
                                    <ProjectCard {...project} live={project.live} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
