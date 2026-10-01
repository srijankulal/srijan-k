import TerminalSnippet from "../TerminalSnippet";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { educationQuery } from "@/sanity/lib/queries";

interface EducationItem {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
}

export default function About() {
  const [eduList, setEduList] = useState<string[]>([
    "B.C.A at St. Aloysius University (2023–Present)",
    "Constantly learning and seeking new challenges",
  ]);
  const [showAllEdu, setShowAllEdu] = useState(false);

  useEffect(() => {
    const fetchEdu = async () => {
      try {
        const data: EducationItem[] = await client.fetch(educationQuery);
        if (data && Array.isArray(data) && data.length > 0) {
          const formatted = data.map(
            (e) => `${e.degree} at ${e.institution} (${e.startDate}–${e.current ? 'Present' : e.endDate || 'Present'})${e.gpa ? ` — ${e.gpa}` : ''}`
          );
          setEduList(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch education from Sanity:", err);
      }
    };
    fetchEdu();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.25
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

  const whoami = [
    "Backend-focused developer skilled in Python (Flask), Next.js, Flutter",
    "Experienced with PostgreSQL, MySQL and database optimization",
    "Specializing in secure, scalable applications with real-time features",
  ];

  return (
    <>
    <div className="w-full my-16 px-4 sm:px-6 lg:px-8 pb-10" id="about">
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="flex flex-col w-full"
    >
      {/* Section header */}
      <motion.div variants={itemVariants} className="mb-8 text-left">
        <p className="section-label mb-1 text-left">// 01. about</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-left">About Me</h2>
      </motion.div>
      
      <div className="flex flex-col justify-center items-start w-full md:flex-row gap-8 md:gap-12">
        {/* Terminal-style about info */}
        <motion.div variants={itemVariants} className="w-full md:w-1/2">
          <div className="border border-border bg-card/70 dark:bg-black/30 backdrop-blur-xs p-5 relative shadow-xs">
            {/* Chip corner accents */}
            <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon/50" />
            <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon/50" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon/50" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon/50" />
            
            {/* whoami block */}
            <div className="mb-5">
              <span className="text-neon font-mono text-lg">$ whoami</span>
              <ul className="list-none pl-4 pt-3 space-y-2">
                {whoami.map((text, index) => (
                  <motion.li 
                    key={index}
                    variants={itemVariants} 
                    className="flex items-start gap-2 text-foreground/80 text-base leading-relaxed"
                  >
                    <span className="text-neon/60 mt-0.5 shrink-0">▸</span> 
                    <span>{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            {/* education block (Top 3 only) */}
            <div className="mb-2 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-neon font-mono text-lg">$ education</span>
                {eduList.length > 3 && (
                  <button
                    onClick={() => setShowAllEdu(!showAllEdu)}
                    className="font-mono text-[11px] text-neon/70 hover:text-neon hover:underline cursor-pointer transition-colors"
                  >
                    {showAllEdu ? '[- show top 3]' : `[+ ${eduList.length - 3} more]`}
                  </button>
                )}
              </div>
              <ul className="list-none pl-4 pt-3 space-y-2.5">
                {(showAllEdu ? eduList : eduList.slice(0, 3)).map((text: string) => (
                  <motion.li 
                    key={text}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-2 text-foreground/80 text-sm sm:text-base leading-relaxed"
                  >
                    <span className="text-neon/60 mt-0.5 shrink-0">▸</span> 
                    <span>{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* IoT interest badge */}
            <div className="mt-4 pt-3 border-t border-border/50">
              <div className="flex items-center gap-2 font-mono text-xs text-neon/50">
                <span className="w-1.5 h-1.5 bg-neon/60 rounded-full led-blink" />
                <span>$ interest --flag iot --status exploring</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* VS Code terminal snippet */}
        <motion.div variants={itemVariants} className="w-full md:w-1/2 flex items-start">
          <TerminalSnippet />
        </motion.div>
      </div>
    </motion.div>
    </div>
    </>
  );
}