import Link from "next/link";
import { Button } from "../ui/button";
import me from "@/public/ascii-art.png"
import PixelRevealImage from "./PixelRevealImage";
import { useEffect, useState } from "react";

export default function Hero() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [tick, setTick] = useState(0);
    
    useEffect(() => {
        setIsLoaded(true);
        const interval = setInterval(() => setTick(t => t + 1), 2000);
        return () => clearInterval(interval);
    }, []);

    const statusItems = [
        { label: "STATUS", value: "ONLINE", color: "text-neon" },
        { label: "LOCATION", value: "MNG, IN", color: "text-blue-400" },
        { label: "ROLE", value: "DEV", color: "text-yellow-400" },
    ];

    return (
        <div className="flex flex-col justify-center items-center w-full overflow-hidden relative">
            {/* Subtle circuit grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(113,252,123,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(113,252,123,0.025) 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
            }} />

            <div className="flex flex-col md:flex-row justify-between items-center w-full sm:pt-16 md:pt-18 pb-8 sm:pb-20 md:pb-54 gap-8 relative z-10">
                <div className="text-left w-full md:w-3/5 pb-24 px-2 sm:px-4 md:px-8 lg:px-12 lg:pb-34 lg:pt-20">
                    
                    {/* Chip-style status bar */}
                    <div className={`flex items-center gap-3 mb-6 pl-1 md:pl-5 transform transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {statusItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5 border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon led-blink" style={{ animationDelay: `${i * 0.5}s` }} />
                                <span className="text-white/40">{item.label}:</span>
                                <span className={item.color}>{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <h2 
                        className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-2 text-left pl-1 md:pl-5 
                        transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                        <span className="text-neon inline-block mr-1">&gt;</span>HI
                    </h2>
                    <h2 
                        className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 text-left pl-3 sm:pl-6 md:pl-11 flex flex-wrap items-center
                        transform transition-all duration-700 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                        I&apos;m&nbsp;<Link href="https://www.linkedin.com/in/srijan-kulal"> 
                            <span className="hover:text-neon transition-colors duration-300">
                                <u className="mx-1 hover:scale-105 inline-block transition-transform"> Srijan</u>&nbsp;
                                <u className="hover:scale-105 inline-block transition-transform">K</u>
                            </span>
                        </Link> !
                        <span className="ml-1 inline-block w-2 sm:w-3 md:w-4 h-5 sm:h-6 md:h-8 animate-caret-blink">_</span>
                    </h2>
                    <p 
                        className={`text-base sm:text-lg md:text-xl mb-2 text-left pl-3 sm:pl-6 md:pl-11 text-foreground/70
                        transform transition-all duration-700 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                        Crafting modern web experiences with security, efficiency, and scalability in mind.
                    </p>
                    
                    {/* IoT tagline */}
                    <p className={`text-sm pl-3 sm:pl-6 md:pl-11 mb-6 font-mono text-neon/50 transform transition-all duration-700 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <span className="text-neon/30">// </span>also exploring the physical world via IoT
                    </p>

                    <div 
                        className={`flex flex-wrap text-left pl-3 sm:pl-6 md:pl-11 gap-2.5 sm:gap-4
                        transform transition-all duration-700 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                        <Link href="/#projects">
                            <Button variant="outline" className="py-1 text-sm sm:text-base md:text-lg font-medium h-9 sm:h-10 md:h-12 px-3 sm:px-6 md:px-8 
                                hover:scale-105 transition-all duration-300 hover:bg-neon hover:text-black hover:border-neon hover:shadow-[0_0_20px_rgba(113,252,123,0.3)]">
                                Projects
                            </Button>
                        </Link>
                        <Link href="/resume">
                            <Button variant="outline" className="py-1 text-sm sm:text-base md:text-lg font-medium h-9 sm:h-10 md:h-12 px-3 sm:px-6 md:px-8 
                                border-neon/50 text-neon bg-neon/5 hover:scale-105 transition-all duration-300 hover:bg-neon hover:text-black hover:border-neon hover:shadow-[0_0_20px_rgba(113,252,123,0.3)]">
                                📄 Resume
                            </Button>
                        </Link>
                        <Link href="/#contact">
                            <Button variant="outline" className="py-1 text-sm sm:text-base md:text-lg font-medium h-9 sm:h-10 md:h-12 px-3 sm:px-6 md:px-8
                                hover:scale-105 transition-all duration-300 hover:bg-neon hover:text-black hover:border-neon hover:shadow-[0_0_20px_rgba(113,252,123,0.3)]">
                                Contact
                            </Button>
                        </Link>
                    </div>
                </div>
                <div 
                    className={`hidden w-full lg:w-2/5 lg:flex md:w-2/5 md:flex items-center justify-center px-4
                    transform transition-all duration-1000 ${isLoaded ? 'translate-x-0 opacity-100 rotate-0' : 'translate-x-10 opacity-0 rotate-6'}`}
                >
                    <PixelRevealImage
                        src={me.src}
                        alt="Srijan K ASCII Art Portrait"
                        width={600}
                        height={600}
                        priority
                    />
                </div>
            </div>
        </div>
    );
}