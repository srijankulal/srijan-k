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
  description: "Srijan Kulal — MCA student at MIT Manipal. Passionate software developer specializing in AI, backend engineering, Next.js, Python, Flutter, and IoT embedded systems.",
  keywords: ["Srijan Kulal", "Srijan K", "software developer", "portfolio", "MIT Manipal", "MCA", "Next.js", "Python", "Flask", "Flutter", "IoT", "backend developer", "Mangalore", "Manipal", "India"],
  authors: [{ name: "Srijan K", url: "https://srijan-k.me" }],
  openGraph: {
    title: "Srijan K | Software Developer",
    description: "MCA student at MIT Manipal. AI, full-stack web development, and IoT embedded systems.",
    type: "website",
    url: "https://srijan-k.me",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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