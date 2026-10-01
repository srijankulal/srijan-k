import { client } from "@/sanity/lib/client";
import { projectsQuery } from "@/sanity/lib/queries";
import ProjectsList from "@/components/Project/ProjectsList";
import type { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Projects | Srijan K - Software Developer",
  description: "Browse all engineering projects, full-stack systems, mobile apps, and open-source contributions by Srijan K.",
};

export default async function Projects() {
  const projects = await client.fetch(projectsQuery);
  return <ProjectsList projects={projects} />;
}
