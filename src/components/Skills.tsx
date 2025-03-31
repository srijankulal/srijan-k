import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";


export default function Skills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2, rotateY: 180, transition: { duration: 0.3 } }
  };

  return (
    <div className="w-full my-16 px-4 sm:px-6 lg:px-8 pb-10" id="skills" ref={ref}>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold mb-8 text-left sm:pb-4"
      >
        Skills
      </motion.h2>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
      >
        {[
          {
            title: "Frontend",
            icon: "</>",
            skills: [
              { name: "React/Next.js"},
              { name: "TypeScript" },
              { name: "Tailwind CSS"},
              { name: "Flutter"}
            ]
          },
          {
            title: "Backend",
            icon: "  ;  ",
            skills: [
              { name: "Python/Flask" },
              { name: "Node.js" },
              { name: "PostgreSQL" },
              { name: "RESTful APIs" }
            ]
          },
          {
            title: "Other",
            icon: "~/",
            skills: [
              { name: "IOT" },
              { name: "Machine Learning" },
              { name: "Computer Vision"}
            ]
          }
        ].map((category, index) => (
          <motion.div 
            key={index}
            variants={cardVariants}
            className="bg-background border border-white p-4 transition-all duration-300 hover:border-2 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.7)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <h3 className="text-xl font-medium mb-4 text-gray-200 flex items-center">
              <motion.span
                whileHover="hover"
                initial="initial"
                variants={iconVariants}
                className="mr-2 font-mono bg-background px-4 py-1 text-amber-600 border border-white inline-flex items-center"
              >
                <span>{category.icon}</span>
              </motion.span>
              <u>{category.title}</u>
            </h3>
            <ul className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <li key={skillIndex} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-300">{skill.name}</span>
                  </div>
                  <div className="w-full bg-gray-700 h-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.2 + skillIndex * 0.1 }}
                      className="bg-gray-600 hover:bg-white h-1 transition-colors duration-500" 
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
