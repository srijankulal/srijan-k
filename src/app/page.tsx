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
    <>
      <div className="border border-gray-300 p-4">
        <Header whereAt="home" />
        <div className="py-8 text-center border-b border-gray-300">
          {/* Hero Section */}
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col justify-center items-center w-full pt-16 md:pt-40 pb-16 md:pb-54">
              <div className="text-left w-full px-4 md:px-8 lg:px-12">
                <h2 className="text-4xl md:text-6xl font-bold mb-2 text-left pl-2 md:pl-5">
                  <span className="inline-block">&#62;</span>HI
                </h2>
                <h2 className="text-4xl md:text-6xl font-bold mb-4 text-left pl-6 md:pl-11 flex flex-wrap items-center">
                  I&apos;m&nbsp;<u className="mx-1"> Srijan</u>&nbsp;<u>K</u> !
                  <span className="ml-1 inline-block w-3 md:w-4 h-6 md:h-8 animate-caret-blink">_</span>
                </h2>
                <p className="text-lg md:text-2xl mb-4 text-left pl-6 md:pl-11">
                  Crafting modern web experiences with security, efficiency, and scalability in mind.
                </p>
                <div className="flex flex-wrap text-left pl-6 md:pl-11 gap-4">
                  <Link href="/#projects">
                    <Button variant="outline" className="py-1 md:py-2 text-base md:text-lg font-medium h-10 md:h-12 px-6 md:px-8">
                      Projects
                    </Button>
                  </Link>
                  <Link href="/#contact">
                    <Button variant="outline" className="py-1 md:py-2 text-base md:text-lg font-medium h-10 md:h-12 px-6 md:px-8">
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
          <div id="projects" className="w-full mt-12 md:mt-16 mb-8 pt-8 md:pt-12 px-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-left">Projects</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 pt-6 md:pt-10 lg:grid-cols-4 gap-4 md:gap-8 w-full">
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
            <div className="w-full flex justify-center mt-8 md:mt-10">
              <Link href="/Projects">
                <Button variant="outline" className="py-1 md:py-2 text-base md:text-lg font-medium h-10 md:h-12 px-6 md:px-8">
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
        <footer className="border-t border-gray-300 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm">© {new Date().getFullYear()} Srijan K. All rights reserved.</p>
              </div>
              <div className="flex space-x-6">
                <Link href="https://github.com/srijankulal" className="hover:text-gray-400 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="https://www.linkedin.com/in/srijan-kulal" className="hover:text-gray-400 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                  </svg>
                </Link>
                <Link href="mailto:srijankulal1010@gmail.com" className="hover:text-gray-400 transition-colors">
                  <span className="sr-only">Email</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Add space at the bottom for mobile navigation */}
        <div className="md:hidden h-16"></div>
      </div>
    </>
  );
}