import { client } from "@/sanity/lib/client"
import { projectsQuery } from "@/sanity/lib/queries"
import ProjectsList from "@/components/Project/ProjectsList"

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Projects() {
    const projects = await client.fetch(projectsQuery)
    
    return <ProjectsList projects={projects} />
}
