import { client } from "@/sanity/lib/client";
import { projectBySlugQuery, projectsQuery } from "@/sanity/lib/queries";
import ProjectDetailView from "@/components/Project/ProjectDetailView";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await client.fetch(projectsQuery);
  return projects.map((p: any) => ({
    slug: p.slug || p._id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await client.fetch(projectBySlugQuery, { slug });

  if (!project) {
    return {
      title: "Project Not Found | Srijan K",
    };
  }

  return {
    title: `${project.title} | Srijan K - Project Dossier`,
    description: project.description || `Technical breakdown and architecture of ${project.title}.`,
    openGraph: {
      title: `${project.title} - Srijan K`,
      description: project.description,
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await client.fetch(projectBySlugQuery, { slug });

  if (!project) {
    notFound();
  }

  return <ProjectDetailView project={project} />;
}
