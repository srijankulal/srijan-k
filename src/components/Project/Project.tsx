import ProjectCard from "@/components/Project/ProjectsCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { projectsQuery } from "@/sanity/lib/queries";
import { motion } from "framer-motion";

export default function Project() {
    const [projects, setProjects] = useState<any[]>([])

    useEffect(() => {
        const getProjects = async () => {
            const data = await client.fetch(projectsQuery)
            setProjects(data)
        }
        getProjects()
    }, [])

    return (
        <div id="projects" className="w-full my-16 px-4 sm:px-6 lg:px-8 pb-10">
            {/* Section header */}
            <div className="mb-8">
                <p className="section-label mb-1">// 02. work</p>
                <h2 className="text-4xl sm:text-5xl font-bold text-left">Projects</h2>
            </div>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 pt-4 sm:pt-6 md:pt-8 lg:grid-cols-4 gap-4 md:gap-5 w-full">
              {projects.slice(0, 4).map((project, index) => (
              <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              live={project.live}
              link={project.link}
              imageUrl={project.imageUrl}
              isFreelance={project.isFreelance}
            />
              ))}
            </div>
            <div className="w-full flex justify-center mt-8 md:mt-10">
              <Link href="/Projects">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" className="font-mono text-sm sm:text-base h-10 md:h-11 px-6 md:px-8 
                    hover:bg-neon hover:text-black hover:border-neon hover:shadow-[0_0_20px_rgba(113,252,123,0.25)] transition-all duration-300">
                    View All Projects →
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
    );}