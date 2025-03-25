// import Contact from "@/components/contact"
import FloatButtons from "@/components/FloatingButtons";
import Header from "@/components/Header";

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
                </div>
                </div>
            </div>
    
  <FloatButtons />
  </div>
      </>
  );
}
