"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteMode, SiteMode } from "@/lib/SiteModeContext";

const modes: { value: SiteMode; label: string; icon: string; desc: string; detail: string }[] = [
    { 
        value: "portfolio", 
        label: "Portfolio", 
        icon: ">_", 
        desc: "Full creative view",
        detail: "Terminal aesthetic, animations, full story"
    },
    { 
        value: "recruiter", 
        label: "Recruiter", 
        icon: "≡", 
        desc: "Structured resume view",
        detail: "Skills, projects, availability at a glance"
    },
    { 
        value: "minimal", 
        label: "Minimal", 
        icon: "○", 
        desc: "Bare essentials only",
        detail: "Name, stack, links — nothing else"
    },
];

export default function ModePrompt() {
    const [show, setShow] = useState(false);
    const { setMode } = useSiteMode();

    useEffect(() => {
        const hasVisited = localStorage.getItem("has-visited");
        if (!hasVisited) {
            // Small delay so the page loads first
            const t = setTimeout(() => setShow(true), 600);
            return () => clearTimeout(t);
        }
    }, []);

    const handleSelect = (value: SiteMode) => {
        setMode(value);
        localStorage.setItem("has-visited", "1");
        setShow(false);
    };

    const handleSkip = () => {
        localStorage.setItem("has-visited", "1");
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-200"
                        onClick={handleSkip}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-0 flex items-center justify-center z-201 px-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full max-w-md bg-background border border-border shadow-2xl">
                            {/* Terminal chrome */}
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/60 bg-foreground/5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                <span className="w-2.5 h-2.5 rounded-full bg-neon/60 led-blink" />
                                <span className="ml-3 font-mono text-xs text-foreground/30">select_view.sh</span>
                            </div>

                            <div className="p-6">
                                <div className="font-mono text-xs text-foreground/40 mb-1">
                                    <span className="text-neon/70">srijan@portfolio</span> ~
                                </div>
                                <h2 className="text-xl font-bold mb-1">
                                    How would you like to view this site?
                                </h2>
                                <p className="font-mono text-xs text-foreground/40 mb-5">
                                    You can change this anytime via the header.
                                </p>

                                <div className="space-y-2">
                                    {modes.map((m, i) => (
                                        <motion.button
                                            key={m.value}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.08 }}
                                            onClick={() => handleSelect(m.value)}
                                            className="w-full text-left flex items-start gap-4 p-3.5 border border-border/40 
                                                hover:border-neon/40 hover:bg-neon/5 hover:text-neon transition-all duration-200 group"
                                        >
                                            <span className="font-mono text-lg w-6 text-center text-foreground/40 group-hover:text-neon transition-colors mt-0.5">
                                                {m.icon}
                                            </span>
                                            <div>
                                                <p className="font-bold text-sm mb-0.5">{m.label}</p>
                                                <p className="font-mono text-xs text-foreground/40 group-hover:text-neon/60 transition-colors">
                                                    {m.detail}
                                                </p>
                                            </div>
                                            <span className="ml-auto text-foreground/20 group-hover:text-neon/60 transition-colors text-sm mt-0.5">
                                                →
                                            </span>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="mt-4 pt-3 border-t border-border/40 flex flex-col gap-2">
                                    <p className="font-mono text-[11px] text-neon/80 flex items-center gap-1.5 justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-neon led-blink" />
                                        <span>// dark mode preferred for optimal cyber aesthetics</span>
                                    </p>
                                    <button
                                        onClick={handleSkip}
                                        className="w-full font-mono text-xs text-foreground/40 hover:text-foreground transition-colors py-1"
                                    >
                                        skip — use default portfolio view
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
