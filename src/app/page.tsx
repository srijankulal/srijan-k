import About from "@/components/About";
import Contact from "@/components/contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Project from "@/components/Project";
import Skills from "@/components/Skills";


export default function Home() {
  

  return (
    <div className="overflow-x-hidden w-full">
      <main className="border border-gray-300 p-2 sm:p-4 my-4 w-full max-w-full overflow-x-hidden">
        
        <Header whereAt="home" />
        
        <div className="py-4 sm:py-8 text-center border-b  border-gray-300 w-full overflow-hidden">
          {/* Hero Section */}
          <div className="border-b border-gray-300 ">
          <Hero/>
          </div>
  
          {/* About Section */}
          <div className="pt-14 border-b border-gray-300 pb-24">
          <About />
          </div>
  
          {/* Projects Section */}
          <div className="pt-10 border-b border-gray-300 pb-24 ">
            <Project />
            </div>
  
          {/* Skills Section */}
          <div className="lg:pt-20 lg:pb-24 border-b border-gray-300">
          <Skills />
          </div>
          {/* Contact Section */}
          <div className="pb-14 ">
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