export default function Skills() {
    const skills = ["Next.js", "Tailwind CSS", "Spring Boot", "Python"];
  
    return (
      <section id="skills" className="py-20 text-center">
        <h2 className="text-3xl font-semibold">Skills</h2>
        <div className="flex flex-wrap justify-center mt-5 gap-3">
          {skills.map((skill, idx) => (
            <span key={idx} className="px-4 py-2 bg-gray-200 rounded-md">{skill}</span>
          ))}
        </div>
      </section>
    );
  }
  