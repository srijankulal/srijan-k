import About from "@/components/About";
import Contact from "@/components/contact";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectsCard";
import Skills from "@/components/Skills";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const projects = [
    {
      title: "ASCII Chat",
      description: "A real-time chat application with retro ASCII art interface and encryption.",
      technologies: ["React", "TypeScript", "WebSockets"],
      link: "#",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      title: "RetroVault",
      description: "Code snippet manager with ASCII art visualization and sharing capabilities.",
      technologies: ["Next.js", "Tailwind", "PostgreSQL"],
      link: "#",
    },
    {
      title: "Pixel Dashboard",
      description: "Monitoring tool with retro-inspired UI for tracking system metrics.",
      technologies: ["Flutter", "Firebase", "GraphQL"],
      link: "#",
    },
    {
      title: "TextMode API",
      description: "API gateway with ASCII visualization of data flow and analytics.",
      technologies: ["Python", "Flask", "Redis"],
      link: "#",
    },
  ];

  return (

      <main className="border border-gray-300 p-2 sm:p-4 my-4">
        <Header whereAt="home" />
       
        <div className="py-4 sm:py-8 text-center border-b border-gray-300">
          {/* Hero Section */}
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col justify-center items-center w-full pt-8 sm:pt-16 md:pt-40 pb-8 sm:pb-16 md:pb-54">
              <div className="text-left w-full px-3 sm:px-4 md:px-8 lg:px-12">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 text-left pl-2 md:pl-5">
                  <span className="inline-block">&#62;</span>HI
                </h2>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 text-left pl-4 sm:pl-6 md:pl-11 flex flex-wrap items-center">
                  I&apos;m&nbsp;<u className="mx-1"> Srijan</u>&nbsp;<u>K</u> !
                  <span className="ml-1 inline-block w-2 sm:w-3 md:w-4 h-5 sm:h-6 md:h-8 animate-caret-blink">_</span>
                </h2>
                <p className="text-base sm:text-lg md:text-2xl mb-4 text-left pl-4 sm:pl-6 md:pl-11">
                  Crafting modern web experiences with security, efficiency, and scalability in mind.
                </p>
                <div className="flex flex-wrap text-left pl-4 sm:pl-6 md:pl-11 gap-3 sm:gap-4">
                  <Link href="/#projects">
                    <Button variant="outline" className="py-1 text-sm sm:text-base md:text-lg font-medium h-9 sm:h-10 md:h-12 px-4 sm:px-6 md:px-8">
                      Projects
                    </Button>
                  </Link>
                  <Link href="/#contact">
                    <Button variant="outline" className="py-1 text-sm sm:text-base md:text-lg font-medium h-9 sm:h-10 md:h-12 px-4 sm:px-6 md:px-8">
                      Contact
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
  
          {/* About Section */}
          <About />
  
          {/* Projects Section */}
          <div id="projects" className="w-full mt-8 sm:mt-12 md:mt-16 mb-6 sm:mb-8 pt-6 sm:pt-8 md:pt-12 px-2 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 text-left">Projects</h2>
  
            <div className="grid grid-cols-1 sm:grid-cols-2 pt-4 sm:pt-6 md:pt-10 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-8 w-full">
              {projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  link={project.link}
                  imageUrl="https://placehold.co/400"
                />
              ))}
            </div>
            <div className="w-full flex justify-center mt-6 sm:mt-8 md:mt-10">
              <Link href="/Projects">
                <Button variant="outline" className="py-1 text-sm sm:text-base md:text-lg font-medium h-9 sm:h-10 md:h-12 px-4 sm:px-6 md:px-8">
                  View More Projects
                </Button>
              </Link>
            </div>
          </div>
  
          {/* Skills Section */}
          <Skills />
  
          {/* Contact Section */}
          <Contact id="contact" />
        </div>
  
        {/* Footer */}
        <footer className="border-t border-gray-300 py-4 sm:py-6">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-xs sm:text-sm">© {new Date().getFullYear()} Srijan K. All rights reserved.</p>
              </div>
              <div className="flex space-x-4 sm:space-x-6">
                <Link href="https://github.com/srijankulal" className="hover:text-gray-400 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {/* GitHub icon path remains the same */}
                  </svg>
                </Link>
                <Link href="https://www.linkedin.com/in/srijan-kulal" className="hover:text-gray-400 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {/* LinkedIn icon path remains the same */}
                  </svg>
                </Link>
                <Link href="mailto:srijankulal1010@gmail.com" className="hover:text-gray-400 transition-colors">
                  <span className="sr-only">Email</span>
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {/* Email icon path remains the same */}
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Add space at the bottom for mobile navigation */}
        <div className="md:hidden h-16"></div>
      </main>
   
  );}