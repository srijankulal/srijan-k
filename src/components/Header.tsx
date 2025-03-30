import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function Header({ whereAt }: { whereAt: string }) {
    
    const NavLinks = () => (
        <nav className="flex space-x-4">
            {["about", "projects", "skills", "contact"].map((section) => (
                <TooltipProvider key={section}>
                    <Tooltip>
                        <TooltipTrigger>
                            <Link href={`/${section === "projects" ? "Projects" : "#" + section}`} 
                                className={`text-white text-2xl ${whereAt === section ? "font-bold" : ""}`}>
                                <span className="text-amber-600"><u><b>{section.charAt(0).toUpperCase()}</b></u></span>
                                <u className={whereAt === section ? "text-amber-600" : ""}>{section.slice(1)}</u>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{section === "about" ? "Says about me!!" :
                                section === "projects" ? "Projects Made!!" :
                                section === "skills" ? "About my skills" : "Say hello to me!!"}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </nav>
    );

    return (
        <>
            <header className="border-b border-gray-300 py-2 pb-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <h1 className="text-4xl font-bold">|</h1>
                        <Link href="/">
                            <h1 className="text-4xl font-bold pl-2"> Srijan K.</h1>
                        </Link>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex ml-auto pr-4">
                        <NavLinks />
                    </div>
                    
                    <h1 className="text-4xl font-bold">|</h1>
                </div>
            </header>
            
            {/* Mobile Navigation */}
          
            <nav className="md:w-[4rem] h-[4rem] z-40   bottom-0 bg-[#232323]  w-screen fixed md:h-screen border-t-[0.01px] md:border-t-0 md:border-r-[0.01px] border-neutral-700 ">
            <div className="flex md:hidden bottom-0">
            
         
                    {["about", "projects", "skills", "contact"].map((section, index) => (
                        <Link key={index} href={`/${section === "projects" ? "Projects" : "#" + section}`} 
                            className="flex flex-col items-center justify-center w-1/4 py-2 text-white">
                            <span className={`text-base sm:text-lg transition-colors ${whereAt === section ? "text-amber-600 scale-110" : "text-gray-400"}`}>
                                {index === 0 ? "\u003E_" : index === 1 ? "{}" : index === 2 ? "\u002F\\" : "@_"}
                            </span>
                            <span className={`text-xs ${whereAt === section ? "text-amber-600 font-bold" : ""}`}>
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                            </span>
                        </Link>
                    ))}
              
            
            </div>
            </nav>

    

            {/* Add padding at the bottom of the page content to prevent content from being hidden behind fixed nav */}
            <div className="md:hidden pb-16"></div>
        </>
    );
}

