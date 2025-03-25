// import Contact from "@/components/contact"
import FloatButtons from "@/components/FloatingButtons";
import Header from "@/components/Header";
import TerminalSnippet from "@/components/TerminalSnippet";
import { Button } from "@/components/ui/button";

// import Hero from "@/components/hero";
// import Projects from "@/components/Projects";
// import Skills from "@/components/Skills";
// import Navbar from "@/components/ui/nav-bar";
// //import Header from "@/components/Header";


export default function Home() {
  return (
    <><div className="border border-gray-300 p-4 max-w-4xl mx-auto my-4">
    <Header />
    <div className="py-8 text-center border-b border-gray-300">
      <div className="flex flex-col justify-center items-center w-full pt-8">
        <div className="max-w-2xl w-full">
          <h2 className="text-5xl font-bold mb-2 text-left">
        Hi,
          </h2>
          <h2 className="text-5xl font-bold mb-4 text-left">
        I&apos;m Srijan K!
          </h2>
                <p className="text-xl mb-4 text-left">
                Crafting modern web experiences with security, efficiency, and scalability in mind.
                </p>

               <div className="flex  text-left">
                <div className="flex pr-8 sm:flex-col">
                  <Button variant="outline" className="mt-2 py-2 text-lg font-medium h-12 px-8">Projects</Button>
                </div>
                <div className="flex  pl-2 sm:flex-col">
                  <Button variant="outline" className="mt-2 py-2 text-lg font-medium h-12 px-8">Contact</Button>
                  </div>
                </div>
                </div>
                </div>
                <div className="flex flex-col justify-center items-center w-full pt-8">
                  <div className="max-w-2xl w-full">
                    <h2 className="text-5xl font-bold mb-2 text-left">About Me</h2>
                    <p className="text-xl mb-4 text-left">
                      I am a backend-focused software developer skilled in Python (Flask), Next js, Flutter and databases like PostgreSQL and MySQL. I specialize in building secure, scalable applications and have experience with real-time features like WebSockets. I also have some experience with app development and frontend technologies, but my strength lies in backend development. I am always eager to learn new technologies and improve my skills.
                      </p>
                    <p className="text-xl mb-4 text-left">
                    Currently, I am pursuing a Bachelor’s in Computer Applications at St. Aloysius University (2023-2026). I am always looking to learn new things and improve my skills, and I am excited to take on new challenges.
                      </p>
                      <div className="flex  text-left">
                      <TerminalSnippet />
                      </div>
                    </div>
                    </div>
                
            </div>
    
  <FloatButtons whereAt="Home" />
  </div>
      </>
  );
}
