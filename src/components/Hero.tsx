import Link from "next/link";
import { Button } from "./ui/button";
import me from "@/public/ascii-art.png"
import Image from "next/image";

export default function Hero() {
    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div className="flex flex-col md:flex-row justify-between items-center w-full  sm:pt-16 md:pt-40 pb-8 sm:pb-16 md:pb-54 gap-8">
                <div className="text-left w-full md:w-3/5 px-2 sm:px-4 md:px-8 lg:px-12 lg:pb-54">
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 text-left pl-1 md:pl-5">
                        <span className="inline-block">&#62;</span>HI
                    </h2>
                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 text-left pl-3 sm:pl-6 md:pl-11 flex flex-wrap items-center">
                        I&apos;m&nbsp;<Link href="https://www.linkedin.com/in/srijan-kulal"> <span className="hover:text-amber-600"><u className="mx-1 "> Srijan</u>&nbsp;<u>K</u></span></Link> !
                        <span className="ml-1 inline-block w-2 sm:w-3 md:w-4 h-5 sm:h-6 md:h-8 animate-caret-blink">_</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-2xl mb-4 text-left pl-3 sm:pl-6 md:pl-11">
                        Crafting modern web experiences with security, efficiency, and scalability in mind.
                    </p>
                    <div className="flex flex-wrap text-left pl-3 sm:pl-6 md:pl-11 gap-3 sm:gap-4">
                        <Link href="/#projects">
                            <Button variant="outline" className="py-1 text-sm sm:text-base md:text-lg font-medium h-9 sm:h-10 md:h-12 px-3 sm:px-6 md:px-8">
                                Projects
                            </Button>
                        </Link>
                        <Link href="/#contact">
                            <Button variant="outline" className="py-1 text-sm sm:text-base md:text-lg font-medium h-9 sm:h-10 md:h-12 px-3 sm:px-6 md:px-8">
                                Contact
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="w-full lg:w-2/5 flex items-center justify-center px-4">
    <Image
        src={me.src} 
        alt="Srijan K ASCII Art" 
        width={600}
        height={600}
        className="max-w-full h-auto w-auto object-contain opacity-90 filter contrast-125"
        priority
    />
</div>
                
            </div>
        </div>
    );
    
}