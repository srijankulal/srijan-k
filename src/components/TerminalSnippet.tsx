export default function TerminalSnippet() {
    return (
        <div className="flex flex-col justify-center items-center w-full snap-start sm:snap-align-none p-2 sm:p-4">
          
        <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg overflow-hidden w-full max-w-[95vw] sm:max-w-xl mx-auto border border-gray-700 animate-fadeIn hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
            {/* VS Code title bar */}
            <div className="bg-[#333333] px-2 sm:px-4 py-1 sm:py-2 flex justify-between items-center">
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="bg-[#1E1E1E] text-[#75BEFF] text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 rounded hover:bg-[#252525] transition-colors duration-300">VS Code</span>
                </div>
                <div className="flex items-center">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 hover:text-white cursor-pointer transform transition-transform duration-300 hover:scale-110 hover:rotate-90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
            
            {/* VS Code terminal content */}
            <div className="p-2 sm:p-4 font-mono bg-[#1E1E1E] border-t border-gray-700">
                <div className="flex items-center mb-1 sm:mb-2 text-[9px] sm:text-xs text-gray-400 overflow-x-auto whitespace-nowrap">
                    <span className="mr-1 sm:mr-2 hover:text-white transition-colors duration-300 cursor-pointer animate-fadeIn">PROBLEMS</span>
                    <span className="mr-1 sm:mr-2 hover:text-white transition-colors duration-300 cursor-pointer animate-fadeIn delay-100">OUTPUT</span>
                    <span className="mr-1 sm:mr-2 hover:text-white transition-colors duration-300 cursor-pointer animate-fadeIn delay-200">DEBUG CONSOLE</span>
                    <span className="text-white border-b-2 border-blue-500 pb-0.5 sm:pb-1 animate-fadeIn delay-300">TERMINAL</span>
                </div>
                
                <pre className="text-[10px] sm:text-sm overflow-x-auto whitespace-pre-wrap sm:whitespace-nowrap animate-typewriter">
                    <span className="text-[#569CD6]">PS C:\Users\Srijan_K&gt;</span> cat developer.py<br/>
                    <span className="text-[#C586C0] animate-slideIn delay-300 hover:text-purple-400 transition-colors duration-300">class</span> <span className="text-[#4EC9B0] animate-slideIn delay-500 hover:text-green-300 transition-colors duration-300">Developer</span>:
                    <br />
                    &nbsp;&nbsp;<span className="text-[#569CD6] animate-slideIn delay-700 hover:text-blue-400 transition-colors duration-300">def</span> <span className="text-[#DCDCAA] animate-slideIn delay-700 hover:text-yellow-300 transition-colors duration-300">__init__</span>
                    (<span className="text-[#9CDCFE] animate-slideIn delay-900 hover:text-blue-300 transition-colors duration-300">self</span>):
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE] animate-slideIn delay-1000 hover:text-blue-300 transition-colors duration-300">self</span>.
                    name = <span className="text-[#CE9178] animate-slideIn delay-1100 hover:text-orange-300 transition-colors duration-300">&apos;Srijan K&apos;</span>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE] animate-slideIn delay-1200 hover:text-blue-300 transition-colors duration-300">self</span>.
                    title = <span className="text-[#CE9178] animate-slideIn delay-1300 hover:text-orange-300 transition-colors duration-300">&apos;Software Developer&apos;</span>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE] animate-slideIn delay-1400 hover:text-blue-300 transition-colors duration-300">self</span>.
                    skills = [<span className="text-[#CE9178] animate-slideIn delay-1500 hover:text-orange-300 transition-colors duration-300">&apos;Python&apos;</span>,{' '}
                        <span className="text-[#CE9178] animate-slideIn delay-1600 hover:text-orange-300 transition-colors duration-300">&apos;Flutter&apos;</span>,{' '}
                    <span className="text-[#CE9178] animate-slideIn delay-1700 hover:text-orange-300 transition-colors duration-300">&apos;Next js&apos;</span>,{' '}
                    <span className="text-[#CE9178] animate-slideIn delay-1800 hover:text-orange-300 transition-colors duration-300">&apos;AI&apos;</span>]
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE] animate-slideIn delay-1900 hover:text-blue-300 transition-colors duration-300">self</span>.
                    specialty = <span className="text-[#CE9178] animate-slideIn delay-2000 hover:text-orange-300 transition-colors duration-300">&apos;Backend Development&apos;</span>
                    <br />
                    <span className="text-[#569CD6] animate-slideIn delay-2100">PS C:\Users\Srijan_K&gt;</span> <span className="animate-bounce inline-block">_</span>
                </pre>
            </div>
        </div>
        </div>
    );
}