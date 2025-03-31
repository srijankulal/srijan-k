"use client";
import About from "@/components/About";
import Contact from "@/components/contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Project from "@/components/Project";
import Skills from "@/components/Skills";
import { motion } from "motion/react"

export default function Home() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="overflow-x-hidden w-full">
      <main className="border border-gray-300 p-2 sm:p-4 my-4 w-full max-w-full overflow-x-hidden">
        
        <Header whereAt="home" />
        
        <div className="py-4 sm:py-8 text-center border-b border-gray-300 w-full overflow-hidden">
          {/* Hero Section */}
          <motion.div 
            className="border-b border-gray-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Hero/>
          </motion.div>
  
          {/* About Section */}
          <motion.div 
            className="pt-14 border-b border-gray-300 pb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <About />
          </motion.div>
  
          {/* Projects Section */}
          <motion.div 
            className="pt-10 border-b border-gray-300 pb-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Project />
          </motion.div>
  
          {/* Skills Section */}
          <motion.div 
            className="lg:pt-20 lg:pb-24 border-b border-gray-300"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Skills />
          </motion.div>
          
          {/* Contact Section */}
          <motion.div 
            className="pb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <Contact id="contact" />
          </motion.div>
        </div>
        
        {/* Footer */}
        <motion.div
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