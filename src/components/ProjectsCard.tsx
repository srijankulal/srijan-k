interface ProjectCardProps {
    title: string;
    description: string;
    technologies: string[];
    link: string;
    imageUrl?: string; // Optional image for the project
}

export default function ProjectCard({ title, description, technologies, link, imageUrl }: ProjectCardProps) {
    return (
        <div className="ascii-card" data-aos="fade-up">
            <div className="ascii-border">
                <pre>
                {
`+-----------------------------+
 |                               |
 |  ${title.padEnd(25)}  |
 |                               |
 |  * ${description.substring(0, 20)}${description.length > 20 ? '...' : ''}   |
 |  * [${technologies.slice(0, 2).join(', ')}${technologies.length > 2 ? ', ...' : ''}]  |
 |                               |
 |  [View Project]               |
 |                               |
 +-------------------------------+`}
                </pre>
            </div>
            <div className="ascii-content">
                {imageUrl && <div className="project-image"><img src={imageUrl} alt={title} /></div>}
                <h3 className="project-title">{title}</h3>
                <p className="project-description">{description}</p>
                <div className="tech-stack">
                    {technologies.map((tech, index) => (
                        <span key={index} className="tech-badge">{tech}</span>
                    ))}
                </div>
                <a href={link} target="_blank" rel="noopener noreferrer" className="view-link">
                    <span className="link-text">View Project</span>
                    <span className="link-arrow">→</span>
                </a>
            </div>
        </div>
    );
}