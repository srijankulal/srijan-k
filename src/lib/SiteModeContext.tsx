"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SiteMode = "portfolio" | "recruiter" | "minimal";

interface SiteModeContextType {
    mode: SiteMode;
    setMode: (mode: SiteMode) => void;
}

const SiteModeContext = createContext<SiteModeContextType>({
    mode: "portfolio",
    setMode: () => {},
});

export function SiteModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<SiteMode>("portfolio");

    useEffect(() => {
        const saved = localStorage.getItem("site-mode") as SiteMode | null;
        if (saved && ["portfolio", "recruiter", "minimal"].includes(saved)) {
            setModeState(saved);
        }
    }, []);

    const setMode = (newMode: SiteMode) => {
        setModeState(newMode);
        localStorage.setItem("site-mode", newMode);
    };

    return (
        <SiteModeContext.Provider value={{ mode, setMode }}>
            {children}
        </SiteModeContext.Provider>
    );
}

export function useSiteMode() {
    return useContext(SiteModeContext);
}
