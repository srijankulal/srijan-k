import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";

export default function Header({ whereAt }: { whereAt: string }) {
    
    const NavLinks = () => (
        <nav className="flex space-x-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Link href="/#about" className={`text-white text-2xl ${whereAt === 'about' ? 'font-bold' : ''}`}>
                            <span className="text-amber-600"><u><b>A</b></u></span>
                            <u className={whereAt === 'about' ? ' text-amber-600' : ''}>bout</u>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Says about me!!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Link href="/Projects" className={`text-white text-2xl ${whereAt === 'projects' ? 'font-bold' : ''}`}>
                            <span className="text-amber-600"><u><b>P</b></u></span>
                            <u className={whereAt === 'projects' ? 'text-amber-600' : ''}>rojects</u>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Projects Made!!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Link href="/#skills" className={`text-white text-2xl ${whereAt === 'skills' ? 'font-bold' : ''}`}>
                            <span className="text-amber-600"><u><b>S</b></u></span>
                            <u className={whereAt === 'skills' ? ' text-amber-600' : ''}>kills</u>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>About my skills</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Link href="/#contact" className={`text-white text-2xl ${whereAt === 'contact' ? 'font-bold' : ''}`}>
                            <span className="text-amber-600"><u><b>C</b></u></span>
                            <u className={whereAt === 'contact' ? '  text-amber-600' : ''}>ontact</u>
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Say hello to me!!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </nav>
    );

    const NavMenu = () => {
        return (
            <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 p-2 border-t border-white z-50 w-md">
                <div className="flex  justify-around items-center max-w-screen-sm mx-auto">
                    <Link href="/#about" className="flex flex-col items-center text-white px-2">
                        <span className={`text-base ${whereAt === 'about' ? 'text-amber-600 scale-110' : 'text-gray-400'}`}>&#62;_</span>
                        <span className={`text-xs ${whereAt === 'about' ? 'text-amber-600 font-bold' : ''}`}>About</span>
                    </Link>
    
                    <Link href="/Projects" className="flex flex-col items-center text-white px-2">
                        <span className={`text-base ${whereAt === 'projects' ? 'text-amber-600 scale-110' : 'text-gray-400'}`}>{`{}`}</span>
                        <span className={`text-xs ${whereAt === 'projects' ? 'text-amber-600 font-bold' : ''}`}>Projects</span>
                    </Link>
    
                    <Link href="/#skills" className="flex flex-col items-center text-white px-2">
                        <span className={`text-base ${whereAt === 'skills' ? 'text-amber-600 scale-110' : 'text-gray-400'}`}>&#47;&#92;</span>
                        <span className={`text-xs ${whereAt === 'skills' ? 'text-amber-600 font-bold' : ''}`}>Skills</span>
                    </Link>
    
                    <Link href="/#contact" className="flex flex-col items-center text-white px-2">
                        <span className={`text-base ${whereAt === 'contact' ? 'text-amber-600 scale-110' : 'text-gray-400'}`}>@_</span>
                        <span className={`text-xs ${whereAt === 'contact' ? 'text-amber-600 font-bold' : ''}`}>Contact</span>
                    </Link>
                </div>
            </nav>
        );
    }

    return (
        <header className="border-b border-gray-300 py-2 pb-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-4xl font-bold">|  </h1>
                    <Link href="/" >
                        <h1 className="text-4xl font-bold pl-2"> Srijan K.</h1>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex ml-auto pr-4">
                    <NavLinks />
                </div>

                {/* Mobile Navigation - padding to account for the fixed bottom nav */}
                <div className="md:hidden lg:hidden flex-grow pr-4">
                    <div className="pb-16"> {/* Space to prevent content from being hidden behind fixed nav */}
                        <NavMenu />
                    </div>
                </div>
                
                <h1 className="text-4xl font-bold"> |</h1>
            </div>
        </header>
    );
}