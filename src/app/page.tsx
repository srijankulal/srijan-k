"use client";
import About from "@/components/About/About";
import Contact from "@/components/Contact/contact";
import Footer from "@/components/HeaderFooter/Footer";
import Header from "@/components/HeaderFooter/Header";
import Hero from "@/components/Hero/Hero";
import Project from "@/components/Project/Project";
import Skills from "@/components/Skill/Skills";
import { motion } from "motion/react"

export default function Home() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="overflow-x-hidden w-full">
      <main className="border border-neutral-600 dark:border-neutral-400 my-4 w-full max-w-full overflow-x-hidden">
        
        <Header whereAt="home" />
        
        <div className="py-4 sm:py-8 text-center border-b border-neutral-600 dark:border-neutral-400 w-full">
          {/* Hero Section */}
          <div className="border-b border-neutral-600 dark:border-neutral-400 w-full">
            <div className="px-2 sm:px-4 md:px-8">
              <motion.div 
                className=""
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Hero/>
              </motion.div>
            </div>
          </div>

          {/* Projects Section */}
          <motion.div 
            className="pt-10 border-b border-neutral-600 dark:border-neutral-400 pb-24 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <div className="px-2 sm:px-4 md:px-8">
              <Project />
            </div>
          </motion.div>
  
          {/* About Section */}
          <motion.div 
            className="pt-14 border-b border-neutral-600 dark:border-neutral-400 pb-24 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <div className="px-2 sm:px-4 md:px-8">
              <About />
            </div>
          </motion.div>
  

  
          {/* Skills Section */}
          <motion.div 
            className="lg:pt-20 lg:pb-24 border-b border-neutral-600 dark:border-neutral-400 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <div className="px-2 sm:px-4 md:px-8">
              <Skills />
            </div>
          </motion.div>
          
          {/* Contact Section */}
          <motion.div 
            className="pb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <div className="px-2 sm:px-4 md:px-8">
              <Contact id="contact" />
            </div>
          </motion.div>
        </div>
        
        {/* Footer */}
        <motion.div
          className="px-2 sm:px-4 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Footer />
        </motion.div>
        
        {/* Add space at the bottom for mobile navigation */}
        <div className="md:hidden h-16"></div>
      </main>
    </div>
  );
}

