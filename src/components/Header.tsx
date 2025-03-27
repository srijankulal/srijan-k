import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"

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
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className=" text-amber-600 border border-white"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                </svg>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="sm:max-w-xs">
                            <NavLinks />
                        </SheetContent>
                    </Sheet>
                </div>
                
                <h1 className="text-4xl font-bold"> |</h1>
            </div>
        </header>
    );
}