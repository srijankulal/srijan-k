// import Contact from "@/components/contact"
import Header from "@/components/Header";
import  TerminalSnippet  from "@/components/TerminalSnippet"; // Adjusted to match named export
import { Button } from "@/components/ui/button";





export default function Home() {
  return (
    <><div className="border border-gray-300 p-4   my-4">
    <Header />
    <div className="py-8 text-center border-b border-gray-300">
      <div className="flex flex-col justify-center items-center w-full ">
            <div className="flex flex-col justify-center items-center w-full snap-start sm:snap-align-none pt-30 pb-54">
        
                <div className="text-left">
                <h2 className="text-6xl font-bold mb-2 text-left">
                <span className="inline-block">&#62;_</span>HI
                </h2>
                <h2 className="text-6xl font-bold mb-4 text-left pl-11">
                I&apos;m <u>Srijan K!</u>
                </h2>
              <p className="text-2xl mb-4 text-left pl-11">
              Crafting modern web experiences with security, efficiency, and scalability in mind.
              </p>
              <div className="flex text-left pl-11">
                <div className="flex pr-8 sm:flex-col">
                <Button variant="outline" className="mt-2 py-2 text-lg font-medium h-12 px-8">
                  Projects
                </Button>
                </div>
                <div className="flex pl-2 sm:flex-col">
                <Button variant="outline" className="mt-2 py-2 text-lg font-medium h-12 px-8">
                  Contact
                </Button>
                </div>
              </div>
              </div>
            </div>
          </div>
                <div className="flex flex-col items-start w-full pt-8">
                 <div className="text-left">
                  <h2 className="text-5xl font-bold mb-2 text-left" id="about">About Me</h2>
                 </div>
                    <div className="flex flex-row justify-center items-center w-full pt-8">
                      <div className="flex flex-col justify-center items-center w-full pt-8">
                    <p className=" text-xl mb-4 text-left">
                      I am a backend-focused software developer skilled in Python (Flask), Next js, Flutter and databases like PostgreSQL and MySQL. I specialize in building secure, scalable applications and have experience with real-time features like WebSockets. I also have some experience with app development and frontend technologies, but my strength lies in backend development. I am always eager to learn new technologies and improve my skills.
                      </p>
                    <p className="text-xl mb-4 text-left">
                    Currently, I am pursuing a Bachelor’s in Computer Applications at St. Aloysius University (2023-2026). I am always looking to learn new things and improve my skills, and I am excited to take on new challenges.
                      </p>
                      </div>
                      <div className="  text-left">
                      <TerminalSnippet />
                      </div>
            
                    </div>
                    </div>
                
            </div>
    
  
  </div>
      </>
  );
}
