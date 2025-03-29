import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


export default function Header() {
    const NavLinks = () => (
        <nav className="flex space-x-4  ">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <a href="#about" className="text-white text-2xl"><span className="text-amber-600"><u><b>A</b></u></span><u>bout</u></a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Says about me!!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <a href="#projects" className="text-white text-2xl"><span className="text-amber-600"><u><b>P</b></u></span><u>rojects</u></a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Projects Made!!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <a href="#skills" className="text-white text-2xl"><span className="text-amber-600"><u><b>S</b></u></span><u>kills</u></a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>About my skills</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <a href="#contact" className="text-white text-2xl"><u><span className="text-amber-600"><u><b>C</b></u></span>ontact</u></a>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Say hello to me!!</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </nav>
    );
    const NavMenu=()=>{
        return(
            <nav className="fixed bottom-0 left-0 right-0 bg-neutral-800 p-4 border-t border-gray-700">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <a href="#about" className="flex flex-col items-center text-white">
                                    <span className="text-amber-600 text-xl">&#62;_</span>
                                    <span className="text-sm">About</span>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Says about me!!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <a href="#projects" className="flex flex-col items-center text-white">
                                    <span className="text-amber-600 text-xl">{`{}`}</span>
                                    <span className="text-sm">Projects</span>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Projects Made!!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <a href="#skills" className="flex flex-col items-center text-white">
                                    <span className="text-amber-600 text-xl">&#47;&#92;</span>
                                    <span className="text-sm">Skills</span>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>About my skills</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <a href="#contact" className="flex flex-col items-center text-white">
                                    <span className="text-amber-600 text-xl">@_</span>
                                    <span className="text-sm">Contact</span>
                                </a>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Say hello to me!!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </nav>
        )
    }

    return (
        <header className="border-b border-gray-300 py-2 pb-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-4xl font-bold">|  </h1>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <h1 className="text-4xl font-bold pl-2"> Srijan K.</h1>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Thats my name :)</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex ml-auto pr-4">
                    <NavLinks />
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden ml-auto pr-4" >
                    
                            <NavMenu />
            
                </div>
                
                <h1 className="text-4xl font-bold"> |</h1>
            </div>
        </header>
    );
}