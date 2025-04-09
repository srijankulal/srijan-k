import ProjectCard from "@/components/Project/ProjectsCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "../../../config/site";

export default function Project() {
    const projects = siteConfig.projects
    return (
        <div id="projects" className="w-full my-16 px-4 sm:px-6 lg:px-8 pb-10">
            <h2 className="text-5xl font-bold mb-8 text-left sm:pb-4">Projects</h2>
      
            <div className="grid grid-cols-1 sm:grid-cols-2 pt-4 sm:pt-6 md:pt-10 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full">
              {projects.slice(0, 4).map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              live={project.live}
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