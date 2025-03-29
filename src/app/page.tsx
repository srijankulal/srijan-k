// import Contact from "@/components/contact"
import Header from "@/components/Header";

import ProjectCard from "@/components/ProjectsCard";
import  TerminalSnippet  from "@/components/TerminalSnippet"; // Adjusted to match named export
import { Button } from "@/components/ui/button";





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
  ]
  return (
    
    <>
  <div className="border border-gray-300 p-4 my-4">
    <Header />
    <div className="py-8 text-center border-b border-gray-300">
       <div className="flex flex-col justify-center items-center w-full ">
            <div className="flex flex-col justify-center items-center w-full snap-start sm:snap-align-none pt-40 pb-54">
        
                <div className="text-left">
                <h2 className="text-6xl font-bold mb-2 text-left pl-5">
                <span className="inline-block">&#62;</span>HI
                </h2>
                <h2 className="text-6xl font-bold mb-4 text-left pl-11 flex items-center">
                  I&apos;m&nbsp;<u className="mx-1"> Srijan</u>&nbsp;<u>K</u> !
                  <span className="ml-1 inline-block w-4 h-8  animate-caret-blink ">_</span>
                </h2>
              <p className="text-2xl mb-4 text-left pl-11">
              Crafting modern web experiences with security, efficiency, and scalability in mind.
              </p>
              <div className="flex text-left pl-11">
                <div className="flex pr-8 sm:flex-col">
                <Button variant="outline" className="mt-2 py-2 text-lg font-medium h-12 px-8">
                  Projects
                </Button>
                </div>
                <div className="flex pl-2 sm:flex-col">
                <Button variant="outline" className="mt-2 py-2 text-lg font-medium h-12 px-8">
                  Contact
                </Button>
                </div>
              </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-full ">
            <div className="flex flex-col  w-full snap-start sm:snap-align-none ">
            
                  <h2 className="text-5xl font-bold mb-2 text-left pl-30" id="about">About Me</h2>
                 </div>
                    <div className="flex flex-row justify-center items-center w-full ">
                      <div className="flex flex-col justify-center items-center w-full pl-20">
                    <div className="terminal-style-about p-4 text-left border-l-2 border-white">
                      <div className="mb-4">
                        <span className="text-green-400 ">$ whoami</span>
                        <ul className="list-none pl-4 pt-2">
                          <li className="flex items-start mb-2">
                            <span className="text-[#9CDCFE] mr-2">▶</span> 
                            <span>Backend-focused developer skilled in Python (Flask), Next.js, Flutter</span>
                          </li>
                          <li className="flex items-start mb-2">
                            <span className="text-[#9CDCFE]">▶</span> 
                            <span>Experienced with PostgreSQL, MySQL and database optimization</span>
                          </li>
                          <li className="flex items-start mb-2">
                            <span className="text-[#9CDCFE] mr-2">▶</span> 
                            <span>Specializing in secure, scalable applications with real-time features</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-green-400">$ education</span>
                        <ul className="list-none pl-4 pt-2">
                          <li className="flex items-start mb-2">
                            <span className="text-[#9CDCFE] mr-2">▶</span> 
                            <span>B.C.A at St. Aloysius University (2023-2026)</span>
                          </li>
                          <li className="flex items-start mb-2">
                            <span className="text-[#9CDCFE] mr-2">▶</span> 
                            <span>Constantly learning and seeking new challenges</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                      <div className="  text-left pr-36">
                      <TerminalSnippet />
                      </div>
            </div>         
            </div>
            <div className="w-full mt-16 mb-8 pt-12">
              <h2 className="text-5xl font-bold mb-8 text-left pl-30">Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
              
            </div>
                
                
            
         
                
    </div>
    
  
  </div>
      </>
  );
}
