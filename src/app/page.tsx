import About from "@/components/About";
import Contact from "@/components/contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Project from "@/components/Project";

import Skills from "@/components/Skills";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  

  return (
    <div className="overflow-x-hidden w-full">
      <main className="border border-gray-300 p-2 sm:p-4 my-4 w-full max-w-full overflow-x-hidden">
        <Header whereAt="home" />
       
        <div className="py-4 sm:py-8 text-center border-b border-gray-300 w-full overflow-hidden">
          {/* Hero Section */}
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
          </div>
  
          {/* About Section */}
          <div className="pt-14">
          <About />
          </div>
  
          {/* Projects Section */}
          <div className="pt-24 ">
            <Project />
            </div>
  
          {/* Skills Section */}
          <div className="pt-24">
          <Skills />
          </div>

  
          {/* Contact Section */}
          <div className="pt-24">
          <Contact id="contact" />
          </div>
        </div>
  
        {/* Footer */}
       <Footer />
        
        {/* Add space at the bottom for mobile navigation */}
        <div className="md:hidden h-16"></div>
      </main>
    </div>
  );
}