import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header({ whereAt }: { whereAt: string }) {
    const router = useRouter();

    // Add keyboard shortcut handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only proceed if Alt key is pressed
            if (e.altKey) {
                switch(e.key.toLowerCase()) {
                    case 'm':
                        e.preventDefault();
                        router.push('/#about');
                        break;
                    case 'w':
                        e.preventDefault();
                        router.push('/Projects');
                        break;
                    case 's':
                        e.preventDefault();
                        router.push('/#skills');
                        break;
                    case 'c':
                        e.preventDefault();
                        router.push('/#contact');
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);
    
    const NavLinks = () => (
        <nav className="flex space-x-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                            <Link href="/#about" className={`text-black dark:text-white text-2xl ${whereAt === 'about' ? 'font-bold' : ''}`}>
                                {/* <span className="text-neon"><u><b>A</b></u></span> */}
                                <u className={whereAt === 'about' ? ' text-neon' : ''}>About</u>
                            </Link>
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Says about me!!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* Apply same pattern to other links */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                            <Link href="/Projects" className={`text-black dark:text-white text-2xl ${whereAt === 'projects' ? 'font-bold' : ''}`}>
                                {/* <span className="text-neon"><u><b>P</b></u></span> */}
                                <u className={whereAt === 'projects' ? 'text-neon' : ''}>Projects</u>
                            </Link>
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Projects Made!!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                            <Link href="/#skills" className={`text-black dark:text-white text-2xl ${whereAt === 'skills' ? 'font-bold' : ''}`}>
                                {/* <span className="text-neon"><u><b>S</b></u></span> */}
                                <u className={whereAt === 'skills' ? ' text-neon' : ''}>Skills</u>
                            </Link>
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>About my skills</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                            <Link href="/#contact" className={`text-black dark:text-white text-2xl ${whereAt === 'contact' ? 'font-bold' : ''}`}>
                                {/* <span className="text-neon"><u><b>C</b></u></span> */}
                                <u className={whereAt === 'contact' ? '  text-neon' : ''}>Contact</u>
                            </Link>
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Say hello to me!!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </nav>
    );

    return (
        <>
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border-b border-neutral-600 dark:border-neutral-400 py-4 w-full"
            >
                <div className="flex justify-between items-center max-w-full px-2 sm:px-4 md:px-8">
                    <motion.div 
                        className="flex items-center"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        
                        <Link href="/" >
                            <h1 className="text-4xl font-bold">Srijan K.</h1>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex ml-auto pr-4">
                        <NavLinks />
                    </div>
                </div>
            </motion.header>
            
            {/* Mobile Navigation - Fixed at bottom of screen */}
            <div className="block md:hidden">
                <motion.div 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-0 left-0 right-0 bg-background border-t border-neutral-600 dark:border-neutral-400 shadow-lg z-50 w-full"
                >
                    <div className="grid grid-cols-4 h-16 pt-4 ">
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <Link href="/#about" className="flex flex-col items-center text-black dark:text-white px-2">
                                <motion.span 
                                    animate={{ scale: whereAt === 'about' ? 1.1 : 1 }}
                                    className={`text-lg ${whereAt === 'about' ? 'text-neon' : 'text-gray-600 dark:text-gray-400'} `}
                                >
                                    &#62;_
                                </motion.span>
                                <span className={`text-xs ${whereAt === 'about' ? 'text-neon font-bold' : ''}`}>About</span>
                            </Link>
                        </motion.div>
    
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <Link href="/Projects" className="flex flex-col items-center text-black dark:text-white px-2">
                                <motion.span 
                                    animate={{ scale: whereAt === 'projects' ? 1.1 : 1 }}
                                    className={`text-base ${whereAt === 'projects' ? 'text-neon' : 'text-gray-600 dark:text-gray-400'}`}
                                >
                                    {`{}`}
                                </motion.span>
                                <span className={`text-xs ${whereAt === 'projects' ? 'text-neon font-bold' : ''}`}>Projects</span>
                            </Link>
                        </motion.div>
    
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <Link href="/#skills" className="flex flex-col items-center text-black dark:text-white px-2">
                                <motion.span 
                                    animate={{ scale: whereAt === 'skills' ? 1.1 : 1 }}
                                    className={`text-base ${whereAt === 'skills' ? 'text-neon' : 'text-gray-600 dark:text-gray-400'}`}
                                >
                                    &#47;&#92;
                                </motion.span>
                                <span className={`text-xs ${whereAt === 'skills' ? 'text-neon font-bold' : ''}`}>Skills</span>
                            </Link>
                        </motion.div>
    
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <Link href="/#contact" className="flex flex-col items-center text-black dark:text-white px-2">
                                <motion.span 
                                    animate={{ scale: whereAt === 'contact' ? 1.1 : 1 }}
                                    className={`text-base ${whereAt === 'contact' ? 'text-neon' : 'text-gray-600 dark:text-gray-400'}`}
                                >
                                    @_
                                </motion.span>
                                <span className={`text-xs ${whereAt === 'contact' ? 'text-neon font-bold' : ''}`}>Contact</span>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
            
            {/* Add padding at the bottom of the page content to prevent content from being hidden behind fixed nav */}
            <div className="block md:hidden pb-16"></div>
        </>
    );
}