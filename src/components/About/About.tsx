import TerminalSnippet from "../TerminalSnippet";
import { motion } from "framer-motion";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
    <div className="flex justify-center items-center w-full" id="about">
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="flex flex-col w-full snap-start sm:snap-align-none"
    >
      <motion.h2 variants={itemVariants} className="text-5xl font-bold mb-2 text-left pl-30">About Me</motion.h2>
      
      <div className="flex flex-col justify-center items-center w-full md:flex-row">
        <div className="flex flex-row justify-center items-center w-full md:pl-20">
          <motion.div variants={itemVariants} className="terminal-style-about p-4 text-left border-l-2 border-white">
            <div className="mb-4">
              <motion.span variants={itemVariants} className="text-amber-600 text-2xl">$ whoami</motion.span>
              <ul className="list-none pl-4 pt-2">
                {["Backend-focused developer skilled in Python (Flask), Next.js, Flutter", 
                  "Experienced with PostgreSQL, MySQL and database optimization",
                  "Specializing in secure, scalable applications with real-time features"].map((text, index) => (
                  <motion.li 
                    key={index}
                    variants={itemVariants} 
                    className="flex items-start mb-2"
                  >
                    <span className="mr-2">▶</span> 
                    <span className="text-2xl">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="mb-2">
              <motion.span variants={itemVariants} className="text-amber-600 text-2xl">$ education</motion.span>
              <ul className="list-none pl-4 pt-2">
                {["B.C.A at St. Aloysius University (2023-2026)", 
                  "Constantly learning and seeking new challenges"].map((text, index) => (
                  <motion.li 
                    key={index}
                    variants={itemVariants} 
                    className="flex items-start mb-2"
                  >
                    <span className="mr-2">▶</span> 
                    <span  className="text-2xl">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
        <motion.div variants={itemVariants} className="text-left lg:pr-36 lg:pl-36 pt-8">
          <TerminalSnippet />
        </motion.div>
      </div>
    </motion.div>
    </div>
    </>
  );
}