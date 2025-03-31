export default function Skills() {
  return (
  
      <div className="w-full my-16 px-4 sm:px-6 lg:px-8 pb-10" id="skills">
        <h2 className="text-5xl font-bold mb-8 text-left sm:pb-4">Skills</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[
            {
              title: "Frontend",
              icon: "</>",
              skills: [
              { name: "React/Next.js" },
              { name: "TypeScript" },
              { name: "Tailwind CSS" },
              { name: "Flutter"}
              ]
            },
            {
              title: "Backend",
              icon: "  ;  ",
              skills: [
              { name: "Python/Flask" },
              { name: "Node.js"},
              { name: "PostgreSQL" },
              { name: "RESTful APIs"}
              ]
            },
            {
              title: "Other",
              icon: "~/",
              skills: [
              { name: "IOT" },
              { name: "Machine Learning" },
              { name: "Computer Vision" }
              ]
            }
            ].map((category, index) => (
            <div 
              key={index} 
              className="bg-background border border-white p-4 transition-all duration-300  hover:border-2 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
            >
              <h3 className="text-xl font-medium mb-4 text-gray-200 flex items-center">
              <span className="mr-2 font-mono bg-background px-4 py-1  text-amber-600 border border-white inline-flex items-center">
              <span>{category.icon}</span>
              
              </span>
              <u>{category.title}</u>
              </h3>
              <ul className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
              <li key={skillIndex} className="space-y-1">
              <div className="flex justify-between ">
                <span className="text-gray-300">{skill.name}</span>
                
              </div>
              <div className="w-full bg-gray-700  h-1">
                <div 
                className="hover:bg-white h-1  transition-all duration-500" 
                />
              </div>
              </li>
              ))}
              </ul>
            </div>
            ))}
        </div>
      </div>
      
  
  );
}
