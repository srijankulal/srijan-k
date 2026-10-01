import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import TerminalMode from "@/components/Terminal/TerminalMode";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteModeProvider } from "@/lib/SiteModeContext";
import StructuredData from "@/components/StructuredData";

const vt323 = VT323({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "Srijan K | Software Developer Portfolio",
  description: "Srijan Kulal — Backend-focused software developer skilled in Python (Flask), Next.js, Flutter, PostgreSQL, and IoT. B.C.A student at St. Aloysius University, Mangalore. Explore projects, skills, and contact info.",
  keywords: ["Srijan Kulal", "software developer", "portfolio", "Next.js", "Python", "Flask", "Flutter", "IoT", "backend developer", "Mangalore", "India"],
  authors: [{ name: "Srijan Kulal", url: "https://srijan-k.me" }],
  openGraph: {
    title: "Srijan K | Software Developer",
    description: "Backend-focused developer. Python, Next.js, Flutter, IoT. Based in Mangalore, India.",
    type: "website",
    url: "https://srijan-k.me",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${vt323.className} antialiased bg-background text-foreground`}>
        <StructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SiteModeProvider>
            {children}
            <TerminalMode />
            <Toaster />
          </SiteModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}