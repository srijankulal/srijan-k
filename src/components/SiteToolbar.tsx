"use client";

import { useTheme } from "next-themes";
import { useSiteMode, SiteMode } from "@/lib/SiteModeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

const modes: { value: SiteMode; label: string; icon: string; desc: string }[] = [
    { value: "portfolio", label: "Portfolio", icon: ">_", desc: "Full creative view" },
    { value: "recruiter", label: "Recruiter", icon: "≡", desc: "Structured resume view" },
    { value: "minimal", label: "Minimal", icon: "○", desc: "Bare essentials only" },
];

export default function SiteToolbar() {
    const { theme, setTheme } = useTheme();
    const { mode, setMode } = useSiteMode();
    const [mounted, setMounted] = useState(false);
    const [showModes, setShowModes] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = theme === "dark";
    const currentMode = modes.find(m => m.value === mode) || modes[0];

    return (
        <div className="fixed top-4 right-4 z-100 flex items-center gap-2 print:hidden">
            {/* Resume link */}
            <Link href="/resume">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-1.5 border border-border/60 bg-background/90 backdrop-blur-sm px-2.5 py-1.5 font-mono text-xs text-foreground/70 hover:text-neon hover:border-neon/40 transition-all duration-200"
                >
                    <span className="text-neon/80 font-bold">&gt;</span>
                    <span>Resume</span>
                </motion.button>
            </Link>

            {/* Mode switcher */}
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModes(!showModes)}
                    className="flex items-center gap-1.5 border border-border/60 bg-background/90 backdrop-blur-sm px-2.5 py-1.5 font-mono text-xs text-foreground/70 hover:text-foreground hover:border-border transition-all duration-200"
                >
                    <span className="text-neon">{currentMode.icon}</span>
                    <span className="hidden sm:inline">{currentMode.label}</span>
                    <span className="text-foreground/40">{showModes ? "▲" : "▼"}</span>
                </motion.button>

                <AnimatePresence>
                    {showModes && (
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 mt-1 bg-background/95 backdrop-blur-md border border-border w-52 shadow-xl z-50"
                        >
                            <div className="p-1.5 border-b border-border/40">
                                <p className="font-mono text-[10px] text-foreground/30 px-2 py-0.5">// view mode</p>
                            </div>
                            {modes.map((m) => (
                                <button
                                    key={m.value}
                                    onClick={() => { setMode(m.value); setShowModes(false); }}
                                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors duration-150 hover:bg-foreground/5
                                        ${mode === m.value ? 'text-neon bg-neon/5' : 'text-foreground/70'}`}
                                >
                                    <span className="font-mono text-base w-5 text-center">{m.icon}</span>
                                    <div>
                                        <p className="font-mono text-xs font-medium">{m.label}</p>
                                        <p className="font-mono text-[10px] text-foreground/40">{m.desc}</p>
                                    </div>
                                    {mode === m.value && (
                                        <span className="ml-auto text-neon text-xs">●</span>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dark mode preferred indicator when in light mode */}
            {!isDark && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTheme("dark")}
                    className="hidden sm:flex items-center gap-1.5 border border-neon/50 bg-neon/10 px-2 py-1 font-mono text-[11px] text-neon hover:bg-neon/20 transition-all duration-200"
                    title="Switch to Dark Mode (Recommended)"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-neon led-blink" />
                    <span>[dark mode preferred]</span>
                </motion.button>
            )}

            {/* Theme toggle */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex items-center justify-center w-8 h-8 border border-border/60 bg-background/90 backdrop-blur-sm text-foreground/80 hover:text-neon hover:border-neon/40 transition-all duration-200 font-mono text-xs"
                aria-label="Toggle theme"
                title={isDark ? "Switch to light mode" : "Switch to dark mode (Dark mode preferred)"}
            >
                <motion.span
                    key={isDark ? "dark-icon" : "light-icon"}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isDark ? "◐" : "◑"}
                </motion.span>
            </motion.button>
        </div>
    );
}
