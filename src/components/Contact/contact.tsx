import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Contact({id}: {id: string}) {
  const [showCursor, setShowCursor] = useState(true);
  const [displayedCommand1, setDisplayedCommand1] = useState("");
  const [displayedCommand2, setDisplayedCommand2] = useState("");
  const command1 = "$ cd contacts";
  const command2 = "$ ls -la ";

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < command1.length) {
        setDisplayedCommand1(command1.substring(0, i + 1));
        i++;
      } else if (i < command1.length + command2.length) {
        const j = i - command1.length;
        setDisplayedCommand2(command2.substring(0, j + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18 }
    }
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.45 }
    }
  };

  const contacts = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: "phone",
      value: "+91 8762471304",
      href: "tel:+918762471304",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "email",
      value: "contact@srijank.com",
      href: "mailto:srijankulal1010@gmail.com",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      label: "github",
      value: "github.com/srijankulal",
      href: "https://github.com/srijankulal",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      label: "linkedin",
      value: "linkedin.com/in/srijank",
      href: "http://www.linkedin.com/in/srijan-kulal",
    },
  ];

  return (
    <div className="w-full my-16 px-4 sm:px-6 lg:px-8 pb-10" id={id}>
        {/* Section header */}
        <div className="mb-8 text-left">
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="section-label mb-1 text-left"
          >
            // 05. contact
          </motion.p>
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl font-bold text-left"
          >
            Contact
          </motion.h2>
        </div>
        
        <div className="flex flex-col justify-center items-center w-full pt-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-3xl border border-border bg-card/85 dark:bg-black/60 text-left shadow-lg"
        >
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-neon/60" />
              <span className="ml-3 font-mono text-xs text-foreground/30">srijan@portfolio — contacts</span>
              <span className="ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neon led-blink" />
              </span>
            </div>

            <div className="p-5 sm:p-6">
              {/* Command 1 */}
              <div className="mb-4 font-mono text-sm">
                <span className="text-neon">srijan@portfolio</span>
                <span className="text-blue-400"> ~</span>
                <br/>
                <span className="text-foreground/80"> {displayedCommand1}
                  <span className={showCursor && displayedCommand1.length < command1.length ? "animate-caret-blink" : "opacity-0"}>_</span>
                </span>
              </div>
              
              {/* Command 2 */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: displayedCommand1.length === command1.length ? 1 : 0 }}
                className="mb-4 font-mono text-sm"
              >
                <span className="text-neon">srijan@portfolio</span>
                <span className="text-blue-400"> ~/contacts</span>
                <br/>
                <span className="text-foreground/80">{displayedCommand2}
                  <span className={showCursor && displayedCommand2.length < command2.length ? "animate-caret-blink" : "opacity-0"}>_</span>
                </span>
              </motion.div>

              {/* Contact list */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: displayedCommand2.length === command2.length ? 1 : 0 }}
              >
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="border-t border-border/40 pt-4 mt-1 space-y-3"
                >
                  <motion.div variants={itemVariants} className="font-mono text-xs text-neon/50 mb-3">
                    total {contacts.length}
                  </motion.div>
                  
                  {contacts.map((contact, i) => (
                    <motion.div key={i} variants={itemVariants} className="flex items-center gap-3 group">
                      <span className="text-blue-400/70 shrink-0">{contact.icon}</span>
                      <span className="text-foreground/30 font-mono text-xs w-16 shrink-0">{contact.label}</span>
                      <a 
                        href={contact.href}
                        className="text-foreground/80 hover:text-neon font-mono text-sm transition-colors duration-200 hover:underline"
                      >
                        {contact.value}
                      </a>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Action line */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: displayedCommand2.length === command2.length ? 1 : 0 }}
                  transition={{ delay: 1.2 }}
                  className="mt-5 pt-4 border-t border-border/40 font-mono text-sm"
                >
                  <span className="text-neon">$ </span>
                  <span className="text-foreground/50">send --method </span>
                  <a 
                    href="/Contact" 
                    className="text-blue-400 hover:text-neon transition-colors duration-200 underline"
                  >
                    email
                  </a>
                  <span className={`ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>
                </motion.div>
              </motion.div>
            </div>
        </motion.div>
        </div>
    </div>
  );
}