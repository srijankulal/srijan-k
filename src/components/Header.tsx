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
                            <Link href="/#about" className={`text-white text-2xl ${whereAt === 'about' ? 'font-bold' : ''}`}>
                                <span className="text-amber-600"><u><b>A</b></u></span>
                                <u className={whereAt === 'about' ? ' text-amber-600' : ''}>bout</u>
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
                            <Link href="/Projects" className={`text-white text-2xl ${whereAt === 'projects' ? 'font-bold' : ''}`}>
                                <span className="text-amber-600"><u><b>P</b></u></span>
                                <u className={whereAt === 'projects' ? 'text-amber-600' : ''}>rojects</u>
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
                            <Link href="/#skills" className={`text-white text-2xl ${whereAt === 'skills' ? 'font-bold' : ''}`}>
                                <span className="text-amber-600"><u><b>S</b></u></span>
                                <u className={whereAt === 'skills' ? ' text-amber-600' : ''}>kills</u>
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
                            <Link href="/#contact" className={`text-white text-2xl ${whereAt === 'contact' ? 'font-bold' : ''}`}>
                                <span className="text-amber-600"><u><b>C</b></u></span>
                                <u className={whereAt === 'contact' ? '  text-amber-600' : ''}>ontact</u>
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
                className="border-b border-gray-300 py-2 pb-4 w-full overflow-x-hidden"
            >
                <div className="flex justify-between items-center max-w-full">
                    <motion.div 
                        className="flex items-center"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h1 className="text-4xl font-bold">|  </h1>
                        <Link href="/" >
                            <h1 className="text-4xl font-bold pl-2"> Srijan K.</h1>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex ml-auto pr-4">
                        <NavLinks />
                    </div>
                    
                    <h1 className="text-4xl font-bold"> |</h1>
                </div>
            </motion.header>
            
            {/* Mobile Navigation - Fixed at bottom of screen */}
            <div className="block md:hidden">
                <motion.div 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-0 left-0 right-0 bg-background border border-white shadow-lg z-50 w-full"
                >
                    <div className="grid grid-cols-4 h-16 pt-4 ">
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <Link href="/#about" className="flex flex-col items-center text-white px-2">
                                <motion.span 
                                    animate={{ scale: whereAt === 'about' ? 1.1 : 1 }}
                                    className={`text-lg ${whereAt === 'about' ? 'text-amber-600' : 'text-gray-400'} `}
                                >
                                    &#62;_
                                </motion.span>
                                <span className={`text-xs ${whereAt === 'about' ? 'text-amber-600 font-bold' : ''}`}>About</span>
                            </Link>
                        </motion.div>
    
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <Link href="/Projects" className="flex flex-col items-center text-white px-2">
                                <motion.span 
                                    animate={{ scale: whereAt === 'projects' ? 1.1 : 1 }}
                                    className={`text-base ${whereAt === 'projects' ? 'text-amber-600' : 'text-gray-400'}`}
                                >
                                    {`{}`}
                                </motion.span>
                                <span className={`text-xs ${whereAt === 'projects' ? 'text-amber-600 font-bold' : ''}`}>Projects</span>
                            </Link>
                        </motion.div>
    
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <Link href="/#skills" className="flex flex-col items-center text-white px-2">
                                <motion.span 
                                    animate={{ scale: whereAt === 'skills' ? 1.1 : 1 }}
                                    className={`text-base ${whereAt === 'skills' ? 'text-amber-600' : 'text-gray-400'}`}
                                >
                                    &#47;&#92;
                                </motion.span>
                                <span className={`text-xs ${whereAt === 'skills' ? 'text-amber-600 font-bold' : ''}`}>Skills</span>
                            </Link>
                        </motion.div>
    
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                            <Link href="/#contact" className="flex flex-col items-center text-white px-2">
                                <motion.span 
                                    animate={{ scale: whereAt === 'contact' ? 1.1 : 1 }}
                                    className={`text-base ${whereAt === 'contact' ? 'text-amber-600' : 'text-gray-400'}`}
                                >
                                    @_
                                </motion.span>
                                <span className={`text-xs ${whereAt === 'contact' ? 'text-amber-600 font-bold' : ''}`}>Contact</span>
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