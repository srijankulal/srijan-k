import Link from "next/link";
import { Button } from "./ui/button";

export default function Hero() {
    return (
        <div className="flex flex-col justify-center items-center w-full">
                    <div className="flex flex-col justify-center items-center w-full pt-8 sm:pt-16 md:pt-40 pb-8 sm:pb-16 md:pb-54">
                      <div className="text-left w-full px-2 sm:px-4 md:px-8 lg:px-12">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 text-left pl-1 md:pl-5">
                          <span className="inline-block">&#62;</span>HI
                        </h2>
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 text-left pl-3 sm:pl-6 md:pl-11 flex flex-wrap items-center">
                          I&apos;m&nbsp;<u className="mx-1"> Srijan</u>&nbsp;<u>K</u> !
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
                    </div>
                  </div>);
    
}