import ProjectCard from "@/components/ProjectsCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "../../config/site";

export default function Project() {
    const projects = siteConfig.projects
    return (
        <div id="projects" className="w-full mt-8 sm:mt-12 md:mt-16 mb-6 sm:mb-8 pt-6 sm:pt-8 md:pt-12 px-1 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-left">Projects</h2>
      
            <div className="grid grid-cols-1 sm:grid-cols-2 pt-4 sm:pt-6 md:pt-10 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full">
              {projects.slice(0, 4).map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              live={project.link}
              link={project.link}
              imageUrl={project.imageUrl}
            />
              ))}
            </div>
            <div className="w-full flex justify-center mt-6 sm:mt-8 md:mt-10">
              <Link href="/Projects">
            <Button variant="outline" className="py-1 text-sm sm:text-base md:text-lg font-medium h-9 sm:h-10 md:h-12 px-3 sm:px-6 md:px-8">
              View More Projects
            </Button>
              </Link>
            </div>
          </div>
    );}