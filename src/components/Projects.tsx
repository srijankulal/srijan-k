export default function Projects() {
    const projects = [
      { title: "Pixel Cypher", desc: "Text-to-image encryption.", link: "#" },
      { title: "Note Vault Add-on", desc: "Flashcards from PDFs.", link: "#" }
    ];
  
    return (
      <section id="projects" className="py-20 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold">Projects</h2>
        <div className="mt-5 grid md:grid-cols-2 gap-5 px-5">
          {projects.map((proj, idx) => (
            <div key={idx} className="p-5 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-medium">{proj.title}</h3>
              <p className="text-gray-600">{proj.desc}</p>
              <a href={proj.link} className="text-blue-500 mt-2 inline-block">View Project</a>
            </div>
          ))}
        </div>
      </section>
    );
  }
  