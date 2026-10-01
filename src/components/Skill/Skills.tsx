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
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  const categories = [
    {
      title: "Frontend",
      icon: "</>",
      label: "UI_LAYER",
      color: "text-blue-700 dark:text-blue-400",
      borderColor: "border-blue-500/30 dark:border-blue-400/20",
      skills: [
        { name: "React / Next.js" },
        { name: "TypeScript" },
        { name: "Tailwind CSS" },
        { name: "Flutter" }
      ]
    },
    {
      title: "Backend",
      icon: "{;}",
      label: "SRV_LAYER",
      color: "text-amber-700 dark:text-yellow-400",
      borderColor: "border-amber-500/30 dark:border-yellow-400/20",
      skills: [
        { name: "Python / Flask" },
        { name: "Node.js" },
        { name: "PostgreSQL" },
        { name: "RESTful APIs" }
      ]
    },
    {
      title: "Other",
      icon: "~/",
      label: "SYS_LAYER",
      color: "text-neon",
      borderColor: "border-neon/30 dark:border-neon/20",
      skills: [
        { name: "IoT & Embedded" },
        { name: "Machine Learning" },
        { name: "Computer Vision" }
      ]
    }
  ];

  return (
    <div className="w-full my-16 px-4 sm:px-6 lg:px-8 pb-10" id="skills" ref={ref}>
      {/* Section header */}
      <div className="mb-8 text-left">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="section-label mb-1 text-left"
        >
          // 04. skills
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-bold text-left"
        >
          Skills
        </motion.h2>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
      >
        {categories.map((category, index) => (
          <motion.div 
            key={index}
            variants={cardVariants}
            className={`relative bg-card/60 dark:bg-background border ${category.borderColor} p-5 transition-all duration-300 
              hover:border-opacity-60 hover:shadow-[0_0_20px_rgba(113,252,123,0.05)] group`}
          >
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon/30" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon/30" />

            {/* Card header */}
            <div className="flex items-center gap-3 mb-5">
              <span className={`font-mono text-sm bg-background border border-border px-2 py-0.5 ${category.color} group-hover:border-neon/30 transition-colors`}>
                {category.icon}
              </span>
              <div>
                <h3 className="text-lg font-bold leading-none">{category.title}</h3>
                <p className={`font-mono text-[10px] ${category.color} opacity-60 mt-0.5`}>{category.label}</p>
              </div>
            </div>

            {/* Skills list */}
            <ul className="space-y-3">
              {category.skills.map((skill, skillIndex) => (
                <li key={skillIndex} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/80 font-mono">{skill.name}</span>
                  </div>
                  <div className="w-full bg-border/30 h-px relative overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={inView ? { width: "100%" } : { width: 0 }}
                      transition={{ duration: 1.2, delay: 0.3 + index * 0.2 + skillIndex * 0.1, ease: "easeOut" }}
                      className="bg-neon/40 group-hover:bg-neon/70 h-px transition-colors duration-500" 
                    />
                  </div>
                </li>
              ))}
            </ul>

            {/* Chip pin decoration at bottom */}
            <div className="flex justify-center gap-2 mt-5 pt-3 border-t border-border/30">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`w-1 h-2 ${i === 2 ? 'bg-neon/50' : 'bg-border/50'} transition-colors group-hover:bg-neon/${i === 2 ? '80' : '20'}`} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
