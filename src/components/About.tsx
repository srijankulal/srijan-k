import TerminalSnippet from "./TerminalSnippet";

export default function About() {
    return (
        <>
        <div className="flex justify-center items-center w-full  " id="about">
        <div className="flex flex-col  w-full snap-start sm:snap-align-none ">
        <h2 className="text-5xl font-bold mb-2 text-left pl-30" >About Me</h2>
        
           <div className="flex flex-col justify-center items-center w-full md:flex-row">
             <div className="flex flex-row justify-center items-center w-full md:pl-20 ">
           <div className="terminal-style-about p-4 text-left border-l-2 border-white">
             <div className="mb-4">
               <span className="text-amber-600 ">$ whoami</span>
               <ul className="list-none pl-4 pt-2">
                 <li className="flex items-start mb-2">
                   <span className=" mr-2">▶</span> 
                   <span>Backend-focused developer skilled in Python (Flask), Next.js, Flutter</span>
                 </li>
                 <li className="flex items-start mb-2">
                   <span className="">▶</span> 
                   <span>Experienced with PostgreSQL, MySQL and database optimization</span>
                 </li>
                 <li className="flex items-start mb-2">
                   <span className=" mr-2">▶</span> 
                   <span>Specializing in secure, scalable applications with real-time features</span>
                 </li>
               </ul>
             </div>
             
             <div className="mb-2">
               <span className="text-amber-600">$ education</span>
               <ul className="list-none pl-4 pt-2">
                 <li className="flex items-start mb-2">
                   <span className=" mr-2">▶</span> 
                   <span>B.C.A at St. Aloysius University (2023-2026)</span>
                 </li>
                 <li className="flex items-start mb-2">
                   <span className=" mr-2">▶</span> 
                   <span>Constantly learning and seeking new challenges</span>
                 </li>
               </ul>
             </div>
           </div>
         </div>
             <div className="  text-left pr-36 pl-36 pt-8">
                 <TerminalSnippet />
             </div>
            </div>
            </div>
            </div>
            </>

    );
}