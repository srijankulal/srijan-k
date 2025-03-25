"use client";

import { PropsWithChildren, useState } from "react";
import { motion } from "framer-motion";

interface BackGroundProps extends PropsWithChildren {
    whereAt?: string;
}

export default function FloatButtons({ whereAt = "" }: BackGroundProps) {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    // Function to determine button class based on current page
    const getButtonClass = (page: string) => {
        const baseClass = "text-white font-bold py-2 px-4 ";
        
        if (whereAt === page) {
            // Highlighted state - darker shade and border
            switch (page) {
                case "Home": return `  border-green-600 ${baseClass}`;
                case "Projects": return `bg-white border-2 border-white ${baseClass}`;
                case "About": return `bg-white  border-2 border-white ${baseClass}`;
                case "Contact": return `bg-white border-2 border-white ${baseClass}`;
                default: return `${baseClass}`;
            }
        } else {
            // Normal state
            switch (page) {
                case "Home": return `${baseClass}`;
                case "Projects": return `${baseClass}`;
                case "About": return `${baseClass}`;
                case "Contact": return `${baseClass}`;
                default: return `${baseClass}`;
            }
        }
    };

    return (
        <div className="fixed top-1/2 right-0 transform -translate-y-1/2 p-4 flex flex-col gap-2 ">
            <div className="flex flex-col gap-2">
                {/* Minecraft-style inventory slots */}
                <div className="relative">
                    <button 
                        className={`${getButtonClass("Home")} relative w-14 h-14  border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2  p-0 flex items-center justify-center`}
                        onClick={() => window.location.href = "/"}
                        onMouseEnter={() => setHoveredButton("Home")}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <div className="absolute inset-1  flex items-center justify-center">
                            {/* Home icon - pixelated house */}
                            <svg className="w-10 h-10 text-white hover:bg-gray-500" viewBox="0 0 16 16" fill="currentColor" style={{imageRendering: 'pixelated'}}>
                                <rect x="7" y="3" width="2" height="2" />
                                <rect x="5" y="5" width="2" height="2" />
                                <rect x="3" y="7" width="2" height="2" />
                                <rect x="9" y="5" width="2" height="2" />
                                <rect x="11" y="7" width="2" height="2" />
                                <rect x="5" y="9" width="6" height="4" />
                                <rect x="7" y="11" width="2" height="2" />
                            </svg>
                        </div>
                    </button>
                    {hoveredButton === "Home" && (
                        <motion.div 
                            className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-opacity-75 text-white px-2 py-1 rounded text-lg whitespace-nowrap"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            Home
                        </motion.div>
                    )}
                </div>

                <div className="relative">
                    <button 
                        className={`${getButtonClass("Projects")} relative w-14 h-14  border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2 p-0 flex items-center justify-center`}
                        onClick={() => window.location.href = "/Projects"}
                        onMouseEnter={() => setHoveredButton("Projects")}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <div className="absolute inset-1  flex items-center justify-center">
                            {/* Projects icon - pixelated document/folder */}
                            <svg className="w-10 h-10 text-white hover:bg-gray-500 " viewBox="0 0 16 16" fill="currentColor" style={{imageRendering: 'pixelated'}}>
                                <rect x="3" y="3" width="10" height="2" />
                                <rect x="3" y="5" width="2" height="8" />
                                <rect x="5" y="11" width="8" height="2" />
                                <rect x="11" y="5" width="2" height="6" />
                                <rect x="5" y="5" width="6" height="6" fill="#555555" />
                                <rect x="6" y="7" width="4" height="2" />
                            </svg>
                        </div>
                    </button>
                    {hoveredButton === "Projects" && (
                         <motion.div 
                         className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-opacity-75 text-white px-2 py-1 rounded text-lg whitespace-nowrap"
                         initial={{ opacity: 0, x: 10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.3, ease: "easeInOut" }}
                     >
                            Projects
                        </motion.div>
                    )}
                </div>
                
                <div className="relative">
                    <button 
                        className={`${getButtonClass("About")} relative w-14 h-14  border-t-3 border-l-2  border-r-2 border-b-2  p-0 flex items-center justify-center`}
                        onClick={() => window.location.href = "/decrypt"}
                        onMouseEnter={() => setHoveredButton("About")}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <div className="absolute inset-1  flex items-center justify-center">
                            {/* About icon - pixelated information */}
                           
                            <svg className="w-10 h-10 text-white hover:bg-gray-500" viewBox="0 0 16 16" fill="currentColor" style={{imageRendering: 'pixelated'}}>
                                {/* Pixelated person/document icon */}
                                <rect x="5" y="2" width="6" height="3" />
                                <rect x="7" y="5" width="2" height="4" />
                                <rect x="5" y="7" width="2" height="2" />
                                <rect x="9" y="7" width="2" height="2" />
                                <rect x="5" y="9" width="6" height="5" />
                                <rect x="7" y="11" width="2" height="3" />
                            </svg>
                        </div>
                    </button>
                    {hoveredButton === "About" && (
                         <motion.div 
                         className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-opacity-75 text-white px-2 py-1 rounded text-lg whitespace-nowrap"
                         initial={{ opacity: 0, x: 10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ duration: 0.3, ease: "easeInOut" }}
                     >
                            About
                        </motion.div>
                    )}
                </div>

                <div className="relative">
                    <button 
                        className={`${getButtonClass("Contact")} relative w-14 h-14  border-t-2 border-l-2 border-[#ffffff] border-r-2 border-b-2  p-0 flex items-center justify-center`}
                        onClick={() => window.location.href = "/projects"}
                        onMouseEnter={() => setHoveredButton("Contact")}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        <div className="absolute inset-1  flex items-center justify-center">
                            {/* Projects icon - pixelated chest */}
                            <svg className="w-10 h-10 text-white hover:bg-gray-500" viewBox="0 0 16 16" fill="currentColor" style={{imageRendering: 'pixelated'}}>
                                {/* Pixelated projects/chest icon */}
                                <rect x="2" y="3" width="12" height="10" />
                                <rect x="3" y="4" width="10" height="3" fill="#555555" />
                                <rect x="3" y="8" width="10" height="4" fill="#555555" />
                                <rect x="5" y="4" width="2" height="2" />
                                <rect x="9" y="4" width="2" height="2" />
                                <rect x="4" y="10" width="8" height="1" />
                            </svg>
                        </div>
                    </button>
                    {hoveredButton === "Contact" && (
                        <motion.div 
                        className="absolute text-lg right-16 top-1/2 transform -translate-y-1/2 bg-opacity-75 text-white px-2 py-1 rounded  whitespace-nowrap"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                            Contact
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}