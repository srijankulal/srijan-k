export default function TerminalSnippet() {
    return (
        <div className="flex flex-col justify-center items-center w-full p-0">
          
        <div className="bg-black/85 text-white overflow-hidden w-full border border-border hover:border-neon/30 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(113,252,123,0.08)] shadow-lg">
            {/* Terminal chrome - matches our contact terminal style */}
            <div className="px-3 sm:px-4 py-2 flex items-center justify-between bg-white/5 border-b border-border/60">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-neon/80" />
                </div>
                <span className="font-mono text-xs text-gray-400">developer.py</span>
                <span className="w-1.5 h-1.5 rounded-full bg-neon led-blink" />
            </div>
            
            {/* Tab bar */}
            <div className="flex items-center px-3 border-b border-border/40 bg-white/2">
                {["PROBLEMS", "OUTPUT", "DEBUG CONSOLE"].map(tab => (
                    <span key={tab} className="mr-3 py-1.5 text-[9px] sm:text-[10px] text-gray-400 hover:text-gray-200 transition-colors cursor-pointer">
                        {tab}
                    </span>
                ))}
                <span className="py-1.5 text-[9px] sm:text-[10px] text-white border-b border-neon/80 pb-1.25 font-semibold">
                    TERMINAL
                </span>
            </div>
            
            {/* Terminal content */}
            <div className="p-3 sm:p-4 font-mono text-[11px] sm:text-xs leading-relaxed text-left">
                {/* Command Line */}
                <div className="flex flex-wrap items-center gap-1 mb-2">
                    <span className="text-neon font-bold">srijan@portfolio</span>
                    <span className="text-blue-400 font-semibold">~</span>
                    <span className="text-gray-400">$</span>
                    <span className="text-white font-medium">cat developer.py</span>
                </div>

                {/* Code body - structured line by line with explicit high-contrast syntax colors */}
                <div className="space-y-0.5 text-gray-200">
                    <div>
                        <span className="text-purple-400 font-semibold">class</span>{" "}
                        <span className="text-neon font-bold">Developer</span>:
                    </div>
                    <div className="pl-4">
                        <span className="text-blue-400 font-semibold">def</span>{" "}
                        <span className="text-yellow-300 font-medium">__init__</span>(
                        <span className="text-blue-300 italic">self</span>):
                    </div>
                    <div className="pl-8">
                        <span className="text-blue-300 italic">self</span>.name ={" "}
                        <span className="text-emerald-300">&apos;Srijan K&apos;</span>
                    </div>
                    <div className="pl-8">
                        <span className="text-blue-300 italic">self</span>.title ={" "}
                        <span className="text-emerald-300">&apos;Software Developer&apos;</span>
                    </div>
                    <div className="pl-8">
                        <span className="text-blue-300 italic">self</span>.skills = [
                        <span className="text-emerald-300">&apos;Python&apos;</span>,{" "}
                        <span className="text-emerald-300">&apos;Flutter&apos;</span>,{" "}
                        <span className="text-emerald-300">&apos;Next.js&apos;</span>,{" "}
                        <span className="text-emerald-300">&apos;IoT&apos;</span>]
                    </div>
                    <div className="pl-8">
                        <span className="text-blue-300 italic">self</span>.specialty ={" "}
                        <span className="text-emerald-300">&apos;Backend &amp; Full-Stack&apos;</span>
                    </div>
                </div>

                {/* Prompt & Cursor */}
                <div className="flex items-center gap-1 mt-3">
                    <span className="text-neon font-bold">srijan@portfolio</span>
                    <span className="text-blue-400 font-semibold">~</span>
                    <span className="text-gray-400">$</span>
                    <span className="w-2 h-4 bg-neon inline-block animate-caret-blink" />
                </div>
            </div>
        </div>
        </div>
    );
}