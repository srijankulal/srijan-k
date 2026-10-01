'use client'
import Header from "../HeaderFooter/Header";
import ProjectCard from "./ProjectsCard"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface ProjectsListProps {
  projects: any[]
}

export default function ProjectsList({ projects }: ProjectsListProps) {
    const [isVisible, setIsVisible] = useState(false)
    
    useEffect(() => {
        setIsVisible(true)
    }, [])
    
    return (
        <div className="border border-border my-4">
            <Header whereAt="projects" />
            <div className="px-2 sm:px-4 md:px-8">
                <div className="flex flex-col justify-center items-center w-full pt-32 pb-24">
                    <div className="text-left w-full"
                        style={{ 
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
                            transition: 'all 0.7s ease-in-out'
                        }}>

                        <div className="mb-8 px-4">
                            <p className="section-label mb-1">// all work</p>
                            <h2 className="text-5xl sm:text-6xl font-bold text-left">
                                <span className="text-neon">&gt;</span>PROJECTS
                                <span className="ml-1 inline-block w-4 h-8 animate-caret-blink">_</span>
                            </h2>
                        </div>
                        
                        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 px-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project, index) => (
                                <motion.div 
                                    key={project._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    className="flex w-full"
                                >
                                    <ProjectCard 
                                        {...project} 
                                        slug={project.slug} 
                                        details={project.details} 
                                        live={project.live} 
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
