"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useSiteMode, SiteMode } from "@/lib/SiteModeContext";

const modes: { value: SiteMode; label: string; icon: string; desc: string }[] = [
    { value: "portfolio", label: "Portfolio", icon: ">_", desc: "Full creative view" },
    { value: "recruiter", label: "Recruiter", icon: "≡", desc: "Structured resume view" },
    { value: "minimal", label: "Minimal", icon: "○", desc: "Bare essentials only" },
];

export default function Header({ whereAt }: { whereAt: string }) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { mode, setMode } = useSiteMode();
    const [mounted, setMounted] = useState(false);
    const [showModes, setShowModes] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey) {
                switch(e.key.toLowerCase()) {
                    case 'm': e.preventDefault(); router.push('/#about'); break;
                    case 'w': e.preventDefault(); router.push('/Projects'); break;
                    case 'e': e.preventDefault(); router.push('/#experience'); break;
                    case 's': e.preventDefault(); router.push('/#skills'); break;
                    case 'c': e.preventDefault(); router.push('/#contact'); break;
                    case 'r': e.preventDefault(); router.push('/resume'); break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);
    
    const navLinks = [
        { href: "/#about", label: "About", key: "about", tooltip: "About me" },
        { href: "/Projects", label: "Projects", key: "projects", tooltip: "Featured projects" },
        { href: "/#experience", label: "Experience", key: "experience", tooltip: "Experience & internships" },
        { href: "/#skills", label: "Skills", key: "skills", tooltip: "Technical skills" },
        { href: "/#contact", label: "Contact", key: "contact", tooltip: "Say hello" },
    ];

    const isDark = mounted && theme === "dark";
    const currentMode = modes.find(m => m.value === mode) || modes[0];

    const NavLinks = () => (
        <nav className="flex items-center space-x-1">
            <TooltipProvider>
                {navLinks.map((link) => {
                    const isActive = whereAt === link.key;
                    return (
                        <Tooltip key={link.key}>
                            <TooltipTrigger asChild>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
                                    <Link 
                                        href={link.href} 
                                        className={`relative px-3 py-1.5 text-lg font-mono transition-all duration-200 block
                                            ${isActive 
                                                ? 'text-neon' 
                                                : 'text-foreground/60 hover:text-foreground'
                                            }`}
                                    >
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-neon opacity-60 text-sm">&gt;</span>
                                        )}
                                        <span className={isActive ? 'pl-3' : ''}>{link.label}</span>
                                        {isActive && (
                                            <span className="absolute bottom-0.5 left-3 right-0 h-px bg-neon/50" />
                                        )}
                                    </Link>
                                </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="font-mono text-xs">
                                <p>{link.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </TooltipProvider>
        </nav>
    );

    return (
        <>
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border-b border-border py-3 w-full"
            >
                <div className="flex justify-between items-center max-w-full px-2 sm:px-4 md:px-8 gap-3">
                    {/* Logo */}
                    <motion.div 
                        className="flex items-center gap-2.5 shrink-0"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <span className="w-2 h-2 rounded-full bg-neon led-blink hidden sm:block" />
                        <Link href="/">
                            <h1 className="text-3xl font-bold tracking-tight">
                                Srijan K<span className="text-neon">.</span>
                            </h1>
                        </Link>
                    </motion.div>

                    {/* Desktop: Nav + controls */}
                    <div className="hidden md:flex items-center gap-3 ml-auto">
                        <NavLinks />

                        {/* Separator */}
                        <span className="w-px h-5 bg-border/60" />

                        {/* Resume link */}
                        <Link href="/resume">
                            <motion.span
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="flex items-center gap-1.5 border border-border/50 px-2.5 py-1.5 font-mono text-xs text-foreground/50 hover:text-neon hover:border-neon/40 transition-all duration-200 cursor-pointer"
                            >
                                CV
                            </motion.span>
                        </Link>

                        {/* Mode switcher */}
                        {mounted && (
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setShowModes(!showModes)}
                                    className="flex items-center gap-1.5 border border-border/50 px-2.5 py-1.5 font-mono text-xs text-foreground/50 hover:text-foreground hover:border-border transition-all duration-200"
                                >
                                    <span className="text-neon/70">{currentMode.icon}</span>
                                    <span>{currentMode.label}</span>
                                    <span className="text-foreground/30">{showModes ? "▲" : "▼"}</span>
                                </motion.button>

                                <AnimatePresence>
                                    {showModes && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -6, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full right-0 mt-1 bg-background border border-border w-52 shadow-2xl z-50"
                                        >
                                            <div className="p-1.5 border-b border-border/40">
                                                <p className="font-mono text-[10px] text-foreground/30 px-2 py-0.5">// view mode</p>
                                            </div>
                                            {modes.map((m) => (
                                                <button
                                                    key={m.value}
                                                    onClick={() => { setMode(m.value); setShowModes(false); }}
                                                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors duration-150
                                                        hover:bg-foreground/5
                                                        ${mode === m.value ? 'text-neon bg-neon/5' : 'text-foreground/60'}`}
                                                >
                                                    <span className="font-mono text-sm w-5 text-center">{m.icon}</span>
                                                    <div>
                                                        <p className="font-mono text-xs font-medium">{m.label}</p>
                                                        <p className="font-mono text-[10px] text-foreground/30">{m.desc}</p>
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
                        )}

                        {/* Dark mode preferred badge when in light mode */}
                        {mounted && !isDark && (
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setTheme("dark")}
                                className="hidden lg:flex items-center gap-1.5 border border-neon/50 bg-neon/10 px-2 py-1 font-mono text-[11px] text-neon hover:bg-neon/20 transition-all duration-200"
                                title="Switch to dark mode for optimal cyber aesthetics"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-neon led-blink" />
                                <span>[dark mode preferred]</span>
                            </motion.button>
                        )}

                        {/* Theme toggle */}
                        {mounted && (
                            <motion.button
                                whileHover={{ scale: 1.07 }}
                                whileTap={{ scale: 0.93 }}
                                onClick={() => setTheme(isDark ? "light" : "dark")}
                                className="flex items-center justify-center w-8 h-8 border border-border/50 text-foreground/80 hover:text-neon hover:border-neon/40 transition-all duration-200 font-mono text-xs"
                                aria-label="Toggle theme"
                                title={isDark ? "Switch to light mode" : "Switch to dark mode (Dark mode preferred)"}
                            >
                                <span className="text-sm leading-none">
                                    {isDark ? "◐" : "◑"}
                                </span>
                            </motion.button>
                        )}
                    </div>

                    {/* Mobile: only theme + mode toggle in header */}
                    <div className="flex md:hidden items-center gap-2 ml-auto">
                        {mounted && (
                            <>
                                {/* Mobile mode indicator */}
                                <button
                                    onClick={() => setShowModes(!showModes)}
                                    className="border border-border/50 px-2 py-1 font-mono text-xs text-foreground/50"
                                >
                                    {currentMode.icon}
                                </button>
                                <AnimatePresence>
                                    {showModes && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="fixed top-16 right-2 bg-background border border-border w-52 shadow-2xl z-50"
                                        >
                                            <div className="p-1.5 border-b border-border/40">
                                                <p className="font-mono text-[10px] text-foreground/30 px-2 py-0.5">// view mode</p>
                                            </div>
                                            {modes.map((m) => (
                                                <button
                                                    key={m.value}
                                                    onClick={() => { setMode(m.value); setShowModes(false); }}
                                                    className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors
                                                        hover:bg-foreground/5
                                                        ${mode === m.value ? 'text-neon bg-neon/5' : 'text-foreground/60'}`}
                                                >
                                                    <span className="font-mono text-sm w-5 text-center">{m.icon}</span>
                                                    <div>
                                                        <p className="font-mono text-xs">{m.label}</p>
                                                        <p className="font-mono text-[10px] text-foreground/30">{m.desc}</p>
                                                    </div>
                                                    {mode === m.value && <span className="ml-auto text-neon text-xs">●</span>}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={() => setTheme(isDark ? "light" : "dark")}
                                    className="w-8 h-8 border border-border/50 flex items-center justify-center text-foreground/50 text-base"
                                >
                                    {isDark ? "☀" : "◑"}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </motion.header>
            
            {/* Mobile Bottom Nav */}
            <div className="block md:hidden">
                <motion.div 
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                    className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 w-full"
                >
                    <div className="grid grid-cols-5 h-14">
                        {[
                            { href: "/#about", icon: ">_", label: "About", key: "about" },
                            { href: "/Projects", icon: "{}", label: "Work", key: "projects" },
                            { href: "/#experience", icon: "≡_", label: "Exp", key: "experience" },
                            { href: "/#skills", icon: "/\\", label: "Skills", key: "skills" },
                            { href: "/#contact", icon: "@_", label: "Contact", key: "contact" },
                        ].map((item) => {
                            const isActive = whereAt === item.key;
                            return (
                                <motion.div key={item.key} whileTap={{ scale: 0.9 }} transition={{ duration: 0.2 }}>
                                    <Link href={item.href} className="flex flex-col items-center justify-center h-full px-2 gap-0.5 relative">
                                        <motion.span 
                                            animate={{ scale: isActive ? 1.15 : 1 }}
                                            className={`text-base font-mono leading-none ${isActive ? 'text-neon' : 'text-foreground/40'}`}
                                        >
                                            {item.icon}
                                        </motion.span>
                                        <span className={`text-[10px] font-mono ${isActive ? 'text-neon' : 'text-foreground/40'}`}>
                                            {item.label}
                                        </span>
                                        {isActive && <span className="absolute bottom-0 w-8 h-0.5 bg-neon" />}
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
            
            <div className="block md:hidden pb-16"></div>
        </>
    );
}