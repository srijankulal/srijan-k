"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MinimalView() {
    const links = [
        { label: "GitHub", href: "https://github.com/srijankulal", mono: "gh" },
        { label: "LinkedIn", href: "https://linkedin.com/in/srijan-kulal", mono: "in" },
        { label: "Email", href: "mailto:srijankulal1010@gmail.com", mono: "@" },
        { label: "Resume", href: "/resume", mono: "cv" },
        { label: "Projects", href: "/Projects", mono: "{}" },
    ];

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-sm"
            >
                {/* Status dot */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="w-2 h-2 rounded-full bg-neon led-blink" />
                    <span className="font-mono text-xs text-foreground/30">ONLINE</span>
                </div>

                {/* Name */}
                <h1 className="text-4xl font-bold mb-1">Srijan K<span className="text-neon">.</span></h1>
                <p className="font-mono text-base text-foreground/50 mb-2">Software Developer</p>
                <p className="font-mono text-xs text-foreground/30 mb-8">Mangalore, India · Open to work</p>

                {/* One-liner */}
                <p className="text-sm text-foreground/60 leading-relaxed mb-10 max-w-xs mx-auto">
                    Python · Next.js · Flutter · PostgreSQL · IoT
                </p>

                {/* Links */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {links.map((link, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.06 }}
                        >
                            <Link
                                href={link.href}
                                target={link.href.startsWith("http") ? "_blank" : undefined}
                                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="flex items-center gap-1.5 border border-border/40 px-3 py-1.5 font-mono text-xs text-foreground/50 hover:text-neon hover:border-neon/40 transition-all duration-200"
                            >
                                <span className="text-neon/40">{link.mono}</span>
                                <span>{link.label}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
