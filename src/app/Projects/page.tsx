'use client'
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectsCard"
import Link from "next/link"
import {siteConfig} from "../../../config/site"

export default function Projects() {
    // Removed the selectedProject state since we'll show all details
    const projects= siteConfig.projects
    
    return (
        <div className="border border-gray-300 p-4 my-4">
            <Header whereAt="projects" />
        <div className="flex flex-col justify-center items-center w-full snap-start sm:snap-align-none pt-40 pb-54">
            <div className="text-left">
                <h2 className="text-6xl font-bold mb-2 text-left pl-5">
                    <span className="inline-block">&#62;</span>PROJECTS
                
                    <span className="ml-1 inline-block w-4 h-8 animate-caret-blink">_</span>
                </h2>
            </div>
            <div className="flex flex-col w-full gap-8 mt-8">
    {projects.map((project, index) => (
        <div key={index} className="transition-all duration-300 w-full max-w-4xl mx-auto">
            <ProjectCard {...project} live={project.live} />
            <div className="mt-4 p-6 bg-background backdrop-blur-sm border border-amber-600">
                <h3 className="text-xl font-bold mb-2">{project.title} - Details</h3>
                <p className="mb-4">{project.details}</p>
                
                {project.link && (
                    <Link href={project.link} className="text-blue-400 hover:underline">
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
