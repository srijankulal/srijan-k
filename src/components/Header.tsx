import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

export default function Header() {
    return (
        <header className="border-b border-gray-300 py-2 pb-4">
        <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">|  </h1>
        <h1 className="text-4xl font-bold pl-2"> Srijan K.</h1>
        <nav className="flex space-x-4 ml-auto pr-2">
        <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
            <a href="#about" className="text-white text-2xl"><span className="text-amber-600"><u><b>A</b></u></span><u>bout</u></a>
            </TooltipTrigger>
            <TooltipContent>
      <p>Says about me!!</p>
    </TooltipContent>    </Tooltip>
    </TooltipProvider>

            <TooltipProvider>
        <Tooltip>                        
    <TooltipTrigger>
            <a href="#projects" className="text-white text-2xl"><span className="text-amber-600"><u><b>P</b></u></span><u>rojects</u></a>
           </TooltipTrigger><TooltipContent>
        <p>Projects Made!!</p>
    </TooltipContent>    </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
    <Tooltip>
    <TooltipTrigger> 
            <a href="#skills" className="text-white text-2xl"><span className="text-amber-600"><u><b>S</b></u></span><u>kills</u></a>
            </TooltipTrigger>
            <TooltipContent>
        <p>About my skills</p>
    </TooltipContent>    </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
    <Tooltip>
    <TooltipTrigger>
            <a href="#contact" className="text-white text-2xl"><u><span className="text-amber-600"><u><b>C</b></u></span>ontact</u></a>
        </TooltipTrigger><TooltipContent>
        <p>Say hello to me!!</p>
    </TooltipContent>
    </Tooltip>
    </TooltipProvider>

        </nav>
        <h1 className="text-4xl font-bold"> |</h1>
        </div>
        
    </header>

    );

}