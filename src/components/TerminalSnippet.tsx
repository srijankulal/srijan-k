export default function TerminalSnippet() {
    return (
        <div className="flex flex-col justify-center items-center w-full snap-start sm:snap-align-none p-2 sm:p-4">
          
        <div className="bg-[#1E1E1E] text-white rounded-lg shadow-lg overflow-hidden w-full max-w-[95vw] sm:max-w-xl mx-auto border border-gray-700">
            {/* VS Code title bar */}
            <div className="bg-[#333333] px-2 sm:px-4 py-1 sm:py-2 flex justify-between items-center">
                <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="bg-[#1E1E1E] text-[#75BEFF] text-[10px] sm:text-xs px-1 sm:px-2 py-0.5 rounded">PYTHON</span>
                </div>
                <div className="flex items-center">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 hover:text-white cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
            
            {/* VS Code terminal content */}
            <div className="p-2 sm:p-4 font-mono bg-[#1E1E1E] border-t border-gray-700">
                <div className="flex items-center mb-1 sm:mb-2 text-[9px] sm:text-xs text-gray-400 overflow-x-auto whitespace-nowrap">
                    <span className="mr-1 sm:mr-2">PROBLEMS</span>
                    <span className="mr-1 sm:mr-2">OUTPUT</span>
                    <span className="mr-1 sm:mr-2">DEBUG CONSOLE</span>
                    <span className="text-white border-b-2 border-blue-500 pb-0.5 sm:pb-1">TERMINAL</span>
                </div>
                
                <pre className="text-[10px] sm:text-sm overflow-x-auto whitespace-pre-wrap sm:whitespace-nowrap">
                    <span className="text-[#569CD6]">PS C:\Users\Srijan_K&gt;</span> cat developer.py<br/>
                    <span className="text-[#C586C0]">class</span> <span className="text-[#4EC9B0]">Developer</span>:
                    <br />
                    &nbsp;&nbsp;<span className="text-[#569CD6]">def</span> <span className="text-[#DCDCAA]">__init__</span>
                    (<span className="text-[#9CDCFE]">self</span>):
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE]">self</span>.
                    name = <span className="text-[#CE9178]">&apos;Srijan K&apos;</span>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE]">self</span>.
                    title = <span className="text-[#CE9178]">&apos;Software Developer&apos;</span>
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE]">self</span>.
                    skills = [<span className="text-[#CE9178]">&apos;Python&apos;</span>,{' '}
                        <span className="text-[#CE9178]">&apos;Flutter&apos;</span>,{' '}
                    <span className="text-[#CE9178]">&apos;Next js&apos;</span>,{' '}
                    <span className="text-[#CE9178]">&apos;AI&apos;</span>]
                    <br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#9CDCFE]">self</span>.
                    specialty = <span className="text-[#CE9178]">&apos;Backend Development&apos;</span>
                    <br />
                    <span className="text-[#569CD6]">PS C:\Users\Srijan_K&gt;</span> <span className="animate-pulse">_</span>
                </pre>
            </div>
        </div>
        </div>
    );
}