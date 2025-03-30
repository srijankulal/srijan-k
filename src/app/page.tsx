// import Contact from "@/components/contact"
import Header from "@/components/Header";

import ProjectCard from "@/components/ProjectsCard";
import  TerminalSnippet  from "@/components/TerminalSnippet"; // Adjusted to match named export
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
                        <span className="text-amber-600 ">$ whoami</span>
                        <ul className="list-none pl-4 pt-2">
                          <li className="flex items-start mb-2">
                            <span className=" mr-2">▶</span> 
                            <span>Backend-focused developer skilled in Python (Flask), Next.js, Flutter</span>
                          </li>
                          <li className="flex items-start mb-2">
                            <span className="">▶</span> 
                            <span>Experienced with PostgreSQL, MySQL and database optimization</span>
                          </li>
                          <li className="flex items-start mb-2">
                            <span className=" mr-2">▶</span> 
                            <span>Specializing in secure, scalable applications with real-time features</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mb-2">
                        <span className="text-amber-600">$ education</span>
                        <ul className="list-none pl-4 pt-2">
                          <li className="flex items-start mb-2">
                            <span className=" mr-2">▶</span> 
                            <span>B.C.A at St. Aloysius University (2023-2026)</span>
                          </li>
                          <li className="flex items-start mb-2">
                            <span className=" mr-2">▶</span> 
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
            <div className="w-full mt-16 mb-8 pt-22">
              <h2 className="text-5xl font-bold mb-8 text-left pl-30">Projects</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 pt-10 lg:grid-cols-4 gap-8 w-full lg:pl-34 lg:pr-34">
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
              <div className="w-full flex justify-center mt-10">
                <Link href="/Projects">
                <Button variant="outline" className="py-2 text-lg font-medium h-12 px-8">
                  View More Projects
                </Button>
                </Link>
              </div>
            </div>

            <div className="w-full mt-16 mb-8 pt-22">
              <h2 className="text-5xl font-bold mb-8 text-left lg:pl-30">Skills</h2>
              <div className="flex flex-col justify-center items-center w-full pt-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full lg:px-20">
                  <div className="terminal-style-skills   ">
                    <h3 className="text-xl font-mono mb-2 text-amber-600 lg:pl-34">$ cat frontend.txt</h3>
                    <pre className="text-2xl " >
                {`
                ┌─────────────────────┐
                │ Frontend            │
                ├─────────────────────┤          
                │ >> React/Next.js    │
                │ >> TypeScript       │
                │ >> Tailwind CSS     │
                │ >> Flutter          │
                └─────────────────────┘`}
                    </pre>
                  </div>
                  
                  <div className="terminal-style-skills ">
                    <h3 className="text-xl font-mono mb-2 text-amber-600 lg:pl-54 ">$ cat backend.txt</h3>
                    <pre className="text-2xl lg:pl-20  ">
                {`
                ┌─────────────────────┐
                │ Backend             │
                ├─────────────────────┤
                │ >> Python/Flask     │
                │ >> Node.js          │
                │ >> PostgreSQL       │
                │ >> RESTful APIs     │
                └─────────────────────┘`}
                    </pre>
                  </div>
                  
                </div>



                {/*Contact*/}
                
                <div className="w-full mt-16 mb-8 pt-22">
                <h2 className="text-5xl font-bold mb-8 text-left lg:pl-30">Contact</h2>
                <div className="flex flex-col justify-center items-start w-full pt-10">
                <div className="terminal-style-contact w-full max-w-3xl p-6 border-2 border-white bg-back bg-opacity-80 text-left">
                  <div className="mb-4 border-b border-gray-700 pb-2">
                  <span className="text-amber-600 font-mono text-xl">$ connect --with Srijan</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <div className="mb-4">
                    <span className="text-green-500 font-mono">~ $ </span>
                    <span className="text-white">mail -s</span>
                    <div className="pl-8 pt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href="mailto:contact@srijank.com" className="text-blue-400 hover:underline">
                      contact@srijank.com
                      </a>
                    </div>
                    </div>
                    
                    <div className="mb-4">
                    <span className="text-green-500 font-mono">~ $ </span>
                    <span className="text-white">github -u</span>
                    <div className="pl-8 pt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <a href="https://github.com/srijank" className="text-blue-400 hover:underline">
                      github.com/srijank
                      </a>
                    </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                    <span className="text-green-500 font-mono">~ $ </span>
                    <span className="text-white">linkedin --profile</span>
                    <div className="pl-8 pt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      <a href="https://linkedin.com/in/srijank" className="text-blue-400 hover:underline">
                      linkedin.com/in/srijank
                      </a>
                    </div>
                    </div>
                    
                    <div className="mb-4">
                    <span className="text-green-500 font-mono">~ $ </span>
                    <span className="text-white">twitter -h</span>
                    <div className="pl-8 pt-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.059 10.059 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      <a href="https://twitter.com/srijank" className="text-blue-400 hover:underline">
                      @srijank
                      </a>
                    </div>
                    </div>
                    </div>
                  </div>
                 
                  
                  <div className="mt-6 pt-4 border-t border-gray-700">
                  <span className="text-amber-600 font-mono">$ </span>
                  <span className="animate-caret-blink">_</span>
                  </div>
                </div>
                </div>
                </div>
 </div>
            </div>
          
                
                
            
         
                
    </div>
    
  
  </div>
      </>
  );
}
