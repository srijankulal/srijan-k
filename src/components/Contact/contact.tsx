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
    }, 500); // Toggle cursor every 500ms
    
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
      transition: {
        staggerChildren: 0.2
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
    <div className="w-full my-16 px-4 sm:px-6 lg:px-8 pb-10" id={id}>
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-bold mb-8 text-left sm:pb-4"
        >
          Contact
        </motion.h2>
        <div className="flex flex-col justify-center items-center w-full pt-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="terminal-style-contact w-full max-w-6xl p-6 border-2 border-white bg-back bg-opacity-80 text-left"
        >
            <div className="mb-4 border-b border-gray-700 pb-2">
            <span className="text-amber-600 font-mono text-lg">srijan@portfolio</span>
            <span className="text-blue-400 font-mono"> ~</span>
            <br></br>
            <span className="text-white font-mono"> {displayedCommand1}<span className={showCursor ? "animate-caret-blink" : ""}>{displayedCommand1.length === command1.length ? "" : "_"}</span></span>
            </div>
            
            <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: displayedCommand1.length === command1.length ? 1 : 0 }}
            className="mb-4 border-b border-gray-700 pb-2"
            >
            <span className="text-amber-600 font-mono text-lg">srijan@portfolio</span>
            <span className="text-blue-400 font-mono"> ~/contacts</span><br></br>
            <span className="text-white font-mono">{displayedCommand2}<span className={showCursor ? "animate-caret-blink" : ""}>{displayedCommand2.length === command2.length ? "" : "_"}</span></span>
            </motion.div>

            <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: displayedCommand2.length === command2.length ? 1 : 0 }}
            className="mb-4 border-b border-gray-700 pb-2"
            >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="font-mono mt-4 pl-4"
            >
              <motion.div variants={itemVariants} className="mb-3 text-green-500 text-lg">total 4</motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-3">
              <motion.div 
              whileHover={{ scale: 1.02 }}
              className="col-span-1 text-blue-400"
              >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-white text-lg">+91 8762471304</span>
              </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-3">
              <motion.div 
              whileHover={{ scale: 1.02 }}
              className="col-span-1 text-blue-400"
              >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <motion.a 
                whileHover={{ color: "#4ADE80" }}
                href="mailto:srijankulal1010@gmail.com" 
                className="text-white text-lg hover:underline"
              >
                contact@srijank.com
              </motion.a>
              </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-3">
              <motion.div 
              whileHover={{ scale: 1.02 }}
              className="col-span-1 text-blue-400"
              >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <motion.a 
                whileHover={{ color: "#4ADE80" }}
                href="https://github.com/srijankulal" 
                className="text-white text-lg hover:underline"
              >
                github.com/srijankulal
              </motion.a>
              </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-3">
              <motion.div 
              whileHover={{ scale: 1.02 }}
              className="col-span-1 text-blue-400"
              >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <motion.a 
                whileHover={{ color: "#4ADE80" }}
                href="http://www.linkedin.com/in/srijan-kulal" 
                className="text-white text-lg hover:underline"
              >
                linkedin.com/in/srijank
              </motion.a>
              </motion.div>
              </motion.div>
            </motion.div>
            </motion.div>
            
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: displayedCommand2.length === command2.length ? 1 : 0 }}
            transition={{ delay: 1.5 }}
            className="mt-6"
          >
            <span className="text-amber-600 font-mono">$ </span>
            contact
            <motion.a 
            whileHover={{ scale: 1.05 }}
            href="/Contact" 
            className="text-gray-400 hover:text-green-600"
            >
            {" "}[<u className="text-blue-400 hover:text-green-600">click to send mail</u>]
            </motion.a>
            <span className="animate-caret-blink"> _</span>
          </motion.div>
        </motion.div>
        </div>
    </div>
  );
}