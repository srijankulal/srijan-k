'use client'
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectsCard"
import Link from "next/link"

export default function Projects() {
    // Removed the selectedProject state since we'll show all details
    
    const projects = [
       
          {
            "title": "ByteSize",
            "description": "AI-powered flashcard generation app",
            "technologies": ["Next.js", "React", "Tailwind CSS", "AI API", "Local Storage"],
            "live": "https://byte-size-six.vercel.app",
            "link":"https://github.com/Nash504/ByteSize",
            "imageUrl": "https://wqvndanjead1tl5k.public.blob.vercel-storage.com/Porject%20Picture/ByteSize-jLbZGZBZxhIC1G9fxLvBaV216hAGyr.png",
             "details": "Developed collaboratively with a friend, ByteSize transforms study materials into interactive flashcards using AI. Features include topic categorization, card animations, document import/export, and local storage for saved decks. The app uses a Duolingo-inspired UI with custom components and animations to create an engaging learning experience."
          }, 
          {
            "title": "PlaylistCrafter",
            "description": "Spotify playlist creation tool",
            "technologies": ["Python", "Flask", "Spotify API", "OAuth 2.0", "JavaScript"],
            "link": "https://github.com/srijankulal/PlaylistCrafter",
            "live": "https://playlistcrafter.vercel.app",
            "imageUrl": "https://wqvndanjead1tl5k.public.blob.vercel-storage.com/Porject%20Picture/playlistCrafter-N78sA8O21nr65K0BBRGl00tVgDRCJt.png",
            "details": "A web application leveraging the Spotify API that helps users discover new music through features like Song Sync (creating playlists based on a favorite track) and Playlist Blend (combining two playlists into a unique mix). Built with Flask backend and integrated with OAuth for seamless Spotify account connection."
          },
        {
          title: "RetroVault",
          description: "Code snippet manager with ASCII art visualization and sharing capabilities.",
          technologies: ["Next.js", "Tailwind", "PostgreSQL"],
          link: "",
          imageUrl: "/placeholder.svg?height=100&width=100",
          details: "A developer tool designed for storing and organizing code snippets with unique ASCII visualization features and secure sharing options."
        },
        {
          title: "Pixel Dashboard",
          description: "Monitoring tool with retro-inspired UI for tracking system metrics.",
          technologies: ["Flutter", "Firebase", "GraphQL"],
          link: "",
          imageUrl: "/placeholder.svg?height=100&width=100",
          details: "Cross-platform monitoring solution with real-time data visualization, custom alerts, and a nostalgic pixel art interface."
        },
      ]
    
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
