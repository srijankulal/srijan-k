'use client'
import Header from "@/components/HeaderFooter/Header";
import ProjectCard from "@/components/Project/ProjectsCard"
import Link from "next/link"
import {siteConfig} from "../../../config/site"
import { useEffect, useState } from "react"

export default function Projects() {
    const projects = siteConfig.projects
    const [isVisible, setIsVisible] = useState(false)
    
    useEffect(() => {
        setIsVisible(true)
    }, [])
    
    return (
        <div className="border border-gray-300 p-4 my-4">
            <Header whereAt="projects" />
        <div className="flex flex-col justify-center items-center w-full snap-start sm:snap-align-none pt-40 pb-54">
            <div className="text-left transform transition-all duration-700 ease-in-out" 
                style={{ 
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(-20px)'
                }}>
                <h2 className="text-6xl font-bold mb-2 text-left pl-5">
                    <span className="inline-block">&#62;</span>PROJECTS
                    <span className="ml-1 inline-block w-4 h-8 animate-caret-blink">_</span>
                </h2>
            </div>
            <div className="flex flex-col w-full gap-8 mt-8">
            {projects.map((project, index) => (
                <div key={index} 
                    className="transition-all duration-500 w-full max-w-4xl mx-auto"
                    style={{ 
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                        transitionDelay: `${index * 200}ms`
                    }}>
                    <ProjectCard {...project} live={project.live} />
                    <div className="mt-4 p-6 bg-background backdrop-blur-sm border border-amber-600 transition-all duration-500 overflow-hidden"
                        style={{
                            maxHeight: isVisible ? '1000px' : '0px',
                            opacity: isVisible ? 1 : 0,
                             transitionDelay: `${(index * 200) + 300}ms`
                        }}>
                        <h3 className="text-xl font-bold mb-2">{project.title} - Details</h3>
                        <p className="mb-4">{project.details}</p>
                        
                        {project.link && (
                            <Link href={project.link} 
                                className="text-blue-400 hover:underline hover:text-blue-300 transition-colors duration-300">
                                View Project Code &rarr;
                            </Link>
                        )}
                    </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    )
}
