import ProjectCard from "./project-card"

interface Project {
  title: string
  description: string
  technologies: string[]
  link: string
  imageUrl?: string
}

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="ascii-projects-container">
      <pre className="text-center text-gray-800 mb-8 hidden md:block">
        {`
   ___           _           _       
  / _ \\_ __ ___ (_) ___  ___| |_ ___ 
 / /_)/ '__/ _ \\| |/ _ \\/ __| __/ __|
/ ___/| | | (_) | |  __/ (__| |_\\__ \\
\\/    |_|  \\___// |\\___|\\___|\\__|___/
              |__/                   
`}
      </pre>
      <h2 className="text-3xl font-bold mb-8 text-center md:hidden">Projects</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            technologies={project.technologies}
            link={project.link}
            imageUrl={project.imageUrl}
          />
        ))}
      </div>
    </div>
  )
}

