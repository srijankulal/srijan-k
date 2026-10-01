"use client";
import About from "@/components/About/About";
import Contact from "@/components/Contact/contact";
import Footer from "@/components/HeaderFooter/Footer";
import Header from "@/components/HeaderFooter/Header";
import Hero from "@/components/Hero/Hero";
import Project from "@/components/Project/Project";
import Experience from "@/components/Experience/Experience";
import Skills from "@/components/Skill/Skills";
import RecruiterView from "@/components/RecruiterView";
import MinimalView from "@/components/MinimalView";
import ModePrompt from "@/components/ModePrompt";
import { useSiteMode } from "@/lib/SiteModeContext";
import { motion, AnimatePresence } from "motion/react";

export default function Home() {
  const { mode } = useSiteMode();

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="overflow-x-hidden w-full">
      <ModePrompt />
      <main className="border border-border my-4 w-full max-w-full overflow-x-hidden">
        
        <Header whereAt="home" />

        <AnimatePresence mode="wait">
          {/* ── MINIMAL MODE ── */}
          {mode === "minimal" && (
            <motion.div
              key="minimal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MinimalView />
              <motion.div
                className="px-2 sm:px-4 md:px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Footer />
              </motion.div>
            </motion.div>
          )}

          {/* ── RECRUITER MODE ── */}
          {mode === "recruiter" && (
            <motion.div
              key="recruiter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-b border-border">
                <div className="px-2 sm:px-4 md:px-8 py-3 flex items-center gap-2 bg-neon/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon led-blink" />
                  <p className="font-mono text-xs text-neon/70">Recruiter View — structured resume layout</p>
                  <span className="ml-auto font-mono text-xs text-foreground/30">Switch mode via toolbar →</span>
                </div>
              </div>
              <RecruiterView />
              <motion.div
                className="px-2 sm:px-4 md:px-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Footer />
              </motion.div>
            </motion.div>
          )}

          {/* ── PORTFOLIO MODE (default) ── */}
          {mode === "portfolio" && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-left w-full"
            >
              {/* Hero Section */}
              <div className="border-b border-border w-full">
                <div className="px-2 sm:px-4 md:px-8">
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={sectionVariants}
                  >
                    <Hero/>
                  </motion.div>
                </div>
              </div>

              {/* About Section */}
              <motion.div 
                className="border-b border-border w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={sectionVariants}
              >
                <div className="px-2 sm:px-4 md:px-8">
                  <About />
                </div>
              </motion.div>

              {/* Projects Section */}
              <motion.div 
                className="border-b border-border w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={sectionVariants}
              >
                <div className="px-2 sm:px-4 md:px-8">
                  <Project />
                </div>
              </motion.div>

              {/* Experience Section */}
              <motion.div 
                className="border-b border-border w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={sectionVariants}
              >
                <div className="px-2 sm:px-4 md:px-8">
                  <Experience />
                </div>
              </motion.div>

              {/* Skills Section */}
              <motion.div 
                className="border-b border-border w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={sectionVariants}
              >
                <div className="px-2 sm:px-4 md:px-8">
                  <Skills />
                </div>
              </motion.div>
              
              {/* Contact Section */}
              <motion.div 
                className="border-b border-border w-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={sectionVariants}
              >
                <div className="px-2 sm:px-4 md:px-8">
                  <Contact id="contact" />
                </div>
              </motion.div>

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
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
